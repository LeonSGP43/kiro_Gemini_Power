# Gemini Assistant Power for Kiro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

专为 **Kiro IDE** 设计的 Gemini 3 Pro Power，提供双模式 AI 能力集成。

## ✨ 功能特性

### 🎨 创意模式
- **UI 生成** - 从描述或设计图生成组件代码
- **多模态分析** - 图像 + 文本理解
- **动画创建** - CSS/Canvas/WebGL/Three.js
- **代码分析** - 支持 1M token 上下文
- **网络搜索** - Google Search grounding

### 🎯 受控模式
| 工具 | 用途 | 约束 |
|------|------|------|
| `research_advisor` | 资料研究 | 只提供信息，不做决策 |
| `devils_advocate` | 风险审查 | 只找问题，不提方案 |
| `consistency_check` | 一致性验证 | 只报告冲突，不建议修复 |

## 🚀 安装

### 前置条件
- [Kiro IDE](https://kiro.dev)
- [Gemini API Key](https://makersuite.google.com/app/apikey)

### 安装步骤

1. 在 Kiro 中打开 Powers 面板
2. 搜索 "Gemini Assistant" 并安装
3. 配置 API Key：
   - 打开 `~/.kiro/settings/mcp.json`
   - 找到 `gemini-assistant` 配置
   - 将 `GEMINI_API_KEY` 替换为你的真实 Key

```json
{
  "env": {
    "GEMINI_API_KEY": "your_actual_api_key"
  }
}
```

4. 重启 Kiro 或重新连接 MCP 服务器

## 📖 使用示例

### 研究顾问
```
帮我研究 React Server Components 的核心概念
```

### 风险审查
```
审查我的微服务拆分方案，找出潜在问题
```

### 一致性检查
```
检查当前实现是否符合 PRD 要求
```

### UI 生成
```
生成一个现代风格的定价卡片组件
```

## 🔗 相关链接

- [MCP 服务器源码](https://github.com/LeonSGP43/Gemini-mcp)
- [Kiro IDE](https://kiro.dev)
- [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📄 License

MIT
