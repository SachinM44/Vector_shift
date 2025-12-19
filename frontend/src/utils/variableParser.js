/**
 * Parses text to extract variable names from {{variableName}} syntax
 * @param {string} text - The text to parse
 * @returns {string[]} - Array of unique variable names
 */
export const parseVariables = (text) => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = new Set();
    let match;

    while ((match = regex.exec(text)) !== null) {
        variables.add(match[1]); 
    }

    return Array.from(variables);
};

/**
 * Validates if a string is a valid JavaScript variable name
 * @param {string} name - The variable name to validate
 * @returns {boolean} - True if valid
 */
export const isValidVariableName = (name) => {
    const validNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

    const reservedKeywords = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
        'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
        'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new',
        'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
        'void', 'while', 'with', 'yield'
    ];

    return validNameRegex.test(name) && !reservedKeywords.includes(name);
};
