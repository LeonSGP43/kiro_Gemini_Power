# Gemini MCP Server 实现计划

**项目名称**: mcp-server-gemini-lkbaba
**版本**: 1.0.0-lkbaba
**创建日期**: 2025-11-25
**基于**: [aliargun/mcp-server-gemini](https://github.com/aliargun/mcp-server-gemini) v4.2.2
**PRD 文档**: [MCP-PRD.md](../MCP-PRD.md)

---

## 📋 总览

本文档将整个项目实现分解为 **14 个独立任务**，每个任务控制在 2 小时内完成。任务按技术依赖和优先级排序，并为每个任务提供了可直接使用的 AI 提示词。

### 任务分布

| 阶段 | 任务数 | 预计时间 | 优先级 |
|------|--------|----------|--------|
| **Phase 0**: 项目基础设置 | 2 | 3 小时 | 🔴 P0 |
| **Phase 1**: 核心基础设施 | 2 | 3 小时 | 🔴 P0 |
| **Phase 2**: 核心工具实现 | 4 | 8 小时 | 🔴 P0 |
| **Phase 3**: 辅助工具实现 | 2 | 4 小时 | 🟡 P1 |
| **Phase 4**: 基础工具实现 | 1 | 2 小时 | 🟢 P2 |
| **Phase 5**: 测试和文档 | 3 | 6 小时 | 🟡 P1 |
| **总计** | **14** | **26 小时** | - |

---

## 🎯 Phase 0: 项目基础设置

### Task 1: 项目初始化和基础架构重构

**预计时间**: 2 小时
**依赖**: 无
**优先级**: 🔴 P0

**AI 提示词**:

```
你是一位资深的 TypeScript 和 MCP 协议工程师，擅长项目架构设计和代码重构。

## 任务目标
基于现有的 mcp-server-gemini 项目（位于 E:\Github\Gemini-mcp），进行项目初始化和基础架构重构，为实现 8 个新工具做好准备。

## 参考文档
use context7
请查阅 Model Context Protocol (MCP) 的最新规范和最佳实践。

## 当前项目结构
- 项目位置: E:\Github\Gemini-mcp
- 主要文件:
  - src/enhanced-stdio-server.ts (主服务器文件)
  - src/types.ts (类型定义)
  - package.json
  - tsconfig.json

## 具体任务

### 1. 更新 package.json
- 修改项目名称为 "mcp-server-gemini"
- 更新版本为 "1.0.1"
- 更新作者信息为 "LKbaba"
- 保留 @google/genai ^1.8.0 依赖
- 确保所有必要的 devDependencies 已安装

### 2. 重构项目文件结构
创建以下目录结构：
```
src/
├── config/
│   ├── models.ts        // 模型配置
│   └── constants.ts     // 常量定义
├── tools/
│   ├── index.ts         // 工具导出
│   ├── list-models.ts   // 模型列表工具
│   ├── generate-ui.ts   // UI 生成工具
│   ├── multimodal-query.ts  // 多模态查询工具
│   ├── fix-ui.ts        // UI 修复工具
│   ├── create-animation.ts  // 动画创建工具
│   ├── analyze-content.ts   // 内容分析工具
│   ├── analyze-codebase.ts  // 代码库分析工具
│   └── brainstorm.ts    // 头脑风暴工具
├── utils/
│   ├── gemini-client.ts // Gemini API 客户端封装
│   ├── error-handler.ts // 错误处理工具
│   └── validators.ts    // 参数验证工具
├── types.ts             // 全局类型定义
└── server.ts            // 主服务器文件（重命名）
```

### 3. 创建基础配置文件

#### src/config/models.ts
定义 4 个支持的模型：
- gemini-3-pro-preview
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-2.5-flash-lite

包含每个模型的：
- 上下文窗口 (1,048,576 tokens)
- 输出限制 (65,536 tokens)
- 特性列表
- 推荐用途

#### src/config/constants.ts
定义项目常量：
- API 配置
- 错误消息
- 默认参数值
- 系统提示词模板

### 4. 更新 src/types.ts
添加新的类型定义：
```typescript
// 工具参数类型
interface GenerateUIParams {
  description: string;
  designImage?: string;
  framework?: 'vanilla' | 'react' | 'vue' | 'svelte';
  includeAnimation?: boolean;
  responsive?: boolean;
  style?: 'modern' | 'minimal' | 'glassmorphism' | 'neumorphism';
}

// 工具返回类型
interface GenerateUIResult {
  code: string;
  framework: string;
  files?: Record<string, string>;
  preview?: string;
}

// 类似地为其他工具添加类型定义
```

### 5. 创建 Gemini 客户端工具类
在 src/utils/gemini-client.ts 中创建一个统一的 Gemini API 客户端封装，包含：
- 初始化方法
- 模型选择逻辑
- 请求发送方法
- 错误处理和重试机制
- 速率限制处理

### 6. 更新主服务器文件
将 src/enhanced-stdio-server.ts 重命名为 src/server.ts，并更新：
- 导入新的工具结构
- 使用新的配置系统
- 添加工具注册机制
- 保持 MCP 协议兼容性

## 验收标准
✅ 项目结构清晰，目录创建完成
✅ 所有配置文件已创建并包含正确内容
✅ 类型定义完整，覆盖所有工具
✅ Gemini 客户端工具类可正常实例化
✅ 项目可以成功编译（npm run build）
✅ 没有 TypeScript 错误

## 注意事项
- 保持代码注释使用中文
- 遵循 TypeScript 最佳实践
- 确保所有文件使用 ES6 模块语法
- 保持与 MCP 协议的兼容性
```

---

### Task 2: 更新配置和模型管理系统

**预计时间**: 1 小时
**依赖**: Task 1
**优先级**: 🔴 P0

**AI 提示词**:

```
你是一位资深的 TypeScript 工程师，擅长配置管理和模型抽象设计。

## 任务目标
完善模型配置系统和管理逻辑，确保支持 4 个 Gemini 模型的动态选择和 fallback 机制。

## 工作目录
E:\Github\Gemini-mcp

## 参考文档
参考 E:\Github\Gemini-mcp\MCP-PRD.md 中的"技术规格 > 支持的模型"部分。

## 具体任务

### 1. 完善 src/config/models.ts

创建详细的模型配置对象：

```typescript
// 模型配置接口
interface ModelConfig {
  id: string;
  name: string;
  description: string;
  contextWindow: number;      // 输入上下文
  outputLimit: number;        // 输出限制
  features: string[];         // 支持的特性
  bestFor: string;           // 最适合的场景
  isDefault: boolean;        // 是否为默认模型
  knowledgeCutoff: string;   // 知识截止日期
  lastUpdate: string;        // 最后更新时间
}

// 定义 4 个模型
export const MODELS: Record<string, ModelConfig> = {
  'gemini-3-pro-preview': {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    description: '最强多模态理解和代理模型，UI生成首选',
    contextWindow: 1048576,
    outputLimit: 65536,
    features: ['Thinking', 'Function calling', 'Search grounding', 'Code execution', 'Structured outputs'],
    bestFor: '前端开发、UI生成、复杂推理',
    isDefault: true,
    knowledgeCutoff: 'January 2025',
    lastUpdate: 'November 2025'
  },
  // ... 其他 3 个模型配置
};

// 模型选择逻辑
export function selectModel(preferred?: string): string {
  if (preferred && MODELS[preferred]) {
    return preferred;
  }
  return 'gemini-3-pro-preview'; // 默认模型
}

// Fallback 链
export const MODEL_FALLBACK_CHAIN = [
  'gemini-3-pro-preview',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite'
];
```

### 2. 创建 src/config/constants.ts

```typescript
// API 配置
export const API_CONFIG = {
  baseUrl: 'https://generativelanguage.googleapis.com',
  timeout: 300000,  // 5 分钟超时
  maxRetries: 3,
  retryDelay: 1000
};

// 系统提示词模板
export const SYSTEM_PROMPTS = {
  UI_GENERATION: `你是一位专业的前端开发专家...`,
  MULTIMODAL_QUERY: `你是一位视觉理解专家...`,
  UI_FIX: `你是一位 UI 调试专家...`,
  ANIMATION: `你是一位创意编程专家...`,
  ANALYZE_CONTENT: `你是一位多功能代码和文档分析专家...`,
  ANALYZE_CODEBASE: `你是一位资深软件架构师...`,
  BRAINSTORM: `你是一位创意思维专家...`
};

// 错误消息
export const ERROR_MESSAGES = {
  MISSING_API_KEY: 'GEMINI_API_KEY 环境变量未设置',
  INVALID_MODEL: '不支持的模型',
  API_ERROR: 'Gemini API 请求失败',
  RATE_LIMIT: '超过 API 速率限制，请稍后重试',
  INVALID_PARAMS: '参数验证失败'
};
```

### 3. 更新 src/utils/gemini-client.ts

添加模型管理方法：

```typescript
import { GoogleGenerativeAI } from '@google/genai';
import { MODELS, selectModel, MODEL_FALLBACK_CHAIN } from '../config/models';
import { API_CONFIG } from '../config/constants';

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private currentModel: string;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.currentModel = selectModel();
  }

  // 获取模型实例（带 fallback）
  async getModelWithFallback(preferredModel?: string): Promise<any> {
    const modelId = preferredModel || this.currentModel;
    const chain = [modelId, ...MODEL_FALLBACK_CHAIN.filter(m => m !== modelId)];

    for (const model of chain) {
      try {
        return this.client.getGenerativeModel({ model });
      } catch (error) {
        console.warn(`模型 ${model} 不可用，尝试 fallback...`);
        continue;
      }
    }
    throw new Error('所有模型都不可用');
  }

  // 列出所有可用模型
  listModels() {
    return Object.values(MODELS);
  }

  // 获取模型详细信息
  getModelInfo(modelId: string) {
    return MODELS[modelId] || null;
  }
}
```

## 验收标准
✅ models.ts 包含完整的 4 个模型配置
✅ constants.ts 包含所有必要常量
✅ GeminiClient 类实现了模型选择和 fallback 逻辑
✅ 代码可以成功编译
✅ 所有导出的接口和类型定义正确

## 注意事项
- 所有注释使用中文
- 模型配置数据与 PRD 一致
- 实现自动 fallback 机制
- 添加详细的错误日志
```

---

## 🎯 Phase 1: 核心基础设施

### Task 3: 实现模型管理核心逻辑

**预计时间**: 1.5 小时
**依赖**: Task 2
**优先级**: 🔴 P0

**AI 提示词**:

```
你是一位资深的 TypeScript 工程师，擅长 API 客户端开发和错误处理。

## 任务目标
完善 GeminiClient 类，实现完整的 API 交互逻辑、错误处理和重试机制。

## 工作目录
E:\Github\Gemini-mcp\src\utils

## 参考文档
use context7
查阅 Google Gemini API (@google/genai) 的最新文档和最佳实践。

## 具体任务

### 1. 完善 gemini-client.ts

添加以下核心方法：

```typescript
export class GeminiClient {
  // ... 现有代码 ...

  /**
   * 发送文本生成请求
   * @param prompt - 提示词
   * @param options - 配置选项
   */
  async generateText(
    prompt: string,
    options: {
      model?: string;
      systemPrompt?: string;
      temperature?: number;
      maxOutputTokens?: number;
    } = {}
  ): Promise<string> {
    const model = await this.getModelWithFallback(options.model);

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: options.systemPrompt,
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxOutputTokens || 8192
        }
      });

      return result.response.text();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 发送多模态请求（文本+图片）
   * @param prompt - 文本提示
   * @param images - Base64 编码的图片数组
   * @param options - 配置选项
   */
  async generateMultimodal(
    prompt: string,
    images: string[],
    options: {
      model?: string;
      systemPrompt?: string;
      outputFormat?: 'text' | 'json';
    } = {}
  ): Promise<string> {
    const model = await this.getModelWithFallback(options.model);

    const imageParts = images.map(base64 => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64
      }
    }));

    try {
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }, ...imageParts]
        }],
        systemInstruction: options.systemPrompt
      });

      return result.response.text();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 错误处理（带重试机制）
   */
  private async handleError(error: any): Promise<never> {
    if (error.message?.includes('rate limit')) {
      throw new Error(ERROR_MESSAGES.RATE_LIMIT);
    }

    if (error.message?.includes('API key')) {
      throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
    }

    throw new Error(`${ERROR_MESSAGES.API_ERROR}: ${error.message}`);
  }

  /**
   * 重试逻辑
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = API_CONFIG.maxRetries
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await this.delay(API_CONFIG.retryDelay * Math.pow(2, i));
        }
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. 创建 src/utils/validators.ts

实现参数验证工具：

```typescript
/**
 * 验证必填参数
 */
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} 是必填参数`);
  }
}

/**
 * 验证枚举值
 */
export function validateEnum<T>(
  value: T,
  allowedValues: readonly T[],
  fieldName: string
): void {
  if (!allowedValues.includes(value)) {
    throw new Error(
      `${fieldName} 必须是以下值之一: ${allowedValues.join(', ')}`
    );
  }
}

/**
 * 验证 Base64 图片
 */
export function validateBase64Image(data: string): boolean {
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  return base64Regex.test(data) || /^[A-Za-z0-9+/=]+$/.test(data);
}

/**
 * 验证工具参数
 */
export function validateToolParams(
  params: any,
  schema: Record<string, { required?: boolean; type?: string; enum?: any[] }>
): void {
  for (const [key, rules] of Object.entries(schema)) {
    const value = params[key];

    if (rules.required) {
      validateRequired(value, key);
    }

    if (value !== undefined && rules.enum) {
      validateEnum(value, rules.enum, key);
    }

    if (value !== undefined && rules.type) {
      const actualType = typeof value;
      if (actualType !== rules.type) {
        throw new Error(`${key} 类型错误: 期望 ${rules.type}, 实际 ${actualType}`);
      }
    }
  }
}
```

