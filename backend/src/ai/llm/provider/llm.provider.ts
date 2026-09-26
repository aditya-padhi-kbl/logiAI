// import { Static, t } from "elysia";
// const ProviderPromptSchema = t.Object({
//   prompt: t.String(),
//   model: t.String(),
//   temperature: t.Number(),
// });

// type ProviderPrompt = Static<typeof ProviderPromptSchema>;

export interface LlmProvider {
  generate<TInput>(input: TInput): Promise<unknown>;
}
