import * as vscode from 'vscode';

export class ConfigService {
    private config: vscode.WorkspaceConfiguration;
    private static instance: ConfigService;

    private constructor() {
        this.config = vscode.workspace.getConfiguration('conventional-commit-ai');
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    /**
     * Refresca la configuración
     */
    public refreshConfig(): void {
        this.config = vscode.workspace.getConfiguration('conventional-commit-ai');
    }

    /**
     * Obtiene la API key de OpenAI
     */
    public getOpenAIKey(): string | null {
        return this.config.get<string>('openAiApiKey') || null;
    }

    /**
     * Obtiene el modelo de OpenAI
     */
    public getOpenAIModel(): string {
        return this.config.get<string>('openAiModel') || 'gpt-4-turbo-preview';
    }

    /**
     * Obtiene la temperatura para OpenAI
     */
    public getOpenAITemperature(): number {
        return this.config.get<number>('openAiTemperature') || 0.7;
    }

    /**
     * Obtiene el máximo de tokens para OpenAI
     */
    public getOpenAIMaxTokens(): number {
        return this.config.get<number>('openAiMaxToken') || 1000;
    }

    /**
     * Obtiene el prompt personalizado
     */
    public getCustomPrompt(): string {
        return this.config.get<string>('customPrompt') || '';
    }

    /**
     * Actualiza la API key de OpenAI
     */
    public async updateOpenAIKey(apiKey: string | null): Promise<void> {
        await this.config.update('openAiApiKey', apiKey, true);
        this.refreshConfig();
    }

    /**
     * Actualiza el modelo de OpenAI
     */
    public async updateOpenAIModel(model: string): Promise<void> {
        await this.config.update('openAiModel', model, true);
        this.refreshConfig();
    }

    /**
     * Actualiza la temperatura de OpenAI
     */
    public async updateOpenAITemperature(temperature: number): Promise<void> {
        await this.config.update('openAiTemperature', temperature, true);
        this.refreshConfig();
    }

    /**
     * Actualiza el máximo de tokens de OpenAI
     */
    public async updateOpenAIMaxTokens(maxTokens: number): Promise<void> {
        await this.config.update('openAiMaxToken', maxTokens, true);
        this.refreshConfig();
    }

    /**
     * Actualiza el prompt personalizado
     */
    public async updateCustomPrompt(prompt: string): Promise<void> {
        await this.config.update('customPrompt', prompt, true);
        this.refreshConfig();
    }
} 