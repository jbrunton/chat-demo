export type Environment = "development" | "staging" | "production";

export interface ClientConfig {
  name: string;
}

export interface ServiceConfig extends ClientConfig {
  repository: string;
  tag: string;
}

export interface ApplicationConfig {
  stackName: string;
  appName: string;
  client: ClientConfig;
  services: ServiceConfig[];
  environment: Environment;
  protect: boolean;
}

export interface ApplicationInputs {
  stackName: string;
  services: ServiceConfig[];
}

export interface GetApplicationConfig<
  T extends ApplicationConfig = ApplicationConfig
> {
  (inputs: ApplicationInputs): T;
}

export interface GetApplicationInputs {
  (): ApplicationInputs;
}
