
/**
 * Parses text to extract variable names from {{variableName}} syntax
 * @param {string} text - The text to parse
 * @returns {string[]} - Array of unique variable names
 */
export const parseVariables = (text) => {
    // Regex to match {{variableName}} where variableName is a valid JS identifier
    const regex = /\{\{(\w+)\}\}/g;
    const variables = new Set();
    let match;

    // Find all matches
    while ((match = regex.exec(text)) !== null) {
        variables.add(match[1]); // match[1] is the captured group (variable name)
    }

    return Array.from(variables);
};

/**
 * Validates if a string is a valid JavaScript variable name
 * @param {string} name - The variable name to validate
 * @returns {boolean} - True if valid
 */
export const isValidVariableName = (name) => {
    // Must start with letter, $, or _, followed by letters, digits, $, or _
    const validNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

    // Check if it matches the pattern and is not a reserved keyword
    const reservedKeywords = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
        'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
        'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new',
        'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
        'void', 'while', 'with', 'yield'
    ];

    return validNameRegex.test(name) && !reservedKeywords.includes(name);
};
