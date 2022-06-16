import * as vscode from 'vscode';

export enum PromptType {
    info = 'info',
    warn = 'warn',
    success = 'success',
    error = 'error',
}

export function showPrompt(promptType: PromptType, message: string) {
    switch (promptType) {
        case PromptType.info:
            vscode.window.showInformationMessage(message);
            break;
        case PromptType.warn:
            vscode.window.showWarningMessage(message);
            break;
        case PromptType.info:
            vscode.window.showInformationMessage(message);
            break;
        case PromptType.error:
            vscode.window.showErrorMessage(message);
            break;
    }
}
