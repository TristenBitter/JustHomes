import { Duration, RemovalPolicy, Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as ses from "aws-cdk-lib/aws-ses";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { HttpJwtAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as path from "path";

/**
 * Domain and mailbox this stack sends from/to. Update if JustHomes ever
 * changes domains — everything else (DNS records, DKIM) is generated
 * from this value.
 */
const APP_DOMAIN = "justhomes.us";
const ADMIN_EMAIL = "david@justhomes.us";
const FROM_EMAIL = `no-reply@${APP_DOMAIN}`;

/** Must be globally unique across all Cognito pools in the region. */
const COGNITO_DOMAIN_PREFIX = "justhomes-admin";

const ALLOWED_ORIGINS = [
  `https://${APP_DOMAIN}`,
  `https://www.${APP_DOMAIN}`,
  "http://localhost:5173",
];

export class JustHomesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ---------------------------------------------------------------------
    // Data storage
    // ---------------------------------------------------------------------

    const applicationsTable = new dynamodb.Table(this, "ApplicationsTable", {
      tableName: "JustHomesApplications",
      partitionKey: { name: "applicationId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const documentsBucket = new s3.Bucket(this, "DocumentsBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET],
          allowedOrigins: ALLOWED_ORIGINS,
          allowedHeaders: ["*"],
          maxAge: 3000,
        },
      ],
    });

    // ---------------------------------------------------------------------
    // Email (SES)
    // ---------------------------------------------------------------------

    const emailIdentity = new ses.EmailIdentity(this, "DomainIdentity", {
      identity: ses.Identity.domain(APP_DOMAIN),
      dkimSigning: true,
    });

    // ---------------------------------------------------------------------
    // Admin authentication (Cognito, admin-only — applicants never get an account)
    // ---------------------------------------------------------------------

    const adminPool = new cognito.UserPool(this, "AdminPool", {
      userPoolName: "justhomes-admin",
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      mfa: cognito.Mfa.REQUIRED,
      mfaSecondFactor: { sms: false, otp: true },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const adminPoolDomain = adminPool.addDomain("AdminPoolDomain", {
      cognitoDomain: { domainPrefix: COGNITO_DOMAIN_PREFIX },
    });

    const adminWebClient = adminPool.addClient("AdminWebClient", {
      generateSecret: false,
      authFlows: { userSrp: true },
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
        callbackUrls: ALLOWED_ORIGINS.map((origin) => `${origin}/admin/callback`),
        logoutUrls: ALLOWED_ORIGINS.map((origin) => `${origin}/admin`),
      },
    });

    // ---------------------------------------------------------------------
    // Lambda functions
    // ---------------------------------------------------------------------

    const commonEnv = {
      TABLE_NAME: applicationsTable.tableName,
      BUCKET_NAME: documentsBucket.bucketName,
      ADMIN_EMAIL,
      FROM_EMAIL,
      ALLOWED_ORIGIN: `https://${APP_DOMAIN}`,
    };

    const commonProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      timeout: Duration.seconds(10),
      memorySize: 256,
      bundling: { externalModules: ["@aws-sdk/*"] },
    };

    const submitApplicationFn = new NodejsFunction(this, "SubmitApplicationFn", {
      ...commonProps,
      entry: path.join(__dirname, "../lambda/submit-application/index.ts"),
      environment: commonEnv,
    });
    applicationsTable.grantWriteData(submitApplicationFn);
    emailIdentity.grantSendEmail(submitApplicationFn);

    const createUploadUrlFn = new NodejsFunction(this, "CreateUploadUrlFn", {
      ...commonProps,
      entry: path.join(__dirname, "../lambda/create-upload-url/index.ts"),
      environment: commonEnv,
    });
    documentsBucket.grantPut(createUploadUrlFn);

    const listApplicationsFn = new NodejsFunction(this, "ListApplicationsFn", {
      ...commonProps,
      entry: path.join(__dirname, "../lambda/list-applications/index.ts"),
      environment: commonEnv,
    });
    applicationsTable.grantReadData(listApplicationsFn);

    const getApplicationFn = new NodejsFunction(this, "GetApplicationFn", {
      ...commonProps,
      entry: path.join(__dirname, "../lambda/get-application/index.ts"),
      environment: commonEnv,
    });
    applicationsTable.grantReadData(getApplicationFn);
    documentsBucket.grantRead(getApplicationFn);

    // ---------------------------------------------------------------------
    // API Gateway (HTTP API)
    // ---------------------------------------------------------------------

    const httpApi = new apigwv2.HttpApi(this, "Api", {
      apiName: "justhomes-api",
      corsPreflight: {
        allowOrigins: ALLOWED_ORIGINS,
        allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS],
        allowHeaders: ["Content-Type", "Authorization"],
        maxAge: Duration.hours(1),
      },
    });

    const adminAuthorizer = new HttpJwtAuthorizer(
      "AdminAuthorizer",
      `https://cognito-idp.${this.region}.amazonaws.com/${adminPool.userPoolId}`,
      { jwtAudience: [adminWebClient.userPoolClientId] }
    );

    httpApi.addRoutes({
      path: "/applications",
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration("SubmitIntegration", submitApplicationFn),
    });

    httpApi.addRoutes({
      path: "/uploads",
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration("UploadIntegration", createUploadUrlFn),
    });

    httpApi.addRoutes({
      path: "/applications",
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration("ListIntegration", listApplicationsFn),
      authorizer: adminAuthorizer,
    });

    httpApi.addRoutes({
      path: "/applications/{id}",
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration("GetIntegration", getApplicationFn),
      authorizer: adminAuthorizer,
    });

    // ---------------------------------------------------------------------
    // Outputs
    // ---------------------------------------------------------------------

    new CfnOutput(this, "ApiUrl", { value: httpApi.apiEndpoint });
    new CfnOutput(this, "TableName", { value: applicationsTable.tableName });
    new CfnOutput(this, "BucketName", { value: documentsBucket.bucketName });
    new CfnOutput(this, "UserPoolId", { value: adminPool.userPoolId });
    new CfnOutput(this, "UserPoolClientId", { value: adminWebClient.userPoolClientId });
    new CfnOutput(this, "UserPoolDomain", { value: adminPoolDomain.domainName });
    new CfnOutput(this, "SesDkimTokens", {
      value: emailIdentity.dkimRecords.map((record) => `${record.name} CNAME ${record.value}`).join(" | "),
      description: "Add each as a CNAME record at your DNS provider to verify the sending domain.",
    });
  }
}
