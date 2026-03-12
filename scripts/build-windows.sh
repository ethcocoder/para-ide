#!/bin/bash

# Build script for Windows executable
# This script builds Forge IDE for Windows

set -e

echo "========================================="
echo "Forge IDE - Windows Build"
echo "========================================="

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

# Clean previous builds
echo ""
echo "Cleaning previous builds..."
rm -rf .build out

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Compile the project
echo ""
echo "Compiling TypeScript..."
npm run compile

# Build for Windows
echo ""
echo "Building Windows executable..."
npm run gulp -- vscode-win32-x64-archive

# Check if build was successful
if [ -d ".build/win32-x64-archive" ]; then
    echo ""
    echo "========================================="
    echo "✓ Build successful!"
    echo "========================================="
    echo ""
    echo "Output location: .build/win32-x64-archive"
    echo ""
    echo "To create an installer, you can use:"
    echo "  - Inno Setup (recommended for Windows)"
    echo "  - NSIS"
    echo "  - WiX Toolset"
    echo ""
    echo "The archive contains the portable executable."
else
    echo ""
    echo "========================================="
    echo "✗ Build failed"
    echo "========================================="
    exit 1
fi
