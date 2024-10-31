import * as vscode from 'vscode';
import { CommitService } from './services/commitService';
import { ConfigService } from './services/configService';
import { LogService } from './services/logService';

export function activate(context: vscode.ExtensionContext) {
	const logService = LogService.getInstance();
	logService.info('Conventional Commit AI is now active!');

	const commitService = CommitService.getInstance();
	const configService = ConfigService.getInstance();

	// Comando para establecer la API key
	context.subscriptions.push(
		vscode.commands.registerCommand('conventiona-commit-ai.setOpenAiKey', async () => {
			const apiKey = await vscode.window.showInputBox({
				prompt: 'Ingresa tu API key de OpenAI'
			});

			if (apiKey) {
				await configService.updateOpenAIKey(apiKey);
				vscode.window.showInformationMessage('OpenAI Key configurada exitosamente');
			}
		})
	);

	// Comando para eliminar la API key
	context.subscriptions.push(
		vscode.commands.registerCommand('conventiona-commit-ai.deleteOpenAiKey', async () => {
			await configService.updateOpenAIKey(null);
			vscode.window.showInformationMessage('OpenAI Key eliminada exitosamente');
		})
	);

	// Comando para generar el mensaje de commit
	context.subscriptions.push(
		vscode.commands.registerCommand('conventiona-commit-ai.generateCommit', async () => {
			if (!configService.getOpenAIKey()) {
				const result = await vscode.window.showErrorMessage(
					'No se ha configurado la API key de OpenAI',
					'Configurar ahora'
				);

				if (result === 'Configurar ahora') {
					await vscode.commands.executeCommand('conventiona-commit-ai.setOpenAiKey');
				}
				return;
			}

			await commitService.generateAndSetCommitMessage();
		})
	);
}
