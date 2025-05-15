/**
 * Wrappers around LLM APIs. Currently just for caching and simple logging.
 */

import { SimpleCache, InMemoryCache } from "@/wab/server/simple-cache";
import { appConfig } from "../nfigure-config";
import { last, mkShortId } from "@/wab/shared/common";
import {
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionRequest,
  CreateChatCompletionRequestOptions,
  showCompletionRequest,
} from "@/wab/shared/copilot/prompt-utils";
import axios from "axios";
import { createHash } from "crypto";
import { pick } from "lodash";
import OpenAI from "openai";
import { stringify } from "safe-stable-stringify";

const verbose = false;

const hash = (x: string) => createHash("sha256").update(x).digest("hex");

export class LLMError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = "LLMError";
  }
}

export abstract class LLMWrapper {
  constructor(protected cache: SimpleCache) {}

  abstract createChatCompletion(
    createChatCompletionRequest: CreateChatCompletionRequest,
    options?: CreateChatCompletionRequestOptions
  ): Promise<any>;

  protected async getCachedResponse(key: string) {
    const cached = await this.cache.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  }

  protected async cacheResponse(key: string, value: any) {
    const stringValue = stringify(value);
    if (stringValue === undefined) {
      throw new Error("Failed to stringify value");
    }
    await this.cache.put(key, stringValue);
    return JSON.parse(stringValue);
  }
}

export class OpenAIWrapper extends LLMWrapper {
  private openai: OpenAI;
  constructor(cache: SimpleCache) {
    super(cache);
    this.openai = new OpenAI({
      apiKey: appConfig.openaiApiKey,
    });
  }

  async createChatCompletion(
    createChatCompletionRequest: CreateChatCompletionRequest,
    options?: CreateChatCompletionRequestOptions
  ) {
    if (verbose) {
      console.log(showCompletionRequest(createChatCompletionRequest));
    }

    const key = hash(
      stringify([
        "OpenAI.createChatCompletion",
        createChatCompletionRequest,
        options,
      ])
    );

    try {
      const cached = await this.getCachedResponse(key);
      if (cached) {
        return cached;
      }

      const result = pick(
        await this.openai.createChatCompletion(
          createChatCompletionRequest,
          options
        ),
        "data"
      );

      return this.cacheResponse(key, result);
    } catch (error) {
      throw new LLMError("OpenAI API error", error);
    }
  }
}

export interface ClaudeAIResponse {
  completion: string;
  stop: string;
  stop_reason: "stop_sequence" | "max_tokens";
  truncated: boolean;
  log_id: string;
  model: string;
  exception?: string;
}

function openAIToAnthropicRole(role: ChatCompletionRequestMessageRoleEnum) {
  if (role === "assistant") {
    return "Assistant" as const;
  }
  return "Human" as const;
}

function anthropicToOpenAIStopReason(reason: "stop_sequence" | "max_tokens") {
  return reason === "max_tokens" ? ("length" as const) : ("stop" as const);
}

export class AnthropicWrapper extends LLMWrapper {
  constructor(cache: SimpleCache) {
    super(cache);
  }

  async createChatCompletion(
    createChatCompletionRequest: CreateChatCompletionRequest,
    options?: CreateChatCompletionRequestOptions
  ) {
    if (verbose) {
      console.log(showCompletionRequest(createChatCompletionRequest));
    }

    const key = hash(
      stringify([
        "Anthropic.createChatCompletion",
        createChatCompletionRequest,
        options,
      ])
    );

    try {
      const cached = await this.getCachedResponse(key);
      if (cached) {
        return cached;
      }

      const prompt =
        createChatCompletionRequest.messages
          .map(
            (message) =>
              `${openAIToAnthropicRole(message.role)}: ${message.content}`
          )
          .join("\n\n") + "\n\nAssistant:";

      const data = {
        prompt,
        model: "claude-v1",
        max_tokens_to_sample: createChatCompletionRequest.max_tokens ?? 5000,
        stop_sequences: ["\n\nHuman:"],
        temperature: createChatCompletionRequest.temperature,
      };

      const response = await axios.post<ClaudeAIResponse>(
        "https://api.anthropic.com/v1/complete",
        data,
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": appConfig.anthropicApiKey,
          },
        }
      );

      const adaptedResponse = {
        id: `chatcmpl-${mkShortId()}`,
        object: "chat.completion.chunk",
        created: Date.now(),
        model: "claude-v1",
        usage: {
          prompt_tokens: 0,
          completion_tokens: -1, // TODO: Not possible to know number of tokens?
          total_tokens: -1,
        },
        choices: [
          {
            message: {
              role: "assistant",
              content: last(response.data.completion.split("\n\nAssistant:")),
            },
            index: 0,
            ...(response.data.stop_reason
              ? {
                  finish_reason: anthropicToOpenAIStopReason(
                    response.data.stop_reason
                  ),
                }
              : {}),
          },
        ],
      };

      const result = { data: adaptedResponse };
      return this.cacheResponse(key, result);
    } catch (error) {
      throw new LLMError("Anthropic API error", error);
    }
  }
}

export const createOpenAIClient = () => new OpenAIWrapper(new InMemoryCache());

export const createAnthropicClient = () =>
  new AnthropicWrapper(new InMemoryCache());
