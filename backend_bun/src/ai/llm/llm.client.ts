import type { AnySchema, UnwrapSchema } from "elysia";

export interface LlmClient {
  generate<TInput, T extends AnySchema>(
    input: TInput,
    schema: T,
  ): Promise<UnwrapSchema<T, {}>>;
}
