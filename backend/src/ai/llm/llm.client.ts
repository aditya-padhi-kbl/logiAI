import type { AnySchema } from "elysia";
import type { ElysiaTypeCheck } from "elysia/schema";

export interface LlmClient {
  generate<TInput, T extends AnySchema>(
    input: TInput,
    schema: T,
  ): Promise<ReturnType<ElysiaTypeCheck<T>["safeParse"]>>;
}
