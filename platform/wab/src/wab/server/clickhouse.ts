import { createClient } from "@clickhouse/client";
import { appConfig } from "./nfigure-config";

export const getClickHouseConnection = () => {
  const clickhouseConfig = appConfig.clickhouse ?? {
    user: "admin",
    pass: "",
    db: "posthog",
  };
  const client = createClient({
    host: "http://clickhouse-db.plasmic.app",
    username: clickhouseConfig.user,
    password: clickhouseConfig.pass,
    database: clickhouseConfig.db,
  });
  return client;
};
