import { DomainInputs, GetDomainConfig } from "@entities/domain";

export const getDomainConfig: GetDomainConfig = (inputs: DomainInputs) => {
  const domain = getDomainName(inputs);
  const publicUrl = `https://${domain}`;
  return {
    domain,
    publicUrl,
    rootDomain: inputs.rootDomain,
  };
};

const getDomainName = (inputs: DomainInputs): string => {
  const subdomain = getSubdomain(inputs);
  switch (inputs.environment) {
    case "production":
      return `${subdomain}.${inputs.rootDomain}`;
    case "staging":
      return `${subdomain}.staging.${inputs.rootDomain}`;
    case "development":
      return `${subdomain}.dev.${inputs.rootDomain}`;
  }
};

const getSubdomain = ({
  stackName,
  serviceName,
  environment,
}: DomainInputs): string => {
  const isClient = serviceName === "client";
  switch (environment) {
    case "development":
      return isClient
        ? `chat-demo-${stackName}`
        : `chat-demo-${serviceName}-${stackName}`;
    default:
      return isClient ? `chat-demo` : `chat-demo-${serviceName}`;
  }
};
