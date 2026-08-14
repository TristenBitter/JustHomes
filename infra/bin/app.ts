#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { JustHomesStack } from "../lib/justhomes-stack";

const app = new App();

new JustHomesStack(app, "JustHomesStack", {
  description: "JustHomes rental application backend: submissions, documents, admin access, and email delivery.",
});
