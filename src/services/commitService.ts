import * as vscode from 'vscode';
import { GitService } from './gitService';
import { OpenAIService } from './openAiService';

export class CommitService {
    private static instance: CommitService;
    private gitService: GitService;
    private openAiService: OpenAIService;

    private constructor() {
        this.gitService = new GitService();
        this.openAiService = new OpenAIService();
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
            // Obtener los cambios staged
            const diff = await this.gitService.getStagedDiff();
            
            if (!diff) {
                return; // El mensaje de error ya se muestra en getStagedDiff
            }

            // Generar el mensaje con OpenAI
            const commitMessage = await this.openAiService.generateCommitMessage(diff);

            // Obtener el repositorio git de VS Code
            const repository = this.gitService.getRepository();
            if (!repository) {
                throw new Error('No se pudo acceder al repositorio Git');
            }

            // Establecer el mensaje en la UI de Git
            await this.setCommitMessage(repository, commitMessage);

            vscode.window.showInformationMessage('Mensaje de commit generado exitosamente');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            vscode.window.showErrorMessage(`Error al generar el mensaje de commit: ${errorMessage}`);
        }
    }

    /**
     * Establece el mensaje de commit en la UI de Git
     */
    private async setCommitMessage(repository: any, message: string): Promise<void> {
        if ('inputBox' in repository) {
            (repository as any).inputBox.value = message;
        } else {
            throw new Error('No se pudo acceder al input box del repositorio');
        }
    }
} 