import "./load-paths";
import * as pulumi from "@pulumi/pulumi";
import * as pulumiservice from "@pulumi/pulumiservice";
import { applyStackConfig } from "@app/aws/apply-stack-config";
import { getApplicationInputs } from "@app/get-application-inputs";
import { registerAutoTags } from "@app/aws/auto-tags";
import { getApplicationConfig } from "@usecases";
import { getStackConfig } from "@app/aws/usecases/stack/get-stack-config";

const appInputs = getApplicationInputs();
const appConfig = getApplicationConfig(appInputs);
const stackConfig = getStackConfig(appConfig);

pulumi.log.info(`app config: ${JSON.stringify(appConfig, null, " ")}`);

registerAutoTags({
  "infra:managedBy": "pulumi",
  "infra:stack": pulumi.getStack(),
  "infra:project": pulumi.getProject(),
});

new pulumiservice.StackTag("stack-tags", {
  organization: pulumi.getOrganization(),
  project: pulumi.getProject(),
  stack: pulumi.getStack(),
  name: "environment",
  value: appConfig.environment,
});

const result = applyStackConfig(stackConfig);

export const webUrl = stackConfig.client.publicUrl;
export const apiUrl = stackConfig.services[0].publicUrl;
export const apiTaskDefinitionArn = result.outputs["apiTaskDefinitionArn"];
export const apiService = result.outputs["apiService"];
export const cluster = result.outputs["cluster"];
