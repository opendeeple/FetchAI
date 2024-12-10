import Anthropic from "@anthropic-ai/sdk";
import { omit } from "../utils";
import {
  AnthropicChatCompletationParams,
  FetchAIChatCompletation,
} from "../type";

export default class AnthropicChatRepository {
  constructor(readonly provider: Anthropic) {}

  async create(body: AnthropicChatCompletationParams) {
    try {
      const completion = await this.provider.messages.create(
        omit(body, ["prediction_tokens"])
      );
      const content = completion.content[0];
      const message =
        content.type == "text"
          ? content.text
          : `${content.name}(id=${content.id}, value=${content.input})`;
      const result: FetchAIChatCompletation = {
        provider: "Anthropic",
        success: true,
        prediction: {
          id: completion.id,
          content: message,
          anthropic: omit(completion, ["id"]),
        },
        usage: {
          input_tokens: completion.usage.input_tokens,
          output_tokens: completion.usage.output_tokens,
          total_tokens:
            completion.usage.input_tokens + completion.usage.output_tokens,
          predicted_tokens:
            body.prediction_tokens ?? (await this.countTokens(body)),
          anthropic: completion.usage,
        },
      };
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result: FetchAIChatCompletation = {
        provider: "Anthropic",
        success: false,
        error: message,
        prediction: {
          content: `Oops: ${message};`,
        },
        usage: {
          predicted_tokens: await this.countTokens(body),
        },
      };
      return result;
    }
  }

  async countTokens(body: AnthropicChatCompletationParams) {
    const response = await this.provider.beta.messages.countTokens({
      betas: ["token-counting-2024-11-01"],
      ...omit(body, ["max_tokens"]),
    });
    return response.input_tokens;
  }
}