### 3. 创建 src/utils/error-handler.ts

```typescript
export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export function wrapToolError(error: unknown): MCPError {
  if (error instanceof MCPError) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  return new MCPError(message, 'TOOL_EXECUTION_ERROR', { originalError: error });
}

export function formatErrorForMCP(error: MCPError) {
  return {
    error: {
      code: error.code,
      message: error.message,
      details: error.details
    }
  };
}
```

## 验收标准
✅ GeminiClient 类包含完整的 API 交互方法
✅ 错误处理和重试机制工作正常
✅ 参数验证工具覆盖所有常见场景
✅ 代码包含详细的中文注释
✅ 所有方法有完整的 TypeScript 类型定义
✅ 编译无错误，无 linting 警告

## 注意事项
- 使用 async/await 处理异步操作
- 添加详细的错误日志
- 确保所有 Promise 都有适当的错误处理
- 重试机制使用指数退避算法
```

---

### Task 4: 实现 list_models 工具

**预计时间**: 1.5 小时
**依赖**: Task 3
**优先级**: 🔴 P0

**AI 提示词**:

```
你是一位资深的 MCP 协议工程师，擅长工具实现和 API 设计。

## 任务目标
实现第一个完整的 MCP 工具：list_models，用于列出所有支持的 Gemini 模型。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 8 部分)
- use context7: 查阅 MCP 协议工具实现规范

## 具体任务

### 1. 创建 src/tools/list-models.ts

```typescript
import { MODELS } from '../config/models';
import { GeminiClient } from '../utils/gemini-client';

/**
 * list_models 工具
 * 功能：列出所有可用的 Gemini 模型及其详细信息
 */
export const listModelsTool = {
  name: 'list_models',
  description: '列出所有可用的 Gemini 模型，包括上下文窗口、特性和推荐用途',

  inputSchema: {
    type: 'object',
    properties: {},  // 无需输入参数
    required: []
  },

  async execute(params: {}, client: GeminiClient): Promise<any> {
    try {
      const models = client.listModels();

      // 找出默认模型
      const defaultModel = models.find(m => m.isDefault);

      return {
        models: models.map(model => ({
          id: model.id,
          name: model.name,
          description: model.description,
          contextWindow: model.contextWindow,
          outputLimit: model.outputLimit,
          features: model.features,
          bestFor: model.bestFor,
          isDefault: model.isDefault,
          knowledgeCutoff: model.knowledgeCutoff,
          lastUpdate: model.lastUpdate
        })),
        recommended: defaultModel?.id || 'gemini-3-pro-preview',
        totalCount: models.length
      };
    } catch (error) {
      throw new Error(`列出模型失败: ${error.message}`);
    }
  }
};
```

### 2. 创建 src/tools/index.ts

创建工具注册中心：

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { listModelsTool } from './list-models';

// 工具接口定义
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  execute(params: any, client: GeminiClient): Promise<any>;
}

// 工具注册表
export const TOOLS: Record<string, MCPTool> = {
  list_models: listModelsTool
};

/**
 * 获取工具
 */
export function getTool(name: string): MCPTool | undefined {
  return TOOLS[name];
}

/**
 * 获取所有工具列表
 */
export function getAllTools(): MCPTool[] {
  return Object.values(TOOLS);
}

/**
 * 执行工具
 */
export async function executeTool(
  toolName: string,
  params: any,
  client: GeminiClient
): Promise<any> {
  const tool = getTool(toolName);

  if (!tool) {
    throw new Error(`工具不存在: ${toolName}`);
  }

  return tool.execute(params, client);
}
```

### 3. 更新 src/server.ts

集成工具系统：

```typescript
import { GeminiClient } from './utils/gemini-client';
import { getAllTools, executeTool } from './tools';

// ... MCP 服务器初始化代码 ...

// 注册工具列表处理器
server.setRequestHandler('tools/list', async () => {
  const tools = getAllTools();
  return {
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  };
});

// 注册工具调用处理器
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: params } = request.params;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY 环境变量未设置');
    }

    const client = new GeminiClient(apiKey);
    const result = await executeTool(name, params, client);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `错误: ${error.message}`
        }
      ],
      isError: true
    };
  }
});
```

### 4. 创建测试文件 tests/list-models.test.ts

```typescript
import { GeminiClient } from '../src/utils/gemini-client';
import { listModelsTool } from '../src/tools/list-models';

describe('list_models 工具', () => {
  let client: GeminiClient;

  beforeEach(() => {
    // 使用测试 API Key 或 mock
    client = new GeminiClient(process.env.GEMINI_API_KEY || 'test-key');
  });

  test('应该返回所有模型列表', async () => {
    const result = await listModelsTool.execute({}, client);

    expect(result.models).toBeDefined();
    expect(result.models).toHaveLength(4);
    expect(result.recommended).toBe('gemini-3-pro-preview');
  });

  test('每个模型应该包含必要字段', async () => {
    const result = await listModelsTool.execute({}, client);
    const model = result.models[0];

    expect(model).toHaveProperty('id');
    expect(model).toHaveProperty('name');
    expect(model).toHaveProperty('contextWindow');
    expect(model).toHaveProperty('features');
    expect(model.contextWindow).toBe(1048576);
  });
});
```

## 验收标准
✅ list_models 工具实现完整
✅ 工具注册系统工作正常
✅ MCP 服务器可以正确响应 tools/list 请求
✅ MCP 服务器可以正确执行 tools/call 请求
✅ 返回的数据格式符合 PRD 规范
✅ 测试用例通过
✅ 可以通过 Claude Code 测试调用

## 测试命令
```bash
# 编译项目
npm run build

# 运行测试
npm test

# 启动服务器测试
npm start
```

## 注意事项
- 确保符合 MCP 协议规范
- 错误处理要完善
- 返回数据格式要统一
- 添加详细的中文注释
```

---

## 🎯 Phase 2: 核心工具实现 (P0)

### Task 5: 实现 gemini_generate_ui 工具

**预计时间**: 2 小时
**依赖**: Task 4
**优先级**: 🔴 P0

**AI 提示词**:

```
ultrathink

你是一位资深的前端工程师和 AI 提示词工程专家，深谙 UI 生成和代码生成最佳实践。

## 任务目标
实现 gemini_generate_ui 工具，这是项目的核心工具之一，用于从描述或设计图生成 HTML/CSS/JavaScript UI 组件。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 1 部分)
- 参考项目: https://github.com/RaiAnsar/claude_code-gemini-mcp
- use context7: 查阅最新的 React, Vue, Svelte 框架文档

## 具体任务

### 1. 创建 src/tools/generate-ui.ts

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { SYSTEM_PROMPTS } from '../config/constants';
import { validateRequired, validateEnum, validateToolParams } from '../utils/validators';

/**
 * UI 生成工具参数接口
 */
interface GenerateUIParams {
  description: string;
  designImage?: string;
  framework?: 'vanilla' | 'react' | 'vue' | 'svelte';
  includeAnimation?: boolean;
  responsive?: boolean;
  style?: 'modern' | 'minimal' | 'glassmorphism' | 'neumorphism';
}

/**
 * UI 生成工具返回接口
 */
interface GenerateUIResult {
  code: string;
  framework: string;
  files?: Record<string, string>;
  preview?: string;
}

/**
 * gemini_generate_ui 工具
 * 功能：从描述或设计图生成完整的 UI 组件代码
 */
export const generateUITool = {
  name: 'gemini_generate_ui',
  description: '从描述或设计图生成 HTML/CSS/JavaScript UI 组件，支持 React、Vue、Svelte 框架',

  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description: 'UI 的详细描述，包括布局、功能、样式需求'
      },
      designImage: {
        type: 'string',
        description: 'Base64 编码的设计图（可选）'
      },
      framework: {
        type: 'string',
        enum: ['vanilla', 'react', 'vue', 'svelte'],
        description: '目标框架，默认为 vanilla HTML'
      },
      includeAnimation: {
        type: 'boolean',
        description: '是否包含动画效果，默认 true'
      },
      responsive: {
        type: 'boolean',
        description: '是否生成响应式布局，默认 true'
      },
      style: {
        type: 'string',
        enum: ['modern', 'minimal', 'glassmorphism', 'neumorphism'],
        description: '设计风格'
      }
    },
    required: ['description']
  },

  async execute(params: GenerateUIParams, client: GeminiClient): Promise<GenerateUIResult> {
    // 参数验证
    validateToolParams(params, {
      description: { required: true, type: 'string' },
      framework: { enum: ['vanilla', 'react', 'vue', 'svelte'] },
      style: { enum: ['modern', 'minimal', 'glassmorphism', 'neumorphism'] }
    });

    // 设置默认值
    const framework = params.framework || 'vanilla';
    const includeAnimation = params.includeAnimation !== false;
    const responsive = params.responsive !== false;

    // 构建增强的提示词
    const prompt = buildUIPrompt(params, framework, includeAnimation, responsive);

    try {
      let code: string;

      // 如果有设计图，使用多模态生成
      if (params.designImage) {
        code = await client.generateMultimodal(
          prompt,
          [params.designImage],
          {
            model: 'gemini-3-pro-preview',  // UI 生成使用最强模型
            systemPrompt: SYSTEM_PROMPTS.UI_GENERATION
          }
        );
      } else {
        // 纯文本描述生成
        code = await client.generateText(prompt, {
          model: 'gemini-3-pro-preview',
          systemPrompt: SYSTEM_PROMPTS.UI_GENERATION,
          temperature: 0.7,
          maxOutputTokens: 8192
        });
      }

      // 解析并格式化代码
      const result = parseGeneratedCode(code, framework);

      return {
        code: result.code,
        framework,
        files: result.files,
        preview: result.preview
      };
    } catch (error) {
      throw new Error(`UI 生成失败: ${error.message}`);
    }
  }
};

/**
 * 构建 UI 生成提示词
 */
function buildUIPrompt(
  params: GenerateUIParams,
  framework: string,
  includeAnimation: boolean,
  responsive: boolean
): string {
  let prompt = `请生成一个 ${framework === 'vanilla' ? 'HTML/CSS/JavaScript' : framework} UI 组件。\n\n`;

  prompt += `## 需求描述\n${params.description}\n\n`;

  if (params.style) {
    prompt += `## 设计风格\n${params.style}\n\n`;
  }

  prompt += `## 技术要求\n`;
  prompt += `- 框架: ${framework}\n`;
  prompt += `- 响应式: ${responsive ? '是' : '否'}\n`;
  prompt += `- 动画效果: ${includeAnimation ? '是' : '否'}\n\n`;

  prompt += `## 输出要求\n`;

  if (framework === 'vanilla') {
    prompt += `- 返回完整的 HTML 文件，包含内联 CSS 和 JavaScript\n`;
    prompt += `- 使用语义化 HTML5 标签\n`;
    prompt += `- CSS 使用现代特性（flexbox, grid, CSS 变量）\n`;
    prompt += `- JavaScript 使用 ES6+ 语法\n`;
  } else if (framework === 'react') {
    prompt += `- 返回 React 函数组件（使用 hooks）\n`;
    prompt += `- 包含必要的 import 语句\n`;
    prompt += `- 使用 TypeScript 类型定义\n`;
    prompt += `- 样式可以使用 CSS-in-JS 或 CSS Modules\n`;
  } else if (framework === 'vue') {
    prompt += `- 返回 Vue 3 单文件组件（SFC）\n`;
    prompt += `- 使用 Composition API\n`;
    prompt += `- 包含 <template>, <script setup>, <style scoped>\n`;
  } else if (framework === 'svelte') {
    prompt += `- 返回完整的 Svelte 组件\n`;
    prompt += `- 使用 Svelte 3+ 语法\n`;
    prompt += `- 包含组件逻辑、模板和样式\n`;
  }

  prompt += `- 代码要完整可运行，不要省略任何部分\n`;
  prompt += `- 添加适当的注释（英文）\n`;
  prompt += `- 确保代码质量和最佳实践\n`;

  if (includeAnimation) {
    prompt += `- 添加流畅的过渡动画和交互效果\n`;
  }

  if (responsive) {
    prompt += `- 实现移动端、平板、桌面端的响应式适配\n`;
  }

  return prompt;
}

/**
 * 解析生成的代码
 */
