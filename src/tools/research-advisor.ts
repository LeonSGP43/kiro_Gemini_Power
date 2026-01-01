/**
 * Tool: gemini_research_advisor
 * 资料顾问 Power - 查资料/看文档/给建议
 * 
 * 设计原则：
 * - 只负责：阅读、提炼、给参考建议
 * - 不给最终方案
 * - 不判断对错
 * - 输出必须结构化且受控
 */

import { GeminiClient } from '../utils/gemini-client.js';
import {
  validateRequired,
  validateString,
  validateNumber
} from '../utils/validators.js';
import { handleAPIError, logError } from '../utils/error-handler.js';
import { readFile, readFiles } from '../utils/file-reader.js';

// 资料顾问系统提示词 - 严格限制角色边界
const RESEARCH_ADVISOR_SYSTEM_PROMPT = `You are a **Research Advisor Power** - a specialized assistant focused ONLY on:
- Reading and understanding documentation, code, and materials
- Extracting key concepts and patterns
- Providing reference suggestions and directions
- Identifying relevant best practices

## CRITICAL CONSTRAINTS (MUST FOLLOW):
❌ You MUST NOT provide final solutions or decisions
❌ You MUST NOT judge whether something is right or wrong
❌ You MUST NOT recommend specific trade-offs
❌ You MUST NOT make architectural decisions
❌ You MUST NOT say "you should do X" - only "consider X" or "X is a common approach"

✅ You MUST only provide:
- Key concepts extracted from materials
- Reference directions for further exploration
- Relevant keywords and search terms
- Common approaches (without recommending one)
- Best practices from the materials (as information, not prescription)

## OUTPUT RULES:
- Keep each item concise (1-2 sentences max)
- Maximum 8 items per category
- Use neutral, informative language
- Always cite sources when available
- Format as structured JSON for machine consumption`;

// 参数接口
export interface ResearchAdvisorParams {
  question: string;
  materials?: string;           // 直接提供的材料内容
  materialPaths?: string[];     // 材料文件路径
  context?: string;             // 额外上下文
  maxOutputTokens?: number;     // 输出 token 预算（默认 800）
}

// 返回接口 - 严格结构化
export interface ResearchAdvisorResult {
  question: string;
  
  // 核心概念（<=8）
  key_concepts: Array<{
    concept: string;
    explanation: string;
    source?: string;
  }>;
  
  // 推荐探索方向（<=5，都是"建议"，不拍板）
  recommended_directions: Array<{
    direction: string;
    rationale: string;
  }>;
  
  // 待回答的问题（<=5）
  open_questions: string[];
  
  // 相关最佳实践（<=8，作为信息，不是处方）
  best_practices: Array<{
    practice: string;
    context: string;
    source?: string;
  }>;
  
  // 可追溯线索
  citations_or_keywords: string[];
  
  // 元数据
  metadata: {
    materialsAnalyzed: number;
    modelUsed: string;
    tokenBudget: number;
  };
}

/**
 * 构建研究顾问提示词
 */
function buildResearchPrompt(
  params: ResearchAdvisorParams,
  materialsContent: string
): string {
  let prompt = `# Research Advisory Request\n\n`;
  
  prompt += `## Question to Research\n${params.question}\n\n`;
  
  if (params.context) {
    prompt += `## Additional Context\n${params.context}\n\n`;
  }
  
  if (materialsContent) {
    prompt += `## Materials to Analyze\n${materialsContent}\n\n`;
  }
  
  prompt += `## Output Requirements
Provide your analysis as valid JSON with this EXACT structure:
{
  "key_concepts": [
    {"concept": "name", "explanation": "1-2 sentences", "source": "optional source"}
  ],
  "recommended_directions": [
    {"direction": "what to explore", "rationale": "why it's relevant"}
  ],
  "open_questions": ["question that needs answering"],
  "best_practices": [
    {"practice": "the practice", "context": "when/why it applies", "source": "optional"}
  ],
  "citations_or_keywords": ["keyword1", "search term", "doc section name"]
}

CONSTRAINTS:
- key_concepts: max 8 items
- recommended_directions: max 5 items  
- open_questions: max 5 items
- best_practices: max 8 items
- citations_or_keywords: max 10 items
- Each explanation/rationale: max 2 sentences
- Return ONLY valid JSON, no additional text`;

  return prompt;
}

/**
 * 解析研究顾问响应
 */
function parseResearchResponse(response: string): Partial<ResearchAdvisorResult> {
  try {
    let jsonContent = response;
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    const parsed = JSON.parse(jsonContent);
    
    return {
      key_concepts: (parsed.key_concepts || []).slice(0, 8).map((c: any) => ({
        concept: c.concept || 'Unknown',
        explanation: c.explanation || '',
        source: c.source
      })),
      recommended_directions: (parsed.recommended_directions || []).slice(0, 5).map((d: any) => ({
        direction: d.direction || '',
        rationale: d.rationale || ''
      })),
      open_questions: (parsed.open_questions || []).slice(0, 5),
      best_practices: (parsed.best_practices || []).slice(0, 8).map((p: any) => ({
        practice: p.practice || '',
        context: p.context || '',
        source: p.source
      })),
      citations_or_keywords: (parsed.citations_or_keywords || []).slice(0, 10)
    };
  } catch {
    // 解析失败时返回最小结构
    return {
      key_concepts: [{ concept: 'Parse Error', explanation: 'Could not parse structured response' }],
      recommended_directions: [],
      open_questions: ['Review raw response for details'],
      best_practices: [],
      citations_or_keywords: []
    };
  }
}

/**
 * 处理 gemini_research_advisor 工具调用
 */
export async function handleResearchAdvisor(
  params: ResearchAdvisorParams,
  client: GeminiClient
): Promise<ResearchAdvisorResult> {
  try {
    // 参数验证
    validateRequired(params.question, 'question');
    validateString(params.question, 'question', 10);
    
    const maxTokens = params.maxOutputTokens || 800;
    if (params.maxOutputTokens) {
      validateNumber(params.maxOutputTokens, 'maxOutputTokens', 200, 2000);
    }
    
    // 收集材料内容
    let materialsContent = '';
    let materialsCount = 0;
    
    // 直接提供的材料
    if (params.materials) {
      materialsContent += params.materials + '\n\n';
      materialsCount++;
    }
    
    // 从文件路径读取材料
    if (params.materialPaths && params.materialPaths.length > 0) {
      try {
        const files = await readFiles(params.materialPaths);
        for (const file of files) {
          materialsContent += `### File: ${file.path}\n${file.content}\n\n`;
          materialsCount++;
        }
      } catch (error) {
        logError('research-advisor:readMaterials', error);
      }
    }
    
    // 构建提示词
    const prompt = buildResearchPrompt(params, materialsContent);
    
    // 调用 Gemini API
    const response = await client.generate(prompt, {
      systemInstruction: RESEARCH_ADVISOR_SYSTEM_PROMPT,
      temperature: 0.3,  // 低温度确保输出稳定
      maxTokens: maxTokens
    });
    
    // 解析响应
    const parsed = parseResearchResponse(response);
    
    return {
      question: params.question,
      key_concepts: parsed.key_concepts || [],
      recommended_directions: parsed.recommended_directions || [],
      open_questions: parsed.open_questions || [],
      best_practices: parsed.best_practices || [],
      citations_or_keywords: parsed.citations_or_keywords || [],
      metadata: {
        materialsAnalyzed: materialsCount,
        modelUsed: client.getModel(),
        tokenBudget: maxTokens
      }
    };
    
  } catch (error: any) {
    logError('research-advisor', error);
    throw handleAPIError(error);
  }
}
