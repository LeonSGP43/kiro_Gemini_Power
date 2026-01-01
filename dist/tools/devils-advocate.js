/**
 * Tool: gemini_devils_advocate
 * 反对者 Power - 交叉验证/找问题/挑风险
 *
 * 设计原则：
 * - 永远当反对派
 * - 找问题、找风险、找遗漏
 * - 不提出新方案
 * - 不修改原决策
 * - 不推荐取舍
 */
import { validateRequired, validateString, validateNumber } from '../utils/validators.js';
import { handleAPIError, logError } from '../utils/error-handler.js';
import { readFiles } from '../utils/file-reader.js';
// 反对者系统提示词 - 严格限制为"挑刺"角色
const DEVILS_ADVOCATE_SYSTEM_PROMPT = `You are a **Devil's Advocate Power** - a specialized critic focused ONLY on:
- Finding problems, risks, and gaps in proposals
- Identifying hidden assumptions
- Questioning logic and completeness
- Highlighting potential failure modes

## CRITICAL CONSTRAINTS (MUST FOLLOW):
❌ You MUST NOT propose new solutions or alternatives
❌ You MUST NOT modify or improve the original proposal
❌ You MUST NOT recommend trade-offs or decisions
❌ You MUST NOT say "instead, you should..." or "a better approach would be..."
❌ You MUST NOT be constructive - your job is to find problems, not solve them

✅ You MUST only:
- List problems and risks
- Identify hidden assumptions
- Point out missing considerations
- Ask challenging questions
- Each criticism must be specific and actionable

## TONE:
- Be direct and critical
- No sugar-coating
- Focus on what could go wrong
- Assume Murphy's Law applies

## OUTPUT RULES:
- Each item: 1-2 sentences max
- Be specific, not vague
- Prioritize by severity
- Format as structured JSON`;
/**
 * 构建反对者提示词
 */
function buildDevilsAdvocatePrompt(params, proposalContent) {
    let prompt = `# Devil's Advocate Review\n\n`;
    prompt += `## Proposal to Critique\n${proposalContent}\n\n`;
    if (params.goal) {
        prompt += `## Stated Goal\n${params.goal}\n\n`;
    }
    if (params.constraints) {
        prompt += `## Known Constraints\n${params.constraints}\n\n`;
    }
    prompt += `## Your Task
Ruthlessly critique this proposal. Find every problem, risk, and gap.
Remember: You are NOT here to help improve it. You are here to break it.

## Output Requirements
Provide your critique as valid JSON with this EXACT structure:
{
  "critical_risks": [
    {"risk": "what could go wrong", "severity": "high|medium|low", "impact": "consequence"}
  ],
  "hidden_assumptions": [
    {"assumption": "unstated assumption", "why_problematic": "why this is dangerous"}
  ],
  "missing_considerations": [
    {"consideration": "what was not considered", "why_important": "why it matters"}
  ],
  "questions_to_answer": ["hard question that needs answering"]
}

CONSTRAINTS:
- critical_risks: max 10 items, sorted by severity
- hidden_assumptions: max 8 items
- missing_considerations: max 8 items
- questions_to_answer: max 8 items
- Each explanation: max 2 sentences
- Be specific, not generic
- Return ONLY valid JSON`;
    return prompt;
}
/**
 * 解析反对者响应
 */
function parseDevilsAdvocateResponse(response) {
    try {
        let jsonContent = response;
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1].trim();
        }
        const parsed = JSON.parse(jsonContent);
        const validSeverities = ['high', 'medium', 'low'];
        return {
            critical_risks: (parsed.critical_risks || []).slice(0, 10).map((r) => ({
                risk: r.risk || '',
                severity: validSeverities.includes(r.severity) ? r.severity : 'medium',
                impact: r.impact || ''
            })),
            hidden_assumptions: (parsed.hidden_assumptions || []).slice(0, 8).map((a) => ({
                assumption: a.assumption || '',
                why_problematic: a.why_problematic || ''
            })),
            missing_considerations: (parsed.missing_considerations || []).slice(0, 8).map((c) => ({
                consideration: c.consideration || '',
                why_important: c.why_important || ''
            })),
            questions_to_answer: (parsed.questions_to_answer || []).slice(0, 8)
        };
    }
    catch {
        return {
            critical_risks: [{ risk: 'Parse Error', severity: 'high', impact: 'Could not parse response' }],
            hidden_assumptions: [],
            missing_considerations: [],
            questions_to_answer: ['Review raw response']
        };
    }
}
/**
 * 处理 gemini_devils_advocate 工具调用
 */
export async function handleDevilsAdvocate(params, client) {
    try {
        // 参数验证
        validateRequired(params.proposal, 'proposal');
        validateString(params.proposal, 'proposal', 20);
        const maxTokens = params.maxOutputTokens || 600;
        if (params.maxOutputTokens) {
            validateNumber(params.maxOutputTokens, 'maxOutputTokens', 200, 1500);
        }
        // 收集方案内容
        let proposalContent = params.proposal;
        // 从文件路径读取额外内容
        if (params.proposalPaths && params.proposalPaths.length > 0) {
            try {
                const files = await readFiles(params.proposalPaths);
                for (const file of files) {
                    proposalContent += `\n\n### File: ${file.path}\n${file.content}`;
                }
            }
            catch (error) {
                logError('devils-advocate:readProposal', error);
            }
        }
        // 构建提示词
        const prompt = buildDevilsAdvocatePrompt(params, proposalContent);
        // 调用 Gemini API
        const response = await client.generate(prompt, {
            systemInstruction: DEVILS_ADVOCATE_SYSTEM_PROMPT,
            temperature: 0.4, // 稍高温度以发现更多问题
            maxTokens: maxTokens
        });
        // 解析响应
        const parsed = parseDevilsAdvocateResponse(response);
        const totalIssues = (parsed.critical_risks?.length || 0) +
            (parsed.hidden_assumptions?.length || 0) +
            (parsed.missing_considerations?.length || 0) +
            (parsed.questions_to_answer?.length || 0);
        return {
            proposal_summary: params.proposal.substring(0, 200) + (params.proposal.length > 200 ? '...' : ''),
            critical_risks: parsed.critical_risks || [],
            hidden_assumptions: parsed.hidden_assumptions || [],
            missing_considerations: parsed.missing_considerations || [],
            questions_to_answer: parsed.questions_to_answer || [],
            metadata: {
                modelUsed: client.getModel(),
                tokenBudget: maxTokens,
                totalIssuesFound: totalIssues
            }
        };
    }
    catch (error) {
        logError('devils-advocate', error);
        throw handleAPIError(error);
    }
}
//# sourceMappingURL=devils-advocate.js.map