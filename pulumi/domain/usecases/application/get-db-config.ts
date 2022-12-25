import {
  ApplicationConfig,
  ApplicationInputs,
  DatabaseConfig,
} from "@entities";

export const getDBConfig = (config: ApplicationConfig): DatabaseConfig => {
  return {
    name: config.appName,
    tables: [
      {
        name: "User",
      },
    ],
  };
};
