import OpenAI, { ClientOptions as OpenAIClientOptions } from "openai";
import Anthropic, {
  ClientOptions as AnthropicClientOptions,
} from "@anthropic-ai/sdk";
import { TiktokenModel } from "tiktoken";

export type Maybe<T> = T | null | undefined;

export type AnthropicChatModels = Anthropic.Messages.Model;
export type AnthropicChatMessageParams = Anthropic.Messages.MessageParam;

export type AnthropicChatCompletionParams = {
  model: AnthropicChatModels;
  system?: string; // Optional system message
  messages: AnthropicChatMessageParams[];
  max_tokens: number;
  prediction_tokens?: number;
};

export type OpenAIChatModels = TiktokenModel;
export type OpenAIChatMessageParams = OpenAI.Chat.ChatCompletionMessageParam;

export type OpenAIChatCompletionParams = {
  model: OpenAIChatModels;
  system?: string; // Optional system message
  messages: OpenAIChatMessageParams[];
  prediction?: string;
  max_tokens: number;
  prediction_tokens?: number;
};

export interface ClientOptions {
  openai?: OpenAIClientOptions;
  anthropic?: AnthropicClientOptions;
}

export type FetchAIChatMessageParams =
  | (OpenAIChatMessageParams & {
      role: "system" | "user" | "assistant";
    })
  | (AnthropicChatMessageParams & {
      role: "user" | "assistant";
    });

export type FetchAIChatModels = OpenAIChatModels | AnthropicChatModels;

export type FetchAIChatCompletionParams =
  | OpenAIChatCompletionParams
  | AnthropicChatCompletionParams;

export interface FetchAIChatCompletion {
  provider: "OpenAI" | "Anthropic";
  success: boolean;
  error?: string;
  prediction: {
    id?: string;
    content: string;
    openai?: OpenAI.Chat.Completions.ChatCompletion;
    anthropic?: Omit<Anthropic.Messages.Message, "id">;
  };
  usage: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    predicted_tokens: number;
    openai?: OpenAI.Completions.CompletionUsage;
    anthropic?: Anthropic.Messages.Usage;
  };
}
