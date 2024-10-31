import * as vscode from 'vscode';
import { DEFAULT_SYSTEM_PROMPT } from './constants';

export class ConfigService {
    private static instance: ConfigService;
    
    public get config() : vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('conventional-commit-ai');
    }
    

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
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
    public getCustomSystemPrompt(): string {
        return this.config.get<string>('customSystemPrompt') || DEFAULT_SYSTEM_PROMPT;
    }

    /**
     * Actualiza la API key de OpenAI
     */
    public async updateOpenAIKey(apiKey: string | null): Promise<void> {
        await this.config.update('openAiApiKey', apiKey, true);
    }

    /**
     * Actualiza el modelo de OpenAI
     */
    public async updateOpenAIModel(model: string): Promise<void> {
        await this.config.update('openAiModel', model, true);
    }

    /**
     * Actualiza la temperatura de OpenAI
     */
    public async updateOpenAITemperature(temperature: number): Promise<void> {
        await this.config.update('openAiTemperature', temperature, true);
    }

    /**
     * Actualiza el máximo de tokens de OpenAI
     */
    public async updateOpenAIMaxTokens(maxTokens: number): Promise<void> {
        await this.config.update('openAiMaxToken', maxTokens, true);
    }

    /**
     * Actualiza el prompt personalizado
     */
    public async updateCustomPrompt(prompt: string): Promise<void> {
        await this.config.update('customSystemPrompt', prompt, true);
    }

    /**
     * Obtiene el idioma configurado para los mensajes de commit
     */
    public getCommitLanguage(): string {
        return this.config.get<string>('commitLanguage') || 'English';
    }

    /**
     * Actualiza el idioma de los mensajes de commit
     */
    public async updateCommitLanguage(language: string): Promise<void> {
        await this.config.update('commitLanguage', language, true);
    }
} 