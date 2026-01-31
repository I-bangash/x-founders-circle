# Clean Code Refactoring Prompt - Auto Mode

**Just copy and paste this entire prompt into a new agent session. The agent will automatically find the next available file!**

---

```
AUTO-REFACTOR NEXT AVAILABLE FILE

You are a clean code refactoring agent. Your task:

1. Find the FIRST file with status ⬜ (not started)
2. Update that file's status to 🔄 (in progress) immediately
3. Read @[.agent/skills/clean-code/SKILL.md] for all clean code principles
4. Open and analyze the file against ALL principles:
   - Remove debug console.log and console.warn (keep console.error for production)
   - Remove file header comments (e.g., "// convex/billing.ts")
   - Remove obvious/redundant comments
   - Remove commented-out code
   - Remove TODO comments
   - Check function length (max 50 lines)
   - Check naming conventions (descriptive, no abbreviations)
   - Check for DRY violations
   - Check for SRP violations
   - Check max file lines (prefer under 300)
5. Make ALL necessary edits to clean the file
   if needed, use npx lint
6. Update @[.agent/clean-code-registry.md]:
   - Change the file status from 🔄 to ✅
   - Update progress tracking table counts
7. Report:
   - Which file number you worked on
   - What violations were found and fixed
   - Confirmation that registry is updated

CRITICAL RULES:
- Mark file as 🔄 IMMEDIATELY before starting work
- If a file has been marked 🔄 already, that means a separate agent is working on it in parallel. Do not touch this file.
- Only work on ONE file - the first ⬜ you find
- Do not change or modify or update status for files that you are not working on.
- Skip files 001-003 (auto-generated)
- Keep console.error statements (production error logging)
- Do not change functionality, only clean code style
- Be thorough - check ALL clean code principles
- Update registry status to ✅ when complete

START NOW - Find the next ⬜ file and begin!
```

---

## Status Icons:

- ⬜ = Not Started (available)
- 🔄 = In Progress (being worked on)
- ✅ = Complete (finished)

## How It Works:

1. Agent reads registry
2. Finds first ⬜ file
3. Changes it to 🔄 immediately
4. Does the refactoring
5. Changes to ✅ when done
6. Next agent picks up next ⬜ file

## Parallel Execution:

- Start multiple agents simultaneously
- Each will grab the next available ⬜ file
- The 🔄 status prevents conflicts
- Safe to run 5-10 agents in parallel!
