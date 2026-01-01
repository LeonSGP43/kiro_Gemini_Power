# Kiro Gemini Power

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![MCP Version](https://img.shields.io/badge/MCP-2024--11--05-green)](https://modelcontextprotocol.io/)

专为 **Kiro** 设计的 Gemini 3 Pro MCP 服务器，采用**双层模式**架构：创意工具 + 受控顾问工具。

🎨 **创意模式**：UI 生成、多模态理解、动画创建、代码分析  
🎯 **受控模式**：资料顾问、反对者、一致性检查（结构化输出，不污染上下文）  
⚡ **驱动引擎**：Gemini 3 Pro（WebDev Arena UI 生成排名第一）

## 为什么需要双层模式？

| 模式 | 用途 | 特点 |
|------|------|------|
| **创意模式** | 头脑风暴、UI 生成、内容创作 | 自由发挥，完整输出 |
| **受控模式** | 工程协作、决策辅助 | 结构化 JSON，token 预算控制，严格角色边界 |

**受控模式的核心理念**：让 Gemini 成为"受控能力模块"，而不是"第二个决策者"。

## 工具列表

### 🎨 创意工具（9 个）

| 工具 | 功能 |
|------|------|
| `gemini_generate_ui` | 从描述或设计图生成 UI 组件 |
| `gemini_multimodal_query` | 图像 + 文本多模态分析 |
| `gemini_fix_ui_from_screenshot` | 从截图诊断并修复 UI 问题 |
| `gemini_create_animation` | 创建 CSS/Canvas/WebGL/Three.js 动画 |
| `gemini_analyze_content` | 分析代码、文档或数据 |
| `gemini_analyze_codebase` | 分析整个代码库（支持 1M token 上下文）|
| `gemini_brainstorm` | 创意头脑风暴 |
| `gemini_search` | 使用 Google Search grounding 搜索网络 |
| `list_models` | 列出可用的 Gemini 模型 |

### 🎯 受控顾问工具（3 个）

| 工具 | 角色 | 约束 |
|------|------|------|
| `gemini_research_advisor` | 资料顾问 | ❌ 不决策 ❌ 不推荐 ✅ 只提供概念和参考 |
| `gemini_devils_advocate` | 反对者 | ❌ 不提方案 ❌ 不修改 ✅ 只找问题和风险 |
| `gemini_consistency_check` | 一致性检查 | ❌ 不建议修复 ✅ 只报告冲突和缺口 |

## 快速开始

### 1. 获取 Gemini API Key

访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 创建 API Key。

### 2. 配置 MCP 客户端

**Kiro / Claude Desktop / Cursor / Windsurf**

```json
{
  "mcpServers": {
    "gemini-assistant": {
      "command": "npx",
      "args": ["-y", "github:LeonSGP43/kiro_Gemini_Power"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**如果需要代理**：
```json
{
  "mcpServers": {
    "gemini-assistant": {
      "command": "npx",
      "args": ["-y", "github:LeonSGP43/kiro_Gemini_Power"],
      "env": {
        "GEMINI_API_KEY": "your_api_key_here",
        "HTTPS_PROXY": "http://127.0.0.1:7897"
      }
    }
  }
}
```

### 3. 重启 MCP 客户端

## 使用示例

### 资料顾问（Research Advisor）

进入陌生领域前，让 Gemini 帮你整理关键概念：

```json
{
  "question": "React Server Components 的核心概念是什么？",
  "materialPaths": ["./docs/rsc-spec.md"],
  "maxOutputTokens": 800
}
```

**返回**：`key_concepts`、`recommended_directions`、`open_questions`、`best_practices`、`citations_or_keywords`

### 反对者（Devil's Advocate）

方案写完后，让 Gemini 找问题：

```json
{
  "proposal": "我们计划将单体应用拆分为 5 个微服务...",
  "goal": "提升可扩展性和团队自治",
  "constraints": "4 人团队，6 个月期限",
  "maxOutputTokens": 600
}
```

**返回**：`critical_risks`、`hidden_assumptions`、`missing_considerations`、`questions_to_answer`

### 一致性检查（Consistency Check）

PR 前检查方案是否与目标一致：

```json
{
  "goal": "实现 OAuth2 认证，支持 Google 和 GitHub",
  "constraints": "必须兼容现有会话管理",
  "proposal": "目前只实现了 Google OAuth...",
  "acceptanceCriteria": "用户可以使用 Google 或 GitHub 登录"
}
```

**返回**：`conflicts_found`、`conflicts`、`requirements_not_covered`、`validation_gaps`

### UI 生成

```json
{
  "description": "现代风格的定价卡片，三个层级",
  "framework": "react",
  "techContext": {
    "cssFramework": "tailwind",
    "typescript": true
  }
}
```

## 工程协作工作流

### 推荐流程

```
1. 进入陌生领域 → gemini_research_advisor（了解概念）
2. 主模型制定方案
3. 方案完成后 → gemini_devils_advocate（找问题）
4. 主模型修复问题
5. PR/部署前 → gemini_consistency_check（验证一致性）
6. 主模型最终决策
```

### Token 预算建议

| 场景 | 推荐预算 |
|------|----------|
| 快速检查 | 200-400 |
| 标准审查 | 500-800 |
| 深度分析 | 1000-1500 |

## 本地开发

```bash
git clone https://github.com/LeonSGP43/kiro_Gemini_Power.git
cd kiro_Gemini_Power
npm install
export GEMINI_API_KEY="your_api_key_here"
npm run build
npm start
```

## 项目结构

```
src/
├── config/
│   ├── models.ts           # 模型配置
│   └── constants.ts        # 全局常量
├── tools/
│   ├── definitions.ts      # MCP 工具定义
│   ├── generate-ui.ts      # UI 生成
│   ├── multimodal-query.ts # 多模态查询
│   ├── fix-ui.ts           # UI 修复
│   ├── create-animation.ts # 动画创建
│   ├── analyze-content.ts  # 内容分析
│   ├── analyze-codebase.ts # 代码库分析
│   ├── brainstorm.ts       # 头脑风暴
│   ├── search.ts           # 网络搜索
│   ├── list-models.ts      # 模型列表
│   ├── research-advisor.ts # 🆕 资料顾问
│   ├── devils-advocate.ts  # 🆕 反对者
│   └── consistency-check.ts# 🆕 一致性检查
├── utils/
│   ├── gemini-client.ts    # Gemini API 客户端
│   ├── error-handler.ts    # 错误处理
│   ├── validators.ts       # 参数验证
│   ├── security.ts         # 安全验证
│   └── file-reader.ts      # 文件读取
├── types.ts                # 类型定义
└── server.ts               # 主服务器
```

## 致谢

基于 [aliargun/mcp-server-gemini](https://github.com/aliargun/mcp-server-gemini) 开发

## License

MIT
