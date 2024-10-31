import OpenAI from 'openai';
import { ConfigService } from './configService';
import { LogService } from './logService';
import { EXAMPLE_COMMIT_MESSAGE_FEAT, EXAMPLE_COMMIT_MESSAGE_STYLE, EXAMPLE_DIFF_FEAT, EXAMPLE_DIFF_STYLE } from './constants';

export class OpenAIService {
    private configService: ConfigService;
    private logService: LogService;

    constructor() {
        this.configService = ConfigService.getInstance();
        this.logService = LogService.getInstance();
    }

    /**
     * Eres un programador senior encargado de generar mensajes de commit de Git de alta calidad que cumplan con los estándares de los 'conventional commits'. Tus commits deben ser concisos, informativos y reflejar claramente el propósito de los cambios en el código.# Directrices- Los mensajes de commit **deben seguir el formato**:- **Sin cuerpo**:```<type>(<scope>): <description>```- **Con cuerpo**:```<type>(<scope>): <description><cuerpo opcional>```- Usa los siguientes tipos de commit:- `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.- Asegúrate de que el **scope** se use adecuadamente para dar contexto cuando sea necesario.- La **descripción** debe tener menos de **50 caracteres** y transmitir el cambio claramente.- El **cuerpo** es opcional y debe usarse para proporcionar detalles adicionales si es necesario.- **Puedes agregar emojis**, pero de manera moderada.# Pasos1. Comprende el cambio exacto en el código.2. Identifica el **tipo** y el **scope** apropiados según las directrices.3. Escribe una **descripción concisa** del cambio.4. Si es necesario, incluye un **cuerpo** para explicar detalles adicionales.5. Asegúrate de que los commits sean informativos para futuros desarrolladores.6. Proporciona **solo el mensaje de commit** directamente, sin explicaciones adicionales.# Formato de SalidaEl mensaje de commit debe seguir uno de estos formatos:- **Sin cuerpo**:```<type>(<scope>): <description>```- **Con cuerpo**:```<type>(<scope>): <description><cuerpo opcional>```
     */
    public async generateCommitMessage(diff: string): Promise<string> {
        const apiKey = this.configService.getOpenAIKey();
        if (!apiKey) {
            throw new Error('OpenAI API key no configurada');
        }

        const openai = new OpenAI({ apiKey });

        try {
            const language = this.configService.getCommitLanguage();
            const customSystemPrompt = this.configService.getCustomSystemPrompt();
            const model = this.configService.getOpenAIModel();
            const temperature = this.configService.getOpenAITemperature();
            const maxTokens = this.configService.getOpenAIMaxTokens();

            const message = `Genera un mensaje de commit para los siguientes cambios:\n\n${diff}`;

            // Loguear la configuración y el prompt
            this.logService.data('Configuración OpenAI', {
                model,
                temperature,
                maxTokens
            });

            this.logService.data('Mensajes para OpenAI', [
                { role: 'system', content: customSystemPrompt.replace('{language}', language) },
                { role: 'user', content: EXAMPLE_DIFF_STYLE },
                { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE_STYLE },
                { role: 'user', content: EXAMPLE_DIFF_FEAT },
                { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE_FEAT },
                { role: 'user', content: message }
            ]);

            const response = await openai.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: customSystemPrompt.replace('{language}', language) },
                    { role: 'user', content: EXAMPLE_DIFF_STYLE },
                    { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE_STYLE },
                    { role: 'user', content: EXAMPLE_DIFF_FEAT },
                    { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE_FEAT },
                    { role: 'user', content: message }
                ],
                temperature,
                max_tokens: maxTokens
            });

            const generatedMessage = response.choices[0]?.message?.content || '';
            this.logService.success(`Mensaje generado: ${generatedMessage}`);
            return generatedMessage;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al generar el mensaje de commit: ${errorMessage}`);
        }
    }
} 