import type { AnySchema, UnwrapSchema } from "elysia";
import { LlmClient } from "./llm.client";
import { ElysiaTypeCheck, getSchemaValidator } from "elysia/schema";
import { schemaValidator } from "../validation/validator";

class LlmService implements LlmClient {
  generate<TInput, TSchema extends AnySchema>(
    input: TInput,
    schema: TSchema,
  ): Promise<UnwrapSchema<TSchema, {}>> {
    const rawResponse = this.callModel<TInput>(input);
    const validator = getSchemaValidator(schema) as ElysiaTypeCheck<TSchema>;

    const result = schemaValidator(validator, rawResponse);

    if (!result.success) {
      throw new Error("LLM response validation failed");
    }

    return Promise.resolve(result.data);
  }

  private async callModel<TInput>(input: TInput) {
    return "The inptu is" + input;
  }
}
