import type { AnySchema } from "elysia";
import type { ElysiaTypeCheck } from "elysia/schema";

export function schemaValidator<TContext, T extends AnySchema>(
  validator: ElysiaTypeCheck<T>,
  context: TContext,
): ReturnType<ElysiaTypeCheck<T>["safeParse"]> {
  return validator.safeParse(context);
}
