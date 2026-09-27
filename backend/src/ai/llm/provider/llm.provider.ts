import { Static, t } from "elysia";

const ProviderRequestSchema = t.Object({
  prompt: t.String(),
  model: t.String(),
  temperature: t.Number(),
});

type ProviderRequest = Static<typeof ProviderRequestSchema>;

export interface LlmProvider {
  generate<TInput>(input: TInput): Promise<unknown>;
}
