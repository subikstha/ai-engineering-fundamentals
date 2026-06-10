const message = process.argv.slice(2).join(" ") || "draw a rectangle";
const url = "ws://localhost:5173/agents/design-agent/test";

const ws = new WebSocket(url);
const requestId = crypto.randomUUID();

let started = false;

ws.addEventListener("open", () => {
  console.log(`Sending: "${message}"\n`);

  const userMessage = {
    id: crypto.randomUUID(),
    role: "user",
    parts: [{ type: "text", text: message }],
  };

  ws.send(
    JSON.stringify({
      type: "cf_agent_use_chat_request",
      id: requestId,
      init: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [userMessage] }),
      },
    })
  );
});

ws.addEventListener("message", (event) => {
  const data = event.data;

  try {
    const parsed = JSON.parse(data);

    if (
      parsed.type === "cf_agent_use_chat_response" &&
      parsed.id === requestId
    ) {
      if (!started) {
        console.log("\n--- response ---\n");
        started = true;
      }

      process.stdout.write(parsed.body);

      if (parsed.done) {
        console.log("\n");
        ws.close();
      }
    }
  } catch {
    process.stdout.write(data);
  }
});

ws.addEventListener("error", (err) => {
  console.error("WebSocket error:", err.message);
  process.exit(1);
});