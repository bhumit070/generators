import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as quickPickItems from '../data/gitignore-templates.json';
import { PromptType, showPrompt } from '../utils/prompt';

interface QuickPickItems {
    label: string;
}

function generatePicker(items: QuickPickItems[]) {
    const picker = vscode.window.createQuickPick();

    picker.items = items!;

    picker.placeholder =
        'Select os and programming language to generate gitignore';

    picker.canSelectMany = true;

    picker.show();

    picker.onDidAccept(async () => {
        if (!picker.selectedItems.length) {
            showPrompt(
                PromptType.info,
                'Please select one option to continue...',
            );
            return;
        }
        picker.hide();
        const selectedItemsWithObject = picker.selectedItems;
        const selectedItems = selectedItemsWithObject.map(({ label }) => label);
        await generateGitIgnoreFile(selectedItems);
    });
}

async function fetchDropDownTemplates(): Promise<QuickPickItems[] | null> {
    try {
        return quickPickItems;
    } catch (error) {
        showPrompt(
            PromptType.error,
            String(error) || 'Failed to generate gitignore file',
        );
        return null;
    }
}

async function generateGitIgnoreFile(items: string[]) {
    try {
        showPrompt(PromptType.info, 'Fetching .gitignore contents...');
        const URL = `https://www.toptal.com/developers/gitignore/api/${items.join(
            ',',
        )}`;
        const { data: gitignoreContents } = await axios.get(URL);

        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.path;

        if (rootPath) {
            const filePath = path.join(rootPath, '/.gitignore');
            fs.appendFileSync(filePath, gitignoreContents);
        } else {
            const textDocument = await vscode.workspace.openTextDocument({
                content: gitignoreContents,
                language: 'plaintext',
            });
            vscode.window.showTextDocument(textDocument);
        }
        showPrompt(PromptType.success, 'Generated .gitignore file');
    } catch (error: any) {
        showPrompt(
            PromptType.error,
            String(error) || 'Failed to generate gitignore file',
        );
    }
}

export async function handleGitignore(): Promise<void> {
    const items = await fetchDropDownTemplates();
    if (!items) {
        return;
    }
    generatePicker(items);
}
