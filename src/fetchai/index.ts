import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import AnthropicChatRepository from "../anthropic";
import OpenAIChatRepository from "../openai";
import {
  AnthropicChatCompletationParams,
  ClientOptions,
  FetchAIChatCompletationParams,
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

  private isAnthropic(
    body: FetchAIChatCompletationParams
  ): body is AnthropicChatCompletationParams {
    return /^claude/.test(body.model);
  }

  async create(body: FetchAIChatCompletationParams) {
    if (this.isAnthropic(body)) {
      return this.Anthropic.create(body);
    }
    return this.OpenAI.create(body);
  }

  async countTokens(body: FetchAIChatCompletationParams) {
    if (this.isAnthropic(body)) {
      return this.Anthropic.countTokens(body);
    }
    return this.OpenAI.countTokens(body);
  }
}
