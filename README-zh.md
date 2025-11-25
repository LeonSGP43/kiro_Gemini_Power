# Gemini MCP - LKbaba 定制版

这是基于 [aliargun/mcp-server-gemini](https://github.com/aliargun/mcp-server-gemini) 的定制版本，专为中文用户和 Windows 平台优化。

## 🎯 定制特性

### 1. 中文优化
- ✅ **中文错误信息** - 所有错误都会翻译成中文，同时保留英文原文用于调试
- ✅ **中文系统提示** - 自动为 Windows 中文用户添加优化的系统提示
- ✅ **中文代码注释** - 新增代码全部使用中文注释

### 2. Windows 平台优化
- ✅ **路径处理增强** - 完善的 Windows 路径处理（支持反斜杠、盘符、中文路径）
- ✅ **路径转换工具** - POSIX ↔ Windows 路径自动转换
- ✅ **CRLF 换行符** - 正确处理 Windows 换行符
- ✅ **中文文件名支持** - 完美支持中文文件名和路径

### 3. 开发体验
- ✅ **详细的中文文档** - 完整的中文使用说明
- ✅ **调试友好** - 错误信息同时包含中文和英文
- ✅ **版本标识** - 独立版本号便于追踪

## 📦 安装方法

### 方法 1: 从 GitHub 直接安装（推荐）

在你的 Claude Code / Claude Desktop 配置中添加：

```json
{
  "mcpServers": {
    "gemini": {
      "command": "npx",
      "args": ["-y", "github:LKbaba/Gemini-mcp"],
      "env": {
        "GEMINI_API_KEY": "你的-Gemini-API-密钥"
      }
    }
  }
}
```

### 方法 2: 本地开发安装

```bash
# 1. 克隆仓库
git clone https://github.com/LKbaba/Gemini-mcp.git
cd Gemini-mcp

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 测试运行（需要先设置 GEMINI_API_KEY）
export GEMINI_API_KEY="你的密钥"  # Linux/Mac
# 或
set GEMINI_API_KEY=你的密钥      # Windows CMD
# 或
$env:GEMINI_API_KEY="你的密钥"   # Windows PowerShell

npm start
```

### 方法 3: 在 Claude-code-ChatInWindows 中配置

在 VS Code 设置中（`claudeCodeChatUI.mcp.servers`）添加：

```json
[
  {
    "name": "gemini",
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "github:LKbaba/Gemini-mcp"],
    "env": {
      "GEMINI_API_KEY": "你的-Gemini-API-密钥"
    }
  }
]
```

## 🔑 获取 API 密钥

1. 访问 [Google AI Studio](https://aistudio.google.com/apikey)
2. 登录你的 Google 账号
3. 点击 "Create API Key" 创建新的 API 密钥
4. 复制密钥并在配置中使用

## 🚀 可用模型

### 思考模型（Thinking Models）- 推荐
- `gemini-2.5-pro` - 最强大的思考模型，适合复杂推理和编程（2M tokens）
- `gemini-2.5-flash` - 快速思考模型，性价比最佳（1M tokens）
- `gemini-2.5-flash-lite` - 超快速、低成本思考模型（1M tokens）

### 2.0 系列
- `gemini-2.0-flash` - 快速高效，1M 上下文
- `gemini-2.0-flash-lite` - 最经济实惠
- `gemini-2.0-pro-experimental` - 实验性模型，2M 上下文，编程能力强

### 1.5 系列（兼容性）
- `gemini-1.5-pro` - 上一代 Pro 模型（2M tokens）
- `gemini-1.5-flash` - 上一代 Flash 模型（1M tokens）

## 📚 主要功能

### 1. 文本生成 (generate_text)
```javascript
{
  "model": "gemini-2.5-flash",
  "prompt": "用中文解释什么是 MCP",
  "systemInstruction": "你是一个专业的技术文档撰写者",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

### 2. 对话管理 (chat)
```javascript
{
  "model": "gemini-2.5-flash",
  "message": "帮我写一个 Windows 路径处理函数",
  "conversationId": "my-chat-session",
  "systemInstruction": "你擅长 TypeScript 和 Windows 开发"
}
```

### 3. 模型列表 (list_models)
查看所有可用模型及其特性

### 4. 清除对话历史 (clear_conversation)
清除指定会话的历史记录

### 5. 思考模式
使用思考模型（2.5 系列）时自动启用推理能力

## 🛠️ 开发

```bash
# 开发模式（使用 ts-node）
npm run dev

# 构建
npm run build

# 运行构建后的版本
npm start
```

## 📝 版本历史

### v4.2.2-lkbaba.1 (2025-11-25)
- ✨ Fork 自 aliargun/mcp-server-gemini v4.2.2
- ✨ 新增中文错误信息翻译
- ✨ 新增 Windows 路径处理工具
- ✨ 新增中文系统提示优化
- ✨ 新增中文文档

## 🙏 致谢

- 原项目作者: [Ali Argun](https://github.com/aliargun)
- 原项目仓库: [aliargun/mcp-server-gemini](https://github.com/aliargun/mcp-server-gemini)
- Claude-code-ChatInWindows: [LKbaba/Claude-code-ChatInWindows](https://github.com/LKbaba/Claude-code-ChatInWindows)

## 📄 许可证

MIT License - 与原项目保持一致

## 🔗 相关链接

- [Google Gemini API 文档](https://ai.google.dev/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code](https://github.com/anthropics/claude-code)
- [Claude Desktop](https://claude.ai/download)

## 💬 反馈与支持

如果你遇到问题或有建议，请：
1. 提交 Issue: [GitHub Issues](https://github.com/LKbaba/Gemini-mcp/issues)
2. 查看原项目文档获取更多信息

---

**定制维护者**: LKbaba
**最后更新**: 2025-11-25
