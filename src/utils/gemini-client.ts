/**
 * Gemini API 客户端封装
 * 提供统一的 API 调用接口，包含错误处理和重试逻辑
 */

import { GoogleGenAI } from '@google/genai';
import { getModelConfig } from '../config/models.js';
import { API_CONFIG, ERROR_CODES } from '../config/constants.js';
import * as fs from 'fs';
import * as path from 'path';

export interface GeminiClientConfig {
  apiKey: string;
  model?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  systemInstruction?: string;
}

/**
 * 根据文件扩展名获取 MIME 类型
 */
function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return mimeTypes[ext.toLowerCase()] || 'image/png';
}

/**
 * 将图片转换为 Base64 内联数据格式
 * 支持：文件路径、Base64 data URI
 */
function convertImageToInlineData(image: string): { mimeType: string; data: string } {
  // 1. 已经是 Base64 data URI 格式
  if (image.startsWith('data:')) {
    const [metadata, data] = image.split(',');
    const mimeType = metadata.match(/:(.*?);/)?.[1] || 'image/png';
    return { mimeType, data };
  }

  // 2. URL 格式 - 不支持
  if (image.startsWith('http://') || image.startsWith('https://')) {
    throw new Error(
      `URL images are not supported. Please provide a file path or Base64 data URI instead.`
    );
  }

  // 3. 文件路径格式 - 读取文件并转换为 Base64
  try {
    // 检查文件是否存在
    if (!fs.existsSync(image)) {
      throw new Error(`Image file not found: ${image}`);
    }

    // 读取文件并转换为 Base64
    const fileBuffer = fs.readFileSync(image);
    const base64Data = fileBuffer.toString('base64');

    // 获取 MIME 类型
    const ext = path.extname(image);
    const mimeType = getMimeType(ext);

    return { mimeType, data: base64Data };
  } catch (error: any) {
    if (error.message.includes('Image file not found')) {
      throw error;
    }
    throw new Error(`Failed to read image file "${image}": ${error.message}`);
  }
}

export class GeminiClient {
  private client: GoogleGenAI;
  private modelId: string;
  private config: Required<GeminiClientConfig>;

  constructor(config: GeminiClientConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.modelId = config.model || 'gemini-3-pro-preview';
    this.config = {
      apiKey: config.apiKey,
      model: this.modelId,
      timeout: config.timeout || API_CONFIG.timeout,
      maxRetries: config.maxRetries || API_CONFIG.maxRetries
    };
  }

  /**
   * 生成内容（文本）
   */
  async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    try {
      const requestBody: any = {
        model: this.modelId,
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
          topP: options.topP,
          topK: options.topK
        }
      };

      // 添加系统指令（如果提供）
      if (options.systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: options.systemInstruction }]
        };
      }

      const result = await this.client.models.generateContent(requestBody);
      return result.text || '';
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 生成内容（多模态：文本 + 图片）
   * 支持图片格式：
   * - 文件路径：如 "./images/screenshot.png"
   * - Base64 data URI：如 "data:image/png;base64,iVBORw0KGgo..."
   */
  async generateMultimodal(
    prompt: string,
    images: string[],
    options: GenerateOptions = {}
  ): Promise<string> {
    try {
      // 构建内容：文本 + 图片
      const parts: any[] = [{ text: prompt }];

      // 处理每个图片（支持文件路径和 Base64）
      for (const image of images) {
        const { mimeType, data } = convertImageToInlineData(image);
        parts.push({
          inlineData: {
            mimeType,
            data
          }
        });
      }

      const requestBody: any = {
        model: this.modelId,
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
          topP: options.topP,
          topK: options.topK
        }
      };

      // 添加系统指令（如果提供）
      if (options.systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: options.systemInstruction }]
        };
      }

      const result = await this.client.models.generateContent(requestBody);
      return result.text || '';
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * 切换模型
   */
  setModel(modelId: string): void {
    this.modelId = modelId;
    this.config.model = modelId;
  }

  /**
   * 获取当前模型
   */
  getModel(): string {
    return this.modelId;
  }

  /**
   * 错误处理
   */
  private handleError(error: any): Error {
    if (error.message?.includes('API key')) {
      return new Error('Invalid API key');
    }
    if (error.message?.includes('quota')) {
      return new Error('API quota exceeded');
    }
    if (error.message?.includes('timeout')) {
      return new Error('Request timeout');
    }
    return new Error(error.message || 'Unknown error');
  }
}

/**
 * 创建 Gemini 客户端实例
 */
export function createGeminiClient(apiKey: string, model?: string): GeminiClient {
  return new GeminiClient({ apiKey, model });
}
