import * as vscode from 'vscode';
import { PickedItemType, quickPickItems } from '../utils/constants';
import { PromptType, showPrompt } from '../utils/prompt';
import { handleGitignore } from './gitignore';
import * as cp from 'child_process';
import * as fs from 'fs';

async function showInputProjectNamePicker(): Promise<string> {
    const projectName = await vscode.window.showInputBox({
                prompt: 'Enter project name',
                placeHolder: 'Project name',
                value: 'my_node_project',
            });
    return projectName || '';
}

async function pickFolderPath(): Promise<string> {
    const folder = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                openLabel: 'Select',
                title: 'Select a folder to generate a template',
            });
    const folderPath = folder && folder[0].path;
    return folderPath || '';
}

const repoURLS = {
    [PickedItemType.node]: 'https://github.com/bhumit070/node-boilerplate-js.git',
    [PickedItemType.tsNode]: 'https://github.com/bhumit070/node-boilerplate-ts.git',
};

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
            const repoURL: string = repoURLS[pickedItem.label];
            if(!repoURL) {
                showPrompt(PromptType.error, 'Something went wrong');
                return;
            }

            const projectName = await showInputProjectNamePicker();
            const folderPath = await pickFolderPath();

            if(!projectName || !folderPath) {
                return;
            }
            try {
                vscode.window.showInformationMessage('Cloning the repo...');
                cp.execSync(`git clone ${repoURL} ${folderPath}/${projectName}`);
                const gitFile = vscode.Uri.file(`${folderPath}/${projectName}/.git`);
                await vscode.workspace.fs.delete(gitFile, { recursive: true, useTrash: false });
                const packageJson = JSON.parse(fs.readFileSync(`${folderPath}/${projectName}/package.json`, 'utf8'));
                packageJson.name = projectName;
                fs.writeFileSync(`${folderPath}/${projectName}/package.json`, JSON.stringify(packageJson, null, 2));
                vscode.window
                    .showInformationMessage('Successfully generated template, Do you want to open it?', "Yes", "No" )
                    .then((isOpenClonedRepo) => {
                        if(isOpenClonedRepo === 'Yes') {
                            vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(`${folderPath}/${projectName}`));
                        }
                    });
            } catch (error) {
                console.log(error);
                showPrompt(PromptType.error, 'Error while cloning the repo');
            }
            break;

        default:
            showPrompt(PromptType.info, 'Not implemented yet.');
            break;
    }
}
