
export const nodeConfigs = {
    /// here lets make each node as simple config object so that i can achive abstraction 
    customInput: {
        type: 'customInput',
        label: 'Input',
        description: 'Input source',

        outputs: [
            { id: 'value', position: 'right' }
        ],

        fields: [
            {
                type: 'text',
                name: 'inputName',
                label: 'Name',
                defaultValue: (id) => id.replace('customInput-', 'input_'),
            },
            {
                type: 'select',
                name: 'inputType',
                label: 'Type',
                options: ['Text', 'File'],
                defaultValue: 'Text',
            }
        ],
    },

    llm: {
        type: 'llm',
        label: 'LLM',
        description: 'Large Language Model',

        inputs: [
            { id: 'system', position: 'left', style: { top: '33%' } },
            { id: 'prompt', position: 'left', style: { top: '66%' } }
        ],

        outputs: [
            { id: 'response', position: 'right' }
        ],

        fields: [],
    },

    customOutput: {
        type: 'customOutput',
        label: 'Output',
        description: 'Output destination',

        inputs: [
            { id: 'value', position: 'left' }
        ],

        fields: [
            {
                type: 'text',
                name: 'outputName',
                label: 'Name',
                defaultValue: (id) => id.replace('customOutput-', 'output_'),
            },
            {
                type: 'select',
                name: 'outputType',
                label: 'Type',
                options: ['Text', 'Image'],
                defaultValue: 'Text',
            }
        ],
    },

    ///just adding 5 additional nodes here 
    api: {
        type: 'api',
        label: 'API',
        description: 'HTTP API Request',

        inputs: [
            { id: 'url', position: 'left', style: { top: '40%' } },
            { id: 'body', position: 'left', style: { top: '60%' } }
        ],

        outputs: [
            { id: 'response', position: 'right' }
        ],

        fields: [
            {
                type: 'select',
                name: 'method',
                label: 'Method',
                options: ['GET', 'POST', 'PUT', 'DELETE'],
                defaultValue: 'GET',
            },
            {
                type: 'text',
                name: 'endpoint',
                label: 'Endpoint',
                defaultValue: '/api/data',
            }
        ],
    },

    database: {
        type: 'database',
        label: 'Database',
        description: 'Database Query',

        inputs: [
            { id: 'query', position: 'left' }
        ],

        outputs: [
            { id: 'result', position: 'right' }
        ],

        fields: [
            {
                type: 'select',
                name: 'operation',
                label: 'Operation',
                options: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
                defaultValue: 'SELECT',
            },
            {
                type: 'text',
                name: 'table',
                label: 'Table',
                defaultValue: 'users',
            }
        ],
    },

    transform: {
        type: 'transform',
        label: 'Transform',
        description: 'Transform Data',

        inputs: [
            { id: 'input', position: 'left' }
        ],

        outputs: [
            { id: 'output', position: 'right' }
        ],

        fields: [
            {
                type: 'select',
                name: 'operation',
                label: 'Operation',
                options: ['Map', 'Filter', 'Reduce', 'Sort'],
                defaultValue: 'Map',
            },
            {
                type: 'text',
                name: 'expression',
                label: 'Expression',
                defaultValue: 'x => x',
            }
        ],
    },

    filter: {
        type: 'filter',
        label: 'Filter',
        description: 'Filter Data',

        inputs: [
            { id: 'input', position: 'left' }
        ],

        outputs: [
            { id: 'passed', position: 'right', style: { top: '40%' } },
            { id: 'failed', position: 'right', style: { top: '60%' } }
        ],

        fields: [
            {
                type: 'text',
                name: 'condition',
                label: 'Condition',
                defaultValue: 'value > 0',
            }
        ],
    },

    merge: {
        type: 'merge',
        label: 'Merge',
        description: 'Merge Inputs',

        inputs: [
            { id: 'input1', position: 'left', style: { top: '33%' } },
            { id: 'input2', position: 'left', style: { top: '50%' } },
            { id: 'input3', position: 'left', style: { top: '66%' } }
        ],

        outputs: [
            { id: 'output', position: 'right' }
        ],

        fields: [
            {
                type: 'select',
                name: 'strategy',
                label: 'Strategy',
                options: ['Concat', 'Union', 'Intersect'],
                defaultValue: 'Concat',
            }
        ],
    },
};

export const getConfigNode = (type) => {
    return nodeConfigs[type] || null
}
