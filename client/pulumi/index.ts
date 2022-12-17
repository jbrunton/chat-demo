import * as staticwebsite from "@pulumi/aws-static-website";

const site = new staticwebsite.Website("client", {
  sitePath: "../app/dist",
  targetDomain: "auth0-test.jbrunton-aws.com",
  withCDN: true,
});

export const websiteURL = site.websiteURL;
