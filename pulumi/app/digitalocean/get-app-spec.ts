import { AppArgs } from "@pulumi/digitalocean";
import { AppSpecService } from "@pulumi/digitalocean/types/input";
import { StackConfig } from "./usecases/stack/get-stack-config";

export const getAppSpec = (config: StackConfig): AppArgs => {
  const serviceSpec = getServiceSpec(config);
  return {
    spec: {
      name: config.appName,
      region: "lon",
      domainNames: [
        {
          name: config.domain,
          zone: config.rootDomain,
          type: "PRIMARY",
        },
      ],
      services: [serviceSpec],
    },
  };
};

const getServiceSpec = (config: StackConfig): AppSpecService => {
  const { tag, publicUrl, specId } = config;
  return {
    name: "app",
    httpPort: 3000,
    image: {
      registry: "jbrunton",
      registryType: "DOCKER_HUB",
      repository: "chat-demo-app",
      tag,
    },
    envs: [
      {
        key: "NEXT_PUBLIC_DOMAIN",
        scope: "RUN_TIME",
        value: publicUrl,
      },
      {
        key: "TAG",
        scope: "RUN_TIME",
        value: tag,
      },
      {
        key: "SPEC_ID",
        scope: "RUN_TIME",
        value: specId,
      },
      {
        key: "GOOGLE_CLIENT_ID",
        scope: "RUN_TIME",
        value: process.env.GOOGLE_CLIENT_ID,
      },
      {
        key: "GOOGLE_CLIENT_SECRET",
        scope: "RUN_TIME",
        value: process.env.GOOGLE_CLIENT_SECRET,
      },
      {
        key: "NEXTAUTH_URL",
        scope: "RUN_TIME",
        value: config.publicUrl,
      },
      {
        key: "NEXTAUTH_SECRET",
        scope: "RUN_TIME",
        value: process.env.NEXTAUTH_SECRET,
      },
      {
        key: "EMAIL_TRANSPORT",
        scope: "RUN_TIME",
        value: "sendgrid",
      },
      {
        key: "SENDGRID_API_KEY",
        scope: "RUN_TIME",
        value: process.env.SENDGRID_API_KEY,
      },
    ],
    instanceCount: 1,
    instanceSizeSlug: "basic-xxs",
    routes: [
      {
        path: "/",
      },
    ],
  };
};
