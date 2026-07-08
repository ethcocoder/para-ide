# Forge IDE

A custom agentic IDE built on a fork of VS Code with OpenCode integrated as the built-in AI agent.

## Features

- **Rebranded VS Code** - Familiar editor experience with Forge branding
- **Built-in AI Agent** - OpenCode integrated by default, no setup required
- **Review Workflow** - All agent edits go through a review process before applying
- **Multi-model Support** - Works with any model supported by OpenCode (Claude, GPT, etc.)
- **Local-first** - Agent runs locally on your machine

## Quick Start

### Prerequisites

- Node.js 22.x or later
- npm or pnpm
- Python 3.x (for some build scripts)

### Development Build

```bash
# Clone and setup
git clone https://github.com/ethcocoder/para-ide.git
cd para-ide
npm install

# Compile everything
npm run compile

# Run the development version
./scripts/code.sh  # macOS/Linux
# or
.\scripts\code.bat  # Windows
```

### Production Build

```bash
# Build for your platform
npm run build

# The output will be in .build/
```

## Architecture

### Core Components

1. **Forge Agent Extension** (`extensions/forge-agent-builtin/`)
   - OpenCodeService: Manages the OpenCode server process
   - AgentPanelViewProvider: Chat interface webview
   - DiffReviewProvider: Diff review workflow
   - PermissionBridge: Permission request handling

2. **Configuration** (`.opencode/opencode.json`)
   - Default agent settings
   - Permission rules
   - Model configuration

3. **Branding** (`product.json`)
   - Application name and identifiers
   - Extension gallery (Open VSX)
   - Built-in extensions list

## Development

### Project Structure

```
forge-ide/
├── src/                              # VS Code core source
├── extensions/
│   └── forge-agent-builtin/          # Built-in Forge agent extension
├── build/                            # Build scripts
├── product.json                      # Branding and configuration
├── FORGE_CHANGES.md                  # Track of all modifications
└── FORGE_README.md                   # This file
```

### Building for Windows

```bash
# Install Windows-specific dependencies
npm install

# Compile
npm run compile

# Build Windows installer
npm run build -- --win

# Output: .build/Forge IDE Setup x.y.z.exe
```

### Building for macOS

```bash
# Compile
npm run compile

# Build macOS app
npm run build -- --mac

# Output: .build/Forge IDE-x.y.z.dmg
```

### Building for Linux

```bash
# Compile
npm run compile

# Build Linux packages
npm run build -- --linux

# Output: .build/forge-ide-x.y.z.tar.gz (and .deb, .rpm if configured)
```

## Configuration

### OpenCode Configuration

Edit `.opencode/opencode.json` to customize:

- **Permissions**: Control what the agent can do (edit, bash, etc.)
- **Agents**: Define different agent modes (build, plan, custom)
- **Models**: Set default models for each agent

Example:

```json
{
  "permissions": {
    "edit": "ask",
    "bash": "ask",
    "bash_rm *": "deny"
  },
  "agents": {
    "build": { "model": "anthropic/claude-sonnet-5" },
    "plan": { "model": "anthropic/claude-sonnet-5" }
  }
}
```

### IDE Settings

In VS Code settings, you can configure:

- `forge.autonomyLevel`: "manual" | "checkpoint" | "full-auto" (default: "checkpoint")
- `forge.defaultModel`: Default model to use (empty = use opencode.json default)

## Troubleshooting

### OpenCode Server Won't Start

1. Check if OpenCode is installed: `npm list -g opencode-ai`
2. Install if missing: `npm install -g opencode-ai@latest`
3. Test manually: `opencode serve --port 4096`

### Extension Not Loading

1. Check the Output panel (View → Output) for errors
2. Look for "Forge Agent" in the Extensions view
3. Restart the IDE: Cmd+Shift+P → "Developer: Reload Window"

### Build Fails

1. Clean build: `npm run clean` (if available) or `rm -rf out .build`
2. Reinstall: `rm -rf node_modules && npm install`
3. Check Node version: `node -v` (should be 22.x)

## Rebranding

To rebrand this fork for your own use:

1. Edit `product.json`:
   - Change `nameShort`, `nameLong`, `applicationName`
   - Update `darwinBundleIdentifier` to your own domain
   - Update `reportIssueUrl` to your repository

2. Update branding assets in `resources/`

3. See `FORGE_CHANGES.md` for a complete list of modified files

## Contributing

This is a fork of VS Code with Forge-specific modifications. When contributing:

1. Keep changes isolated to Forge-specific files (see `FORGE_CHANGES.md`)
2. Don't modify upstream VS Code files unless absolutely necessary
3. Document any new changes in `FORGE_CHANGES.md`

## Upstream Rebase

To pull in the latest VS Code security fixes:

```bash
git fetch upstream
git rebase upstream/main

# Resolve any conflicts in the files listed in FORGE_CHANGES.md
# Test thoroughly before pushing
```

## License

Forge IDE is licensed under the MIT License, same as VS Code.

## Support

For issues and feature requests, visit: https://github.com/ethcocoder/para-ide/issues

## References

- [VS Code Repository](https://github.com/microsoft/vscode)
- [OpenCode Documentation](https://opencode.ai)
- [VS Code Extension API](https://code.visualstudio.com/api)
