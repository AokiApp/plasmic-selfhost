import { nfigure } from "@kintaman-co/nfigure";
import { Type } from "@sinclair/typebox";
import { typeboxValidator } from "@kintaman-co/nfigure-typebox";

export const AppConfigSchema = Type.Object({
  nodeEnv: Type.String({ default: "development" }),
  socketHost: Type.Optional(Type.String()),
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
  siteAssetsBucket: Type.String(),
  // ...add more as you migrate more usages...
});

export const appConfig = nfigure({
  validator: typeboxValidator(AppConfigSchema),
});
