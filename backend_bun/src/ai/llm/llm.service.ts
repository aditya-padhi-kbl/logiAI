import type { AnySchema, UnwrapSchema } from "elysia";
import { LlmClient } from "./llm.client";
import { ElysiaTypeCheck, getSchemaValidator } from "elysia/schema";
import { schemaValidator } from "../validation/validator";
import { LlmProvider } from "./provider/llm.provider";

class LlmService implements LlmClient {
  constructor(private readonly provider: LlmProvider) {}
  async generate<TInput, TSchema extends AnySchema>(
    input: TInput,
    schema: TSchema,
  ): Promise<UnwrapSchema<TSchema, {}>> {
    const rawResponse = await this.provider.generate<TInput>(input);
    const validator = getSchemaValidator(schema) as ElysiaTypeCheck<TSchema>;

    const result = schemaValidator(validator, rawResponse);

    if (!result.success) {
      throw new Error("LLM response validation failed");
    }
    return result.data;
  }
}
