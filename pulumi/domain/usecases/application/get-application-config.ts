import {
  ApplicationInputs,
  Environment,
  GetApplicationConfig,
} from "@entities/application";
import { randomString } from "@common/random";

export const getApplicationConfig: GetApplicationConfig = (
  inputs: ApplicationInputs
) => {
  const { stackName, services } = inputs;
  const environment = getEnvironment(stackName);
  const appName = getAppName(stackName);
  const protect = environment === "production";
  return {
    stackName,
    client: {
      name: "client",
    },
    appName,
    environment,
    services,
    protect,
  };
};

export const getEnvironment = (stackName: string): Environment => {
  switch (stackName) {
    case "production":
      return "production";
    case "staging":
      return "staging";
  }
  return "development";
};

const getAppName = (stackName: string): string => {
  const cleanName = `auth0-test-${cleanString(stackName)}`;
  if (cleanName.length > 32) {
    const shortName = cleanName.slice(0, 27);
    return `${shortName}-${randomString(2)}`;
  }
  return cleanName;
};

const cleanString = (s: string) => s.replace("/", "").replace(".", "");
