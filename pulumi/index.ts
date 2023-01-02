import "./load-paths";
import * as pulumi from "@pulumi/pulumi";
import * as pulumiservice from "@pulumi/pulumiservice";
import { applyStackConfig } from "@app/aws/apply-stack-config";
import { getApplicationInputs } from "@app/get-application-inputs";
import { getStackConfig } from "@app/aws/usecases/stack/get-stack-config";
import { applyClientConfig } from "@app/aws/apply-client-config";
import { getSharedResources } from "@app/aws/usecases/stack/get-shared-resources";
import { registerAutoTags } from "@app/aws/auto-tags";

const apiConfig = getStackConfig(getApplicationInputs("api"));
pulumi.log.info(`api config: ${JSON.stringify(apiConfig, null, " ")}`);

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
  value: apiConfig.environment,
});

applyStackConfig(apiConfig);

export const publicApiUrl = apiConfig.publicUrl;

const clientConfig = getStackConfig(getApplicationInputs("client"));
pulumi.log.info(`client config: ${JSON.stringify(clientConfig, null, " ")}`);

getSharedResources().apply((shared) => applyClientConfig(clientConfig, shared));

export const publicUrl = clientConfig.publicUrl;
