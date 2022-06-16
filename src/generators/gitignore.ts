import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { PromptType, showPrompt } from '../utils/prompt';

function generatePicker(items: []) {
    const picker = vscode.window.createQuickPick();

    picker.items = items!;

    picker.placeholder =
        'Select os and programming language to generate gitignore';

    picker.canSelectMany = true;

    picker.show();

    picker.onDidAccept(async () => {
        if (picker.selectedItems.length) {
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

async function fetchDropDownTemplates(): Promise<[] | null> {
    try {
        showPrompt(PromptType.info, 'Fetching Select Types...');
        const { data } = await axios.get(
            'https://www.toptal.com/developers/gitignore/dropdown/templates.json',
        );

        const quickPickItems = data.map((_data: { id: string }) => ({
            label: _data.id,
        }));

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
        const rootPath = vscode.workspace.rootPath;
        if (rootPath) {
            const filePath = path.join(rootPath, '.gitignore');
            fs.appendFileSync(filePath, gitignoreContents);
            showPrompt(PromptType.success, 'Generated .gitignore file');
        }
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
