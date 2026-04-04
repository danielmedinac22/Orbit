# Contributing to Orbit

Thanks for your interest in contributing to Orbit! This guide will help you get started.

## Quick Start

1. Fork the repo and clone it
2. Run `bash install.sh .` to install Orbit into your workspace
3. Run `/orbit-init` in Claude Code to set up your `.orbit/` directory
4. For the dashboard: `cd dashboard && npm install && npm run dev`

## What You Can Contribute

### Good first contributions
- Improve documentation or translations
- Add new artifact templates in `templates/`
- Fix bugs in existing skills
- Improve the dashboard UI/UX

### Bigger contributions
- New MCP integrations (Notion, Linear, Google Docs, etc.)
- New Orbit skills
- Dashboard features
- Agent improvements (Astro, Engin)

## Project Structure

```
Orbit/
├── .claude/
│   ├── agents/          # Astro and Engin agent definitions
│   ├── skills/          # Claude Code skill definitions
│   ├── hooks/           # Post-write hooks and statusline
│   └── settings.json    # Permissions and hooks config
├── dashboard/           # Local web dashboard (Vite + React + Express)
├── templates/           # PM artifact templates
├── CLAUDE.md            # Orbit framework instructions
├── install.sh           # Installation script
└── VERSION              # Current version
```

## How to Add a New Skill

1. Create a directory: `.claude/skills/orbit-your-skill/`
2. Add a `SKILL.md` file with frontmatter:
   ```yaml
   ---
   name: orbit-your-skill
   description: What it does in one line.
   user_invocable: true
   ---
   ```
3. Write the skill instructions in Markdown
4. Add the skill name to the skills list in `CLAUDE.md`
5. Test it by running `/orbit-your-skill` in Claude Code

## How to Add an Artifact Template

1. Create a new `.md` file in `templates/`
2. Use YAML frontmatter with `template:`, `version:`, `description:`
3. Use `{placeholder}` syntax for dynamic fields
4. Add the template name to the `/orbit-artifact` skill's template list

## Development Guidelines

- **Keep it simple.** Orbit is intentionally lightweight — no databases, no build pipelines for the core, just Markdown and Claude Code skills.
- **Preserve the space theme.** Notes are "signals", themes are "constellations", action items are "missions", decisions are "coordinates".
- **Notes are sacred.** Never modify note content body. Only Astro updates the `themes:` field in frontmatter.
- **Cite sources.** All factual claims must reference the source note: `(from Meeting Title, YYYY-MM-DD)`.
- **Support multiple languages.** Orbit responds in the user's language. Don't hardcode strings in English.
- **Test with real data.** Run `/orbit-ingest` with actual meeting notes and verify the full pipeline works.

## Commit Messages

Follow conventional commits:

```
feat: add Notion MCP integration
fix: correct date parsing in action items
docs: update README with dashboard instructions
chore: bump dependencies
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test the full workflow (ingest → organize → query)
4. Open a PR with a clear description of what changed and why
5. Include screenshots for UI changes

## Reporting Issues

- Use the [GitHub Issues](https://github.com/danielmedinac22/Orbit/issues) page
- Include your Claude Code version and OS
- For bugs: steps to reproduce, expected vs actual behavior
- For features: describe the use case and who benefits

## Code of Conduct

Be kind, be respectful, be constructive. We're building tools for PMs who are already stressed enough. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
