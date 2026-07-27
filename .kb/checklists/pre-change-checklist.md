# Pre-Change Checklist

Source code is the final authority.

Before editing:

- Run or inspect `git status --short --branch`.
- Identify the smallest affected source files.
- Read `AGENTS.md` and only the relevant `.kb` documents.
- Confirm whether the task changes content, UI, routing, deployment, theme, cursor, particles, or data models.
- For content changes, verify facts from user-provided information or existing source files.
- For routing or deployment changes, read [../context/deployment-and-routing.md](../context/deployment-and-routing.md) and make a short plan.
- For theme, cursor, particle, or global layout changes, make a short plan.
- Do not modify dependencies, configuration, routing, deployment, or application source during documentation-only work.
- Do not commit or push unless the user explicitly asks.
