import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getMessagesSchema } from "./tools/get-messages/schema.js";
import { getMessagesHandler } from "./tools/get-messages/index.js";
const server = new McpServer({
  name: "email-reader-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
  const transport = new StdioServerTransport();
  server.registerTool(
    "get-messages",
    {
      title: "Get Messages",
      description: "Get the last messages from your inbox",
      inputSchema: getMessagesSchema.shape,
    },
    getMessagesHandler
  );
  await server.connect(transport);
  console.error("Email MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
