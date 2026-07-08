import * as vscode from 'vscode';

export class AgentPanelViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'forge-agent-chat';
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'ask':
                    vscode.window.showInformationMessage(`Agent received: ${data.value}`);
                    // Here we would call the OpenCode SDK
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Forge Agent Chat</title>
                <style>
                    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 10px; }
                    #chat { height: calc(100vh - 100px); overflow-y: auto; border: 1px solid var(--vscode-panel-border); margin-bottom: 10px; padding: 5px; }
                    #input-container { display: flex; gap: 5px; }
                    input { flex-grow: 1; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 5px; }
                    button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 5px 10px; cursor: pointer; }
                    button:hover { background: var(--vscode-button-hoverBackground); }
                </style>
            </head>
            <body>
                <div id="chat">
                    <div class="message">Welcome to Forge IDE. How can I help you today?</div>
                </div>
                <div id="input-container">
                    <input type="text" id="prompt" placeholder="Ask anything...">
                    <button id="send">Send</button>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    const promptInput = document.getElementById('prompt');
                    const sendButton = document.getElementById('send');
                    const chatDiv = document.getElementById('chat');

                    sendButton.addEventListener('click', () => {
                        const value = promptInput.value;
                        if (value) {
                            appendMessage('User', value);
                            vscode.postMessage({ type: 'ask', value });
                            promptInput.value = '';
                        }
                    });

                    promptInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            sendButton.click();
                        }
                    });

                    function appendMessage(role, text) {
                        const div = document.createElement('div');
                        div.className = 'message';
                        div.innerHTML = '<strong>' + role + ':</strong> ' + text;
                        chatDiv.appendChild(div);
                        chatDiv.scrollTop = chatDiv.scrollHeight;
                    }
                </script>
            </body>
            </html>`;
    }
}
