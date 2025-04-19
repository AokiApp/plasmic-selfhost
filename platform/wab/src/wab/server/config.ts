import { getPublicUrl } from "@/wab/shared/urls";
import { appConfig } from "./nfigure-config";

export interface Config {
  host: string;
  production: boolean;
  databaseUri: string;
  adminEmails: string[];
  sentryDSN?: string;
  sessionSecret: string;
  mailFrom: string;
  mailUserOps: string;
  mailBcc?: string;
  port?: number;
}

export const DEFAULT_DATABASE_URI =
  "postgresql://wab@localhost/" + appConfig.wabDbName;

export const loadConfig = (): Config => {
  const config: Config = {
    host: getPublicUrl(),
    production: appConfig.nodeEnv === "production",
    databaseUri:
      appConfig.databaseUri ??
      `postgresql://wab@localhost/${appConfig.wabDbName}`,
    adminEmails: appConfig.adminEmails,
    sentryDSN: appConfig.sentryDSN,
    sessionSecret: appConfig.sessionSecret,
    mailFrom: appConfig.mailFrom,
    mailUserOps: appConfig.mailUserOps,
    mailBcc: appConfig.mailBcc,
    port: appConfig.backendPort,
  };

  // Runtime validation for required fields in production
  if (config.production) {
    if (!config.sessionSecret) {
      throw new Error("Production missing Session Secret");
    }
    if (!config.databaseUri) {
      throw new Error("Production missing DB Uri");
    }
    if (!config.host) {
      throw new Error("Production missing Host");
    }
  }

  return config;
};
