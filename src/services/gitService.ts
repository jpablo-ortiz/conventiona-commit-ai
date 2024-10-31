import * as vscode from 'vscode';

export class GitService {
    private repository;

    constructor() {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!gitExtension) {
            return;
        }

        const git = gitExtension.exports;
        if (!git) {
            return;
        }

        const api = git.getAPI(1);
        if (!api || !api.repositories.length) {
            return;
        }

        this.repository = api.repositories[0];
    }

    /**
     * Obtiene los archivos que están en estado staged.
     */
    async getStagedDiff(): Promise<string | null> {
        if (!this.repository) {
            vscode.window.showErrorMessage('No se encontró un repositorio Git');
            return null;
        }

        const diffChanges = await this.repository.diff(true);
        if (!diffChanges) {
            vscode.window.showErrorMessage('No hay cambios staged para hacer commit');
            return null;
        }

        return diffChanges;
    }

    /**
     * Obtiene el repositorio actual
     */
    getRepository() {
        return this.repository;
    }
}

