
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { theme } from '../styles/theme';
import { parseVariables } from '../utils/variableParser';

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    const detectedVars = parseVariables(text);
    setVariables(detectedVars);
  }, [text]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const getHandlePosition = (index, total) => {
    if (total === 1) return '50%';
    const spacing = 80 / (total + 1);
    return `${10 + spacing * (index + 1)}%`;
  };

  return (
    <div style={styles.nodeContainer}>
      {variables.map((variable, index) => (
        <Handle
          key={variable}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{
            ...styles.handle,
            top: getHandlePosition(index, variables.length),
          }}
        />
      ))}

      <div style={styles.header}>
        <span style={styles.headerText}>Text</span>
      </div>

      <div style={styles.content}>
        <label style={styles.label}>Text:</label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          style={styles.textarea}
          placeholder="Enter text with {{variables}}"
          rows={1}
        />

        {variables.length > 0 && (
          <div style={styles.variablesInfo}>
            <span style={styles.variablesLabel}>Variables:</span>
            <div style={styles.variablesList}>
              {variables.map(variable => (
                <span key={variable} style={styles.variableTag}>
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={styles.handle}
      />
    </div>
  );
};

const styles = {
  nodeContainer: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '4px',
    minWidth: '250px',
    maxWidth: '400px',
    boxShadow: theme.shadows.sm,
    fontFamily: theme.typography.fontFamily,
  },

  header: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderBottom: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
  },

  headerText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  content: {
    padding: theme.spacing.md,
  },

  label: {
    display: 'block',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },

  textarea: {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.sm}`,
    background: theme.colors.surface,
    border: `1px solid #cbd5e1`,
    borderRadius: '4px',
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
    outline: 'none',
    resize: 'none',
    fontFamily: theme.typography.fontFamily,
    minHeight: '60px',
    maxHeight: '300px',
    overflow: 'auto',
    boxSizing: 'border-box',  
  },

  variablesInfo: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    background: '#f8fafc',
    borderRadius: '4px',
    border: `1px solid #e2e8f0`,
  },

  variablesLabel: {
    display: 'block',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },

  variablesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },

  variableTag: {
    padding: `4px ${theme.spacing.sm}`,
    background: theme.colors.primary,
    color: '#ffffff',
    fontSize: '0.7rem',
    borderRadius: '3px',
    fontWeight: theme.typography.fontWeight.medium,
  },

  handle: {
    width: '8px',
    height: '8px',
    background: theme.colors.primary,
    border: `2px solid ${theme.colors.surface}`,
  },
};
