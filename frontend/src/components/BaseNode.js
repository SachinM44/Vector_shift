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
            {/* Input handles */}
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
            <div style={{
                ...styles.header,
                borderLeftColor: nodeColor,
            }}>
                <span style={styles.headerText}>{config.label}</span>
            </div>

            {/* Description */}
            {config.description && (
                <div style={styles.description}>
                    {config.description}
                </div>
            )}

            {/* Fields */}
            {config.fields && config.fields.length > 0 && (
                <div style={styles.fieldsContainer}>
                    {config.fields.map(field => renderField(field))}
                </div>
            )}

            {/* Output handles */}
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

// Styles (clean, VectorShift-inspired)
const styles = {
    nodeContainer: {
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        minWidth: '200px',
        boxShadow: theme.shadows.md,
        fontFamily: theme.typography.fontFamily,
    },

    header: {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderBottom: `1px solid ${theme.colors.border}`,
        borderLeft: `3px solid`,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
    },

    headerText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.semibold,
    },

    description: {
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
        borderBottom: `1px solid ${theme.colors.border}`,
    },

    fieldsContainer: {
        padding: theme.spacing.md,
    },

    fieldContainer: {
        marginBottom: theme.spacing.sm,
    },

    label: {
        display: 'block',
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
        marginBottom: theme.spacing.xs,
        fontWeight: theme.typography.fontWeight.medium,
    },

    input: {
        width: '100%',
        padding: theme.spacing.sm,
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.sm,
        outline: 'none',
        fontFamily: theme.typography.fontFamily,
    },

    select: {
        width: '100%',
        padding: theme.spacing.sm,
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.sm,
        outline: 'none',
        cursor: 'pointer',
    },

    textarea: {
        width: '100%',
        padding: theme.spacing.sm,
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.sm,
        outline: 'none',
        resize: 'vertical',
        fontFamily: theme.typography.fontFamily,
    },

    handle: {
        width: '10px',
        height: '10px',
        border: `2px solid ${theme.colors.surface}`,
    },
};
