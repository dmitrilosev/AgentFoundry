import { Agent, run } from "@openai/agents";

const productAgent = new Agent({
  name: "__PRODUCT_NAME__ Agent",
  instructions: [
    "Help the user achieve the core outcome of __PRODUCT_NAME__.",
    "Be concise, concrete, and honest about uncertainty.",
    "Format user-facing answers as readable line-oriented Markdown.",
    "Use headings only when useful; prefer short paragraphs and bullets.",
  ].join("\n"),
});

export async function runProductAgent(transcript: string): Promise<string> {
  const result = await run(productAgent, transcript, { maxTurns: 6 });
  const output = result.finalOutput;
  if (typeof output === "string" && output.trim().length > 0) return output.trim();
  if (output != null) return JSON.stringify(output, null, 2);
  throw new Error("The agent returned no final output.");
}
