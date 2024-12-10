# FetchAI
FetchAI is AI integration library, build for integrate with ChatGPT, Anthropic and more AI services.

# Example

Send request to OpenAI Chat Completation.

```ts
const repo = new FetchAIChatRepository({
  openai: {
    apiKey: "<your-openai-api-key>",
  },
  anthropic: {
    apiKey: "<your-anthropci-api-key>",
  },
});

const result: FetchAIChatCompletation = await repo.create({
  model: "gpt-4o",
  system: "You are a helpful assistant.",
  messages: [
    {
      role: "user",
      content: "Write your message",
    },
  ],
  max_tokens: 1000,
});

console.log(result);
```

Calculate the input tokens before sending request to provider.

```ts
const input_tokens: number = await repo.countTokens({
  model: "claude-3-5-haiku-20241022",
  system: "You are a helpful assistant.",
  messages: [
    {
      role: "user",
      content: "Write your message",
    },
  ],
  max_tokens: 1000,
});

console.log(input_tokens);
```