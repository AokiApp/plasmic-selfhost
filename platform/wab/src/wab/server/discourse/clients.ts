import { appConfig } from "../nfigure-config";
import { BASE_URL, SYSTEM_USERNAME } from "@/wab/shared/discourse/config";
import { DiscourseClient } from "@/wab/shared/discourse/DiscourseClient";

export function createSystemDiscourseClient() {
  return new DiscourseClient(
    BASE_URL,
    appConfig.discourse.apiKey,
    SYSTEM_USERNAME
  );
}

export function createUserDiscourseClient(username: string) {
  return new DiscourseClient(BASE_URL, appConfig.discourse.apiKey, username);
}
