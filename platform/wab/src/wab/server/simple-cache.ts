import { DbMgr } from "@/wab/server/db/DbMgr";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

export interface CacheOptions {
  ttl?: number;
}

export interface SimpleCache {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: CacheOptions): Promise<void>;
}

export class InMemoryCache implements SimpleCache {
  private cache = new Map<string, { value: string; expiry: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async put(key: string, value: string, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl ?? 3600 * 1000; // 1 hour default
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }
}

export class DynamoDbCache implements SimpleCache {
  constructor(private client: DynamoDBClient) {}

  async get(key: string): Promise<string | null> {
    const command = new GetItemCommand({
      TableName: "llm-cache",
      Key: { key: { S: key } },
    });
    const response = await this.client.send(command);
    if (response.Item?.["my-value"]?.S) {
      return response.Item["my-value"].S;
    } else {
      return null;
    }
  }

  async put(key: string, value: string, options?: CacheOptions): Promise<void> {
    const command = new PutItemCommand({
      TableName: "llm-cache",
      Item: { key: { S: key }, "my-value": { S: value } },
    });
    await this.client.send(command);
  }
}

export class DbMgrCache implements SimpleCache {
  constructor(private dbMgr: DbMgr) {}

  async get(key: string) {
    const entry = await this.dbMgr.tryGetKeyValue("copilot-cache", key);
    return entry?.value ?? null;
  }

  put(key: string, value: string) {
    return this.dbMgr.setKeyValue("copilot-cache", key, value);
  }
}
