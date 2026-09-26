import type { AnySchema } from "elysia";
import { LlmClient } from "./llm.client";
import { ElysiaTypeCheck, getSchemaValidator } from "elysia/schema";
import { schemaValidator } from "../validation/validator";

class LlmService implements LlmClient {
  generate<TInput, TSchema extends AnySchema>(
    input: TInput,
    schema: TSchema,
  ): Promise<ReturnType<ElysiaTypeCheck<TSchema>["safeParse"]>> {
    return this.parseWithSchema(input, schema);
  }

  private parseWithSchema<TInput, TSchema extends AnySchema>(
    input: TInput,
    schema: TSchema,
  ): Promise<ReturnType<ElysiaTypeCheck<TSchema>["safeParse"]>> {
    const validator = getSchemaValidator(schema) as ElysiaTypeCheck<TSchema>;

    if (!validator) {
      throw new Error(
        "Unable to create schema validator for the provided input schema.",
      );
    }

    return Promise.resolve(schemaValidator<TInput, TSchema>(validator, input));
  }
}
