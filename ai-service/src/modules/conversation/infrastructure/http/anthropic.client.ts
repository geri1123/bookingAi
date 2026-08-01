import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";

export type AnthropicRole = "user" | "assistant";

export interface AnthropicToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface AnthropicTextBlock {
  type: "text";
  text: string;
}

export type AnthropicContentBlock = AnthropicTextBlock | AnthropicToolUseBlock;

export interface AnthropicMessage {
  role: AnthropicRole;
  content: string | AnthropicContentBlock[] | AnthropicToolResultContent[];
}

export interface AnthropicToolResultContent {
  type: "tool_result";
  tool_use_id: string;
  content: string;
}

export interface AnthropicToolDefinition {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface AnthropicResponse {
  content: AnthropicContentBlock[];
  stop_reason: string;
}

// Klient minimal per Anthropic Messages API me tool-use, permes fetch native.
@Injectable()
export class AnthropicClient {
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
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.appConfig.anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.appConfig.anthropicModel,
        max_tokens: 1024,
        system: params.system,
        messages: params.messages,
        tools: params.tools,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${errText}`);
    }

    return (await response.json()) as AnthropicResponse;
  }
}
