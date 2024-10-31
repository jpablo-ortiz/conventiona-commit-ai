import * as vscode from 'vscode';

export class LogService {
    private static instance: LogService;
    private outputChannel: vscode.OutputChannel;

    // Colores ANSI que funcionan en VS Code
    private readonly colors = {
        black: '\u001b[30m',
        red: '\u001b[31m',
        green: '\u001b[32m',
        yellow: '\u001b[33m',
        blue: '\u001b[34m',
        magenta: '\u001b[35m',
        cyan: '\u001b[36m',
        white: '\u001b[37m',
        brightBlack: '\u001b[90m',
        reset: '\u001b[0m'
    };

    private constructor() {
        // Crear el canal con soporte para ANSI
        this.outputChannel = vscode.window.createOutputChannel('Conventional Commit AI', { log: true });
    }

    public static getInstance(): LogService {
        if (!LogService.instance) {
            LogService.instance = new LogService();
        }
        return LogService.instance;
    }

    /**
     * Muestra el panel de salida
     */
    public show(): void {
        this.outputChannel.show();
    }

    /**
     * Registra un mensaje informativo
     */
    public info(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        this.outputChannel.appendLine(`${this.colors.blue}[INFO] ${timestamp}${this.colors.reset} ${message}`);
    }

    /**
     * Registra un mensaje de error
     */
    public error(message: string, error?: unknown): void {
        const timestamp = new Date().toLocaleTimeString();
        this.outputChannel.appendLine(`${this.colors.red}[ERROR] ${timestamp}${this.colors.reset} ${message}`);
        if (error) {
            const errorMessage = error instanceof Error ? error.stack || error.message : String(error);
            this.outputChannel.appendLine(`${this.colors.red}${this.indentText(errorMessage)}${this.colors.reset}`);
        }
    }

    /**
     * Registra un mensaje de debug
     */
    public debug(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        this.outputChannel.appendLine(`${this.colors.brightBlack}[DEBUG] ${timestamp}${this.colors.reset} ${message}`);
    }

    /**
     * Registra un mensaje de éxito
     */
    public success(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        this.outputChannel.appendLine(`${this.colors.green}[SUCCESS] ${timestamp}${this.colors.reset} ${message}`);
    }

    /**
     * Registra datos importantes
     */
    public data(title: string, data: any): void {
        const timestamp = new Date().toLocaleTimeString();
        this.outputChannel.appendLine(`${this.colors.cyan}[DATA] ${timestamp} ${title}:${this.colors.reset}`);
        const formattedData = this.formatData(data);
        this.outputChannel.appendLine(`${this.colors.brightBlack}${this.indentText(formattedData)}${this.colors.reset}`);
        this.outputChannel.appendLine(''); // Línea en blanco para mejor legibilidad
    }

    /**
     * Crea y retorna una barra de progreso
     */
    public async withProgress<T>(
        title: string,
        task: (progress: vscode.Progress<{ message?: string; increment?: number }>) => Promise<T>
    ): Promise<T> {
        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title,
                cancellable: false
            },
            async (progress) => {
                try {
                    return await task(progress);
                } catch (error) {
                    this.error('Error durante la operación', error);
                    throw error;
                }
            }
        );
    }

    /**
     * Formatea datos para el log
     */
    private formatData(data: any): string {
        if (typeof data === 'string') {
            return data;
        }
        
        try {
            return JSON.stringify(data, null, 2)
                .split('\n')
                .map(line => line.trimRight()) // Elimina espacios en blanco al final
                .join('\n');
        } catch {
            return String(data);
        }
    }

    /**
     * Indenta el texto para mejor legibilidad
     */
    private indentText(text: string, spaces: number = 4): string {
        const indent = ' '.repeat(spaces);
        return text.split('\n')
            .map(line => `${indent}${line}`)
            .join('\n');
    }
} 