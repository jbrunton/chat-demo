/**
 * Workaround for https://github.com/pulumi/pulumi/issues/3061
 * Pulumi overrides TypeScript defaults, so we have to load paths manually.
 */

import { register, loadConfig } from "tsconfig-paths";

const tsConfig = loadConfig(".");

if (tsConfig.resultType === "failed") {
  console.log("Could not load tsconfig to map paths, aborting.");
  process.exit(1);
}

register({
  baseUrl: tsConfig.absoluteBaseUrl,
  paths: tsConfig.paths,
});
