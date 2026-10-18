import { LlmProvider } from "./llm.provider";

class OpenAiProvider implements LlmProvider {
  async generate<TInput>(input: TInput): Promise<unknown> {
    return Promise.resolve();
  }
}
