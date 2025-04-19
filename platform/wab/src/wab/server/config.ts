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
    mailFrom: appConfig.mail.from,
    mailUserOps: appConfig.mail.userOps,
    mailBcc: appConfig.mail.bcc,
    port: appConfig.backendPort,
  };

  return config;
};
