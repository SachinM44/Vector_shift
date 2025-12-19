
export const theme = {
    colors: {
        background: '#f8fafc',        
        surface: '#ffffff',           
        border: '#e2e8f0',          

        primary: '#3b82f6',          
        primaryHover: '#2563eb',    

        text: {
            primary: '#0f172a',       
            secondary: '#64748b',   
            muted: '#94a3b8',         
        },

        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',

        nodeAccents: {
            input: '#3b82f6'
        },
    },

    typography: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
        },
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },

    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },

};

export const getNodeColor = (nodeType) => {
    return theme.colors.nodeAccents[nodeType] || theme.colors.primary;
};
