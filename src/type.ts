import OpenAI, { ClientOptions as OpenAIClientOptions } from "openai";
import Anthropic, {
  ClientOptions as AnthropicClientOptions,
} from "@anthropic-ai/sdk";
import { TiktokenModel } from "tiktoken";

export type Maybe<T> = T | null | undefined;

export type AnthropicChatModels = Anthropic.Messages.Model;
export type AnthropicChatMessageParams = Anthropic.Messages.MessageParam;

export type AnthropicChatCompletationParams = {
  model: AnthropicChatModels;
  system: string;
  messages: AnthropicChatMessageParams[];
  max_tokens: number;
  prediction_tokens?: number;
};

export type OpenAIChatModels = TiktokenModel;
export type OpenAIChatMessageParams = OpenAI.Chat.ChatCompletionMessageParam;

export type OpenAIChatCompletationParams = {
  model: OpenAIChatModels;
  system: string;
  messages: OpenAIChatMessageParams[];
  prediction?: string;
  max_tokens: number;
  prediction_tokens?: number;
};

export interface ClientOptions {
  openai?: OpenAIClientOptions;
  anthropic?: AnthropicClientOptions;
}

export type FalconAIChatModels = OpenAIChatModels | AnthropicChatModels;
export type FalconAIChatMessageParams =
  | OpenAIChatMessageParams
  | AnthropicChatMessageParams;

export type FalconAIChatCompletationParams =
  | OpenAIChatCompletationParams
  | AnthropicChatCompletationParams;

export interface FalconAIChatCompletation {
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
