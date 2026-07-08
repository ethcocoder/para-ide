import * as vscode from 'vscode';

export interface FileEditProposal {
    filePath: string;
    originalContent: string;
    proposedContent: string;
    description?: string;
}

export class DiffReviewProvider {
    private _tempScheme = 'forge-proposed';

    constructor() {
        vscode.workspace.registerTextDocumentContentProvider(
            this._tempScheme,
            new ProposedContentProvider()
        );
    }

    public async reviewEdit(proposal: FileEditProposal): Promise<'accept' | 'reject' | 'cancel'> {
        const fileUri = vscode.Uri.file(proposal.filePath);
        const proposedUri = vscode.Uri.parse(`${this._tempScheme}:${proposal.filePath}`);

        // Store the proposed content temporarily
        ProposedContentProvider.setContent(proposedUri.toString(), proposal.proposedContent);

        try {
            // Open diff view
            await vscode.commands.executeCommand(
                'vscode.diff',
                fileUri,
                proposedUri,
                `Proposed changes: ${proposal.description || proposal.filePath}`
            );

            // Show quick pick for user decision
            const choice = await vscode.window.showQuickPick(
                ['Accept', 'Reject', 'Cancel'],
                { placeHolder: 'Review the diff and choose an action' }
            );

            return (choice?.toLowerCase() as 'accept' | 'reject' | 'cancel') || 'cancel';
        } finally {
            ProposedContentProvider.clearContent(proposedUri.toString());
        }
    }
}

class ProposedContentProvider implements vscode.TextDocumentContentProvider {
    private static _contents = new Map<string, string>();

    static setContent(uri: string, content: string): void {
        this._contents.set(uri, content);
    }

    static clearContent(uri: string): void {
        this._contents.delete(uri);
    }

    provideTextDocumentContent(uri: vscode.Uri): string {
        return ProposedContentProvider._contents.get(uri.toString()) || '';
    }
}