function parseGeneratedCode(rawCode: string, framework: string): {
  code: string;
  files?: Record<string, string>;
  preview?: string;
} {
  // 移除 markdown 代码块标记
  let cleanCode = rawCode.replace(/```(?:html|javascript|typescript|jsx|tsx|vue|svelte)?\n?/g, '');
  cleanCode = cleanCode.trim();

  // 对于 React、Vue、Svelte，尝试提取多个文件
  if (framework !== 'vanilla') {
    // TODO: 实现多文件分离逻辑
    return {
      code: cleanCode
    };
  }

  // 对于 vanilla HTML，直接返回
  return {
    code: cleanCode,
    preview: cleanCode  // HTML 可以直接预览
  };
}
```

### 2. 更新 src/config/constants.ts

添加详细的 UI 生成系统提示词：

```typescript
export const SYSTEM_PROMPTS = {
  UI_GENERATION: `你是一位专业的前端开发专家，精通 UI/UX 设计和实现。

你的优势：
- 将设计稿转换为像素级完美的 HTML/CSS/JavaScript 代码
- 创建流畅的动画和过渡效果
- 编写语义化、可访问的 HTML 代码
- 实现响应式布局（移动优先方法）
- 使用现代 ES6+ JavaScript 语法添加交互功能

输出要求：
1. 返回完整可运行的代码，不要省略任何部分
2. 对于 vanilla HTML：
   - 使用内联 <style> 标签，组织良好的 CSS
   - 使用内联 <script> 标签，现代 JavaScript
   - 包含所有必要的 HTML 结构
3. 对于 React/Vue/Svelte：
   - 返回完整组件代码和所有导入
   - 使用现代 hooks/Composition API
   - 包含 prop 类型和文档注释
4. 确保生产就绪：
   - 使用语义化 HTML5 元素
   - 可访问性（ARIA 标签、键盘导航）
   - 响应式（移动、平板、桌面）
   - 流畅动画（CSS transitions/keyframes）
5. 代码质量：
   - 不要添加多余的解释文字
   - 代码组织良好，添加注释（英文）
   - 遵循最佳实践和约定

当给定设计图时：
- 精确匹配颜色、间距、字体
- 实现所有可见的 hover 状态和交互
- 确保像素级准确
- 智能推断缺失的细节

当只给定描述时：
- 创建美观、现代的设计
- 使用当前设计趋势（2025）
- 选择合适的配色方案
- 添加令人愉悦的微交互`,

  // ... 其他提示词
};
```

### 3. 更新 src/tools/index.ts

注册新工具：

```typescript
import { generateUITool } from './generate-ui';

export const TOOLS: Record<string, MCPTool> = {
  list_models: listModelsTool,
  gemini_generate_ui: generateUITool
};
```

### 4. 创建测试用例

```typescript
// tests/generate-ui.test.ts
describe('gemini_generate_ui 工具', () => {
  test('应该从描述生成 vanilla HTML', async () => {
    const result = await generateUITool.execute({
      description: '一个居中的登录表单，包含邮箱和密码输入框'
    }, client);

    expect(result.code).toContain('<form');
    expect(result.code).toContain('input');
    expect(result.framework).toBe('vanilla');
  });

  test('应该支持 React 框架', async () => {
    const result = await generateUITool.execute({
      description: '一个用户卡片组件',
      framework: 'react'
    }, client);

    expect(result.framework).toBe('react');
  });
});
```

## 验收标准
✅ gemini_generate_ui 工具完整实现
✅ 支持 4 种框架（vanilla, react, vue, svelte）
✅ 支持设计图输入（多模态）
✅ 参数验证完善
✅ 系统提示词详细且有效
✅ 生成的代码格式正确、可运行
✅ 测试用例通过
✅ 可以通过 Claude Code 成功调用

## 测试示例
通过 Claude Code 测试：
```
请使用 gemini_generate_ui 工具生成一个现代风格的定价卡片组件（三个层级：Basic、Pro、Enterprise），包含 hover 动画效果。
```

## 注意事项
- 这是最复杂的工具之一，需要仔细测试
- 生成的代码质量直接影响用户体验
- 确保提示词能够引导 Gemini 生成高质量代码
- 添加详细的错误处理和日志
```

---

### Task 6: 实现 gemini_multimodal_query 工具

**预计时间**: 1.5 小时
**依赖**: Task 5
**优先级**: 🔴 P0

**AI 提示词**:

```
你是一位资深的多模态 AI 应用工程师，擅长图像理解和视觉问答系统。

## 任务目标
实现 gemini_multimodal_query 工具，用于处理图片+文本的多模态查询。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 2 部分)
- 参考项目: https://github.com/aliargun/mcp-server-gemini
- use context7: 查阅 Gemini Vision API 文档

## 具体任务

### 1. 创建 src/tools/multimodal-query.ts

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { SYSTEM_PROMPTS } from '../config/constants';
import { validateRequired, validateToolParams, validateBase64Image } from '../utils/validators';

/**
 * 多模态查询参数接口
 */
interface MultimodalQueryParams {
  prompt: string;
  images: string[];
  outputFormat?: 'text' | 'code' | 'json';
  context?: string;
}

/**
 * 多模态查询返回接口
 */
interface MultimodalQueryResult {
  response: string;
  format: string;
  metadata?: {
    imageCount: number;
    modelUsed: string;
  };
}

/**
 * gemini_multimodal_query 工具
 * 功能：使用图片+文本进行多模态查询
 */
export const multimodalQueryTool = {
  name: 'gemini_multimodal_query',
  description: '使用图片和文本进行多模态查询，适用于 UI/UX 分析、设计理解、架构图解读等场景',

  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: '查询问题或指令'
      },
      images: {
        type: 'array',
        items: { type: 'string' },
        description: 'Base64 编码的图片数组或图片 URL'
      },
      outputFormat: {
        type: 'string',
        enum: ['text', 'code', 'json'],
        description: '输出格式，默认为 text'
      },
      context: {
        type: 'string',
        description: '额外的上下文信息'
      }
    },
    required: ['prompt', 'images']
  },

  async execute(params: MultimodalQueryParams, client: GeminiClient): Promise<MultimodalQueryResult> {
    // 参数验证
    validateToolParams(params, {
      prompt: { required: true, type: 'string' },
      images: { required: true },
      outputFormat: { enum: ['text', 'code', 'json'] }
    });

    // 验证图片格式
    if (!Array.isArray(params.images) || params.images.length === 0) {
      throw new Error('images 必须是非空数组');
    }

    // 验证每个图片的格式
    params.images.forEach((img, index) => {
      if (!validateBase64Image(img) && !img.startsWith('http')) {
        throw new Error(`图片 ${index + 1} 格式无效（需要 Base64 或 URL）`);
      }
    });

    const outputFormat = params.outputFormat || 'text';

    // 构建增强的提示词
    const enhancedPrompt = buildMultimodalPrompt(params.prompt, params.context, outputFormat);

    try {
      const response = await client.generateMultimodal(
        enhancedPrompt,
        params.images,
        {
          model: 'gemini-3-pro-preview',  // 使用最强视觉理解模型
          systemPrompt: SYSTEM_PROMPTS.MULTIMODAL_QUERY,
          outputFormat
        }
      );

      return {
        response: formatResponse(response, outputFormat),
        format: outputFormat,
        metadata: {
          imageCount: params.images.length,
          modelUsed: 'gemini-3-pro-preview'
        }
      };
    } catch (error) {
      throw new Error(`多模态查询失败: ${error.message}`);
    }
  }
};

/**
 * 构建多模态查询提示词
 */
function buildMultimodalPrompt(
  prompt: string,
  context: string | undefined,
  outputFormat: string
): string {
  let enhancedPrompt = '';

  if (context) {
    enhancedPrompt += `## 上下文信息\n${context}\n\n`;
  }

  enhancedPrompt += `## 查询任务\n${prompt}\n\n`;

  enhancedPrompt += `## 输出格式要求\n`;

  if (outputFormat === 'json') {
    enhancedPrompt += `请以 JSON 格式返回结果，使用标准的 JSON 语法。\n`;
  } else if (outputFormat === 'code') {
    enhancedPrompt += `请返回完整的代码实现，包含必要的注释。\n`;
  } else {
    enhancedPrompt += `请以清晰、结构化的文本格式返回结果。\n`;
  }

  enhancedPrompt += `\n## 分析要求\n`;
  enhancedPrompt += `- 仔细观察图片中的所有细节\n`;
  enhancedPrompt += `- 识别设计模式、UI 组件和布局结构\n`;
  enhancedPrompt += `- 提供准确的颜色值（hex codes）\n`;
  enhancedPrompt += `- 说明间距和尺寸（如适用）\n`;
  enhancedPrompt += `- 如果是设计图，推断交互状态（hover, active等）\n`;

  return enhancedPrompt;
}

/**
 * 格式化响应
 */
