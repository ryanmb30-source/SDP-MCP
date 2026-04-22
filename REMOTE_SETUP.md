# Remote MCP Setup with mcp-remote

## Overview
`mcp-remote` is an npm package that acts as a bridge between Claude Desktop (which only supports stdio) and remote MCP servers (using SSE/HTTP).

## Setup Instructions

### 1. On the Server
First, make sure the SSE server is running:

```bash
cd C:\SDP-MCP\SDP-MCP-fork\sdp-mcp-server
node src/working-sse-server.cjs
```

The server should be running on port 3456. Verify with:
```bash
curl http://localhost:3456/health
```

### 2. On the Remote PC (Claude Desktop)

#### Step 1: Install Node.js
Make sure Node.js is installed. Test with:
```bash
node --version
npm --version
```

#### Step 2: Configure Claude Desktop
Find your Claude Desktop config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration (replace `YOUR-SERVER-IP` with your server's IP or hostname):

```json
{
  "mcpServers": {
    "service-desk-plus": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://YOUR-SERVER-IP:3456/sse"
      ],
      "env": {
        "SDP_CLIENT_ID": "your-client-id-from-zoho-console",
        "SDP_CLIENT_SECRET": "your-client-secret-from-zoho-console"
      }
    }
  }
}
```

#### Step 3: Test Connection
1. Close Claude Desktop completely
2. Open Claude Desktop
3. Look for the MCP tools icon (should appear if connection successful)
4. Try a simple command like "list service desk requests"

## Troubleshooting

### "Cannot find module mcp-remote"
When you first use `npx mcp-remote`, it will download the package. Make sure you have internet access.

### "Connection refused"
1. Check server is running: `curl http://localhost:3456/health`
2. Check firewall allows port 3456
3. Try using IP address instead of hostname

### "No tools available"
1. Check Claude Desktop logs
2. Verify the server shows the SSE connection in its logs
3. Try restarting Claude Desktop

### Network Issues
If hostname doesn't resolve, add to hosts file:
- Mac/Linux: `/etc/hosts`
- Windows: `C:\Windows\System32\drivers\etc\hosts`
```
192.168.x.x  your-server-hostname
```

## How It Works

```
Claude Desktop --stdio--> npx mcp-remote --HTTP/SSE--> MCP Server (server:3456)
```

1. Claude Desktop starts `mcp-remote` as a subprocess
2. `mcp-remote` connects to the remote SSE server
3. It translates between stdio (used by Claude) and SSE (used by server)
4. Your tools are now available in Claude Desktop!

## Logs
To see what's happening:
1. Server logs: Check the terminal where you started the server
2. Claude Desktop logs: 
   - Mac: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`
