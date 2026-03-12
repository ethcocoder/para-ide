# Forge IDE Build Guide

This guide explains how to build Forge IDE for different platforms and create distributable packages.

## Prerequisites

### All Platforms

- **Node.js**: 22.x or later (https://nodejs.org/)
- **npm**: 10.x or later (comes with Node.js)
- **Git**: For cloning and version control
- **Python**: 3.x (for some build scripts)

### Windows-Specific

- **Visual Studio Build Tools** (optional, for native modules)
- **Inno Setup** (optional, for creating .exe installer)

### macOS-Specific

- **Xcode Command Line Tools**: `xcode-select --install`
- **Apple Developer ID** (optional, for code signing)

### Linux-Specific

- **build-essential**: `sudo apt-get install build-essential`
- **libx11-dev**: `sudo apt-get install libx11-dev`

## Quick Start

```bash
# Clone the repository
git clone https://github.com/ethcocoder/para-ide.git
cd para-ide

# Install dependencies
npm install

# Compile
npm run compile

# Run development version
./scripts/code.sh  # macOS/Linux
# or
.\scripts\code.bat  # Windows
```

## Building for Windows

### Option 1: Portable Executable (Recommended for Testing)

```bash
# From the repository root
npm install
npm run compile

# Build portable archive
npm run gulp -- vscode-win32-x64-archive

# Output: .build/win32-x64-archive/
# Contains: Forge IDE.exe and supporting files
```

### Option 2: Windows Installer (.exe)

```bash
# Install Inno Setup from: https://jrsoftware.org/isdl.php

# Build the installer
npm run gulp -- vscode-win32-x64-inno-setup

# Output: .build/win32-x64-inno/Forge IDE Setup x.y.z.exe
```

### Option 3: MSI Installer

```bash
# Requires WiX Toolset: https://wixtoolset.org/

npm run gulp -- vscode-win32-x64-msi

# Output: .build/win32-x64-msi/Forge IDE-x.y.z.msi
```

## Building for macOS

### Intel (x64)

```bash
npm install
npm run compile
npm run gulp -- vscode-darwin-x64-archive

# Output: .build/darwin-x64-archive/Forge IDE-x.y.z.dmg
```

### Apple Silicon (ARM64)

```bash
npm install
npm run compile
npm run gulp -- vscode-darwin-arm64-archive

# Output: .build/darwin-arm64-archive/Forge IDE-x.y.z.dmg
```

### Universal (Intel + Apple Silicon)

```bash
npm install
npm run compile
npm run gulp -- vscode-darwin-universal-archive

# Output: .build/darwin-universal-archive/Forge IDE-x.y.z.dmg
```

## Building for Linux

### Debian/Ubuntu (.deb)

```bash
npm install
npm run compile
npm run gulp -- vscode-linux-x64-deb

# Output: .build/linux-x64-deb/forge-ide-x.y.z.deb
```

### RPM (.rpm)

```bash
npm install
npm run compile
npm run gulp -- vscode-linux-x64-rpm

# Output: .build/linux-x64-rpm/forge-ide-x.y.z.rpm
```

### Portable Archive (.tar.gz)

```bash
npm install
npm run compile
npm run gulp -- vscode-linux-x64-archive

# Output: .build/linux-x64-archive/forge-ide-x.y.z.tar.gz
```

## Build Customization

### Changing Application Name

Edit `product.json`:

```json
{
  "nameShort": "YourName",
  "nameLong": "Your Application Name",
  "applicationName": "yourname"
}
```

### Changing Extension Gallery

Edit `product.json`:

```json
{
  "extensionsGallery": {
    "serviceUrl": "https://your-registry.com/vscode/gallery",
    "itemUrl": "https://your-registry.com/vscode/item"
  }
}
```

### Changing Icons

Replace files in `resources/`:

- `resources/win32/code.ico` - Windows icon
- `resources/darwin/code.icns` - macOS icon
- `resources/linux/code.png` - Linux icon

## Troubleshooting

### Build Fails with "Cannot find module"

```bash
# Clean and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
```

### Out of Memory During Build

```bash
# Increase Node's memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run compile
```

### Python Not Found

```bash
# Install Python 3
# macOS: brew install python3
# Ubuntu: sudo apt-get install python3
# Windows: https://www.python.org/downloads/
```

### Git LFS Issues

```bash
# Install Git LFS if needed
git lfs install
git lfs pull
```

## Testing the Build

### Windows

1. Extract or run the installer
2. Launch `Forge IDE.exe`
3. Wait for OpenCode server to start (check Output panel)
4. Click the Forge Agent icon in the activity bar
5. Test by typing a message in the chat panel

### macOS

```bash
# Mount the DMG
open .build/darwin-x64-archive/Forge\ IDE-x.y.z.dmg

# Drag Forge IDE to Applications
# Launch from Applications
```

### Linux

```bash
# Install from .deb
sudo dpkg -i .build/linux-x64-deb/forge-ide-x.y.z.deb
forge-ide

# Or extract and run from archive
tar xzf .build/linux-x64-archive/forge-ide-x.y.z.tar.gz
./forge-ide/bin/forge-ide
```

## Code Signing (Optional but Recommended)

### Windows Code Signing

```bash
# Requires a code signing certificate
# Edit build/win/sign.json with your certificate details
npm run gulp -- vscode-win32-x64-archive --sign
```

### macOS Code Signing

```bash
# Requires Apple Developer ID
export CODESIGN_IDENTITY="Developer ID Application: Your Name (XXXXXXXXXX)"
npm run gulp -- vscode-darwin-x64-archive
```

## Creating a Release

```bash
# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"

# Build all platforms
npm run compile
npm run gulp -- vscode-win32-x64-archive
npm run gulp -- vscode-darwin-x64-archive
npm run gulp -- vscode-linux-x64-archive

# Artifacts are in .build/
```

## Continuous Integration

For GitHub Actions, configure workflows to build on push/PR.

Example workflow:

```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '22'
      - run: npm install
      - run: npm run compile
      - run: npm run gulp -- vscode-win32-x64-archive
```

## Performance Tips

1. **Use SSD**: Builds are I/O intensive
2. **Close other apps**: Reduces memory contention
3. **Increase swap**: On low-memory systems
4. **Use npm ci**: Instead of npm install for CI/CD

## Getting Help

- **Issues**: https://github.com/ethcocoder/para-ide/issues
- **VS Code Build**: https://github.com/microsoft/vscode/wiki/How-to-Contribute
- **OpenCode**: https://opencode.ai

## Next Steps

After building:

1. Test the application thoroughly
2. Create release notes
3. Upload to your distribution platform
4. Update documentation
5. Announce the release
