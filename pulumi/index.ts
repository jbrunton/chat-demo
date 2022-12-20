import "./load-paths";
import * as pulumi from "@pulumi/pulumi";
import { applyStackConfig } from "@app/aws/apply-stack-config";
import { getApplicationInputs } from "@app/get-application-inputs";
import { getStackConfig } from "@app/aws/usecases/stack/get-stack-config";
import { applyClientConfig } from "@app/aws/apply-client-config";
import { getSharedResources } from "@app/aws/usecases/stack/get-shared-resources";

const apiConfig = getStackConfig(getApplicationInputs("api"));
pulumi.log.info(`api config: ${JSON.stringify(apiConfig, null, " ")}`);

applyStackConfig(apiConfig);

export const publicApiUrl = apiConfig.publicUrl;

const clientConfig = getStackConfig(getApplicationInputs("client"));
pulumi.log.info(`client config: ${JSON.stringify(clientConfig, null, " ")}`);

getSharedResources().apply((shared) => applyClientConfig(clientConfig, shared));

export const publicUrl = clientConfig.publicUrl;
