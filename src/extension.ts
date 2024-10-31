import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Conventional Commit AI is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('conventiona-commit-ai.setOpenAiKey', () => {
		vscode.window.showInformationMessage('OpenAI Key set!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('conventiona-commit-ai.commit', () => {	
		vscode.window.showInformationMessage('Commit created!');
	}));
}
