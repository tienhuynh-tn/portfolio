# Workflow: Git Commit

Use this workflow only when the user explicitly asks Codex to prepare or create a commit.

Source code is the final authority.

## Summary

This workflow is for preparing or creating Git commits in this personal portfolio repository. Codex must never commit or push automatically after implementation. Commit and push actions require explicit user requests.

## Before Preparing a Commit

Before preparing a commit, Codex must:

1. Run `git status --short`.
2. Review `git diff`.
3. Review `git diff --stat`.
4. Identify unrelated changes.
5. Check for untracked files.
6. Confirm that generated files, secrets, environment files, and unrelated changes are excluded.
7. Run the real verification commands from `package.json` when applicable.

Available package scripts are:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

There is no test script in `package.json`. Do not invent verification commands that do not exist in the repository.

## Commit Scope

- Keep one logical change per commit.
- Include only task-related files.
- Preserve unrelated working-tree changes.
- Do not stage with `git add .` or `git add -A` unless the user explicitly requests all current changes.
- Stage approved files explicitly.

## Commit Message Convention

Use Conventional Commits:

```text
feat:
fix:
refactor:
docs:
style:
perf:
test:
chore:
```

Use a scope when useful.

Examples:

```text
feat(projects): add project detail modal
fix(cursor): keep cat cursor visible over overlays
style(background): reduce connection line opacity
docs(kb): add git commit workflow
chore(deps): update development dependencies
```

Commit messages must:

- use imperative wording;
- be concise;
- describe the actual change;
- avoid vague messages such as `update code`, `fix issue`, or `changes`;
- not mention AI, Codex, or generated code unless explicitly required.

## Prepare Commit Workflow

When the user asks Codex to prepare a commit:

1. Inspect the full working-tree diff.
2. Identify which files belong to the current task.
3. Identify unrelated or risky changes.
4. Suggest the exact files to stage.
5. Suggest one Conventional Commit message.
6. Summarize verification results.
7. Wait for explicit user approval.

Do not stage or commit during this step.

## Create Commit Workflow

When the user explicitly approves the files and commit message:

1. Re-run `git status --short`.
2. Confirm the approved files still contain the expected changes.
3. Stage only the approved files.
4. Show the staged diff with `git diff --cached`.
5. Create the approved commit.
6. Show:
   - commit hash;
   - commit message;
   - committed files;
   - final `git status --short`.
7. Do not push.

If the staged diff contains unrelated changes, stop and report them instead of committing.

## Push Workflow

Push only when the user explicitly asks.

Before pushing:

1. Confirm the current branch.
2. Confirm the target remote and upstream branch.
3. Confirm the working tree status.
4. Show what will be pushed.

Do not force push.

## Prohibited Actions

Never perform these unless explicitly requested:

- `git push`
- force push
- amend
- rebase
- reset
- revert
- cherry-pick
- delete branches
- create or delete tags
- rewrite history
- stage unrelated files
- commit secrets or environment files
- modify Git configuration

## Safety Rules

- Do not commit `.env` files, credentials, tokens, private keys, or secrets.
- Do not remove unrelated changes.
- Do not discard local modifications.
- Do not use destructive Git commands to clean the working tree.
- Stop and ask for approval if the commit scope is ambiguous.
- Never claim a verification command passed unless it was actually run.