function formatResponse(response: string, format: string): string {
  if (format === 'json') {
    // 尝试提取和验证 JSON
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return JSON.stringify(parsed, null, 2);
      }
    } catch (e) {
      // 如果解析失败，返回原始响应
    }
  } else if (format === 'code') {
    // 移除可能的 markdown 代码块标记
    return response.replace(/```[\w]*\n?/g, '').trim();
  }

  return response;
}
```

### 2. 更新系统提示词

在 src/config/constants.ts 中添加：

```typescript
MULTIMODAL_QUERY: `你是一位视觉理解专家，深入掌握以下领域：
- UI/UX 设计模式和原则
- 前端开发（HTML/CSS/JavaScript）
- 架构图和技术文档理解
- 设计系统和组件库

分析图片时：
1. 识别所有关键元素及其用途
2. 理解空间关系和布局结构
3. 识别设计模式和约定
4. 精确检测颜色、字体、间距
5. 推断交互状态（hover, active, disabled）

当被要求将设计转换为代码时：
- 提供完整、生产就绪的实现
- 像素级匹配设计
- 包含所有可见和隐含的交互

当被要求分析设计时：
- 具体且详细
- 引用准确的颜色（hex codes）
- 在相关时提及间距值
- 如果被要求，提供改进建议

输出格式：
- 适应请求的格式（text/code/json）
- 简洁但全面
- 使用专业术语`,
```

### 3. 注册工具

更新 src/tools/index.ts：

```typescript
import { multimodalQueryTool } from './multimodal-query';

export const TOOLS: Record<string, MCPTool> = {
  list_models: listModelsTool,
  gemini_generate_ui: generateUITool,
  gemini_multimodal_query: multimodalQueryTool
};
```

### 4. 创建测试

```typescript
// tests/multimodal-query.test.ts
describe('gemini_multimodal_query 工具', () => {
  test('应该分析 UI 设计图', async () => {
    const testImage = 'data:image/jpeg;base64,...'; // 测试图片

    const result = await multimodalQueryTool.execute({
      prompt: '这个设计使用了哪些 UI 组件？',
      images: [testImage]
    }, client);

    expect(result.response).toBeDefined();
    expect(result.metadata.imageCount).toBe(1);
  });

  test('应该支持 JSON 输出格式', async () => {
    const result = await multimodalQueryTool.execute({
      prompt: '分析这个界面',
      images: [testImage],
      outputFormat: 'json'
    }, client);

    expect(result.format).toBe('json');
    expect(() => JSON.parse(result.response)).not.toThrow();
  });
});
```

## 验收标准
✅ gemini_multimodal_query 工具完整实现
✅ 支持多张图片输入
✅ 支持三种输出格式（text, code, json）
✅ 图片格式验证正确
✅ 系统提示词能有效引导视觉理解
✅ 测试用例通过
✅ 可以成功处理真实的 UI 设计图

## 测试示例
```
使用 gemini_multimodal_query 工具分析这个界面设计（上传图片），列出所有使用的 UI 组件，并以 JSON 格式返回。
```

## 注意事项
- 确保正确处理 Base64 和 URL 两种图片格式
- 添加图片大小限制（避免超过 API 限制）
- 多张图片时注意 token 消耗
- 错误消息要清晰易懂
```

---

### Task 7: 实现 gemini_fix_ui_from_screenshot 工具

**预计时间**: 2 小时
**依赖**: Task 6
**优先级**: 🔴 P0

**AI 提示词**:

```
ultrathink

你是一位资深的 UI 调试专家，擅长从截图诊断和修复 UI 问题。

## 任务目标
实现 gemini_fix_ui_from_screenshot 工具，这是一个创新工具，可以从问题截图识别 UI bug 并生成修复代码。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 3 部分)
- 参考项目: https://github.com/cmdaltctr/claude-gemini-mcp-slim

## 具体任务

### 1. 创建 src/tools/fix-ui.ts

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { SYSTEM_PROMPTS } from '../config/constants';
import { validateRequired, validateToolParams } from '../utils/validators';

/**
 * UI 修复参数接口
 */
interface FixUIParams {
  screenshot: string;
  currentCode?: string;
  issueDescription?: string;
  targetState?: string;
}

/**
 * UI 修复返回接口
 */
interface FixUIResult {
  diagnosis: string;
  fixes: Array<{
    description: string;
    code: string;
    changes: string[];
  }>;
  preventionTips?: string[];
}

/**
 * gemini_fix_ui_from_screenshot 工具
 * 功能：从截图识别并修复 UI 问题
 */
export const fixUITool = {
  name: 'gemini_fix_ui_from_screenshot',
  description: '从问题截图识别 UI bug 并生成修复代码，支持布局、样式、响应式等各类问题',

  inputSchema: {
    type: 'object',
    properties: {
      screenshot: {
        type: 'string',
        description: 'Base64 编码的问题截图'
      },
      currentCode: {
        type: 'string',
        description: '当前的代码（HTML/CSS/JS 或组件代码）'
      },
      issueDescription: {
        type: 'string',
        description: '问题描述（可选，如"按钮在移动端错位"）'
      },
      targetState: {
        type: 'string',
        description: '期望状态的描述或参考图片（Base64）'
      }
    },
    required: ['screenshot']
  },

  async execute(params: FixUIParams, client: GeminiClient): Promise<FixUIResult> {
    // 参数验证
    validateToolParams(params, {
      screenshot: { required: true, type: 'string' }
    });

    // 构建诊断提示词
    const diagnosticPrompt = buildDiagnosticPrompt(params);

    try {
      // 第一步：诊断问题
      const images = [params.screenshot];
      if (params.targetState && params.targetState.startsWith('data:image')) {
        images.push(params.targetState);
      }

      const diagnosisResponse = await client.generateMultimodal(
        diagnosticPrompt,
        images,
        {
          model: 'gemini-3-pro-preview',
          systemPrompt: SYSTEM_PROMPTS.UI_FIX
        }
      );

      // 第二步：生成修复代码
      const fixPrompt = buildFixPrompt(diagnosisResponse, params);

      const fixResponse = await client.generateText(fixPrompt, {
        model: 'gemini-3-pro-preview',
        systemPrompt: SYSTEM_PROMPTS.UI_FIX,
        temperature: 0.5  // 降低温度以获得更精确的修复
      });

      // 解析响应
      const result = parseFixResponse(diagnosisResponse, fixResponse);

      return result;
    } catch (error) {
      throw new Error(`UI 修复失败: ${error.message}`);
    }
  }
};

/**
 * 构建诊断提示词
 */
function buildDiagnosticPrompt(params: FixUIParams): string {
  let prompt = `# UI 问题诊断任务\n\n`;

  prompt += `## 截图分析\n`;
  prompt += `请仔细分析这张截图，识别所有可见的 UI 问题。\n\n`;

  if (params.issueDescription) {
    prompt += `## 已知问题描述\n`;
    prompt += `${params.issueDescription}\n\n`;
  }

  if (params.targetState && !params.targetState.startsWith('data:image')) {
    prompt += `## 期望状态\n`;
    prompt += `${params.targetState}\n\n`;
  }

  prompt += `## 诊断要求\n`;
  prompt += `请按以下结构分析：\n\n`;
  prompt += `### 1. 问题识别\n`;
  prompt += `列出所有发现的问题，包括：\n`;
  prompt += `- 布局问题（重叠、错位、溢出等）\n`;
  prompt += `- 样式问题（颜色、字体、间距等）\n`;
  prompt += `- 响应式问题（不同屏幕尺寸的适配）\n`;
  prompt += `- 对齐和间距问题\n`;
  prompt += `- 可访问性问题\n\n`;

  prompt += `### 2. 根本原因\n`;
  prompt += `对每个问题，分析可能的根本原因：\n`;
  prompt += `- CSS 属性问题\n`;
  prompt += `- HTML 结构问题\n`;
  prompt += `- JavaScript 逻辑问题\n`;
  prompt += `- 浏览器兼容性问题\n\n`;

  prompt += `### 3. 严重程度\n`;
  prompt += `标注每个问题的严重程度（高/中/低）\n\n`;

  if (params.currentCode) {
    prompt += `## 当前代码\n`;
    prompt += `\`\`\`\n${params.currentCode}\n\`\`\`\n\n`;
    prompt += `请结合代码分析问题的具体位置。\n`;
  }

  return prompt;
}

/**
 * 构建修复提示词
 */
function buildFixPrompt(diagnosis: string, params: FixUIParams): string {
  let prompt = `# UI 修复代码生成\n\n`;

  prompt += `## 诊断结果\n`;
  prompt += `${diagnosis}\n\n`;

  prompt += `## 修复要求\n`;
  prompt += `基于上述诊断，请生成完整的修复代码。\n\n`;

  prompt += `### 输出格式\n`;
  prompt += `请按以下结构输出：\n\n`;
  prompt += `#### 修复方案 1: [简短描述]\n`;
  prompt += `**问题**: [要修复的问题]\n`;
  prompt += `**方案**: [修复方法说明]\n`;
  prompt += `**代码**:\n`;
  prompt += `\`\`\`css/html/javascript\n`;
  prompt += `[修复后的完整代码或代码片段]\n`;
  prompt += `\`\`\`\n`;
  prompt += `**变更说明**:\n`;
  prompt += `- [变更点 1]\n`;
  prompt += `- [变更点 2]\n\n`;

  prompt += `### 代码要求\n`;
  prompt += `- 提供完整可用的代码\n`;
  prompt += `- 标注修改的具体位置\n`;
  prompt += `- 确保修复不引入新问题\n`;
  prompt += `- 考虑浏览器兼容性\n`;
  prompt += `- 保持代码简洁高效\n\n`;

  if (params.currentCode) {
    prompt += `### 现有代码\n`;
    prompt += `请基于以下代码进行修复：\n`;
    prompt += `\`\`\`\n${params.currentCode}\n\`\`\`\n\n`;
  }

  prompt += `### 预防建议\n`;
  prompt += `提供 3-5 条预防类似问题的最佳实践建议。\n`;

  return prompt;
}

/**
 * 解析修复响应
 */
function parseFixResponse(diagnosis: string, fixResponse: string): FixUIResult {
  // 提取诊断信息
  const diagnosisSection = diagnosis.split('## 诊断结果')[0] || diagnosis;

  // 提取修复方案
  const fixes: FixUIResult['fixes'] = [];
  const fixRegex = /#### 修复方案 \d+: (.+?)\n\*\*问题\*\*: (.+?)\n\*\*方案\*\*: (.+?)\n\*\*代码\*\*:\n```[\w]*\n([\s\S]+?)```\n\*\*变更说明\*\*:\n([\s\S]+?)(?=####|###|$)/g;

  let match;
  while ((match = fixRegex.exec(fixResponse)) !== null) {
    const changes = match[5]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());

    fixes.push({
      description: match[1].trim(),
      code: match[4].trim(),
      changes
    });
  }

  // 如果正则匹配失败，创建默认修复方案
  if (fixes.length === 0) {
    fixes.push({
      description: '代码修复',
      code: fixResponse.replace(/```[\w]*\n?/g, '').trim(),
      changes: ['已应用修复']
    });
  }

  // 提取预防建议
  const tipsMatch = fixResponse.match(/### 预防建议\n([\s\S]+?)(?=###|$)/);
  const preventionTips = tipsMatch
    ? tipsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(1).trim())
    : undefined;

  return {
    diagnosis: diagnosisSection.trim(),
    fixes,
    preventionTips
  };
}
```

### 2. 更新系统提示词

```typescript
UI_FIX: `你是一位 UI 调试专家，专精于视觉问题诊断和修复。

你的专长：
- 常见 UI 问题模式识别（布局、对齐、响应式、z-index 等）
- CSS 调试技巧和最佳实践
- 浏览器兼容性问题
- 响应式设计问题
- 可访问性问题

问题诊断流程：
1. 视觉检查：
   - 识别所有可见的异常（重叠、错位、溢出、错误的颜色/字体/间距）
   - 比较期望状态和实际状态
   - 注意边缘情况（不同屏幕尺寸、状态）

2. 根本原因分析：
   - 检查可能的 CSS 属性问题（position, display, flex/grid, z-index）
   - 检查 HTML 结构问题
   - 检查 JavaScript 动态样式问题
   - 考虑浏览器特定问题

3. 解决方案设计：
   - 提供最简单有效的修复
   - 考虑副作用和边缘情况
   - 确保修复不破坏其他功能
   - 遵循最佳实践

代码修复要求：
- 提供完整的修复代码
- 清楚标注变更位置
- 包含详细的注释
- 确保跨浏览器兼容
- 保持代码整洁

输出组织：
- 按严重程度排序问题（高 > 中 > 低）
- 为每个问题提供独立的修复方案
- 包含"变更前后"对比说明
- 提供预防类似问题的建议`,
```

### 3. 注册工具

```typescript
import { fixUITool } from './fix-ui';

export const TOOLS: Record<string, MCPTool> = {
  list_models: listModelsTool,
  gemini_generate_ui: generateUITool,
  gemini_multimodal_query: multimodalQueryTool,
  gemini_fix_ui_from_screenshot: fixUITool
};
```

## 验收标准
✅ gemini_fix_ui_from_screenshot 工具完整实现
✅ 能够从截图准确识别 UI 问题
✅ 生成的修复代码正确有效
✅ 支持多种问题类型（布局、样式、响应式等）
✅ 提供问题诊断和修复两个步骤
✅ 测试用例通过
✅ 可以处理真实的 UI bug 截图

## 测试示例
```
我的导航栏在移动端错位了（上传截图），当前代码是：[粘贴 HTML/CSS 代码]。请帮我诊断并修复。
```

## 注意事项
- 这是一个创新性工具，需要精心设计提示词
- 诊断和修复分两步进行，确保准确性
- 修复代码要考虑不破坏其他功能
- 提供多个修复方案供用户选择
- 添加详细的变更说明和注释
```

---

### Task 8: 实现 gemini_create_animation 工具

**预计时间**: 2 小时
**依赖**: Task 7
**优先级**: 🔴 P0

**AI 提示词**:

```
ultrathink

你是一位创意编程专家，精通交互动画和视觉效果开发。

## 任务目标
实现 gemini_create_animation 工具，用于创建各种交互式动画效果（CSS、Canvas、WebGL、Three.js）。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 4 部分)
- 参考项目: https://github.com/RLabs-Inc/gemini-mcp
- use context7: 查阅 Canvas API, WebGL, Three.js 文档

## 具体任务

### 1. 创建 src/tools/create-animation.ts

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { SYSTEM_PROMPTS } from '../config/constants';
import { validateRequired, validateEnum, validateToolParams } from '../utils/validators';

/**
 * 动画创建参数接口
 */
interface CreateAnimationParams {
  description: string;
  technology?: 'css' | 'canvas' | 'webgl' | 'threejs';
  interactive?: boolean;
  fps?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * 动画创建返回接口
 */
interface CreateAnimationResult {
  code: string;
  technology: string;
  preview?: string;
  dependencies?: string[];
  usage: string;
}

/**
 * gemini_create_animation 工具
 * 功能：创建交互式动画效果
 */
export const createAnimationTool = {
  name: 'gemini_create_animation',
  description: '创建交互式动画效果，支持 CSS 动画、Canvas 2D、WebGL 和 Three.js',

  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description: '动画的详细描述，包括视觉效果、交互方式、运动特性等'
      },
      technology: {
        type: 'string',
        enum: ['css', 'canvas', 'webgl', 'threejs'],
        description: '动画技术选择，默认为 canvas'
      },
      interactive: {
        type: 'boolean',
        description: '是否包含用户交互（鼠标、触摸、键盘），默认 true'
      },
      fps: {
        type: 'number',
        description: '目标帧率，默认 60'
      },
      dimensions: {
        type: 'object',
        properties: {
          width: { type: 'number' },
          height: { type: 'number' }
        },
        description: '画布尺寸（对 canvas/webgl/threejs 有效）'
      }
    },
    required: ['description']
  },

  async execute(params: CreateAnimationParams, client: GeminiClient): Promise<CreateAnimationResult> {
    // 参数验证
    validateToolParams(params, {
      description: { required: true, type: 'string' },
      technology: { enum: ['css', 'canvas', 'webgl', 'threejs'] },
      fps: { type: 'number' }
    });

    // 设置默认值
    const technology = params.technology || 'canvas';
    const interactive = params.interactive !== false;
    const fps = params.fps || 60;
    const dimensions = params.dimensions || { width: 800, height: 600 };

    // 构建动画生成提示词
    const prompt = buildAnimationPrompt(params, technology, interactive, fps, dimensions);

    try {
      const code = await client.generateText(prompt, {
        model: 'gemini-3-pro-preview',
        systemPrompt: SYSTEM_PROMPTS.ANIMATION,
        temperature: 0.8,  // 创意任务使用稍高温度
        maxOutputTokens: 8192
      });

      // 解析生成的代码
      const result = parseAnimationCode(code, technology);

      // 生成使用说明
      const usage = generateUsageInstructions(technology, dimensions, interactive);

      return {
        code: result.code,
        technology,
        preview: result.preview,
        dependencies: result.dependencies,
        usage
      };
    } catch (error) {
      throw new Error(`动画创建失败: ${error.message}`);
    }
  }
};

/**
 * 构建动画生成提示词
 */
function buildAnimationPrompt(
  params: CreateAnimationParams,
  technology: string,
  interactive: boolean,
  fps: number,
  dimensions: { width: number; height: number }
): string {
  let prompt = `# 动画创建任务\n\n`;

  prompt += `## 动画描述\n`;
  prompt += `${params.description}\n\n`;

  prompt += `## 技术栈\n`;
  prompt += `- 技术: ${technology}\n`;
  prompt += `- 交互性: ${interactive ? '是' : '否'}\n`;
  prompt += `- 目标帧率: ${fps} FPS\n`;

  if (technology !== 'css') {
    prompt += `- 画布尺寸: ${dimensions.width}x${dimensions.height}\n`;
  }
  prompt += `\n`;

  prompt += `## 实现要求\n\n`;

  if (technology === 'css') {
    prompt += `### CSS 动画实现\n`;
    prompt += `- 使用 CSS animations 或 transitions\n`;
    prompt += `- 使用 @keyframes 定义动画序列\n`;
    prompt += `- 使用合适的 timing functions（ease, cubic-bezier 等）\n`;
    prompt += `- 考虑性能优化（transform, opacity）\n`;
    prompt += `- 返回完整的 HTML 文件（包含内联 CSS）\n\n`;
  } else if (technology === 'canvas') {
    prompt += `### Canvas 2D 实现\n`;
    prompt += `- 使用 Canvas 2D API\n`;
    prompt += `- 使用 requestAnimationFrame 实现 ${fps} FPS\n`;
    prompt += `- 实现流畅的渲染循环\n`;
    prompt += `- 优化性能（只重绘变化的部分）\n`;
    prompt += `- 画布尺寸: ${dimensions.width}x${dimensions.height}\n\n`;
  } else if (technology === 'webgl') {
    prompt += `### WebGL 实现\n`;
    prompt += `- 使用 WebGL 着色器\n`;
    prompt += `- 编写 vertex shader 和 fragment shader\n`;
    prompt += `- 实现高性能渲染\n`;
    prompt += `- 画布尺寸: ${dimensions.width}x${dimensions.height}\n\n`;
  } else if (technology === 'threejs') {
    prompt += `### Three.js 实现\n`;
    prompt += `- 使用 Three.js 库\n`;
    prompt += `- 创建 scene, camera, renderer\n`;
    prompt += `- 添加合适的光照和材质\n`;
    prompt += `- 实现流畅的动画循环\n`;
    prompt += `- 画布尺寸: ${dimensions.width}x${dimensions.height}\n\n`;
  }

  if (interactive) {
    prompt += `### 交互功能\n`;
    prompt += `- 响应鼠标移动和点击\n`;
    prompt += `- 响应触摸事件（移动端）\n`;
    prompt += `- 添加键盘控制（如适用）\n`;
    prompt += `- 提供平滑自然的交互反馈\n\n`;
  }

  prompt += `### 性能要求\n`;
  prompt += `- 使用 requestAnimationFrame 实现流畅动画\n`;
  prompt += `- 优化渲染性能（避免不必要的重绘）\n`;
  prompt += `- 启用硬件加速（如适用）\n`;
  prompt += `- 实现正确的资源清理（移除事件监听器、取消动画帧）\n\n`;

  prompt += `### 代码质量\n`;
  prompt += `- 结构良好、模块化\n`;
  prompt += `- 可配置的参数\n`;
  prompt += `- 清晰的注释解释逻辑\n`;
  prompt += `- 自包含（最少的外部依赖）\n\n`;

  prompt += `### 视觉质量\n`;
  prompt += `- 流畅、精致的动画\n`;
  prompt += `- 合适的缓动函数\n`;
  prompt += `- 一致的风格和感觉\n`;
  prompt += `- 注重细节\n\n`;

  prompt += `## 输出格式\n`;
  prompt += `- 返回完整、可运行的代码\n`;
  prompt += `- 嵌入在 HTML 中，包含内联脚本\n`;
  prompt += `- 包含所有必要的设置和初始化\n`;
  prompt += `- 可以直接复制粘贴运行\n`;

  if (technology === 'threejs') {
    prompt += `- 包含 Three.js CDN 链接\n`;
  }

  return prompt;
}

/**
 * 解析动画代码
 */
function parseAnimationCode(rawCode: string, technology: string): {
  code: string;
  preview?: string;
  dependencies?: string[];
} {
  // 清理代码
  let code = rawCode.replace(/```(?:html|javascript|glsl)?\n?/g, '').trim();

  // 提取依赖
  const dependencies: string[] = [];

  if (technology === 'threejs') {
    const threeMatch = code.match(/src="(.*three.*\.js)"/i);
    if (threeMatch) {
      dependencies.push('Three.js');
    }
  }

  // 对于 HTML 代码，可以直接作为预览
  const preview = code.includes('<!DOCTYPE') || code.includes('<html') ? code : undefined;

  return {
    code,
    preview,
    dependencies: dependencies.length > 0 ? dependencies : undefined
  };
}

/**
 * 生成使用说明
 */
function generateUsageInstructions(
  technology: string,
  dimensions: { width: number; height: number },
  interactive: boolean
): string {
  let usage = `## 使用说明\n\n`;

  usage += `### 运行方式\n`;
  usage += `1. 将代码保存为 HTML 文件（例如：animation.html）\n`;
  usage += `2. 使用浏览器打开文件\n`;
  usage += `3. 动画将自动开始播放\n\n`;

  if (interactive) {
    usage += `### 交互控制\n`;
    usage += `- **鼠标移动**: 与动画元素交互\n`;
    usage += `- **点击**: 触发特殊效果（如适用）\n`;
    usage += `- **键盘**: 使用方向键或其他按键控制（如适用）\n\n`;
  }

  if (technology === 'threejs') {
    usage += `### 依赖说明\n`;
    usage += `- 需要互联网连接以加载 Three.js 库（使用 CDN）\n`;
    usage += `- 或者可以下载 Three.js 本地使用\n\n`;
  }

  usage += `### 浏览器要求\n`;
  if (technology === 'css') {
    usage += `- 支持 CSS animations 的现代浏览器\n`;
  } else if (technology === 'canvas') {
    usage += `- 支持 Canvas 2D API 的现代浏览器\n`;
  } else if (technology === 'webgl') {
    usage += `- 支持 WebGL 的现代浏览器\n`;
    usage += `- 需要硬件加速支持\n`;
  } else if (technology === 'threejs') {
    usage += `- 支持 WebGL 的现代浏览器\n`;
    usage += `- Chrome, Firefox, Safari, Edge 最新版本\n`;
  }

  usage += `\n### 性能提示\n`;
  usage += `- 关闭其他标签页以获得最佳性能\n`;
  usage += `- 使用硬件加速\n`;
  usage += `- 全屏运行以获得最佳体验\n`;

  return usage;
}
```

### 2. 更新系统提示词

```typescript
ANIMATION: `你是一位创意编程专家，专精于交互式动画开发。

你的专长：
- CSS animations 和 transitions（keyframes, timing functions）
- Canvas 2D API（粒子、效果、游戏）
- WebGL 和着色器（3D 图形、视觉效果）
- Three.js（3D 场景、材质、光照）
- 动画原理（缓动、时序、运动设计）

创作指南：

1. 性能：
   - 使用 requestAnimationFrame 实现流畅的 60fps
   - 优化渲染（只绘制变化的内容）
   - 尽可能使用硬件加速
   - 实现正确的清理（事件监听器、定时器）

2. 交互性：
   - 响应鼠标/触摸事件
   - 添加键盘控制（适当时）
   - 提供流畅、自然的交互
   - 处理边缘情况（窗口调整大小、可见性）

3. 代码质量：
   - 结构良好、模块化
   - 可配置的参数
   - 清晰的注释解释逻辑
   - 自包含（最少依赖）

4. 视觉质量：
   - 流畅、精致的动画
   - 合适的缓动函数
   - 一致的风格和感觉
   - 注重细节

输出格式：
- 完整、可运行的代码
- 嵌入 HTML 中，包含内联脚本
- 包含所有必要的设置和初始化
- 可以直接复制粘贴运行`,
```

### 3. 注册工具

```typescript
import { createAnimationTool } from './create-animation';

export const TOOLS: Record<string, MCPTool> = {
  list_models: listModelsTool,
  gemini_generate_ui: generateUITool,
  gemini_multimodal_query: multimodalQueryTool,
  gemini_fix_ui_from_screenshot: fixUITool,
  gemini_create_animation: createAnimationTool
};
```

## 验收标准
✅ gemini_create_animation 工具完整实现
✅ 支持 4 种技术（CSS、Canvas、WebGL、Three.js）
✅ 生成的动画流畅且可交互
✅ 代码完整可运行
✅ 包含详细的使用说明
✅ 测试用例通过
✅ 可以生成各种创意动画效果

## 测试示例
```
使用 gemini_create_animation 创建一个粒子系统，500 个彩色粒子跟随鼠标光标并产生拖尾效果，使用 Canvas 技术。
```

```
创建一个 3D 旋转立方体，每个面不同颜色，带流畅光照效果，使用 Three.js。
```

## 注意事项
- 这是最具创意的工具，需要平衡创意和技术实现
- 确保生成的动画性能良好（60fps）
- 添加适当的注释帮助用户理解代码
- 考虑不同浏览器的兼容性
- Three.js 代码要包含 CDN 链接
```

---

## 🎯 Phase 3: 辅助工具实现 (P1)

### Task 9: 实现 gemini_analyze_content 工具

**预计时间**: 2 小时
**依赖**: Task 8
**优先级**: 🟡 P1

**AI 提示词**:

```
你是一位多功能代码和文档分析专家，擅长代码审查、文档总结和数据分析。

## 任务目标
实现 gemini_analyze_content 工具，这是一个通用的内容分析工具，可以处理代码片段、文档、数据等多种内容类型。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 5 部分)
- 参考项目: https://github.com/RaiAnsar/claude_code-gemini-mcp

## 具体任务

### 1. 创建 src/tools/analyze-content.ts

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { SYSTEM_PROMPTS } from '../config/constants';
import { validateRequired, validateEnum, validateToolParams } from '../utils/validators';

/**
 * 内容分析参数接口
 */
interface AnalyzeContentParams {
  content: string;
  type?: 'code' | 'document' | 'data' | 'auto';
  task?: 'summarize' | 'review' | 'explain' | 'optimize' | 'debug';
  language?: string;
  focus?: string[];
  outputFormat?: 'text' | 'json' | 'markdown';
}

/**
 * 内容分析返回接口
 */
interface AnalyzeContentResult {
  analysis: string;
  suggestions?: string[];
  issues?: Array<{
    severity: 'high' | 'medium' | 'low';
    description: string;
    location?: string;
  }>;
  summary?: string;
}

/**
 * gemini_analyze_content 工具
 * 功能：通用内容分析 - 代码、文档、数据
 */
export const analyzeContentTool = {
  name: 'gemini_analyze_content',
  description: '通用内容分析工具，支持代码审查、文档总结、数据分析等多种任务',

  inputSchema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: '要分析的内容（代码、文档或数据）'
      },
      type: {
        type: 'string',
        enum: ['code', 'document', 'data', 'auto'],
        description: '内容类型，默认自动检测'
      },
      task: {
        type: 'string',
        enum: ['summarize', 'review', 'explain', 'optimize', 'debug'],
        description: '分析任务类型，默认 summarize'
      },
      language: {
        type: 'string',
        description: '编程语言（如果是代码）'
      },
      focus: {
        type: 'array',
        items: { type: 'string' },
        description: '关注点列表'
      },
      outputFormat: {
        type: 'string',
        enum: ['text', 'json', 'markdown'],
        description: '输出格式，默认 markdown'
      }
    },
    required: ['content']
  },

  async execute(params: AnalyzeContentParams, client: GeminiClient): Promise<AnalyzeContentResult> {
    // 参数验证
    validateToolParams(params, {
      content: { required: true, type: 'string' },
      type: { enum: ['code', 'document', 'data', 'auto'] },
      task: { enum: ['summarize', 'review', 'explain', 'optimize', 'debug'] },
      outputFormat: { enum: ['text', 'json', 'markdown'] }
    });

    // 设置默认值
    const type = params.type || 'auto';
    const task = params.task || 'summarize';
    const outputFormat = params.outputFormat || 'markdown';

    // 自动检测内容类型
    const detectedType = type === 'auto' ? detectContentType(params.content, params.language) : type;

    // 构建分析提示词
    const prompt = buildAnalysisPrompt(params, detectedType, task, outputFormat);

    try {
      const response = await client.generateText(prompt, {
        model: 'gemini-2.5-flash',  // 使用高性能模型
        systemPrompt: SYSTEM_PROMPTS.ANALYZE_CONTENT,
        temperature: 0.5,
        maxOutputTokens: 8192
      });

      // 解析响应
      const result = parseAnalysisResult(response, task, outputFormat);

      return result;
    } catch (error) {
      throw new Error(`内容分析失败: ${error.message}`);
    }
  }
};

/**
 * 检测内容类型
 */
function detectContentType(content: string, language?: string): 'code' | 'document' | 'data' {
  // 如果指定了编程语言，认为是代码
  if (language) {
    return 'code';
  }

  // 检查是否是 JSON 数据
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
    try {
      JSON.parse(content);
      return 'data';
    } catch {
      // 不是有效 JSON，继续检查
    }
  }

  // 检查代码特征
  const codePatterns = [
    /function\s+\w+\(/,
    /class\s+\w+/,
    /import\s+.*from/,
    /const\s+\w+\s*=/,
    /def\s+\w+\(/,
    /public\s+class/,
    /<\?php/,
    /package\s+\w+/
  ];

  if (codePatterns.some(pattern => pattern.test(content))) {
    return 'code';
  }

  // 默认为文档
  return 'document';
}

/**
 * 构建分析提示词
 */
function buildAnalysisPrompt(
  params: AnalyzeContentParams,
  type: string,
  task: string,
  outputFormat: string
): string {
  let prompt = `# 内容分析任务\n\n`;

  prompt += `## 内容类型\n${type}\n\n`;

  if (params.language) {
    prompt += `## 编程语言\n${params.language}\n\n`;
  }

  prompt += `## 分析任务\n`;

  switch (task) {
    case 'summarize':
      prompt += `总结内容，提取关键信息和要点。\n`;
      break;
    case 'review':
      prompt += `进行全面审查，找出问题并提供改进建议。\n`;
      break;
    case 'explain':
      prompt += `详细解释内容，分解复杂部分使其易于理解。\n`;
      break;
    case 'optimize':
      prompt += `分析性能和效率，提供优化建议。\n`;
      break;
    case 'debug':
      prompt += `识别潜在的 bug 和逻辑错误。\n`;
      break;
  }
  prompt += `\n`;

  if (params.focus && params.focus.length > 0) {
    prompt += `## 关注点\n`;
    params.focus.forEach(f => prompt += `- ${f}\n`);
    prompt += `\n`;
  }

  prompt += `## 待分析内容\n\`\`\`${params.language || ''}\n${params.content}\n\`\`\`\n\n`;

  prompt += `## 输出要求\n`;

  if (type === 'code') {
    prompt += `### 代码分析要点\n`;
    prompt += `1. **代码质量**:\n`;
    prompt += `   - 可读性和可维护性\n`;
    prompt += `   - 命名规范\n`;
    prompt += `   - 代码组织和结构\n`;
    prompt += `2. **最佳实践**:\n`;
    prompt += `   - 是否遵循语言约定\n`;
    prompt += `   - 设计模式使用\n`;
    prompt += `   - 错误处理\n`;
    prompt += `3. **潜在问题**:\n`;
    prompt += `   - Bug 和逻辑错误\n`;
    prompt += `   - 性能问题\n`;
    prompt += `   - 安全隐患\n`;
    prompt += `4. **改进建议**:\n`;
    prompt += `   - 具体的优化方案\n`;
    prompt += `   - 代码重构建议\n\n`;
  } else if (type === 'document') {
    prompt += `### 文档分析要点\n`;
    prompt += `1. **核心内容**: 主要观点和论据\n`;
    prompt += `2. **结构**: 文档组织和逻辑流程\n`;
    prompt += `3. **关键信息**: 重要数据、日期、人物等\n`;
    prompt += `4. **总结**: 简洁的摘要\n\n`;
  } else if (type === 'data') {
    prompt += `### 数据分析要点\n`;
    prompt += `1. **结构**: 数据格式和组织方式\n`;
    prompt += `2. **内容**: 数据类型和含义\n`;
    prompt += `3. **质量**: 数据完整性和一致性\n`;
    prompt += `4. **洞察**: 从数据中得出的结论\n\n`;
  }

  prompt += `### 输出格式\n`;

  if (outputFormat === 'json') {
    prompt += `以 JSON 格式输出，包含以下字段：\n`;
    prompt += `\`\`\`json\n`;
    prompt += `{\n`;
    prompt += `  "analysis": "详细分析内容",\n`;
    prompt += `  "summary": "简短总结",\n`;
    prompt += `  "suggestions": ["建议1", "建议2"],\n`;
    prompt += `  "issues": [\n`;
    prompt += `    {\n`;
    prompt += `      "severity": "high|medium|low",\n`;
    prompt += `      "description": "问题描述",\n`;
    prompt += `      "location": "位置（如适用）"\n`;
    prompt += `    }\n`;
    prompt += `  ]\n`;
    prompt += `}\n`;
    prompt += `\`\`\`\n`;
  } else if (outputFormat === 'markdown') {
    prompt += `以 Markdown 格式输出，包含：\n`;
    prompt += `- 分析概述\n`;
    prompt += `- 详细分析（分点说明）\n`;
    prompt += `- 发现的问题（如有）\n`;
    prompt += `- 改进建议\n`;
    prompt += `- 简短总结\n`;
  } else {
    prompt += `以清晰的文本格式输出。\n`;
  }

  return prompt;
}

/**
 * 解析分析结果
 */
function parseAnalysisResult(
  response: string,
  task: string,
  outputFormat: string
): AnalyzeContentResult {
  if (outputFormat === 'json') {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // JSON 解析失败，返回文本格式
    }
  }

  // 提取建议
  const suggestionsMatch = response.match(/##?\s*(?:改进)?建议[：:]\s*([\s\S]*?)(?=##|$)/i);
  const suggestions = suggestionsMatch
    ? suggestionsMatch[1]
        .split('\n')
        .filter(line => line.trim().match(/^[-*]\s/))
        .map(line => line.trim().replace(/^[-*]\s+/, ''))
    : undefined;

  // 提取问题
  const issuesMatch = response.match(/##?\s*(?:发现的)?问题[：:]\s*([\s\S]*?)(?=##|$)/i);
  const issues = issuesMatch
    ? issuesMatch[1]
        .split('\n')
        .filter(line => line.trim().match(/^[-*]\s/))
        .map(line => {
          const text = line.trim().replace(/^[-*]\s+/, '');
          let severity: 'high' | 'medium' | 'low' = 'medium';

          if (text.includes('严重') || text.includes('critical') || text.includes('高优先级')) {
            severity = 'high';
          } else if (text.includes('轻微') || text.includes('low') || text.includes('低优先级')) {
            severity = 'low';
          }

          return {
            severity,
            description: text,
            location: undefined
          };
        })
    : undefined;

  // 提取总结
  const summaryMatch = response.match(/##?\s*总结[：:]\s*([\s\S]*?)(?=##|$)/i);
  const summary = summaryMatch ? summaryMatch[1].trim() : undefined;

  return {
    analysis: response,
    suggestions,
    issues: issues && issues.length > 0 ? issues : undefined,
    summary
  };
}
```

### 2. 更新系统提示词

```typescript
ANALYZE_CONTENT: `你是一位多功能内容分析专家，精通以下领域：
- 代码质量分析（任何编程语言）
- 文档总结和理解
- 数据结构分析和优化
- 技术写作审查

分析方法：

1. 自动检测内容类型（代码、文档、数据）
2. 理解上下文和目的
3. 执行请求的任务：
   - **Summarize（总结）**: 创建简洁摘要，包含关键点
   - **Review（审查）**: 分析质量，找出问题，提供改进建议
   - **Explain（解释）**: 将复杂内容分解为易于理解的部分
   - **Optimize（优化）**: 建议性能和效率改进
   - **Debug（调试）**: 识别潜在的 bug 和逻辑错误

代码分析标准：
- 可读性和可维护性
- 是否遵循最佳实践和约定
- 性能和效率
- 安全性考虑
- 错误处理
- 测试覆盖率（如适用）

文档分析标准：
- 结构和组织
- 清晰度和完整性
- 准确性
- 受众适配性

数据分析标准：
- 结构和格式
- 数据质量和一致性
- 潜在的洞察
- 优化机会

输出要求：
- 客观专业
- 具体可操作
- 按优先级排序建议
- 提供代码示例（如适用）
- 清晰的结构化输出`,
```

### 3. 注册工具

```typescript
import { analyzeContentTool } from './analyze-content';

export const TOOLS: Record<string, MCPTool> = {
  // ... 现有工具 ...
  gemini_analyze_content: analyzeContentTool
};
```

## 验收标准
✅ gemini_analyze_content 工具完整实现
✅ 支持多种内容类型（代码、文档、数据）
✅ 支持多种任务类型（总结、审查、解释、优化、调试）
✅ 自动检测内容类型功能正常
✅ 可以输出不同格式（text, json, markdown）
✅ 测试用例通过

## 测试示例
```
使用 gemini_analyze_content 审查以下 JavaScript 代码，找出潜在问题并提供优化建议：
[粘贴代码]
```

---

### Task 10: 实现 gemini_analyze_codebase 工具

**预计时间**: 2 小时
**依赖**: Task 9
**优先级**: 🟡 P1

**AI 提示词**:

```
ultrathink

你是一位资深软件架构师，擅长大型代码库分析和架构设计。

## 任务目标
实现 gemini_analyze_codebase 工具，利用 Gemini 的 1M token 上下文窗口，分析整个代码库。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 6 部分)
- 参考项目: https://github.com/aliargun/mcp-server-gemini
- use context7: 查阅软件架构和代码分析最佳实践

## 具体任务

### 1. 创建 src/tools/analyze-codebase.ts

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { SYSTEM_PROMPTS } from '../config/constants';
import { validateRequired, validateEnum, validateToolParams } from '../utils/validators';

/**
 * 代码库分析参数接口
 */
interface AnalyzeCodebaseParams {
  files: Array<{
    path: string;
    content: string;
  }>;
  focus?: 'architecture' | 'security' | 'performance' | 'dependencies' | 'patterns';
  deepThink?: boolean;
  outputFormat?: 'markdown' | 'json';
}

/**
 * 代码库分析返回接口
 */
interface AnalyzeCodebaseResult {
  summary: string;
  findings: Array<{
    category: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    location?: string;
    suggestion?: string;
  }>;
  metrics?: {
    totalFiles: number;
    totalLines: number;
    complexity: string;
  };
  visualization?: string;
}

/**
 * gemini_analyze_codebase 工具
 * 功能：分析整个代码库（利用 1M token 上下文）
 */
export const analyzeCodebaseTool = {
  name: 'gemini_analyze_codebase',
  description: '分析整个代码库，利用 Gemini 的 1M token 上下文窗口，提供架构、安全、性能等方面的深度分析',

  inputSchema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            path: { type: 'string' },
            content: { type: 'string' }
          },
          required: ['path', 'content']
        },
        description: '代码库文件列表'
      },
      focus: {
        type: 'string',
        enum: ['architecture', 'security', 'performance', 'dependencies', 'patterns'],
        description: '分析重点领域'
      },
      deepThink: {
        type: 'boolean',
        description: '是否启用 Deep Think 模式（更深入的推理）'
      },
      outputFormat: {
        type: 'string',
        enum: ['markdown', 'json'],
        description: '输出格式，默认 markdown'
      }
    },
    required: ['files']
  },

  async execute(params: AnalyzeCodebaseParams, client: GeminiClient): Promise<AnalyzeCodebaseResult> {
    // 参数验证
    validateToolParams(params, {
      files: { required: true },
      focus: { enum: ['architecture', 'security', 'performance', 'dependencies', 'patterns'] },
      outputFormat: { enum: ['markdown', 'json'] }
    });

    if (!Array.isArray(params.files) || params.files.length === 0) {
      throw new Error('files 必须是非空数组');
    }

    const outputFormat = params.outputFormat || 'markdown';
    const deepThink = params.deepThink || false;

    // 计算代码库指标
    const metrics = calculateMetrics(params.files);

    // 构建代码库快照
    const codebaseSnapshot = buildCodebaseSnapshot(params.files, metrics);

    // 构建分析提示词
    const prompt = buildCodebaseAnalysisPrompt(params, codebaseSnapshot, metrics, outputFormat);

    try {
      // 使用支持 Deep Think 的模型
      const modelOptions = {
        model: deepThink ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
        systemPrompt: SYSTEM_PROMPTS.ANALYZE_CODEBASE,
        temperature: 0.3,  // 降低温度以获得更一致的分析
        maxOutputTokens: 8192
      };

      const response = await client.generateText(prompt, modelOptions);

      // 解析分析结果
      const result = parseCodebaseAnalysis(response, metrics, outputFormat);

      return result;
    } catch (error) {
      throw new Error(`代码库分析失败: ${error.message}`);
    }
  }
};

