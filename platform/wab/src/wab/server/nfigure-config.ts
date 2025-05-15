import { nfigure } from "@kintaman-co/nfigure";
import { Type } from "@sinclair/typebox";
import { typeboxValidator } from "@kintaman-co/nfigure-typebox";

export const AppConfigSchema = Type.Object({
  nodeEnv: Type.String({ default: "development" }),
  socketHost: Type.Optional(Type.String({ default: "http://localhost:3004" })),
  dbPassword: Type.Optional(Type.String()),
  s3Endpoint: Type.Optional(Type.String()),
  clickhouse: Type.Object({
    host: Type.String({ default: "http://clickhouse-db.plasmic.app" }),
    username: Type.String({ default: "admin" }),
    password: Type.String({ default: "" }),
    database: Type.String({ default: "posthog" }),
  }),
  pgSimpleQueryMode: Type.Optional(Type.Boolean()),
  siteAssetsBucket: Type.String({ default: "plasmic-assets" }),
  tutorialDbHost: Type.Optional(Type.String()),
  amplitudeApiKey: Type.Optional(Type.String()),
  siteAssetsBaseUrl: Type.Optional(Type.String()),
  devBundleMigration: Type.Optional(Type.Boolean()),
  enabledGetEmailVerificationToken: Type.Optional(Type.Boolean()),
  backendPort: Type.Number({ default: 3004 }),
  loaderAssetsBucket: Type.String({ default: "plasmic-loader-assets-dev" }),
  socketPort: Type.Number({ default: 3020 }),
  tutorialDbSuperPassword: Type.Optional(Type.String()),
  wabDbName: Type.String({ default: "wab" }),
  disableBwrap: Type.Boolean({ default: false }),
  bwrapArgs: Type.Optional(Type.String()),
  superUserEmails: Type.Array(Type.String(), {
    default: ["admin@admin.example.com"],
    description:
      "A list of emails that are considered super users. These users unlock admin APIs.",
  }),
  adminUiEnableDomain: Type.String({
    default: "plasmic.app",
    description: "The domain that is allowed to access the admin UI in Studio.",
  }),
  databaseUri: Type.Optional(Type.String()),
  sentryDSN: Type.Optional(Type.String()),
  sessionSecret: Type.String({ default: "x" }),
  mail: Type.Object({
    from: Type.String({ default: "Plasmic <team@example.com>" }),
    userOps: Type.String({ default: "ops@example.com" }),
    bcc: Type.Optional(Type.String()),
  }),

  // === Migrated from secrets.ts ===
  encryptionKey: Type.String(),
  dataSourceOperationEncryptionKey: Type.String(),
  smtpTransportOption: Type.Object(
    {
      // popular properties of nodemailer.SMTPConnection.Options
      host: Type.Optional(Type.String()),
      port: Type.Optional(Type.Number()),
      auth: Type.Optional(
        Type.Object(
          {
            user: Type.String(),
            pass: Type.String(),
          },
          {
            additionalProperties: true, // allow other properties listed in SMTPTransport.AuthenticationType
          }
        )
      ),
    },
    {
      additionalProperties: true, // allow other properties listed in SMTPTransport.Options
    }
  ),
  intercomToken: Type.Optional(Type.String()),
  openaiApiKey: Type.Optional(Type.String()),

  github: Type.Object({
    appId: Type.Number(),
    privateKey: Type.String(),
    oauth: Type.Object({
      clientId: Type.String(),
      clientSecret: Type.String(),
    }),
  }),
  discourse: Type.Object({
    discourseConnectSecret: Type.String(),
    apiKey: Type.String(),
  }),
  anthropicApiKey: Type.Optional(Type.String()),

  google: Type.Object({
    clientId: Type.String(),
    clientSecret: Type.String(),
  }),
  airtableSso: Type.Object({
    clientId: Type.String(),
    clientSecret: Type.String(),
  }),
  googleSheets: Type.Object({
    clientId: Type.String(),
    clientSecret: Type.String(),
  }),
  vercel: Type.Object({
    plasmicHostingSecret: Type.String(),
    projectId: Type.String(),
    teamId: Type.String(),
    authBearerToken: Type.String(),
  }),
});

export const appConfig = nfigure({
  validator: typeboxValidator(AppConfigSchema),
});
