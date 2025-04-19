/**
 * This module handles loading secrets from secrets.json.
 *
 * Plasmic should run without any secrets.json file.
 * But for testing some features, you'll need to set up certain variables.
 *
 * By default, secrets are read from ~/.plasmic/secrets.json.
 */

import { ensure, uncheckedCast } from "@/wab/shared/common";
import fs from "fs";
import * as os from "os";
import { appConfig } from "./nfigure-config";

interface Secrets {
  google?: {
    /** AKA consumer key */
    clientId: string;
    /** AKA consumer secret */
    clientSecret: string;
  };
  airtableSso?: {
    clientId: string;
    clientSecret: string;
  };
  "google-sheets"?: {
    /** AKA consumer key */
    clientId: string;
    /** AKA consumer secret */
    clientSecret: string;
  };
  encryptionKey?: string;
  dataSourceOperationEncryptionKey?: string;
  smtpAuth?: {
    user: string;
    pass: string;
  };
  intercomToken?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  github?: {
    appId: number;
    privateKey: string;
    oauth: {
      clientId: string;
      clientSecret: string;
    };
  };
  stripe?: {
    secretKey: string;
  };
  vercel?: {
    plasmicHostingSecret: string;
    projectId: string;
    teamId: string;
    authBearerToken: string;
  };
  discourse?: {
    discourseConnectSecret?: string;
    apiKey?: string;
  };
  dynamodb?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export function loadSecrets(): Secrets {
  const path = getSecretsFile();
  if (!fs.existsSync(path)) {
    return {};
  }
  return uncheckedCast<Secrets>(
    JSON.parse(fs.readFileSync(path, { encoding: "utf8" }))
  );
}

function getSecretsFile() {
  return appConfig.secretsFile || `${os.homedir()}/.plasmic/secrets.json`;
}
