import { DesignAgent } from "./agent";
import { routeAgentRequest } from "agents";

export { DesignAgent };

interface ENV {
  DesignAgent: DurableObjectNamespace;
  OPENAI_API_KEY: string;
}

// This fetch request is what gets called when someone hits our URL, when GET request comes to the root of the server
export default {
  async fetch(request: Request, env: ENV) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<ENV>;
