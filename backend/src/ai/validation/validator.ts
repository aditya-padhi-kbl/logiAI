import type { AnySchema, UnwrapSchema } from "elysia";
import type { ElysiaTypeCheck } from "elysia/schema";

export function schemaValidator<T extends AnySchema>(
  validator: ElysiaTypeCheck<T>,
  context: unknown,
): ReturnType<ElysiaTypeCheck<T>["safeParse"]> {
  return validator.safeParse(context);
}
