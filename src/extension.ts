import * as vscode from 'vscode';
import { handlePicker } from './generators/picker';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'template-generators.generate',
        handlePicker,
    );
    context.subscriptions.push(disposable);
}

export function deactivate() {}
