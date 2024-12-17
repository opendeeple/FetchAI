import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import AnthropicChatRepository from "../anthropic";
import OpenAIChatRepository from "../openai";
import {
  AnthropicChatCompletionParams,
  ClientOptions,
  FetchAIChatCompletionParams,
  FetchAIChatCount,
  FetchAIChatModels,
  FetchAIProviders,
} from "../type";

export default class FetchAIChatRepository {
  OpenAI: OpenAIChatRepository;
  Anthropic: AnthropicChatRepository;

  constructor(readonly options?: ClientOptions) {
    this.OpenAI = new OpenAIChatRepository(new OpenAI(options?.openai));
    this.Anthropic = new AnthropicChatRepository(
      new Anthropic(options?.anthropic)
    );
  }

  private isAnthropicModel(model: FetchAIChatModels) {
    return /^claude/.test(model);
  }

  private isAnthropic(
    body: FetchAIChatCompletionParams
  ): body is AnthropicChatCompletionParams {
    return this.isAnthropicModel(body.model);
  }

  async create(body: FetchAIChatCompletionParams) {
    if (this.isAnthropic(body)) {
      return this.Anthropic.create(body);
    }
    return this.OpenAI.create(body);
  }

  async countTokens(
    body: FetchAIChatCompletionParams
  ): Promise<FetchAIChatCount> {
    if (this.isAnthropic(body)) {
      return {
        provider: "Anthropic",
        input_tokens: await this.Anthropic.countTokens(body),
      };
    }
    return {
      provider: "OpenAI",
      input_tokens: await this.OpenAI.countTokens(body),
    };
  }

  provider(model: FetchAIChatModels): FetchAIProviders {
    return this.isAnthropicModel(model) ? "Anthropic" : "OpenAI";
  }
}