/**
 * 计算代码库指标
 */
function calculateMetrics(files: Array<{ path: string; content: string }>) {
  let totalLines = 0;
  const languageCount: Record<string, number> = {};

  files.forEach(file => {
    const lines = file.content.split('\n').length;
    totalLines += lines;

    // 检测语言
    const ext = file.path.split('.').pop()?.toLowerCase() || '';
    const language = detectLanguage(ext);
    languageCount[language] = (languageCount[language] || 0) + 1;
  });

  // 简单的复杂度评估
  const avgLinesPerFile = totalLines / files.length;
  let complexity = 'low';

  if (avgLinesPerFile > 500) {
    complexity = 'high';
  } else if (avgLinesPerFile > 200) {
    complexity = 'medium';
  }

  return {
    totalFiles: files.length,
    totalLines,
    complexity,
    avgLinesPerFile: Math.round(avgLinesPerFile),
    languages: languageCount
  };
}

/**
 * 检测编程语言
 */
function detectLanguage(ext: string): string {
  const langMap: Record<string, string> = {
    'ts': 'TypeScript',
    'js': 'JavaScript',
    'tsx': 'TypeScript React',
    'jsx': 'JavaScript React',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'cs': 'C#',
    'go': 'Go',
    'rs': 'Rust',
    'rb': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kt': 'Kotlin'
  };

  return langMap[ext] || 'Unknown';
}

