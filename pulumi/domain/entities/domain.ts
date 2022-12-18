import { Environment } from "./application";

export interface DomainConfig {
  domain: string;
  rootDomain: string;
  publicUrl: string;
}

export interface DomainInputs {
  rootDomain: string;
  environment: Environment;
  stackName: string;
  serviceName: string;
}

export interface GetDomainConfig<T extends DomainConfig = DomainConfig> {
  (inputs: DomainInputs): T;
}
