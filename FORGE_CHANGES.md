# Forge IDE Changes from Upstream VS Code

This document tracks all modifications made to the VS Code fork for Forge IDE. This helps with periodic rebases against upstream.

## Modified Files

### 1. `product.json`
- Changed `nameShort`, `nameLong`, `applicationName` to "Forge"
- Updated bundle identifier: `darwinBundleIdentifier` to `com.ethcocoder.forge`
- Updated `reportIssueUrl` to point to Forge IDE repository
- Added `extensionsGallery` pointing to Open VSX instead of Microsoft Marketplace
- Added `forge-agent-builtin` to `builtInExtensions`

### 2. `package.json`
- Updated repository URL to `https://github.com/ethcocoder/para-ide.git`
- Updated bugs URL to point to Forge IDE issues

### 3. `build/gulpfile.extensions.ts`
- Added `'extensions/forge-agent-builtin/tsconfig.json'` to the compilations array

## New Files/Directories

### Extension: `extensions/forge-agent-builtin/`
- `package.json` - Extension manifest
- `tsconfig.json` - TypeScript configuration
- `src/extension.ts` - Main extension entry point
- `src/OpenCodeService.ts` - Service for managing OpenCode server lifecycle
- `src/AgentPanelViewProvider.ts` - Webview provider for chat interface
- `src/DiffReviewProvider.ts` - Provider for diff review workflow
- `src/PermissionBridge.ts` - Bridge for permission requests
- `media/icon.svg` - Extension icon

### Configuration: `.opencode/`
- `opencode.json` - Default OpenCode configuration with safe defaults

### Documentation: `FORGE_CHANGES.md`
- This file, tracking all changes for future rebases

## Rebase Strategy

When rebasing against upstream `microsoft/vscode`:

1. Keep all changes in `product.json` - these are purely branding
2. Keep the `extensions/forge-agent-builtin/` directory intact - it's all new code
3. Keep `.opencode/` directory intact - it's all new configuration
4. Update `build/gulpfile.extensions.ts` if the compilations array structure changes
5. Check if `package.json` repository URLs need updating (usually just a merge conflict to resolve)

## Build Instructions

```bash
# Install dependencies
npm install

# Compile the extension and main code
npm run compile

# Run the development version
./scripts/code.sh

# Build for production
npm run build
```

## Testing the Built-in Extension

1. Launch the development build: `./scripts/code.sh`
2. The Forge Agent extension should activate automatically
3. Look for the Forge Agent icon in the activity bar
4. Click to open the agent chat panel
