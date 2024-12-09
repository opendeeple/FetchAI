import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";
import {
  FalconAIChatCompletation,
  OpenAIChatCompletationParams,
  OpenAIChatMessageParams,
} from "../type";

export default class OpenAIChatRepository {
  constructor(readonly provider: OpenAI) {}

  async create(body: OpenAIChatCompletationParams) {
    const prediction = body.prediction;
    try {
      const completion = await this.provider.chat.completions.create({
        model: body.model,
        messages: this.buildMessages(body),
        max_tokens: body.max_tokens,
        prediction: prediction
          ? {
              type: "content",
              content: prediction,
            }
          : undefined,
      });
      const result: FalconAIChatCompletation = {
        provider: "OpenAI",
        success: true,
        prediction: {
          id: completion._request_id ? completion._request_id : undefined,
          content: completion.choices[0].message.content ?? "",
          openai: completion,
        },
        usage: {
          input_tokens: completion.usage?.prompt_tokens,
          output_tokens: completion.usage?.completion_tokens,
          total_tokens: completion.usage?.total_tokens,
          predicted_tokens:
            body.prediction_tokens ?? (await this.countTokens(body)),
          openai: completion.usage,
        },
      };
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result: FalconAIChatCompletation = {
        provider: "OpenAI",
        success: false,
        error: message,
        prediction: {
          content: `Oops: ${message}`,
        },
        usage: {
          predicted_tokens: await this.countTokens(body),
        },
      };
      return result;
    }
  }

  async countTokens(body: OpenAIChatCompletationParams) {
    const modelEncoding = encoding_for_model(body.model);

    let tokens = modelEncoding.encode(body.system).length;

    const messages = body.messages;
    for (const message of messages) {
      const roleTokens = modelEncoding.encode(message.role).length + 4;
      const contentTokens = modelEncoding.encode(
        typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content ?? "")
      ).length;

      tokens += roleTokens + contentTokens;
      tokens += 4;
    }
    tokens += messages.length * 2;

    return tokens;
  }

  private buildMessages(body: OpenAIChatCompletationParams) {
    const messages: OpenAIChatMessageParams[] = [
      {
        role: "system",
        content: body.system,
      },
      ...body.messages,
    ];
    return messages;
  }
}
