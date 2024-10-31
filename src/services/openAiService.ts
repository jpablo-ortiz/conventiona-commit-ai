import * as vscode from 'vscode';
import OpenAI from 'openai';
import { ConfigService } from './configService';
import { LogService } from './logService';

// Constantes
// Style diff example
const EXAMPLE_DIFF = `diff --git a/src/extension.ts b/src/extension.ts
index 1234567890..abcdef1234 100644
--- a/src/extension.ts
+++ b/src/extension.ts
@@ -1,5 +1,5 @@
 import * as vscode from 'vscode';
 
 export class ConventionaCommitAi {
-    constructor() {
+    constructor() {
        this.configService = ConfigService.getInstance();
    }
`;
const EXAMPLE_COMMIT_MESSAGE = `style(formatting): adjust constructor indentation`;
// Feat diff example
const EXAMPLE_DIFF_2 = `diff --git a/src/services/userService.ts b/src/services/userService.ts
index 1234567..abcdef12 100644
--- a/src/services/userService.ts
+++ b/src/services/userService.ts
@@ -10,6 +10,12 @@ export class UserService {
     constructor() {
         this.users = [];
     }
+
+    async createUser(name: string, email: string): Promise<User> {
+        const user = new User(name, email);
+        this.users.push(user);
+        return user;
+    }
 }`;
const EXAMPLE_COMMIT_MESSAGE_2 = `feat(user): add user creation functionality

- Added createUser method to UserService`;

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
            const customPrompt = this.configService.getCustomPrompt();
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
                { role: 'system', content: customPrompt },
                { role: 'user', content: EXAMPLE_DIFF },
                { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE },
                { role: 'user', content: EXAMPLE_DIFF_2 },
                { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE_2 },
                { role: 'user', content: message }
            ]);

            const response = await openai.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: customPrompt },
                    { role: 'user', content: EXAMPLE_DIFF },
                    { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE },
                    { role: 'user', content: EXAMPLE_DIFF_2 },
                    { role: 'assistant', content: EXAMPLE_COMMIT_MESSAGE_2 },
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