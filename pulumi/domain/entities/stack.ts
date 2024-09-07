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

export interface ApplyStackResult<T> {
  outputs: Record<string, T>;
}

export interface ApplyStackConfig<T> {
  (config: StackConfig): ApplyStackResult<T>;
}