/**
 * 构建代码库快照
 */
function buildCodebaseSnapshot(
  files: Array<{ path: string; content: string }>,
  metrics: any
): string {
  let snapshot = `# 代码库快照\n\n`;

  snapshot += `## 概览\n`;
  snapshot += `- 文件总数: ${metrics.totalFiles}\n`;
  snapshot += `- 代码行数: ${metrics.totalLines}\n`;
  snapshot += `- 平均每文件行数: ${metrics.avgLinesPerFile}\n`;
  snapshot += `- 复杂度: ${metrics.complexity}\n\n`;

  snapshot += `## 使用的语言\n`;
  Object.entries(metrics.languages).forEach(([lang, count]) => {
    snapshot += `- ${lang}: ${count} 文件\n`;
  });
  snapshot += `\n`;

  snapshot += `## 文件结构\n`;
  files.forEach(file => {
    const lines = file.content.split('\n').length;
    snapshot += `### ${file.path} (${lines} 行)\n`;
    snapshot += `\`\`\`\n${file.content}\n\`\`\`\n\n`;
  });

  return snapshot;
}

/**
 * 构建代码库分析提示词
 */
function buildCodebaseAnalysisPrompt(
  params: AnalyzeCodebaseParams,
  snapshot: string,
  metrics: any,
  outputFormat: string
): string {
  let prompt = `# 代码库深度分析任务\n\n`;

  prompt += snapshot;

  prompt += `## 分析任务\n`;

  if (params.focus) {
    prompt += `### 分析重点: ${params.focus}\n`;

    switch (params.focus) {
      case 'architecture':
        prompt += `请重点分析：\n`;
        prompt += `- 整体架构模式和设计\n`;
        prompt += `- 模块划分和依赖关系\n`;
        prompt += `- 代码组织和文件结构\n`;
        prompt += `- 设计模式的使用\n`;
        break;
      case 'security':
        prompt += `请重点分析：\n`;
        prompt += `- 安全漏洞和风险点\n`;
        prompt += `- 输入验证和数据处理\n`;
        prompt += `- 身份认证和授权\n`;
        prompt += `- 敏感数据处理\n`;
        break;
      case 'performance':
        prompt += `请重点分析：\n`;
        prompt += `- 性能瓶颈\n`;
        prompt += `- 算法复杂度\n`;
        prompt += `- 资源使用（内存、CPU）\n`;
        prompt += `- 可扩展性\n`;
        break;
      case 'dependencies':
        prompt += `请重点分析：\n`;
        prompt += `- 依赖管理\n`;
        prompt += `- 版本冲突\n`;
        prompt += `- 过时的依赖\n`;
        prompt += `- 依赖关系图\n`;
        break;
      case 'patterns':
        prompt += `请重点分析：\n`;
        prompt += `- 使用的设计模式\n`;
        prompt += `- 代码重复（DRY 原则）\n`;
        prompt += `- 代码异味\n`;
        prompt += `- 反模式\n`;
        break;
    }
  } else {
    prompt += `进行全面分析，包括架构、安全、性能、依赖和模式等方面。\n`;
  }

  prompt += `\n## 输出要求\n\n`;

  prompt += `### 1. 总体概述\n`;
  prompt += `- 代码库的总体评价\n`;
  prompt += `- 主要优点\n`;
  prompt += `- 主要问题\n\n`;

  prompt += `### 2. 详细发现\n`;
  prompt += `按以下结构组织发现：\n`;
  prompt += `- **类别**: 架构/安全/性能/依赖/模式\n`;
  prompt += `- **严重程度**: High/Medium/Low\n`;
  prompt += `- **描述**: 详细说明问题或发现\n`;
  prompt += `- **位置**: 相关文件路径\n`;
  prompt += `- **建议**: 改进方案\n\n`;

  prompt += `### 3. 架构可视化\n`;
  prompt += `使用 Mermaid 语法绘制架构图（如适用）。\n\n`;

  prompt += `### 4. 改进建议\n`;
  prompt += `- 按优先级排序建议\n`;
  prompt += `- 提供可操作的步骤\n`;
  prompt += `- 评估影响和工作量\n\n`;

  if (outputFormat === 'json') {
    prompt += `### 输出格式\n`;
    prompt += `以 JSON 格式输出，包含以下字段：\n`;
    prompt += `\`\`\`json\n`;
    prompt += `{\n`;
    prompt += `  "summary": "总体概述",\n`;
    prompt += `  "findings": [\n`;
    prompt += `    {\n`;
    prompt += `      "category": "类别",\n`;
    prompt += `      "severity": "high|medium|low",\n`;
    prompt += `      "description": "描述",\n`;
    prompt += `      "location": "文件路径",\n`;
    prompt += `      "suggestion": "建议"\n`;
    prompt += `    }\n`;
    prompt += `  ],\n`;
    prompt += `  "visualization": "Mermaid 代码"\n`;
    prompt += `}\n`;
    prompt += `\`\`\`\n`;
  }

  return prompt;
}

