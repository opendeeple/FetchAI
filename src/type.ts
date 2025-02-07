import OpenAI, { ClientOptions as OpenAIClientOptions } from "openai";
import Anthropic, {
  ClientOptions as AnthropicClientOptions,
} from "@anthropic-ai/sdk";
import { TiktokenModel } from "tiktoken";

export type Maybe<T> = T | null | undefined;

export interface FetchAITextBlockParams {
  type: "text";
  text: string;
}

export interface FetchAIChatMessageParams {
  role: "assistant" | "user";
  content: string | Array<FetchAITextBlockParams>;
}

export type AnthropicChatModels = Anthropic.Messages.Model;
export type AnthropicChatMessageParams = FetchAIChatMessageParams;

export type AnthropicChatCompletionParams = {
  model: AnthropicChatModels;
  system?: string;
  messages: AnthropicChatMessageParams[];
  prediction?: string;
  max_tokens: number;
  prediction_tokens?: number;
};

export type OpenAIChatModels = TiktokenModel;
export type OpenAIChatMessageParams = FetchAIChatMessageParams;

export type OpenAIChatCompletionParams = {
  model: OpenAIChatModels;
  system?: string;
  messages: OpenAIChatMessageParams[];
  prediction?: string;
  max_tokens: number;
  prediction_tokens?: number;
};

export interface ClientOptions {
  openai?: OpenAIClientOptions;
  anthropic?: AnthropicClientOptions;
}

export type FetchAIChatModels = OpenAIChatModels | AnthropicChatModels;

export type FetchAIChatCompletionParams =
  | OpenAIChatCompletionParams
  | AnthropicChatCompletionParams;

export type FetchAIProviders = "OpenAI" | "Anthropic";

export interface FetchAIChatPrediction {
  id?: string;
  content: string;
  openai?: OpenAI.Chat.Completions.ChatCompletion;
  anthropic?: Omit<Anthropic.Messages.Message, "id">;
}

export interface FetchAIUsage {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  predicted_tokens: number;
  openai?: OpenAI.Completions.CompletionUsage;
  anthropic?: Anthropic.Messages.Usage;
}

export interface FetchAIChatCompletion {
  provider: FetchAIProviders;
  success: boolean;
  error?: string;
  prediction: FetchAIChatPrediction;
  usage: FetchAIUsage;
}

export interface FetchAIChatCount {
  provider: FetchAIProviders;
  input_tokens: number;
}
