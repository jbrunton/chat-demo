import { getApplicationConfig } from "./get-application-config";

jest.mock("@common/random");

describe("getApplicationConfig", () => {
  it("returns the application configuration", () => {
    const inputs = {
      tag: "latest",
      stackName: "dev",
      serviceName: "client",
    };
    const config = getApplicationConfig(inputs);
    expect(config).toEqual({
      tag: "latest",
      stackName: "dev",
      appName: "auth0-test-dev",
      environment: "development",
      protect: false,
    });
  });

  describe(".protect", () => {
    const tag = "latest";

    it("returns true for production", () => {
      const config = getApplicationConfig({
        stackName: "production",
        tag,
        serviceName: "client",
      });
      expect(config.protect).toEqual(true);
    });

    it("returns false for staging", () => {
      const config = getApplicationConfig({
        stackName: "staging",
        tag,
        serviceName: "client",
      });
      expect(config.protect).toEqual(false);
    });

    it("returns false for other stack names", () => {
      const config = getApplicationConfig({
        stackName: "dev",
        tag,
        serviceName: "client",
      });
      expect(config.protect).toEqual(false);
    });
  });

  describe(".environment", () => {
    const tag = "latest";

    it("returns 'production' for production", () => {
      const config = getApplicationConfig({
        stackName: "production",
        tag,
        serviceName: "client",
      });
      expect(config.environment).toEqual("production");
    });

    it("returns 'staging' for staging", () => {
      const config = getApplicationConfig({
        stackName: "staging",
        tag,
        serviceName: "client",
      });
      expect(config.environment).toEqual("staging");
    });

    it("returns 'development' for other stack names", () => {
      expect(
        getApplicationConfig({ stackName: "dev", tag, serviceName: "client" })
          .environment
      ).toEqual("development");
      expect(
        getApplicationConfig({
          stackName: "foo-bar",
          tag,
          serviceName: "client",
        }).environment
      ).toEqual("development");
      expect(
        getApplicationConfig({
          stackName: "deps-lib-123.x",
          tag,
          serviceName: "client",
        }).environment
      ).toEqual("development");
    });
  });

  describe(".appName", () => {
    const tag = "latest";
    it("prepends auth0-test", () => {
      const config = getApplicationConfig({
        stackName: "dev",
        tag,
        serviceName: "client",
      });
      expect(config.appName).toEqual("auth0-test-dev");
    });

    it("truncates names greater than 32 chars long", () => {
      const config = getApplicationConfig({
        stackName: "deps-some-long-name-lib-3.x",
        tag,
        serviceName: "client",
      });
      expect(config.appName).toEqual("auth0-test-deps-some-long-n-a1a1");
      expect(config.appName.length).toEqual(32);
    });

    it("removes illegal characters", () => {
      const config = getApplicationConfig({
        stackName: "deps-some-lib-3.x",
        tag,
        serviceName: "client",
      });
      expect(config.appName).toEqual("auth0-test-deps-some-lib-3x");
    });
  });
});
