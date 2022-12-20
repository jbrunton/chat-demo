import { ApplicationConfig, ApplicationInputs } from "./application";
import { DomainConfig } from "./domain";

export interface StackConfig extends ApplicationConfig, DomainConfig {}

export interface GetStackConfig<T extends ApplicationConfig> {
  (inputs: ApplicationInputs): T;
}

export interface ApplyStackConfig<T extends ApplicationConfig> {
  (config: T): void;
}
