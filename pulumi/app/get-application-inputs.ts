import * as pulumi from "@pulumi/pulumi";
import { GetApplicationInputs } from "@entities/application";

export const getApplicationInputs: GetApplicationInputs = () => {
  const stackName = pulumi.getStack();
  return {
    stackName,
    rootDomain: "jbrunton-aws.com",
    services: [
      {
        name: "api",
        repository: "auth0-test-api",
        tag: process.env.API_TAG || "latest",
      },
    ],
  };
};
