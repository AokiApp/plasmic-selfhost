import { createClient } from "@clickhouse/client";
import { appConfig } from "./nfigure-config";

export const getClickHouseConnection = () => {
  const client = createClient({
    host: appConfig.clickhouse.host,
    username: appConfig.clickhouse.username,
    password: appConfig.clickhouse.password,
    database: appConfig.clickhouse.database,
  });
  return client;
};
