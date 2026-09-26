import type { AnySchema, UnwrapSchema } from "elysia";
import type { ElysiaTypeCheck } from "elysia/schema";

export interface LlmClient {
  generate<TInput, T extends AnySchema>(
    input: TInput,
    schema: T,
  ): Promise<UnwrapSchema<T, {}>>;
}
