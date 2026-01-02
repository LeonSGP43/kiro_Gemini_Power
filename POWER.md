---
name: "gemini-assistant"
displayName: "Gemini Assistant Power"
description: "Dual-mode Gemini 3 Pro integration: Creative tools (UI generation, multimodal, animation) + Controlled advisory powers (research, devil's advocate, consistency check) for engineering collaboration."
keywords: ["gemini", "ui", "multimodal", "research", "review", "consistency", "validation", "brainstorm", "animation"]
author: "LeonSGP43"
---

# Gemini Assistant Power

## Overview

This power provides a **dual-mode** integration with Gemini 3 Pro:

### 🎨 Creative Mode (Original Tools)
Full creative capabilities for UI generation, multimodal understanding, and content creation:
- **UI Generation** - Pixel-perfect HTML/CSS/JS from descriptions or design images
- **Multimodal Query** - Analyze images with natural language
- **Fix UI** - Diagnose and fix UI issues from screenshots
- **Create Animation** - CSS/Canvas/WebGL/Three.js animations
- **Analyze Content** - Code review, summarization, optimization
- **Analyze Codebase** - Architecture analysis with 1M token context
- **Brainstorm** - Creative ideation with pros/cons
- **Search** - Web search with Google Search grounding

### 🎯 Controlled Mode (Power Tools)
Structured, token-controlled outputs for engineering collaboration:
- **Research Advisor** - Extract concepts, provide references (never decides)
- **Devil's Advocate** - Find risks and gaps (never proposes solutions)
- **Consistency Check** - Verify alignment (never suggests fixes)

## Why Dual-Mode?

**Creative Mode** = When you need Gemini's full capabilities (brainstorming, UI, content)
**Controlled Mode** = When you need Gemini as a "controlled capability module" that:
- Doesn't pollute your main context
- Doesn't "take over" decision-making
- Provides structured, predictable outputs
- Stays in its lane (research, critique, or validation)

## Available Steering Files

- **workflows** - Common usage patterns and integration examples
- **power-tools-guide** - Deep dive into the 3 controlled power tools

## MCP Server

This power uses a single MCP server: `gemini-assistant`

### Environment Variables
- `GEMINI_API_KEY` (required) - Your Google AI API key

## Tool Categories

### Creative Tools (9 tools)

| Tool | Purpose | Best For |
|------|---------|----------|
| `gemini_generate_ui` | Generate UI components | Design-to-code, prototyping |
| `gemini_multimodal_query` | Image + text analysis | Design review, diagram understanding |
| `gemini_fix_ui_from_screenshot` | Fix UI bugs | Visual debugging |
| `gemini_create_animation` | Create animations | Interactive effects |
| `gemini_analyze_content` | Analyze code/docs | Code review, summarization |
| `gemini_analyze_codebase` | Analyze entire codebase | Architecture review |
| `gemini_brainstorm` | Generate ideas | Ideation, exploration |
| `gemini_search` | Web search | Current info, fact-checking |
| `list_models` | List Gemini models | Model selection |

### Controlled Power Tools (3 tools)

| Tool | Role | Constraints |
|------|------|-------------|
| `gemini_research_advisor` | Research Assistant | ❌ No decisions, ❌ No recommendations |
| `gemini_devils_advocate` | Critic / Risk Finder | ❌ No solutions, ❌ No alternatives |
| `gemini_consistency_check` | Alignment Validator | ❌ No fixes, ❌ No suggestions |

## Quick Start Examples

### Research Advisor
```
Use gemini_research_advisor to understand React Server Components:
- question: "What are the key concepts of React Server Components?"
- materialPaths: ["./docs/rsc-spec.md"]
- maxOutputTokens: 600
```

### Devil's Advocate
```
Use gemini_devils_advocate to review my API design:
- proposal: "REST API with JWT auth, rate limiting, and caching..."
- goal: "Build a scalable user management API"
- maxOutputTokens: 500
```

### Consistency Check
```
Use gemini_consistency_check before PR:
- goal: "Implement user authentication with OAuth2"
- constraints: "Must support Google and GitHub providers"
- proposal: "Current implementation uses only Google OAuth..."
- acceptanceCriteria: "Users can sign in with Google or GitHub"
```

## Best Practices

### When to Use Creative Mode
- Generating UI components or animations
- Brainstorming ideas freely
- Analyzing images or designs
- Getting comprehensive code reviews

### When to Use Controlled Mode
- Before making architectural decisions → `research_advisor`
- After writing a proposal → `devils_advocate`
- Before PR/deployment → `consistency_check`

### Token Budget Tips
- Default budgets are optimized for minimal context pollution
- Lower `maxOutputTokens` for quick checks (200-400)
- Higher for comprehensive analysis (800-1500)

## Configuration

### Setting Up Your API Key

This power requires a Google AI API key. **The key is NOT stored in the power repository** - you need to set it in your environment.

**Option 1: Environment Variable (Recommended)**
```bash
# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export GEMINI_API_KEY="your-actual-api-key-here"
```

**Option 2: User-level MCP Config**
Edit `~/.kiro/settings/mcp.json` and add your key:
```json
{
  "mcpServers": {
    "gemini-assistant": {
      "env": {
        "GEMINI_API_KEY": "your-actual-api-key-here"
      }
    }
  }
}
```

Get your API key from: https://aistudio.google.com/apikey

## Troubleshooting

### "API key not set"
The `GEMINI_API_KEY` environment variable is not configured. See the Configuration section above.

### Output too long
Reduce `maxOutputTokens` parameter. Controlled tools respect this strictly.

### Tool not responding
Check if Gemini API is accessible. The server logs errors to stderr.
