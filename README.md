# Gemini MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![MCP Version](https://img.shields.io/badge/MCP-2024--11--05-green)](https://modelcontextprotocol.io/)

A specialized MCP (Model Context Protocol) server focused on **UI generation and frontend development** using Google's latest Gemini 3.0 Pro model. Designed to complement Claude Code by handling what Gemini does best.

🚀 **Works with**: Claude Desktop, Claude Code, Cursor, Windsurf, Kiro, and any MCP-compatible client
🎯 **Specialization**: UI generation, design-to-code, interactive animations, visual debugging
⚡ **Powered by**: Gemini 3.0 Pro (#1 on WebDev Arena for UI generation)
🎯 **NEW**: Kiro Power support with controlled advisory tools

## Why This Server?

Claude Code excels at code planning, architecture design, and code review. But for UI generation and frontend development, Gemini 3.0 Pro is the leader:

- **#1 on WebDev Arena** (1487 Elo) for UI generation
- **Superior visual understanding**: Design mockups → pixel-perfect code
- **Animation expertise**: Canvas, WebGL, CSS animations, Three.js
- **Native multimodal**: Seamless image + text understanding

> **Philosophy**: Let Claude be the commander, let Gemini be the specialist.

## Features

### 12 Specialized Tools (9 Creative + 3 Controlled Power)

#### Creative Tools (Original)

| Tool | Description | Priority |
|------|-------------|----------|
| `gemini_generate_ui` | Generate HTML/CSS/JS UI components from description or design image | 🔴 P0 |
| `gemini_multimodal_query` | Analyze images with natural language queries | 🔴 P0 |
| `gemini_fix_ui_from_screenshot` | Diagnose and fix UI issues from screenshots | 🔴 P0 |
| `gemini_create_animation` | Create interactive animations (CSS/Canvas/WebGL/Three.js) | 🔴 P0 |
| `gemini_analyze_content` | Analyze code, documents, or data (supports file path) | 🟡 P1 |
| `gemini_analyze_codebase` | Analyze entire codebase (supports directory path) | 🟡 P1 |
| `gemini_brainstorm` | Generate creative ideas with project context | 🟢 P2 |
| `gemini_search` | Web search with Google Search grounding | 🟢 P2 |
| `list_models` | List available Gemini models with capabilities | 🟢 P2 |

#### 🆕 Controlled Power Tools (v1.2.0)

| Tool | Role | Constraints |
|------|------|-------------|
| `gemini_research_advisor` | Research Assistant - Extract concepts, provide references | ❌ No decisions, ❌ No recommendations |
| `gemini_devils_advocate` | Critic - Find risks, gaps, hidden assumptions | ❌ No solutions, ❌ No alternatives |
| `gemini_consistency_check` | Validator - Check goal/constraint/proposal alignment | ❌ No fixes, ❌ No suggestions |

**Why Controlled Tools?**
- **Minimal context pollution**: Structured JSON output with token budgets
- **No decision drift**: Tools stay in their lane (research OR critique OR validate)
- **Predictable outputs**: Perfect for automated workflows and CI/CD integration

### v1.2.0 New Features - Controlled Power Tools

Three new "controlled" tools designed for engineering collaboration:

#### Research Advisor
```json
{
  "question": "What are the key patterns for React Server Components?",
  "materialPaths": ["./docs/rsc-spec.md"],
  "maxOutputTokens": 800
}
```
Returns: `key_concepts`, `recommended_directions`, `open_questions`, `best_practices`, `citations_or_keywords`

#### Devil's Advocate
```json
{
  "proposal": "We will use microservices with 5 services...",
  "goal": "Improve scalability",
  "constraints": "Team of 4, 6-month deadline",
  "maxOutputTokens": 600
}
```
Returns: `critical_risks`, `hidden_assumptions`, `missing_considerations`, `questions_to_answer`

#### Consistency Check
```json
{
  "goal": "Implement OAuth2 with Google and GitHub",
  "constraints": "Must work with existing sessions",
  "proposal": "Implemented Google OAuth only...",
  "acceptanceCriteria": "Users can sign in with Google or GitHub"
}
```
Returns: `conflicts_found`, `conflicts`, `requirements_not_covered`, `validation_gaps`

### v1.1.0 New Features

#### Direct File System Access

Tools can now read files directly from the file system, no need to pass file contents:

| Tool | New Parameters |
|------|----------------|
| `analyze_codebase` | `directory`, `filePaths`, `include`, `exclude` |
| `analyze_content` | `filePath` |
| `generate_ui` | `techContext`, `configPath` |
| `fix_ui_from_screenshot` | `sourceCodePath`, `relatedFiles` |
| `brainstorm` | `contextFilePath`, `contextFiles` |

#### Tech Stack Context

`generate_ui` now supports technology stack context for generating code that matches your project:

```json
{
  "description": "User login form",
  "framework": "react",
  "techContext": {
    "cssFramework": "tailwind",
    "uiLibrary": "shadcn",
    "typescript": true
  }
}
```

Or auto-detect from `package.json`:
```json
{
  "description": "User login form",
  "configPath": "./package.json"
}
```

#### Structured Model Information

`list_models` now returns detailed capability information:
- `capabilities`: maxInputTokens, supportsVision, supportsFunctionCalling, etc.
- `useCases`: Recommended use cases in Chinese
- `recommendations`: Model recommendations by scenario

### Supported Models

| Model | Context | Best For | Default |
|-------|---------|----------|---------|
| `gemini-3-pro-preview` | 1M tokens | UI generation, frontend development | ✅ Yes |
| `gemini-2.5-pro` | 1M tokens | General coding, fallback | ❌ No |
| `gemini-2.5-flash` | 1M tokens | High-frequency tasks, cost optimization | ❌ No |
| `gemini-2.5-flash-lite` | 1M tokens | Simple queries, maximum cost savings | ❌ No |

## Kiro Power Installation

This server can be installed as a **Kiro Power** for enhanced integration:

### Option 1: Local Installation (Development)

1. Clone and build the project:
```bash
git clone https://github.com/LeonSGP43/Gemini-mcp.git
cd Gemini-mcp
npm install && npm run build
```

2. Copy the power folder to your Kiro powers directory:
```bash
cp -r .kiro/powers/gemini-assistant ~/.kiro/powers/
```

3. Update the mcp.json path to point to your local build:
```json
{
  "mcpServers": {
    "gemini-assistant": {
      "command": "node",
      "args": ["/path/to/Gemini-mcp/dist/server.js"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Option 2: NPX Installation (Recommended)

Create `.kiro/powers/gemini-assistant/mcp.json`:
```json
{
  "mcpServers": {
    "gemini-assistant": {
      "command": "npx",
      "args": ["-y", "github:LeonSGP43/Gemini-mcp"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      },
      "autoApprove": [
        "list_models",
        "gemini_research_advisor",
        "gemini_devils_advocate",
        "gemini_consistency_check"
      ]
    }
  }
}
```

## Quick Start

### 1. Get Gemini API Key

Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create an API key.

### 2. Configure Your MCP Client

<details>
<summary><b>Claude Desktop / Claude Code</b></summary>

Config location:
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gemini-assistant": {
      "command": "npx",
      "args": ["-y", "github:LeonSGP43/Gemini-mcp"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**For users behind proxy/VPN**, add proxy environment variable:
```json
{
  "mcpServers": {
    "gemini-assistant": {
      "command": "npx",
      "args": ["-y", "github:LeonSGP43/Gemini-mcp"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here",
        "HTTPS_PROXY": "http://127.0.0.1:7897"
      }
    }
  }
}
```
</details>

<details>
<summary><b>Cursor / Windsurf</b></summary>

Add to your MCP settings:
```json
{
  "gemini-assistant": {
    "command": "npx",
    "args": ["-y", "github:LeonSGP43/Gemini-mcp"],
    "env": {
      "GEMINI_API_KEY": "your_api_key_here"
    }
  }
}
```
</details>

### 3. Restart Your MCP Client

## Usage Examples

### UI Generation

```
"Generate a responsive pricing card with three tiers using React"
"Create a modern login form with glassmorphism style"
"Build a dashboard sidebar with smooth hover animations"
```

### Design to Code

```
"Convert this Figma screenshot to a React component" (attach image)
"Implement this UI design pixel-perfectly" (attach image)
```

### Visual Debugging

```
"Fix the layout issue in this screenshot" (attach screenshot)
"The button is misaligned on mobile, here's a screenshot" (attach screenshot)
```

### Animation Creation

```
"Create a particle system that follows the mouse cursor"
"Build a 3D rotating cube with Three.js"
"Make a smooth page transition animation with CSS"
```

### Code Analysis

```
"Analyze this codebase for security issues"
"Review this function for performance improvements"
"Explain this complex algorithm"
```

## Image Input Support

All image-related tools support two input formats:

1. **File paths** (recommended for local files):
   ```
   "./images/design.png"
   "C:/Users/name/Desktop/screenshot.png"
   ```

2. **Base64 data URIs**:
   ```
   "data:image/png;base64,iVBORw0KGgo..."
   ```

When you provide a file path, Claude Code will automatically read and convert it.

## Local Development

```bash
# Clone repository
git clone https://github.com/LeonSGP43/Gemini-mcp.git
cd Gemini-mcp

# Install dependencies
npm install

# Set up environment
export GEMINI_API_KEY="your_api_key_here"

# Build
npm run build

# Start server
npm start
```

## Project Structure

```
src/
├── config/
│   ├── models.ts        # 模型配置（含能力信息）
│   └── constants.ts     # 全局常量
├── tools/
│   ├── definitions.ts   # MCP 工具定义
│   ├── generate-ui.ts   # UI 生成（支持技术栈上下文）
│   ├── multimodal-query.ts  # 多模态查询
│   ├── fix-ui.ts        # UI 修复（支持源代码路径）
│   ├── create-animation.ts  # 动画创建
│   ├── analyze-content.ts   # 内容分析（支持文件路径）
│   ├── analyze-codebase.ts  # 代码库分析（支持目录路径）
│   ├── brainstorm.ts    # 头脑风暴（支持项目上下文）
│   ├── search.ts        # 网络搜索（Google Search grounding）
│   ├── list-models.ts   # 模型列表（结构化输出）
│   ├── research-advisor.ts   # 🆕 资料顾问 Power
│   ├── devils-advocate.ts    # 🆕 反对者 Power
│   └── consistency-check.ts  # 🆕 一致性检查 Power
├── utils/
│   ├── gemini-client.ts # Gemini API 客户端
│   ├── error-handler.ts # 错误处理
│   ├── validators.ts    # 参数验证
│   ├── security.ts      # 安全验证模块
│   └── file-reader.ts   # 文件读取工具
├── types.ts             # 类型定义
└── server.ts            # 主服务器

.kiro/powers/gemini-assistant/   # 🆕 Kiro Power 配置
├── POWER.md             # Power 文档
├── mcp.json             # MCP 服务器配置
└── steering/
    ├── workflows.md     # 工作流指南
    └── power-tools-guide.md  # Power 工具深度指南
```

## Credits

Based on [aliargun/mcp-server-gemini](https://github.com/aliargun/mcp-server-gemini) v4.2.2

Inspired by:
- [RaiAnsar/claude_code-gemini-mcp](https://github.com/RaiAnsar/claude_code-gemini-mcp)
- [cmdaltctr/claude-gemini-mcp-slim](https://github.com/cmdaltctr/claude-gemini-mcp-slim)
- [RLabs-Inc/gemini-mcp](https://github.com/RLabs-Inc/gemini-mcp)

## License

MIT

---

*Specialized for UI generation and frontend development*
*Powered by Gemini 3.0 Pro*
