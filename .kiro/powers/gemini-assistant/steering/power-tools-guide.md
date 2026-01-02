# Controlled Power Tools Deep Dive

## Philosophy: Why "Controlled" Matters

Traditional AI assistants have a problem: they want to help too much.

When you ask for feedback, they give you:
- The feedback you asked for
- Plus suggestions you didn't ask for
- Plus alternative approaches
- Plus opinions on your architecture
- Plus...

This "helpful overflow" causes:
1. **Context pollution** - Your main model's context fills with tangential information
2. **Decision drift** - The AI starts influencing decisions it shouldn't make
3. **Unpredictable outputs** - Hard to integrate into automated workflows

**Controlled Power Tools solve this by:**
- Strict role boundaries (research OR critique OR validate, never all three)
- Structured JSON output (predictable, parseable)
- Token budgets (you control how much context is used)
- No "helpful" additions (they do exactly what they're told, nothing more)

---

## Tool 1: Research Advisor (`gemini_research_advisor`)

### Role Definition
```
You are a RESEARCH ASSISTANT.
You READ, EXTRACT, and SUMMARIZE.
You DO NOT decide, recommend, or judge.
```

### What It Does
- Reads documentation, code, or materials you provide
- Extracts key concepts and patterns
- Identifies relevant best practices (as information, not prescription)
- Suggests directions for further exploration
- Provides keywords and citations for traceability

### What It NEVER Does
- ❌ Says "you should use X"
- ❌ Recommends one approach over another
- ❌ Makes architectural decisions
- ❌ Judges if something is "right" or "wrong"

### Output Structure
```json
{
  "key_concepts": [
    { "concept": "...", "explanation": "...", "source": "..." }
  ],
  "recommended_directions": [
    { "direction": "...", "rationale": "..." }
  ],
  "open_questions": ["..."],
  "best_practices": [
    { "practice": "...", "context": "...", "source": "..." }
  ],
  "citations_or_keywords": ["..."]
}
```

### Example Usage

**Scenario:** You're implementing caching but unfamiliar with the patterns.

```json
{
  "question": "What are the common caching patterns for API responses?",
  "materials": "We have a REST API serving 10k requests/minute...",
  "materialPaths": ["./docs/api-spec.md", "./src/middleware/cache.ts"],
  "maxOutputTokens": 800
}
```

**What you get:**
- Key concepts: Cache-aside, write-through, TTL strategies
- Directions: "Consider exploring Redis vs in-memory for your scale"
- Best practices: "Cache invalidation patterns from the materials"
- Keywords: "stale-while-revalidate", "cache stampede"

**What you DON'T get:**
- "You should use Redis" (decision)
- "This is the best approach" (judgment)
- "Here's how to implement it" (solution)

---

## Tool 2: Devil's Advocate (`gemini_devils_advocate`)

### Role Definition
```
You are a CRITIC.
You FIND PROBLEMS, RISKS, and GAPS.
You DO NOT propose solutions or alternatives.
```

### What It Does
- Identifies critical risks in your proposal
- Exposes hidden assumptions you might have made
- Points out missing considerations
- Asks hard questions that need answering

### What It NEVER Does
- ❌ Says "instead, you should..."
- ❌ Proposes alternative approaches
- ❌ Suggests how to fix the problems it finds
- ❌ Softens criticism with constructive suggestions

### Output Structure
```json
{
  "critical_risks": [
    { "risk": "...", "severity": "high|medium|low", "impact": "..." }
  ],
  "hidden_assumptions": [
    { "assumption": "...", "why_problematic": "..." }
  ],
  "missing_considerations": [
    { "consideration": "...", "why_important": "..." }
  ],
  "questions_to_answer": ["..."]
}
```

### Example Usage

**Scenario:** You've designed a microservices architecture.

```json
{
  "proposal": "We will split the monolith into 5 services: User, Order, Payment, Inventory, Notification. Each service has its own database. Communication via REST APIs.",
  "goal": "Improve scalability and team autonomy",
  "constraints": "Team of 4 developers, 6-month timeline, existing PostgreSQL database",
  "maxOutputTokens": 600
}
```

**What you get:**
- Risks: "Distributed transactions across Order-Payment-Inventory"
- Assumptions: "Assumes team can handle 5x operational complexity"
- Missing: "No mention of service discovery or failure handling"
- Questions: "How will you handle partial failures in the order flow?"

**What you DON'T get:**
- "Use event sourcing instead" (alternative)
- "Start with 2 services" (suggestion)
- "Here's how to handle distributed transactions" (solution)

---

## Tool 3: Consistency Check (`gemini_consistency_check`)

### Role Definition
```
You are a VALIDATOR.
You CHECK ALIGNMENT between goal, constraints, and proposal.
You DO NOT suggest how to fix misalignments.
```

### What It Does
- Compares your proposal against stated goals
- Checks if constraints are being violated
- Identifies requirements that aren't covered
- Finds gaps in validation/verification

### What It NEVER Does
- ❌ Suggests how to resolve conflicts
- ❌ Prioritizes which conflicts to fix first
- ❌ Recommends changes to the proposal
- ❌ Offers alternative approaches

### Output Structure
```json
{
  "conflicts_found": true|false,
  "conflicts": [
    {
      "element_a": "...",
      "element_b": "...",
      "conflict_type": "goal_vs_proposal|constraint_vs_proposal|...",
      "description": "..."
    }
  ],
  "requirements_not_covered": [
    { "requirement": "...", "source": "goal|constraint|acceptance_criteria" }
  ],
  "validation_gaps": [
    { "gap": "...", "what_cannot_be_verified": "..." }
  ],
  "summary": {
    "total_conflicts": 2,
    "total_uncovered": 1,
    "total_gaps": 1,
    "overall_consistency": "major_issues"
  }
}
```

### Example Usage

**Scenario:** Pre-PR check for a feature implementation.

```json
{
  "goal": "Implement user authentication with OAuth2 supporting Google and GitHub",
  "constraints": "Must work with existing session management, no breaking changes to API",
  "proposal": "Implemented Google OAuth using passport.js. Sessions stored in Redis. New /auth/google endpoint added.",
  "acceptanceCriteria": "Users can sign in with Google or GitHub. Existing users can link accounts.",
  "proposalPaths": ["./src/auth/google.ts", "./src/routes/auth.ts"],
  "maxOutputTokens": 500
}
```

**What you get:**
- conflicts_found: true
- Conflict: "Goal requires GitHub support" vs "Proposal only implements Google"
- Uncovered: "Account linking not mentioned in proposal"
- Gap: "Cannot verify backward compatibility without API tests"

**What you DON'T get:**
- "Add GitHub OAuth like this..." (solution)
- "Prioritize GitHub over account linking" (decision)
- "Here's how to test backward compatibility" (suggestion)

---

## Integration Tips

### Chaining Tools Effectively

```
1. research_advisor → Understand the domain
2. [Main model creates proposal]
3. devils_advocate → Find problems
4. [Main model addresses problems]
5. consistency_check → Verify alignment
6. [Main model finalizes]
```

### Token Budget Strategy

| Tool | Light Check | Standard | Deep Analysis |
|------|-------------|----------|---------------|
| research_advisor | 400 | 800 | 1500 |
| devils_advocate | 300 | 600 | 1000 |
| consistency_check | 250 | 500 | 800 |

### When NOT to Use These Tools

- **Don't use research_advisor** when you need a decision → Use main model
- **Don't use devils_advocate** when you need solutions → Use main model
- **Don't use consistency_check** when you need fixes → Use main model

These tools are **inputs to your decision-making**, not decision-makers themselves.
