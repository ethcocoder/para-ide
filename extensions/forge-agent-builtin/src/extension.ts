import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Forge Agent extension is now active!');

	let disposable = vscode.commands.registerCommand('forge-agent.ask', () => {
		vscode.window.showInformationMessage('Hello from Forge Agent!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