/**
 * 解析代码库分析结果
 */
function parseCodebaseAnalysis(
  response: string,
  metrics: any,
  outputFormat: string
): AnalyzeCodebaseResult {
  if (outputFormat === 'json') {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          metrics
        };
      }
    } catch (e) {
      // JSON 解析失败，继续文本解析
    }
  }

  // 提取总结
  const summaryMatch = response.match(/##?\s*(?:总体)?概述[：:]\s*([\s\S]*?)(?=##|$)/i);
  const summary = summaryMatch ? summaryMatch[1].trim() : '分析完成';

  // 提取发现（简化版）
  const findings: AnalyzeCodebaseResult['findings'] = [];

  // 提取 Mermaid 图表
  const mermaidMatch = response.match(/```mermaid\n([\s\S]*?)```/);
  const visualization = mermaidMatch ? mermaidMatch[1].trim() : undefined;

  return {
    summary,
    findings,
    metrics,
    visualization
  };
}
```

### 2. 更新系统提示词

```typescript
ANALYZE_CODEBASE: `你是一位资深软件架构师，精通以下领域：
- 系统架构和设计模式
- 代码质量和最佳实践
- 安全漏洞和威胁
- 性能优化
- 依赖管理

分析方法：

1. 总览：
   - 理解整体结构
   - 识别主要组件及其关系
   - 识别架构模式

2. 深入分析（基于重点）：
   - **Architecture（架构）**: 层次、模块、数据流
   - **Security（安全）**: 漏洞、暴露点
   - **Performance（性能）**: 瓶颈、低效
   - **Dependencies（依赖）**: 版本冲突、过时包
   - **Patterns（模式）**: 设计模式、反模式

3. 建议：
   - 按影响和工作量优先级排序
   - 提供可操作的建议
   - 在有帮助时包含代码示例

输出质量：
- 全面但简洁
- 使用清晰、专业的语言
- 包含文件路径和行号
- 使用 Mermaid 图表可视化架构`,
```

### 3. 注册工具

```typescript
import { analyzeCodebaseTool } from './analyze-codebase';

export const TOOLS: Record<string, MCPTool> = {
  // ... 现有工具 ...
  gemini_analyze_codebase: analyzeCodebaseTool
};
```

## 验收标准
✅ gemini_analyze_codebase 工具完整实现
✅ 可以处理多个文件的代码库
✅ 计算基本的代码指标
✅ 支持多个分析重点领域
✅ 可以生成 Mermaid 架构图
✅ 支持 Deep Think 模式
✅ 测试用例通过

## 测试示例
```
使用 gemini_analyze_codebase 分析这个项目，重点关注安全性：
[上传多个文件]
```

---

## 🎯 Phase 4: 基础工具实现 (P2)

### Task 11: 实现 gemini_brainstorm 工具

**预计时间**: 2 小时
**依赖**: Task 10
**优先级**: 🟢 P2

**AI 提示词**:

```
你是一位创意思维专家，擅长头脑风暴和创新性解决方案设计。

## 任务目标
实现 gemini_brainstorm 工具，用于创意头脑风暴和想法生成。

## 工作目录
E:\Github\Gemini-mcp\src\tools

## 参考文档
- PRD 文档: E:\Github\Gemini-mcp\MCP-PRD.md (Tool 7 部分)
- 参考项目: https://github.com/RLabs-Inc/gemini-mcp

## 具体任务

### 1. 创建 src/tools/brainstorm.ts

```typescript
import { GeminiClient } from '../utils/gemini-client';
import { SYSTEM_PROMPTS } from '../config/constants';
import { validateRequired, validateEnum, validateToolParams } from '../utils/validators';

/**
 * 头脑风暴参数接口
 */
interface BrainstormParams {
  topic: string;
  context?: string;
  count?: number;
  style?: 'innovative' | 'practical' | 'radical';
}

/**
 * 头脑风暴返回接口
 */
interface BrainstormResult {
  ideas: Array<{
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    feasibility: 'low' | 'medium' | 'high';
  }>;
}

/**
 * gemini_brainstorm 工具
 * 功能：创意头脑风暴
 */
export const brainstormTool = {
  name: 'gemini_brainstorm',
  description: '创意头脑风暴工具，生成多个创新性想法，包含可行性评估和优缺点分析',

  inputSchema: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: '头脑风暴的主题或问题'
      },
      context: {
        type: 'string',
        description: '额外的上下文信息（背景、限制条件等）'
      },
      count: {
        type: 'number',
        description: '生成想法的数量，默认 5'
      },
      style: {
        type: 'string',
        enum: ['innovative', 'practical', 'radical'],
        description: '思考风格：创新型/实用型/激进型，默认 innovative'
      }
    },
    required: ['topic']
  },

  async execute(params: BrainstormParams, client: GeminiClient): Promise<BrainstormResult> {
    // 参数验证
    validateToolParams(params, {
      topic: { required: true, type: 'string' },
      count: { type: 'number' },
      style: { enum: ['innovative', 'practical', 'radical'] }
    });

    const count = params.count || 5;
    const style = params.style || 'innovative';

    // 构建头脑风暴提示词
    const prompt = buildBrainstormPrompt(params, count, style);

    try {
      const response = await client.generateText(prompt, {
        model: 'gemini-2.5-flash',
        systemPrompt: SYSTEM_PROMPTS.BRAINSTORM,
        temperature: 0.9,  // 创意任务使用高温度
        maxOutputTokens: 8192
      });

      // 解析想法
      const ideas = parseIdeas(response, count);

      return { ideas };
    } catch (error) {
      throw new Error(`头脑风暴失败: ${error.message}`);
    }
  }
};

/**
 * 构建头脑风暴提示词
 */
function buildBrainstormPrompt(params: BrainstormParams, count: number, style: string): string {
  let prompt = `# 创意头脑风暴任务\n\n`;

  prompt += `## 主题\n${params.topic}\n\n`;

  if (params.context) {
    prompt += `## 背景和限制\n${params.context}\n\n`;
  }

  prompt += `## 思考风格\n`;

  switch (style) {
    case 'innovative':
      prompt += `**创新型**: 注重新颖性和独特性，突破传统思维。\n`;
      break;
    case 'practical':
      prompt += `**实用型**: 注重可行性和实际效果，易于实施。\n`;
      break;
    case 'radical':
      prompt += `**激进型**: 大胆突破常规，挑战现有框架。\n`;
      break;
  }
  prompt += `\n`;

  prompt += `## 任务要求\n`;
  prompt += `请生成 ${count} 个创意想法，每个想法包含：\n\n`;

  prompt += `### 输出格式\n`;
  prompt += `对每个想法，按以下结构输出：\n\n`;
  prompt += `#### 想法 [N]: [简短标题]\n\n`;
  prompt += `**描述**:\n`;
  prompt += `[详细描述这个想法，包括具体实现思路]\n\n`;
  prompt += `**优点**:\n`;
  prompt += `- [优点 1]\n`;
  prompt += `- [优点 2]\n`;
  prompt += `- [优点 3]\n\n`;
  prompt += `**缺点**:\n`;
  prompt += `- [缺点 1]\n`;
  prompt += `- [缺点 2]\n\n`;
  prompt += `**可行性**: [Low/Medium/High]\n`;
  prompt += `[简要说明可行性评估理由]\n\n`;
  prompt += `---\n\n`;

  prompt += `## 创意要求\n`;
  prompt += `- 每个想法都要有独特性，避免重复\n`;
  prompt += `- 考虑不同的角度和维度\n`;
  prompt += `- 优缺点要客观、具体\n`;
  prompt += `- 可行性评估要基于实际情况\n`;
  prompt += `- 鼓励跨界思维和创新结合\n`;

  return prompt;
}

/**
 * 解析想法列表
 */
function parseIdeas(response: string, expectedCount: number): BrainstormResult['ideas'] {
  const ideas: BrainstormResult['ideas'] = [];

  // 匹配想法块
  const ideaRegex = /####?\s*想法\s*\[?\d+\]?[：:]\s*(.+?)\n\n\*\*描述\*\*[：:]\s*([\s\S]*?)\n\n\*\*优点\*\*[：:]\s*([\s\S]*?)\n\n\*\*缺点\*\*[：:]\s*([\s\S]*?)\n\n\*\*可行性\*\*[：:]\s*(\w+)/g;

  let match;
  while ((match = ideaRegex.exec(response)) !== null) {
    const title = match[1].trim();
    const description = match[2].trim();

    const pros = match[3]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().replace(/^-\s*/, ''));

    const cons = match[4]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().replace(/^-\s*/, ''));

    const feasibilityText = match[5].toLowerCase();
    let feasibility: 'low' | 'medium' | 'high' = 'medium';

    if (feasibilityText.includes('high') || feasibilityText.includes('高')) {
      feasibility = 'high';
    } else if (feasibilityText.includes('low') || feasibilityText.includes('低')) {
      feasibility = 'low';
    }

    ideas.push({
      title,
      description,
      pros,
      cons,
      feasibility
    });
  }

  return ideas;
}
```

### 2. 更新系统提示词

```typescript
BRAINSTORM: `你是一位创意思维专家，擅长头脑风暴和创新性解决方案设计。

你的优势：
- 多角度思考问题
- 突破传统框架
- 结合不同领域的知识
- 评估创意的可行性
- 平衡创新和实用

头脑风暴方法：

1. **发散思维**:
   - 探索多个方向
   - 不受传统思维限制
   - 欢迎大胆的想法

2. **结构化思考**:
   - 清晰描述每个想法
   - 列出优点和缺点
   - 评估可行性

3. **多维度评估**:
   - 技术可行性
   - 成本和资源
   - 时间和效益
   - 创新性和影响

创意质量要求：
- 每个想法都要独特且有价值
- 描述要具体，不要空泛
- 优缺点要客观全面
- 可行性评估要基于实际
- 鼓励跨界思维

输出组织：
- 按可行性或创新性排序
- 为每个想法提供详细分析
- 突出最有潜力的想法
- 提供实施建议（如适用）`,
```

### 3. 注册工具

```typescript
import { brainstormTool } from './brainstorm';

export const TOOLS: Record<string, MCPTool> = {
  // ... 现有工具 ...
  gemini_brainstorm: brainstormTool
};
```

## 验收标准
✅ gemini_brainstorm 工具完整实现
✅ 可以生成指定数量的创意想法
✅ 支持不同的思考风格
✅ 包含优缺点和可行性评估
✅ 测试用例通过

## 测试示例
```
使用 gemini_brainstorm 为"提升团队协作效率"生成 5 个创新想法，风格为实用型。
```

---

## 🎯 Phase 5: 测试和文档

### Task 12: 编写单元测试

**预计时间**: 2 小时
**依赖**: Task 11
**优先级**: 🟡 P1

**AI 提示词**:

```
你是一位测试工程专家，精通 Jest 测试框架和 TDD 方法论。

## 任务目标
为所有 8 个工具编写完整的单元测试，确保代码质量和稳定性。

## 工作目录
E:\Github\Gemini-mcp\tests

## 测试框架
- Jest 29.5.0
- ts-jest 29.1.0

## 具体任务

### 1. 创建测试辅助工具

创建 tests/helpers/mock-client.ts：

```typescript
import { GeminiClient } from '../../src/utils/gemini-client';

/**
 * 创建模拟的 GeminiClient
 */
export function createMockClient(responses: Record<string, string> = {}): GeminiClient {
  const mockClient = {
    generateText: jest.fn(async (prompt: string, options: any) => {
      return responses[options.model] || '模拟响应';
    }),

    generateMultimodal: jest.fn(async (prompt: string, images: string[], options: any) => {
      return responses[options.model] || '模拟多模态响应';
    }),

    listModels: jest.fn(() => {
      return [
        {
          id: 'gemini-3-pro-preview',
          name: 'Gemini 3 Pro',
          contextWindow: 1048576,
          features: ['Thinking'],
          isDefault: true
        }
      ];
    }),

    getModelInfo: jest.fn((modelId: string) => {
      return { id: modelId, name: 'Test Model' };
    })
  };

  return mockClient as any;
}
```

### 2. 为每个工具编写测试

创建以下测试文件：
- tests/tools/list-models.test.ts
- tests/tools/generate-ui.test.ts
- tests/tools/multimodal-query.test.ts
- tests/tools/fix-ui.test.ts
- tests/tools/create-animation.test.ts
- tests/tools/analyze-content.test.ts
- tests/tools/analyze-codebase.test.ts
- tests/tools/brainstorm.test.ts

示例测试文件（tests/tools/generate-ui.test.ts）：

