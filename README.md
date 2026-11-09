# BrowserUtility

A Playwright browser for Claude Code, packaged as a skill.

- **`bin/pw`** (`bin/pw.cmd` on Windows shells) wraps Microsoft's [`@playwright/cli`](https://github.com/microsoft/playwright-cli). It gives you a live, named browser session that you drive one command at a time (`open`, `snapshot`, `click`, `fill`, `screenshot`, `console`, `requests`, …). It's pinned to the repo's bundled Chromium, and its output goes to `.out/`.
- **`bin/run.mjs`** is a one-shot script runner. A script default-exports `async ({ page, context, browser, playwright, args, out }) => result`. The runner launches the browser, runs the script, prints the result as JSON and closes the browser. Scripts don't import Playwright, so they can live anywhere.
- **`skills/browser/`** is the Claude Code skill. It explains when to use each tool and includes Microsoft's official `playwright-cli` docs in `reference/`.

## Setup

```bash
npm run setup          # npm ci + download the CLI's Chromium build + sync reference docs
npm run install-skill  # junction skills/browser -> ~/.claude/skills/browser
npm run smoke          # end-to-end check via run.mjs
```

Requires Node 18+. The skill's paths assume the repo lives at `D:/BrowserUtility`.

## Upgrading Playwright

`playwright` is pinned to the exact version `@playwright/cli` depends on, so only one Playwright install and one Chromium build are needed. To upgrade:

```bash
npm view @playwright/cli dependencies   # find its playwright version
npm install --save-exact @playwright/cli@<new> playwright@<matching>
npm run setup
```

## Prior art

- [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli): the official agent CLI and skill. The `pw` tool here builds on it.
- [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill): a skill where the agent writes Playwright scripts and runs them through `run.js`. It inspired `run.mjs`.
- [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp): an MCP server for the same features. The CLI and skill approach uses fewer tokens, because snapshots are saved to files instead of being included in every response.
