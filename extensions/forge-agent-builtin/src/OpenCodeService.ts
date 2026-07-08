import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

export class OpenCodeService {
    private _process: ChildProcess | undefined;
    private _outputChannel: vscode.OutputChannel;

    constructor() {
        this._outputChannel = vscode.window.createOutputChannel('OpenCode Server');
    }

    public async start(): Promise<void> {
        if (this._process) {
            return;
        }

        return new Promise((resolve, reject) => {
            // In a real scenario, we might bundle the opencode binary
            // For now, we assume it's installed or we use npx
            const command = 'npx';
            const args = ['opencode-ai@latest', 'serve', '--port', '4096'];

            this._outputChannel.appendLine(`Starting OpenCode server: ${command} ${args.join(' ')}`);

            this._process = spawn(command, args, {
                shell: true,
                env: { ...process.env }
            });

            this._process.stdout?.on('data', (data) => {
                const message = data.toString();
                this._outputChannel.append(message);
                if (message.includes('Server running')) {
                    resolve();
                }
            });

            this._process.stderr?.on('data', (data) => {
                this._outputChannel.append(`ERR: ${data.toString()}`);
            });

            this._process.on('error', (err) => {
                this._outputChannel.appendLine(`Failed to start OpenCode server: ${err.message}`);
                reject(err);
            });

            this._process.on('exit', (code) => {
                this._outputChannel.appendLine(`OpenCode server exited with code ${code}`);
                this._process = undefined;
            });

            // Fallback resolve if we don't see the specific message but it seems to be running
            setTimeout(resolve, 5000);
        });
    }

    public stop(): void {
        if (this._process) {
            this._process.kill();
            this._process = undefined;
        }
    }
}
