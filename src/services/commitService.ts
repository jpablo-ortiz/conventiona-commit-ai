import * as vscode from 'vscode';
import { GitService } from './gitService';
import { OpenAIService } from './openAiService';
import { LogService } from './logService';

export class CommitService {
    private static instance: CommitService;
    private gitService: GitService;
    private openAiService: OpenAIService;
    private logService: LogService;

    private constructor() {
        this.gitService = new GitService();
        this.openAiService = new OpenAIService();
        this.logService = LogService.getInstance();
    }

    public static getInstance(): CommitService {
        if (!CommitService.instance) {
            CommitService.instance = new CommitService();
        }
        return CommitService.instance;
    }

    /**
     * Genera y establece el mensaje de commit en la UI de Git
     */
    public async generateAndSetCommitMessage(): Promise<void> {
        try {
            await this.logService.withProgress('Generando mensaje de commit', async (progress) => {
                this.logService.info('Iniciando generación de mensaje de commit');
                progress.report({ increment: 0 });

                // Obtener los cambios staged
                const diff = await this.gitService.getStagedDiff();
                if (!diff) {
                    this.logService.info('No hay cambios staged para generar el mensaje de commit');
                    return;
                }
                progress.report({ increment: 30, message: 'Cambios obtenidos' });

                // Generar el mensaje con OpenAI
                this.logService.info('Generando mensaje con OpenAI');
                const commitMessage = await this.openAiService.generateCommitMessage(diff);
                progress.report({ increment: 60, message: 'Mensaje generado' });

                // Obtener el repositorio git de VS Code
                const repository = this.gitService.getRepository();
                if (!repository) {
                    throw new Error('No se pudo acceder al repositorio Git');
                }

                // Establecer el mensaje en la UI de Git
                await this.setCommitMessage(repository, commitMessage);
                progress.report({ increment: 100, message: 'Mensaje establecido' });

                this.logService.info('Mensaje de commit generado y establecido exitosamente');
                vscode.window.showInformationMessage('Mensaje de commit generado exitosamente');
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.logService.error('Error al generar el mensaje de commit', error);
            vscode.window.showErrorMessage(`Error al generar el mensaje de commit: ${errorMessage}`);
        }
    }

    /**
     * Establece el mensaje de commit en la UI de Git
     */
    private async setCommitMessage(repository: any, message: string): Promise<void> {
        if ('inputBox' in repository) {
            (repository as any).inputBox.value = message;
            this.logService.debug(`Mensaje establecido: ${message}`);
        } else {
            throw new Error('No se pudo acceder al input box del repositorio');
        }
    }
} 