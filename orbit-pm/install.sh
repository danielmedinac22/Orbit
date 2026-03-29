#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${1:-$(pwd)}"

echo "Installing Orbit into: $DEST"
echo ""

# ─────────────────────────────────────────────────────────
# Section 1: Create destination directories
# ─────────────────────────────────────────────────────────
mkdir -p "$DEST/.claude/agents"
mkdir -p "$DEST/.claude/skills"

# ─────────────────────────────────────────────────────────
# Section 2: Copy agents (ask before overwriting)
# ─────────────────────────────────────────────────────────
echo "Installing agents..."
for src_agent in "$SCRIPT_DIR/.claude/agents/"*.md; do
    [ -f "$src_agent" ] || continue
    agent_name=$(basename "$src_agent")
    dest_agent="$DEST/.claude/agents/$agent_name"
    if [ -f "$dest_agent" ]; then
        read -r -p "Orbit agent already exists: $agent_name. Overwrite? [y/N] " response || response=""
        case "$response" in
            [yY][eE][sS]|[yY])
                cp "$src_agent" "$dest_agent"
                echo "  Updated: $agent_name"
                ;;
            *)
                echo "  Skipping: $agent_name"
                ;;
        esac
    else
        cp "$src_agent" "$dest_agent"
        echo "  Installed: $agent_name"
    fi
done

# ─────────────────────────────────────────────────────────
# Section 3: Copy skills (ask before overwriting per skill directory)
# ─────────────────────────────────────────────────────────
echo "Installing skills..."
for src_skill_dir in "$SCRIPT_DIR/.claude/skills"/*/; do
    [ -d "$src_skill_dir" ] || continue
    skill_name=$(basename "$src_skill_dir")
    dest_skill_dir="$DEST/.claude/skills/$skill_name"
    if [ -d "$dest_skill_dir" ]; then
        read -r -p "Skill '$skill_name' already exists. Overwrite? [y/N] " response || response=""
        case "$response" in
            [yY][eE][sS]|[yY])
                rm -rf "$dest_skill_dir"
                cp -r "${src_skill_dir%/}" "$DEST/.claude/skills/"
                echo "  Updated skill: $skill_name"
                ;;
            *)
                echo "  Skipping skill: $skill_name"
                ;;
        esac
    else
        cp -r "${src_skill_dir%/}" "$DEST/.claude/skills/"
        echo "  Installed skill: $skill_name"
    fi
done

# ─────────────────────────────────────────────────────────
# Section 4: Merge settings.json hooks (python3, idempotent)
# ─────────────────────────────────────────────────────────
echo "Merging settings.json..."
ORBIT_SETTINGS="$SCRIPT_DIR/.claude/settings.json"
DEST_SETTINGS="$DEST/.claude/settings.json"

if [ ! -f "$DEST_SETTINGS" ]; then
    cp "$ORBIT_SETTINGS" "$DEST_SETTINGS"
    echo "  Copied settings.json (no existing file found)"
else
    python3 - "$DEST_SETTINGS" "$ORBIT_SETTINGS" <<'PYEOF'
import json, sys

dest_path = sys.argv[1]
orbit_path = sys.argv[2]

with open(dest_path) as f:
    existing = json.load(f)
with open(orbit_path) as f:
    orbit = json.load(f)

existing.setdefault('hooks', {})
for event, hook_entries in orbit.get('hooks', {}).items():
    existing['hooks'].setdefault(event, [])
    for hook_entry in hook_entries:
        # Deduplicate by command string
        new_commands = set(h.get('command', '') for h in hook_entry.get('hooks', []))
        already_present = False
        for existing_entry in existing['hooks'][event]:
            existing_commands = set(h.get('command', '') for h in existing_entry.get('hooks', []))
            if new_commands & existing_commands:
                already_present = True
                break
        if not already_present:
            existing['hooks'][event].append(hook_entry)

with open(dest_path, 'w') as f:
    json.dump(existing, f, indent=2)
    f.write('\n')
PYEOF
    echo "  Merged hooks into existing settings.json"
fi

# ─────────────────────────────────────────────────────────
# Section 5: Append CLAUDE.md (idempotent)
# ─────────────────────────────────────────────────────────
echo "Updating CLAUDE.md..."
ORBIT_CLAUDE_MD="$SCRIPT_DIR/CLAUDE.md"
DEST_CLAUDE_MD="$DEST/CLAUDE.md"
ORBIT_MARKER="# Orbit — Context Copilot for Product Managers"

if ! grep -qF "$ORBIT_MARKER" "$DEST_CLAUDE_MD" 2>/dev/null; then
    cat "$ORBIT_CLAUDE_MD" >> "$DEST_CLAUDE_MD"
    echo "  Appended Orbit instructions to CLAUDE.md"
else
    echo "  CLAUDE.md already contains Orbit instructions — skipping"
fi

# ─────────────────────────────────────────────────────────
# Section 6: Copy templates (ask before overwriting)
# ─────────────────────────────────────────────────────────
echo "Installing templates..."
ORBIT_TEMPLATES="$SCRIPT_DIR/templates"
DEST_TEMPLATES="$DEST/templates"

if [ -d "$DEST_TEMPLATES" ]; then
    for src_template in "$ORBIT_TEMPLATES/"*.md; do
        [ -f "$src_template" ] || continue
        template_name=$(basename "$src_template")
        dest_template="$DEST_TEMPLATES/$template_name"
        if [ -f "$dest_template" ]; then
            read -r -p "Template '$template_name' already exists. Overwrite? [y/N] " response || response=""
            case "$response" in
                [yY][eE][sS]|[yY])
                    cp "$src_template" "$dest_template"
                    echo "  Updated template: $template_name"
                    ;;
                *)
                    echo "  Skipping template: $template_name"
                    ;;
            esac
        else
            cp "$src_template" "$dest_template"
            echo "  Installed template: $template_name"
        fi
    done
else
    cp -r "$ORBIT_TEMPLATES" "$DEST/"
    echo "  Installed templates/"
fi

# ─────────────────────────────────────────────────────────
# Section 7: Success message
# ─────────────────────────────────────────────────────────
echo ""
echo "Orbit installed successfully."
echo ""
echo "Run /orbit-init to set up your workspace."
