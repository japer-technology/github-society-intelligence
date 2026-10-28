import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  const baseUrl = process.env.GSI_LOCAL_BASE_URL;
  const model = process.env.GSI_LOCAL_MODEL;
  if (!baseUrl || !model) throw new Error("Local provider requires an endpoint and model.");

  pi.registerProvider("openai", {
    baseUrl,
    api: "openai-completions",
    apiKey: "OPENAI_API_KEY",
    models: [{
      id: model,
      name: model,
      reasoning: false,
      input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 32768,
      maxTokens: 4096,
      compat: { supportsDeveloperRole: false, supportsStore: false },
    }],
  });
}
