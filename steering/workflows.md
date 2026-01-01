# Gemini Assistant Workflows

## Common Integration Patterns

### Pattern 1: Research Before Implementation

**When:** Starting work on unfamiliar technology or domain

```
1. Call gemini_research_advisor
   - question: "What are the key patterns for [technology]?"
   - materialPaths: [relevant docs]
   
2. Review key_concepts and best_practices
   
3. Proceed with implementation using main model
```

**Example:**
```json
{
  "question": "What are the best practices for implementing WebSocket reconnection?",
  "materialPaths": ["./docs/websocket-spec.md"],
  "maxOutputTokens": 800
}
```

### Pattern 2: Proposal Review Cycle

**When:** After drafting a technical proposal or design

```
1. Write proposal (main model)

2. Call gemini_devils_advocate
   - proposal: [your proposal summary]
   - goal: [stated objective]
   
3. Review critical_risks and hidden_assumptions

4. Address issues (main model)

5. Call gemini_consistency_check
   - goal: [objective]
   - proposal: [updated proposal]
   - constraints: [requirements]
   
6. Verify conflicts_found = false
```

### Pattern 3: Pre-PR Validation

**When:** Before submitting a pull request

```
1. Call gemini_consistency_check
   - goal: [ticket/issue description]
   - constraints: [acceptance criteria]
   - proposal: [implementation summary]
   - proposalPaths: [changed files]
   
2. If conflicts_found = true:
   - Review conflicts list
   - Fix issues
   - Re-run check
   
3. If conflicts_found = false:
   - Proceed with PR
```

### Pattern 4: UI Development Flow

**When:** Building UI components

```
1. Call gemini_generate_ui
   - description: [component description]
   - designImage: [optional Figma export]
   - framework: "react"
   - techContext: { cssFramework: "tailwind", typescript: true }
   
2. Implement generated code

3. If issues appear, call gemini_fix_ui_from_screenshot
   - screenshot: [problem screenshot]
   - sourceCodePath: [component file]
```

### Pattern 5: Codebase Onboarding

**When:** Joining a new project or exploring unfamiliar code

```
1. Call gemini_analyze_codebase
   - directory: "./src"
   - focus: "architecture"
   - include: ["**/*.ts", "**/*.tsx"]
   - exclude: ["**/*.test.ts"]
   
2. Review architecture overview

3. For specific questions, call gemini_research_advisor
   - question: [specific question]
   - materialPaths: [relevant files]
```

## Workflow: Engineering Decision Making

### Step 1: Gather Information
```
gemini_research_advisor({
  question: "What are the trade-offs between REST and GraphQL for our use case?",
  materials: "Our API serves mobile apps and web dashboard...",
  maxOutputTokens: 800
})
```

**Output used for:** Understanding options (NOT making decision)

### Step 2: Draft Proposal
Main model creates proposal based on research.

### Step 3: Stress Test
```
gemini_devils_advocate({
  proposal: "We will use GraphQL because...",
  goal: "Build a flexible API for multiple clients",
  constraints: "Team has REST experience, 3-month deadline",
  maxOutputTokens: 600
})
```

**Output used for:** Finding blind spots (NOT changing direction)

### Step 4: Validate Alignment
```
gemini_consistency_check({
  goal: "Build a flexible API for multiple clients",
  constraints: "Team has REST experience, 3-month deadline",
  proposal: "GraphQL implementation with Apollo Server...",
  acceptanceCriteria: "API supports web and mobile with shared schema"
})
```

**Output used for:** Confirming alignment (NOT suggesting changes)

### Step 5: Final Decision
Main model makes final decision incorporating all inputs.

## Anti-Patterns to Avoid

### ❌ Don't: Let Gemini Make Decisions
```
# BAD: Asking for a decision
gemini_research_advisor({
  question: "Should we use REST or GraphQL?"  # Asking for decision
})
```

### ✅ Do: Ask for Information
```
# GOOD: Asking for information
gemini_research_advisor({
  question: "What are the key differences between REST and GraphQL for mobile-first APIs?"
})
```

### ❌ Don't: Expect Solutions from Devil's Advocate
```
# BAD: Expecting fixes
gemini_devils_advocate({
  proposal: "...",
  # Then trying to use output as implementation guide
})
```

### ✅ Do: Use It for Risk Discovery Only
```
# GOOD: Using for risk discovery
gemini_devils_advocate({
  proposal: "..."
  # Then having main model address discovered risks
})
```

## Token Budget Guidelines

| Use Case | Recommended Budget |
|----------|-------------------|
| Quick sanity check | 200-400 |
| Standard review | 500-800 |
| Deep analysis | 1000-1500 |
| Comprehensive research | 1500-2000 |

Lower budgets = faster responses + less context pollution
