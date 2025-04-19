import { nfigure } from "@kintaman-co/nfigure";
import { Type } from "@sinclair/typebox";
import { typeboxValidator } from "@kintaman-co/nfigure-typebox";

export const AppConfigSchema = Type.Object({
  nodeEnv: Type.String({ default: "development" }),
  socketHost: Type.String({ default: "http://localhost:3004" }),
  dbPassword: Type.Optional(Type.String()),
  s3Endpoint: Type.Optional(Type.String()),
  clickhouse: Type.Optional(
    Type.Object({
      user: Type.String({ default: "admin" }),
      pass: Type.String({ default: "" }),
      db: Type.String({ default: "posthog" }),
    })
  ),
  pgSimpleQueryMode: Type.Optional(Type.Boolean()),
  ci: Type.Optional(Type.Boolean()),
  siteAssetsBucket: Type.String({ default: "plasmic-assets" }),
  tutorialDbHost: Type.Optional(Type.String()),
  amplitudeApiKey: Type.Optional(Type.String()),
  siteAssetsBaseUrl: Type.Optional(Type.String()),
  devBundleMigration: Type.Optional(Type.Boolean()),
  enabledGetEmailVerificationToken: Type.Optional(Type.Boolean()),
  secretsFile: Type.Optional(Type.String()),
  backendPort: Type.Number({ default: 3004 }),
  loaderAssetsBucket: Type.String({ default: "plasmic-loader-assets-dev" }),
  socketPort: Type.Number({ default: 3020 }),
  tutorialDbSuperPassword: Type.Optional(Type.String()),
  wabDbName: Type.String({ default: "wab" }),
  disableBwrap: Type.Boolean({ default: false }),
  bwrapArgs: Type.Optional(Type.String()),
  adminEmails: Type.Array(Type.String(), {
    default: ["admin@admin.example.com"],
  }),
  databaseUri: Type.Optional(Type.String()),
  sentryDSN: Type.Optional(Type.String()),
  sessionSecret: Type.String({ default: "x" }),
  mailFrom: Type.String({ default: "Plasmic <team@example.com>" }),
  mailUserOps: Type.String({ default: "ops@example.com" }),
  mailBcc: Type.Optional(Type.String()),
  // ...add more as you migrate more usages...
});

export const appConfig = nfigure({
  validator: typeboxValidator(AppConfigSchema),
});
