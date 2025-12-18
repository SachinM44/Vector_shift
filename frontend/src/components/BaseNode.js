// frontend/src/components/BaseNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { theme, getNodeColor } from '../styles/theme';

export const BaseNode = ({ id, data }) => {
    const config = data.config;

    // Initialize field values
    const [fieldValues, setFieldValues] = useState(() => {
        const initial = {};
        config.fields?.forEach(field => {
            const defaultVal = typeof field.defaultValue === 'function'
                ? field.defaultValue(id)
                : field.defaultValue;
            initial[field.name] = data[field.name] || defaultVal;
        });
        return initial;
    });

    // Handle field changes
    const handleFieldChange = (fieldName, value) => {
        setFieldValues(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    // Render field based on type
    const renderField = (field) => {
        const value = fieldValues[field.name] || '';

        switch (field.type) {
            case 'text':
                return (
                    <div key={field.name} style={styles.fieldContainer}>
                        <label style={styles.label}>{field.label}:</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            style={styles.input}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.name} style={styles.fieldContainer}>
                        <label style={styles.label}>{field.label}:</label>
                        <select
                            value={value}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            style={styles.select}
                        >
                            {field.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.name} style={styles.fieldContainer}>
                        <label style={styles.label}>{field.label}:</label>
                        <textarea
                            value={value}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            style={styles.textarea}
                            rows={3}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    const nodeColor = getNodeColor(config.type);

    return (
        <div style={styles.nodeContainer}>
            {config.inputs?.map((input) => (
                <Handle
                    key={input.id}
                    type="target"
                    position={Position.Left}
                    id={`${id}-${input.id}`}
                    style={{
                        ...styles.handle,
                        ...input.style,
                        background: nodeColor,
                    }}
                />
            ))}

            {/* Header */}
            <div style={styles.header}>
                <span style={styles.headerText}>{config.label}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    style={styles.deleteButton}
                    title="Press Delete key to remove"
                >
                    ×
                </button>
            </div>



            {config.description && (
                <div style={styles.description}>
                    {config.description}
                </div>
            )}

            {config.fields && config.fields.length > 0 && (
                <div style={styles.fieldsContainer}>
                    {config.fields.map(field => renderField(field))}
                </div>
            )}

            {config.outputs?.map((output) => (
                <Handle
                    key={output.id}
                    type="source"
                    position={Position.Right}
                    id={`${id}-${output.id}`}
                    style={{
                        ...styles.handle,
                        ...output.style,
                        background: nodeColor,
                    }}
                />
            ))}
        </div>

    );
};

const styles = {
    nodeContainer: {
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '4px',
        minWidth: '200px',
        boxShadow: theme.shadows.sm,
        fontFamily: theme.typography.fontFamily,
    },

    header: {
        position: 'relative',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderBottom: `1px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerText: {

        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.semibold,
    },

    description: {
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.xs,
        borderBottom: `1px solid ${theme.colors.border}`,
    },

    fieldsContainer: {
        padding: theme.spacing.xl,
    },

    fieldContainer: {
        marginBottom: theme.spacing.md,
    },

    label: {
        display: 'block',
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.xs,
        marginBottom: theme.spacing.xs,
        fontWeight: theme.typography.fontWeight.medium,
    },

    input: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        background: theme.colors.surface,
        border: `1px solid #cbd5e1`,
        borderRadius: '4px',
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.xs,
        outline: 'none',
        fontFamily: theme.typography.fontFamily,
        boxSizing: 'border-box',
    },

    select: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        background: theme.colors.surface,
        border: `1px solid #cbd5e1`,
        borderRadius: '4px',
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.xs,
        outline: 'none',
        cursor: 'pointer',
        boxSizing: 'border-box',
    },

    textarea: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '4px',
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.xs,
        outline: 'none',
        resize: 'vertical',
        fontFamily: theme.typography.fontFamily,
    },

    handle: {
        width: '8px',
        height: '8px',
        background: theme.colors.primary,  // Simple blue
        border: `2px solid ${theme.colors.surface}`,
    },

    deleteButton: {
        background: 'transparent',
        border: 'none',
        color: theme.colors.text.secondary,
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0 4px',
        lineHeight: 1,
    },

};


