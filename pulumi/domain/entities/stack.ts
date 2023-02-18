import {
  ApplicationConfig,
  ApplicationInputs,
  ClientConfig,
  ServiceConfig,
} from "./application";
import { DomainConfig } from "./domain";

export interface StackConfig extends ApplicationConfig {
  client: ClientConfig & DomainConfig;
  services: (ServiceConfig & DomainConfig)[];
  rootDomain: string;
}

export interface GetStackConfig {
  (inputs: ApplicationInputs): StackConfig;
}

export interface ApplyStackConfig {
  (config: StackConfig): void;
}
