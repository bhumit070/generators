import * as vscode from 'vscode';
import { handleGitignore } from './gitignore';
import { quickPickItems, PickedItemType } from '../utils/constants';
import { PromptType, showPrompt } from '../utils/prompt';

export async function handlePicker() {
    const pickedItem = await vscode.window.showQuickPick(quickPickItems, {
        matchOnDetail: true,
    });

    switch (pickedItem?.label) {
        case PickedItemType.gitignore:
            await handleGitignore();
            break;
        
        case PickedItemType.node:
        case PickedItemType.tsNode:
            showPrompt(PromptType.info, 'Coming soon...');
            break;
        
        default:
            showPrompt(PromptType.info, 'Not implemented yet.');
            break;
    }
}
