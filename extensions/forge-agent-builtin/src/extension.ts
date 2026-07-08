import * as vscode from 'vscode';
import { OpenCodeService } from './OpenCodeService';
import { AgentPanelViewProvider } from './AgentPanelViewProvider';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Forge Agent extension is now active!');

    const openCodeService = new OpenCodeService();
    const provider = new AgentPanelViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(AgentPanelViewProvider.viewType, provider)
    );

    let disposable = vscode.commands.registerCommand('forge-agent.ask', () => {
        vscode.commands.executeCommand('forge-agent-chat.focus');
    });

    context.subscriptions.push(disposable);

    // Start OpenCode server
    try {
        await openCodeService.start();
        vscode.window.showInformationMessage('Forge Agent (OpenCode) is ready.');
    } catch (err) {
        vscode.window.showErrorMessage('Failed to start Forge Agent server.');
    }

    context.subscriptions.push({
        dispose: () => openCodeService.stop()
    });
}

export function deactivate() {}
