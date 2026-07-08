import * as vscode from 'vscode';

export interface PermissionRequest {
    id: string;
    type: 'bash' | 'edit' | 'fetch' | string;
    description: string;
    command?: string;
}

export class PermissionBridge {
    public async requestPermission(request: PermissionRequest): Promise<'allow' | 'deny'> {
        const message = `Permission request: ${request.description}`;
        const detail = request.command ? `Command: ${request.command}` : undefined;

        const choice = await vscode.window.showInformationMessage(
            message,
            { detail, modal: true },
            'Allow',
            'Deny'
        );

        return choice === 'Allow' ? 'allow' : 'deny';
    }

    public async requestMultiplePermissions(requests: PermissionRequest[]): Promise<Map<string, 'allow' | 'deny'>> {
        const results = new Map<string, 'allow' | 'deny'>();

        for (const request of requests) {
            const result = await this.requestPermission(request);
            results.set(request.id, result);
        }

        return results;
    }
}
