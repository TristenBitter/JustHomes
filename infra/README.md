# JustHomes infrastructure

AWS CDK (TypeScript) app defining the backend for the rental application system: DynamoDB table, private S3 bucket for documents, SES email sending, a Cognito user pool for admin staff, four Lambda functions, and an HTTP API tying it together.

## What this does NOT include

Nothing here is deployed automatically just by merging to `main` on your first pass — the GitHub Actions workflow (`deploy-infra.yml`) needs an AWS IAM role (`AWS_INFRA_ROLE_ARN` secret) that doesn't exist yet. See the root-level deployment checklist for the full list of one-time setup steps.

## One-time manual deploy (recommended first run)

From your own machine, with your own AWS credentials configured (`aws configure` or SSO):

```bash
cd infra
npm install
npx cdk bootstrap   # only needed once per AWS account/region
npx cdk deploy
```

This never sends your AWS credentials anywhere outside your machine. After it finishes, CDK prints outputs — `ApiUrl`, `UserPoolId`, `UserPoolClientId`, `UserPoolDomain`, `SesDkimTokens`, etc. Copy those into:

1. **DNS** — add the `SesDkimTokens` as CNAME records at your domain registrar for `justhomes.us`.
2. **GitHub repo variables** (Settings → Secrets and variables → Actions → Variables) — set `VITE_API_URL`, `VITE_COGNITO_DOMAIN`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_REDIRECT_URI`, `VITE_COGNITO_LOGOUT_URI` from the CDK outputs, so the frontend build picks them up.
3. **SES production access** — request it in the SES console (Account dashboard → Request production access) so applicants (not just david@justhomes.us) can receive email.
4. **Admin users** — create Cognito users for yourself and David:
   ```bash
   aws cognito-idp admin-create-user --user-pool-id <UserPoolId> --username you@justhomes.us --user-attributes Name=email,Value=you@justhomes.us Name=email_verified,Value=true
   ```
   Cognito emails a temporary password; the Hosted UI walks through setting a real password and enrolling an authenticator app for MFA on first sign-in.

## Ongoing deploys via GitHub Actions

Once you've bootstrapped and deployed manually at least once (above), automate future `infra/` changes with a scoped OIDC role:

1. Get your AWS account ID (`aws sts get-caller-identity --query Account --output text`) and note the region you deployed to.
2. In `deploy-role-trust-policy.json` and `deploy-role-permissions-policy.json`, replace `<ACCOUNT_ID>` and `<REGION>` with those values. The permissions policy only allows assuming the CDK bootstrap roles (`cdk-hnb659fds-*`) — it deliberately doesn't grant direct create/delete permissions on DynamoDB, S3, etc. directly, since CloudFormation does the actual resource creation under the bootstrap roles. This mirrors the existing frontend deploy role's least-privilege pattern, just for a different set of services.
3. Create the role:
   ```bash
   aws iam create-role --role-name JustHomesInfraDeployRole \
     --assume-role-policy-document file://deploy-role-trust-policy.json

   aws iam put-role-policy --role-name JustHomesInfraDeployRole \
     --policy-name cdk-bootstrap-assume \
     --policy-document file://deploy-role-permissions-policy.json
   ```
   (Skip creating the OIDC provider itself if `token.actions.githubusercontent.com` is already registered in your account — it almost certainly is, from the existing frontend deploy role.)
4. Add the resulting role ARN as the `AWS_INFRA_ROLE_ARN` secret in GitHub (Settings → Secrets and variables → Actions → Secrets), and confirm the `AWS_REGION` repo variable is set (it's likely already there from the frontend workflow).

After that, pushes to `main` that touch `infra/**` deploy automatically via `deploy-infra.yml`, mirroring the existing frontend deploy pattern.
