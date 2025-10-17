# Email Reader MCP

A Model Context Protocol (MCP) server that enables Claude Desktop or any Client to read and search your Gmail messages via IMAP. Perfect for AI-powered email workflows, automation, and intelligent email management.

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **Gmail account** with IMAP enabled
- **App Password** (if using 2-factor authentication)

### 2. Gmail Setup

1. **Enable IMAP in Gmail:**
   - Go to Gmail Settings → See all settings → Forwarding and POP/IMAP
   - Enable "IMAP access"
   - Save changes

2. **Create App Password (if using 2FA):**
   - Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" for the app and "Other (Custom name)" for the device
   - Name it "Claude Desktop MCP"
   - Copy the generated password

### 3. MCP Server Configuration

Add this to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "email-reader": {
      "command": "npx",
      "args": ["-y", "@automatearmy/email-reader-mcp"]
    }
  }
}
```

### 4. Environment Setup

Create a `.env` file in your home directory or project folder:

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
USER_EMAIL="your-email@gmail.com"
USER_PASS="your-app-specific-password"
```

### 5. Restart Claude Desktop

Restart Claude Desktop to load the new MCP server. You can now ask Claude to read your emails!

## 📧 Available Tools

### `get-messages`

Fetch and filter email messages from your Gmail inbox with powerful search capabilities.

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Maximum number of messages to fetch |
| `includeFullContent` | boolean | false | Include full email body (default: 500-char preview) |
| `dateFrom` | string | - | Filter messages from this date (ISO format: "2024-01-01") |
| `dateTo` | string | - | Filter messages until this date (ISO format) |
| `unreadOnly` | boolean | false | Only fetch unread messages |
| `from` | string | - | Filter by sender email address |
| `subject` | string | - | Filter by subject (partial match) |

#### Response Format

```json
{
  "messages": [
    {
      "uid": 12345,
      "subject": "Email Subject",
      "from": "sender@example.com",
      "to": "recipient@example.com",
      "date": "2024-01-15T10:30:00.000Z",
      "body": "Email content...",
      "flags": ["\\Seen"]
    }
  ],
  "count": 1,
  "filters": {
    "limit": 10,
    "includeFullContent": false,
    "unreadOnly": false
  }
}
```

## 💡 Usage Examples

### Basic Email Reading
```
"Show me my latest 5 emails"
```

### Unread Messages Only
```
"Get all unread messages from today"
```

### Advanced Filtering
```
"Find emails from notifications@github.com about 'pull request' in the last week"
```

### Full Content Search
```
"Show me the complete content of the 3 most recent emails from my boss"
```

### Date Range Queries
```
"Get all emails from December 2024 with 'invoice' in the subject"
```

## 🔒 Security Best Practices

- **Never commit `.env` files** to version control
- **Use App Passwords** instead of your main Gmail password
- **Limit access** to only necessary email folders
- **Regularly rotate** your app passwords
- **Monitor access** in your Google account security settings

## ⚡ Performance Tips

- Use **date ranges** to reduce processing time
- Set **reasonable limits** (default: 10 messages)
- Use **preview mode** (`includeFullContent: false`) for initial searches
- Apply **specific filters** (sender, subject) to narrow results

## 🛠️ Troubleshooting

### Common Issues

**"Authentication failed"**
- Verify IMAP is enabled in Gmail settings
- Check that you're using an App Password (not regular password)
- Ensure email and password are correctly set.

**"No messages found"**
- Check your search criteria aren't too restrictive
- Verify the date format is correct (ISO string)
- Try without filters first to test connectivity

**"Connection timeout"**
- Check your internet connection
- Verify Gmail IMAP servers are accessible
- Try restarting Claude Desktop



## 🏗️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/automatearmy/email-reader-mcp.git
cd email-reader-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### Project Structure

```
src/
├── index.ts              # MCP server entry point
├── imap/
│   └── index.ts          # IMAP client configuration
└── tools/
    └── get-messages/
        ├── schema.ts     # Zod validation schema
        └── index.ts      # Tool handler implementation
```

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the [MCP documentation](https://modelcontextprotocol.io/)

---

**Built by [Automate Army](https://automatearmy.com)** - Empowering AI workflows with robust integrations.
