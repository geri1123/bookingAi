import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import {
  AnthropicMessage,
  AnthropicResponse,
  AnthropicToolDefinition,
  AnthropicContentBlock,
  AnthropicToolResultContent,
} from "./anthropic.client";

// Format-et interne te Gemini API
interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args: Record<string, unknown> };
  functionResponse?: { name: string; response: Record<string, unknown> };
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface GeminiCandidate {
  content: { parts: GeminiPart[] };
  finishReason: string;
}

interface GeminiApiResponse {
  candidates: GeminiCandidate[];
}

// Klient per Gemini API (free tier) qe respekton te njejtin "shape" pergjigje si AnthropicClient,
// keshtu qe HandleIncomingMessageUseCase mund ta perdore pa asnje ndryshim logjike.
@Injectable()
export class GeminiClient {
  constructor(private readonly appConfig: AppConfigService) {}

  async createMessage(params: {
    system: string;
    messages: AnthropicMessage[];
    tools: AnthropicToolDefinition[];
  }): Promise<AnthropicResponse> {
    if (this.appConfig.aiMockMode) {
      return {
        content: [{ type: "text", text: this.appConfig.aiMockReplyText }],
        stop_reason: "end_turn",
      };
    }

    const contents = this.toGeminiContents(params.messages);
    const tools = params.tools.length
      ? [
          {
            functionDeclarations: params.tools.map((t) => ({
              name: t.name,
              description: t.description,
              parameters: t.input_schema,
            })),
          },
        ]
      : undefined;

    const model = this.appConfig.geminiModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.appConfig.geminiApiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: params.system }] },
        contents,
        tools,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const data = (await response.json()) as GeminiApiResponse;
    return this.toAnthropicResponse(data);
  }

  // Konverton historikun ne formatin e Gemini-t (role: "model" ne vend te "assistant",
  // functionCall/functionResponse ne vend te tool_use/tool_result)
  private toGeminiContents(messages: AnthropicMessage[]): GeminiContent[] {
    return messages.map((m) => {
      const role: "user" | "model" = m.role === "assistant" ? "model" : "user";

      if (typeof m.content === "string") {
        return { role, parts: [{ text: m.content }] };
      }

      const parts: GeminiPart[] = m.content.map((block) => {
        if (block.type === "text") {
          return { text: block.text };
        }
        if (block.type === "tool_use") {
          return { functionCall: { name: block.name, args: block.input } };
        }
        const resultBlock = block as AnthropicToolResultContent;
        return {
          functionResponse: {
            name: resultBlock.tool_use_id,
            response: { content: this.tryParseJson(resultBlock.content) },
          },
        };
      });

      return { role, parts };
    });
  }

  private tryParseJson(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  // Konverton pergjigjen e Gemini-t ne "shape"-in e AnthropicResponse qe pret use-case-i
  private toAnthropicResponse(data: GeminiApiResponse): AnthropicResponse {
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];

    const content: AnthropicContentBlock[] = parts.map((p, idx) => {
      if (p.functionCall) {
        return {
          type: "tool_use",
          id: `call_${idx}_${p.functionCall.name}`,
          name: p.functionCall.name,
          input: p.functionCall.args ?? {},
        };
      }
      return { type: "text", text: p.text ?? "" };
    });

    return {
      content,
      stop_reason: candidate?.finishReason === "STOP" ? "end_turn" : "tool_use",
    };
  }
}