import { getDomainConfig } from "./get-domain-config";

describe("getDomainConfig", () => {
  it("returns production domain when the environment is production", () => {
    const config = getDomainConfig({
      environment: "production",
      stackName: "production",
      rootDomain: "jbrunton-aws.com",
      serviceName: "client",
    });
    expect(config).toEqual({
      domain: "chat-demo.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://chat-demo.jbrunton-aws.com",
    });
  });

  it("returns staging domain when the environment is staging", () => {
    const config = getDomainConfig({
      environment: "staging",
      stackName: "staging",
      rootDomain: "jbrunton-aws.com",
      serviceName: "client",
    });
    expect(config).toEqual({
      domain: "chat-demo.staging.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://chat-demo.staging.jbrunton-aws.com",
    });
  });

  it("returns a dev domain when the environment is development", () => {
    const config = getDomainConfig({
      environment: "development",
      stackName: "my-branch",
      rootDomain: "jbrunton-aws.com",
      serviceName: "client",
    });
    expect(config).toEqual({
      domain: "chat-demo-my-branch.dev.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://chat-demo-my-branch.dev.jbrunton-aws.com",
    });
  });

  it("appends the service name for backend services", () => {
    const apiConfig = {
      rootDomain: "jbrunton-aws.com",
      serviceName: "api",
    };
    expect(
      getDomainConfig({
        environment: "production",
        stackName: "production",
        ...apiConfig,
      })
    ).toEqual({
      domain: "chat-demo-api.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://chat-demo-api.jbrunton-aws.com",
    });
    expect(
      getDomainConfig({
        environment: "development",
        stackName: "my-branch",
        ...apiConfig,
      })
    ).toEqual({
      domain: "chat-demo-api-my-branch.dev.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://chat-demo-api-my-branch.dev.jbrunton-aws.com",
    });
  });
});
