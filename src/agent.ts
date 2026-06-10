import { AIChatAgent } from "@cloudflare/ai-chat";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  generateText,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tools } from "./tools";

interface Env {
  OPENAI_API_KEY: string;
}

const SYSTEM_PROMPT = `You are a diagram design assistant. You help users create and modify diagrams on an Excalidraw canvas.

When the user asks you to create a diagram, use the generateDiagram tool to produce Excalidraw elements.

Guidelines for generating diagrams:
- Give each element a unique id (e.g. "rect-1", "text-1", "arrow-1")
- Position elements with reasonable spacing (at least 20px gap between elements)
- Use rectangles for boxes/containers, ellipses for circles, diamonds for decision points
- Add text labels inside or near shapes
- Connect related elements with arrows
- Use a clean layout: left to right or top to bottom
- Default to strokeColor "#1e1e1e" and backgroundColor "transparent"
- Set roughness to 1 for a hand-drawn look

When the user asks to modify an element, use the modifyDiagram tool with the element's id.`;

export class DesignAgent extends AIChatAgent<Env> {
  async onChatMessage() {
    const openai = createOpenAI({
      baseURL: "https://gazing-darkish-repost.ngrok-free.dev/v1",
      apiKey: "ollama-bypass",
    });

    console.log("Before generateText");

    const result = await generateText({
      model: openai.chat("llama3.2:1b"),
      messages: await convertToModelMessages(this.messages),
    });

    console.log("After generateText");
    console.log(result.text);

    return new Response(result.text)
  }
}

// export class DesignAgent extends AIChatAgent {
//   async onChatMessage() {
//     console.log("Testing Ollama endpoint...")
    
//     const response = await fetch("https://gazing-darkish-repost.ngrok-free.dev/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer ollama-bypass",
//       },
//       body: JSON.stringify({
//         model: "llama3.2:1b",
//         messages: [
//           {
//             role: "user",
//             content: "Hello"
//           }
//         ],
//         stream: true
//       })
//     })

//     console.log("Status:", response.status);
//     const text = await response.text();
//     console.log('Text', text);

//     const data = await response.json();

//     console.log("Response:", JSON.stringify(data, null, 2));

//     return new Response(JSON.stringify(data));
//   }
// }

// export class DesignAgent extends AIChatAgent<Env> {
//   async onChatMessage() {
//     const openai = createOpenAI({
//       baseURL: "https://gazing-darkish-repost.ngrok-free.dev/v1",
//       apiKey: "ollama-bypass"
//     });

//     const result = streamText({
//       model: openai.chat("llama3.2:1b"),
//       system: SYSTEM_PROMPT,
//       messages: await convertToModelMessages(this.messages),
//       // tools,
//       // stopWhen: stepCountIs(5),
//       providerOptions: {
//         openai: {
//           strictJsonSchema: false,
//           parallelToolCalls: false // Disable parallel tool calls for local models
//         }
//       }
//       // providerOptions: {openai: {strictJsonSchema: false}}
//     });
//     console.log("Returning Response")
//     const text = await result.text
//     console.log(text)
//     return result.toUIMessageStreamResponse();
//   }
// }
