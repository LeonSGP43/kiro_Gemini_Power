/**
 * Tool: gemini_consistency_check
 * 一致性检查员 Power - 检查目标/约束/方案是否冲突
 *
 * 设计原则：
 * - 不需要拍板
 * - 不需要创造
 * - 只需要对齐和比对
 * - 输出冲突点，不给解决方案
 */
import { validateRequired, validateString, validateNumber } from '../utils/validators.js';
import { handleAPIError, logError } from '../utils/error-handler.js';
import { readFiles } from '../utils/file-reader.js';
// 一致性检查系统提示词
const CONSISTENCY_CHECK_SYSTEM_PROMPT = `You are a **Consistency Check Power** - a specialized validator focused ONLY on:
- Comparing goals, constraints, and current proposals
- Identifying conflicts and inconsistencies
- Finding requirements that are not covered
- Detecting validation gaps

## CRITICAL CONSTRAINTS (MUST FOLLOW):
❌ You MUST NOT suggest how to resolve conflicts
❌ You MUST NOT recommend changes to the proposal
❌ You MUST NOT prioritize or make trade-off decisions
❌ You MUST NOT say "you should fix this by..."
❌ You MUST NOT be creative - only analytical

✅ You MUST only:
- Report whether conflicts exist (yes/no)
- List specific conflict points with both sides
- Identify uncovered requirements
- Point out validation gaps
- Be objective and factual

## OUTPUT RULES:
- Binary answer first: conflicts_found = true/false
- Each conflict must specify BOTH conflicting elements
- Be precise about what conflicts with what
- Format as structured JSON`;
/**
 * 构建一致性检查提示词
 */
function buildConsistencyCheckPrompt(params, proposalContent) {
    let prompt = `# Consistency Check Request\n\n`;
    prompt += `## Goal\n${params.goal}\n\n`;
    if (params.constraints) {
        prompt += `## Constraints\n${params.constraints}\n\n`;
    }
    prompt += `## Current Proposal\n${proposalContent}\n\n`;
    if (params.acceptanceCriteria) {
        prompt += `## Acceptance Criteria\n${params.acceptanceCriteria}\n\n`;
    }
    prompt += `## Your Task
Check if the proposal is CONSISTENT with the goal, constraints, and acceptance criteria.
Find any conflicts, uncovered requirements, or validation gaps.
DO NOT suggest fixes - only report issues.

## Output Requirements
Provide your analysis as valid JSON with this EXACT structure:
{
  "conflicts_found": true|false,
  "conflicts": [
    {
      "element_a": "the first conflicting element (quote from goal/constraint)",
      "element_b": "the second conflicting element (quote from proposal)",
      "conflict_type": "goal_vs_proposal|constraint_vs_proposal|internal_contradiction|criteria_vs_proposal",
      "description": "brief explanation of the conflict"
    }
  ],
  "requirements_not_covered": [
    {"requirement": "what is required", "source": "goal|constraint|acceptance_criteria"}
  ],
  "validation_gaps": [
    {"gap": "what is missing", "what_cannot_be_verified": "what we cannot check"}
  ]
}

CONSTRAINTS:
- conflicts: max 10 items
- requirements_not_covered: max 10 items
- validation_gaps: max 10 items
- Each description: max 2 sentences
- Be specific - quote actual text when possible
- Return ONLY valid JSON`;
    return prompt;
}
/**
 * 解析一致性检查响应
 */
function parseConsistencyCheckResponse(response) {
    try {
        let jsonContent = response;
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1].trim();
        }
        const parsed = JSON.parse(jsonContent);
        const validConflictTypes = ['goal_vs_proposal', 'constraint_vs_proposal', 'internal_contradiction', 'criteria_vs_proposal'];
        const validSources = ['goal', 'constraint', 'acceptance_criteria'];
        const conflicts = (parsed.conflicts || []).slice(0, 10).map((c) => ({
            element_a: c.element_a || '',
            element_b: c.element_b || '',
            conflict_type: validConflictTypes.includes(c.conflict_type) ? c.conflict_type : 'internal_contradiction',
            description: c.description || ''
        }));
        const requirements_not_covered = (parsed.requirements_not_covered || []).slice(0, 10).map((r) => ({
            requirement: r.requirement || '',
            source: validSources.includes(r.source) ? r.source : 'goal'
        }));
        const validation_gaps = (parsed.validation_gaps || []).slice(0, 10).map((g) => ({
            gap: g.gap || '',
            what_cannot_be_verified: g.what_cannot_be_verified || ''
        }));
        return {
            conflicts_found: parsed.conflicts_found === true || conflicts.length > 0,
            conflicts,
            requirements_not_covered,
            validation_gaps
        };
    }
    catch {
        return {
            conflicts_found: false,
            conflicts: [],
            requirements_not_covered: [],
            validation_gaps: [{ gap: 'Parse Error', what_cannot_be_verified: 'Response parsing failed' }]
        };
    }
}
/**
 * 计算整体一致性评级
 */
function calculateOverallConsistency(conflicts, uncovered, gaps) {
    const total = conflicts + uncovered + gaps;
    if (total === 0)
        return 'consistent';
    if (conflicts === 0 && total <= 3)
        return 'minor_issues';
    if (conflicts <= 2 && total <= 6)
        return 'major_issues';
    return 'inconsistent';
}
/**
 * 处理 gemini_consistency_check 工具调用
 */
export async function handleConsistencyCheck(params, client) {
    try {
        // 参数验证
        validateRequired(params.goal, 'goal');
        validateString(params.goal, 'goal', 10);
        validateRequired(params.proposal, 'proposal');
        validateString(params.proposal, 'proposal', 20);
        const maxTokens = params.maxOutputTokens || 500;
        if (params.maxOutputTokens) {
            validateNumber(params.maxOutputTokens, 'maxOutputTokens', 200, 1200);
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
                logError('consistency-check:readProposal', error);
            }
        }
        // 构建提示词
        const prompt = buildConsistencyCheckPrompt(params, proposalContent);
        // 调用 Gemini API
        const response = await client.generate(prompt, {
            systemInstruction: CONSISTENCY_CHECK_SYSTEM_PROMPT,
            temperature: 0.2, // 低温度确保分析稳定
            maxTokens: maxTokens
        });
        // 解析响应
        const parsed = parseConsistencyCheckResponse(response);
        const totalConflicts = parsed.conflicts?.length || 0;
        const totalUncovered = parsed.requirements_not_covered?.length || 0;
        const totalGaps = parsed.validation_gaps?.length || 0;
        return {
            conflicts_found: parsed.conflicts_found || false,
            conflicts: parsed.conflicts || [],
            requirements_not_covered: parsed.requirements_not_covered || [],
            validation_gaps: parsed.validation_gaps || [],
            summary: {
                total_conflicts: totalConflicts,
                total_uncovered: totalUncovered,
                total_gaps: totalGaps,
                overall_consistency: calculateOverallConsistency(totalConflicts, totalUncovered, totalGaps)
            },
            metadata: {
                modelUsed: client.getModel(),
                tokenBudget: maxTokens
            }
        };
    }
    catch (error) {
        logError('consistency-check', error);
        throw handleAPIError(error);
    }
}
//# sourceMappingURL=consistency-check.js.map