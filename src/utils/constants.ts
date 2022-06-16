// '.gitignore', 'node', 'ts-node'

export enum PickedItemType {
    gitignore = '.gitignore',
    node = 'node',
    tsNode = 'ts-node',
}

export const quickPickItems = [
    {
        label: '.gitignore',
        description: 'Generate .gitignore file',
    },
    {
        label: 'node',
        description: 'Generate nodejs boilerplate',
    },
    {
        label: 'ts-node',
        description: 'Generate nodejs boilerplate with typescript',
    },
];