```typescript
import { generateUITool } from '../../src/tools/generate-ui';
import { createMockClient } from '../helpers/mock-client';

describe('gemini_generate_ui 工具', () => {
  let client: any;

  beforeEach(() => {
    client = createMockClient({
      'gemini-3-pro-preview': '<div>模拟 UI 代码</div>'
    });
  });

  test('应该从描述生成 UI', async () => {
    const result = await generateUITool.execute({
      description: '一个登录表单'
    }, client);

    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('framework');
    expect(result.framework).toBe('vanilla');
    expect(client.generateText).toHaveBeenCalled();
  });

  test('应该支持不同框架', async () => {
    const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

    for (const framework of frameworks) {
      const result = await generateUITool.execute({
        description: '测试',
        framework: framework as any
      }, client);

      expect(result.framework).toBe(framework);
    }
  });

  test('应该验证必填参数', async () => {
    await expect(
      generateUITool.execute({} as any, client)
    ).rejects.toThrow();
  });

  test('应该处理设计图输入', async () => {
    client.generateMultimodal = jest.fn(async () => '<div>从设计图生成</div>');

    const result = await generateUITool.execute({
      description: '实现这个设计',
      designImage: 'data:image/jpeg;base64,abc123'
    }, client);

    expect(client.generateMultimodal).toHaveBeenCalled();
  });
});
```

### 3. 创建集成测试套件

创建 tests/integration/tools.test.ts：

```typescript
describe('工具集成测试', () => {
  test('所有工具都已正确注册', () => {
    const { TOOLS } = require('../../src/tools');

    expect(TOOLS).toHaveProperty('list_models');
    expect(TOOLS).toHaveProperty('gemini_generate_ui');
    expect(TOOLS).toHaveProperty('gemini_multimodal_query');
    expect(TOOLS).toHaveProperty('gemini_fix_ui_from_screenshot');
    expect(TOOLS).toHaveProperty('gemini_create_animation');
    expect(TOOLS).toHaveProperty('gemini_analyze_content');
    expect(TOOLS).toHaveProperty('gemini_analyze_codebase');
    expect(TOOLS).toHaveProperty('gemini_brainstorm');

    expect(Object.keys(TOOLS)).toHaveLength(8);
  });

  test('所有工具都有必需的字段', () => {
    const { TOOLS } = require('../../src/tools');

    Object.values(TOOLS).forEach((tool: any) => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('inputSchema');
      expect(tool).toHaveProperty('execute');
      expect(typeof tool.execute).toBe('function');
    });
  });
});
```

### 4. 更新测试配置

确保 jest.config.ts 配置正确：

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

## 验收标准
✅ 所有 8 个工具都有单元测试
✅ 测试覆盖率 > 70%
✅ 所有测试通过
✅ 包含正常和异常场景测试
✅ Mock 机制工作正常
✅ 集成测试验证工具注册

## 测试命令
```bash
# 运行所有测试
npm test

# 运行测试并查看覆盖率
npm test -- --coverage

# 监听模式
npm run test:watch
```
```

---

### Task 13: 编写集成测试和使用示例

**预计时间**: 2 小时
**依赖**: Task 12
**优先级**: 🟡 P1

**AI 提示词**:

```
你是一位技术文档和示例代码专家，擅长编写清晰易懂的使用文档。

## 任务目标
创建完整的使用示例和集成测试，帮助用户快速上手。

## 工作目录
E:\Github\Gemini-mcp

## 具体任务

### 1. 创建使用示例文档

创建 examples/README.md：

```markdown
# Gemini MCP Server 使用示例

本目录包含所有工具的使用示例。

## 目录

1. [模型列表](#list_models)
2. [UI 生成](#gemini_generate_ui)
3. [多模态查询](#gemini_multimodal_query)
4. [UI 修复](#gemini_fix_ui_from_screenshot)
5. [动画创建](#gemini_create_animation)
6. [内容分析](#gemini_analyze_content)
7. [代码库分析](#gemini_analyze_codebase)
8. [头脑风暴](#gemini_brainstorm)

## 示例

### list_models

列出所有可用模型：

\`\`\`typescript
// 无需参数
{
  "name": "list_models"
}
\`\`\`

### gemini_generate_ui

从描述生成 UI：

\`\`\`typescript
{
  "name": "gemini_generate_ui",
  "arguments": {
    "description": "创建一个现代风格的定价卡片，三个层级（Basic $9/月、Pro $29/月、Enterprise 联系我们），每个卡片包含功能列表和 CTA 按钮",
    "framework": "react",
    "includeAnimation": true,
    "responsive": true
  }
}
\`\`\`

...（继续添加其他工具示例）
```

### 2. 创建实际可运行的示例

创建 examples/generate-ui-example.ts：

```typescript
import { GeminiClient } from '../src/utils/gemini-client';
import { generateUITool } from '../src/tools/generate-ui';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('请设置 GEMINI_API_KEY 环境变量');
    process.exit(1);
  }

  const client = new GeminiClient(apiKey);

  console.log('正在生成 UI...\n');

  const result = await generateUITool.execute({
    description: '一个现代风格的登录表单，包含邮箱、密码输入框和"记住我"复选框',
    framework: 'vanilla',
    includeAnimation: true,
    responsive: true
  }, client);

  console.log('生成成功！\n');
  console.log('使用的框架:', result.framework);
  console.log('\n代码:\n');
  console.log(result.code);

  // 保存到文件
  const fs = require('fs');
  fs.writeFileSync('output/login-form.html', result.code);
  console.log('\n代码已保存到 output/login-form.html');
}

main().catch(console.error);
```

### 3. 创建端到端测试

创建 tests/e2e/workflow.test.ts：

```typescript
describe('端到端工作流测试', () => {
  test('完整的 UI 生成工作流', async () => {
    // 1. 列出模型
    const models = await listModelsTool.execute({}, realClient);
    expect(models.models).toHaveLength(4);

    // 2. 生成 UI
    const ui = await generateUITool.execute({
      description: '一个按钮',
      framework: 'react'
    }, realClient);
    expect(ui.code).toBeTruthy();

    // 3. 分析生成的代码
    const analysis = await analyzeContentTool.execute({
      content: ui.code,
      type: 'code',
      task: 'review'
    }, realClient);
    expect(analysis.analysis).toBeTruthy();
  });

  test('UI 问题诊断和修复流程', async () => {
    // 1. 提交问题截图
    const diagnosis = await fixUITool.execute({
      screenshot: 'data:image/jpeg;base64,...',
      issueDescription: '按钮错位'
    }, realClient);

    expect(diagnosis.diagnosis).toBeTruthy();
    expect(diagnosis.fixes).toHaveLength(greaterThan(0));

    // 2. 应用修复并验证
    const fixedCode = diagnosis.fixes[0].code;
    expect(fixedCode).toBeTruthy();
  });
});
```

### 4. 创建性能测试

创建 tests/performance/benchmark.test.ts：

```typescript
describe('性能基准测试', () => {
  test('UI 生成响应时间', async () => {
    const start = Date.now();

    await generateUITool.execute({
      description: '简单按钮'
    }, realClient);

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(30000);  // 30 秒内完成
  });

  test('大代码库分析性能', async () => {
    const files = generateLargeCodebase(50);  // 50 个文件

    const start = Date.now();

    await analyzeCodebaseTool.execute({
      files
    }, realClient);

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(60000);  // 60 秒内完成
  });
});
```

## 验收标准
✅ 所有工具都有完整的使用示例
✅ 示例代码可以直接运行
✅ 端到端测试覆盖主要工作流
✅ 性能测试验证响应时间
✅ 文档清晰易懂

## 运行示例
```bash
# 运行单个示例
npm run example:generate-ui

# 运行所有示例
npm run examples

# 运行端到端测试
npm run test:e2e
```
```

---

### Task 14: 完善文档和 README

**预计时间**: 2 小时
**依赖**: Task 13
**优先级**: 🟡 P1

**AI 提示词**:

```
你是一位技术文档撰写专家，擅长创建用户友好的项目文档。

## 任务目标
完善项目的 README.md 和相关文档，确保用户可以快速上手。

## 工作目录
E:\Github\Gemini-mcp

## 具体任务

### 1. 更新 README.md

更新项目主 README：

```markdown
# mcp-server-gemini-lkbaba

> 专注于 Gemini 3.0 Pro 优势的 MCP Server - 让 AI 帮你生成 UI、动画和前端代码

[![npm version](https://badge.fury.io/js/mcp-server-gemini-lkbaba.svg)](https://www.npmjs.com/package/mcp-server-gemini-lkbaba)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 特性

- 🎨 **UI 生成** - 从描述或设计图生成完整的 UI 组件
- 🖼️ **多模态理解** - 分析设计图、架构图、截图
- 🐛 **智能修复** - 从截图识别并修复 UI 问题
- ✨ **动画创建** - 生成交互式动画效果
- 📊 **代码分析** - 利用 1M token 上下文分析整个代码库
- 💡 **创意头脑风暴** - AI 辅助创意生成

## 🚀 快速开始

### 安装

\`\`\`bash
npm install -g mcp-server-gemini-lkbaba
\`\`\`

### 配置

1. 获取 Gemini API Key：[Google AI Studio](https://makersuite.google.com/app/apikey)

2. 在 Claude Desktop 配置中添加：

\`\`\`json
{
  "mcpServers": {
    "gemini": {
      "command": "mcp-server-gemini-lkbaba",
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
\`\`\`

### 使用示例

\`\`\`
请使用 gemini_generate_ui 工具生成一个现代风格的定价卡片组件
\`\`\`

## 📚 工具列表

| 工具名 | 描述 | 优先级 |
|--------|------|--------|
| `list_models` | 列出所有可用模型 | 🟢 P2 |
| `gemini_generate_ui` | 从描述/设计图生成 UI | 🔴 P0 |
| `gemini_multimodal_query` | 多模态查询 | 🔴 P0 |
| `gemini_fix_ui_from_screenshot` | 从截图修复 UI | 🔴 P0 |
| `gemini_create_animation` | 创建交互式动画 | 🔴 P0 |
| `gemini_analyze_content` | 通用内容分析 | 🟡 P1 |
| `gemini_analyze_codebase` | 代码库分析 | 🟡 P1 |
| `gemini_brainstorm` | 创意头脑风暴 | 🟢 P2 |

详细文档：[完整 API 文档](./docs/API.md)

## 🎯 支持的模型

- **Gemini 3 Pro** (默认) - 最强多模态理解
- **Gemini 2.5 Pro** - 高级推理能力
- **Gemini 2.5 Flash** - 性价比最佳
- **Gemini 2.5 Flash-Lite** - 最快最便宜

所有模型均支持：
- 🎯 1M token 输入上下文
- 📤 65K token 输出限制
- 🧠 Thinking 模式
- 🔧 Function calling
- 📊 Structured outputs

## 💻 开发

\`\`\`bash
# 克隆项目
git clone https://github.com/lkbaba/mcp-server-gemini-lkbaba.git
cd mcp-server-gemini-lkbaba

# 安装依赖
npm install

# 编译
npm run build

# 运行测试
npm test

# 启动开发服务器
npm run dev
\`\`\`

## 📖 文档

- [完整 API 文档](./docs/API.md)
- [使用示例](./examples/README.md)
- [开发指南](./docs/DEVELOPMENT.md)
- [贡献指南](./CONTRIBUTING.md)
- [更新日志](./CHANGELOG.md)

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](./CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

## 🙏 致谢

基于 [aliargun/mcp-server-gemini](https://github.com/aliargun/mcp-server-gemini) 开发

## 📮 联系

- 问题反馈：[GitHub Issues](https://github.com/lkbaba/mcp-server-gemini-lkbaba/issues)
- 作者：LKbaba
\`\`\`
```

### 2. 创建 API 文档

创建 docs/API.md（包含每个工具的详细 API 文档）

### 3. 创建开发指南

创建 docs/DEVELOPMENT.md（包含项目结构、开发流程、调试技巧等）

### 4. 创建 CHANGELOG.md

创建版本更新日志

### 5. 更新 package.json

确保 package.json 包含正确的元数据：

```json
{
  "name": "mcp-server-gemini-lkbaba",
  "version": "1.0.0",
  "description": "MCP Server focused on Gemini 3.0 Pro's strengths - UI generation, animation, and frontend development",
  "author": "LKbaba",
  "license": "MIT",
  "keywords": [
    "mcp",
    "gemini",
    "ui-generation",
    "animation",
    "frontend",
    "ai",
    "claude-code"
  ]
}
```

## 验收标准
✅ README.md 清晰完整
✅ API 文档详细准确
✅ 开发指南完善
✅ CHANGELOG.md 记录版本历史
✅ 所有文档使用中文
✅ 包含丰富的示例和截图

## 文档检查清单
- [ ] 安装步骤清晰
- [ ] 配置说明详细
- [ ] 所有工具都有示例
- [ ] 错误处理说明
- [ ] 常见问题解答
- [ ] 贡献指南
```

---

## 🎉 总结

恭喜！你已经完成了所有 14 个任务的规划。项目实现路线图如下：

### 完成时间线

| 阶段 | 任务 | 预计时间 | 累计时间 |
|------|------|----------|----------|
| **Phase 0** | Task 1-2 | 3 小时 | 3 小时 |
| **Phase 1** | Task 3-4 | 3 小时 | 6 小时 |
| **Phase 2** | Task 5-8 | 8 小时 | 14 小时 |
| **Phase 3** | Task 9-10 | 4 小时 | 18 小时 |
| **Phase 4** | Task 11 | 2 小时 | 20 小时 |
| **Phase 5** | Task 12-14 | 6 小时 | 26 小时 |

### 下一步

1. 按顺序执行每个任务
2. 每个任务完成后提交代码
3. 运行测试确保质量
4. 及时更新文档

### 注意事项

- 每个任务都是独立的，可以单独完成和测试
- 遵循任务依赖关系，确保顺序正确
- 使用提供的 AI 提示词，可以直接复制给 Claude Code
- 遇到问题时参考 PRD 文档和参考项目
- 保持代码注释使用中文

祝开发顺利！🚀

