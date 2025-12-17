# VectorShift Frontend Assessment - Design Document

## Overview

This design document outlines the architecture and implementation strategy for enhancing the VectorShift pipeline builder. The solution focuses on creating a flexible node abstraction system, implementing professional UI styling inspired by VectorShift's design language, adding dynamic text node functionality with variable detection, and integrating backend validation.

The design prioritizes:
- **Reusability**: Node abstraction that eliminates code duplication
- **Maintainability**: Clean architecture with clear separation of concerns
- **User Experience**: Professional, intuitive interface with smooth interactions
- **Extensibility**: Easy addition of new node types and features

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │   Toolbar      │  │  Canvas (RF)   │  │   Submit     │  │
│  │  - Node Types  │  │  - Nodes       │  │   Button     │  │
│  │  - Draggable   │  │  - Edges       │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│           │                  │                    │          │
│           └──────────────────┼────────────────────┘          │
│                              │                               │
│                    ┌─────────▼─────────┐                    │
│                    │  Zustand Store    │                    │
│                    │  - nodes[]        │                    │
│                    │  - edges[]        │                    │
│                    └───────────────────┘                    │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP POST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /pipelines/parse                                     │  │
│  │  - Count nodes                                        │  │
│  │  - Count edges                                        │  │
│  │  - Validate DAG                                       │  │
│  │  - Return: {num_nodes, num_edges, is_dag}           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── components/
│   ├── BaseNode.js          # Abstract base node component
│   └── NodeFactory.js       # Factory for creating node types
├── nodes/
│   ├── nodeConfigs.js       # Configuration for all node types
│   ├── inputNode.js         # Input node (refactored)
│   ├── llmNode.js           # LLM node (refactored)
│   ├── outputNode.js        # Output node (refactored)
│   ├── textNode.js          # Text node with dynamic handles
│   └── [5 new nodes]        # New node types
├── styles/
│   ├── theme.js             # Design system tokens
│   └── nodeStyles.js        # Shared node styling
├── utils/
│   ├── variableParser.js    # Parse {{variable}} syntax
│   └── dagValidator.js      # DAG validation logic (if needed)
├── store.js                 # Zustand store
├── toolbar.js               # Toolbar component
├── ui.js                    # Main canvas
├── submit.js                # Submit button with API call
└── App.js                   # Root component
```

## Components and Interfaces

### 1. BaseNode Component

**Purpose**: Reusable base component that all nodes inherit from.

**Props Interface**:
```javascript
{
  id: string,              // Unique node ID
  data: {
    config: {
      type: string,        // Node type identifier
      label: string,       // Display label
      description: string, // Node description
      inputs: [            // Input handles configuration
        {
          id: string,
          label: string,
          position: 'left' | 'right' | 'top' | 'bottom',
          style: object
        }
      ],
      outputs: [           // Output handles configuration
        {
          id: string,
          label: string,
          position: 'left' | 'right' | 'top' | 'bottom',
          style: object
        }
      ],
      fields: [            // Form fields in node
        {
          type: 'text' | 'select' | 'textarea' | 'number',
          name: string,
          label: string,
          defaultValue: any,
          options: array   // For select fields
        }
      ],
      icon: ReactComponent,  // Optional icon
      color: string,         // Primary color
      width: number,         // Default width
      height: number         // Default height
    },
    ...fieldValues         // Current field values
  }
}
```

**Responsibilities**:
- Render node container with consistent styling
- Generate handles based on configuration
- Render form fields based on configuration
- Handle field value changes
- Apply theme styling

### 2. Node Configuration System

**File**: `nodeConfigs.js`

**Structure**:
```javascript
export const nodeConfigs = {
  customInput: {
    type: 'customInput',
    label: 'Input',
    description: 'Data input source',
    color: '#3b82f6',
    icon: InputIcon,
    outputs: [
      { id: 'value', label: 'Output', position: 'right' }
    ],
    fields: [
      { type: 'text', name: 'inputName', label: 'Name', defaultValue: 'input' },
      { type: 'select', name: 'inputType', label: 'Type', 
        options: ['Text', 'File'], defaultValue: 'Text' }
    ]
  },
  // ... other node configs
}
```

### 3. Text Node with Variable Detection

**Enhanced Features**:
- Auto-resizing based on content
- Real-time variable detection using regex: `/\{\{(\w+)\}\}/g`
- Dynamic handle generation
- Handle positioning algorithm

**State Management**:
```javascript
{
  text: string,                    // Current text content
  variables: Set<string>,          // Detected variable names
  dimensions: { width, height },   // Current dimensions
  handles: [                       // Dynamic handles
    { id: string, variable: string, position: number }
  ]
}
```

**Variable Detection Algorithm**:
1. Parse text on every change
2. Extract all `{{variableName}}` patterns
3. Validate variable names (JavaScript identifier rules)
4. Compare with previous variables
5. Add new handles for new variables
6. Remove handles for deleted variables
7. Update Zustand store with new handle configuration

### 4. Submit Integration

**Flow**:
```
User clicks Submit
    ↓
Serialize nodes and edges from Zustand store
    ↓
POST to http://localhost:8000/pipelines/parse
    ↓
Backend validates and returns response
    ↓
Display alert with results
```

**API Request Format**:
```javascript
{
  nodes: [
    { id: string, type: string, position: {x, y}, data: object }
  ],
  edges: [
    { id: string, source: string, target: string, sourceHandle: string, targetHandle: string }
  ]
}
```

**API Response Format**:
```javascript
{
  num_nodes: number,
  num_edges: number,
  is_dag: boolean
}
```

## Data Models

### Node Data Model
```javascript
{
  id: "llm-1",
  type: "llm",
  position: { x: 100, y: 200 },
  data: {
    config: nodeConfigs.llm,
    // Field values
    modelName: "gpt-4",
    temperature: 0.7,
    // Dynamic properties
    variables: ["input", "context"]
  }
}
```

### Edge Data Model
```javascript
{
  id: "e1-2",
  source: "input-1",
  sourceHandle: "input-1-value",
  target: "llm-1",
  targetHandle: "llm-1-prompt",
  type: "smoothstep",
  animated: true,
  style: { stroke: '#3b82f6', strokeWidth: 2 }
}
```

## Design System

### Color Palette (Inspired by VectorShift)
```javascript
{
  primary: '#3b82f6',      // Blue
  secondary: '#8b5cf6',    // Purple
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Orange
  danger: '#ef4444',       // Red
  background: '#0f172a',   // Dark blue-gray
  surface: '#1e293b',      // Lighter dark
  border: '#334155',       // Border gray
  text: {
    primary: '#f1f5f9',    // Light text
    secondary: '#94a3b8',  // Muted text
  }
}
```

### Typography
```javascript
{
  fontFamily: "'Inter', -apple-system, sans-serif",
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem'
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
```

### Spacing System
```javascript
{
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem'    // 48px
}
```

### Node Styling
```javascript
{
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  border: '2px solid',
  padding: '16px',
  minWidth: '200px',
  minHeight: '80px',
  background: 'linear-gradient(135deg, surface 0%, darken(surface, 5%) 100%)'
}
```

## Error Handling

### Frontend Error Scenarios
1. **Network Error**: Display user-friendly message if backend is unreachable
2. **Invalid Response**: Handle malformed backend responses gracefully
3. **Variable Parsing Error**: Silently ignore invalid variable syntax
4. **Node Creation Error**: Validate node configuration before creation

### Backend Error Scenarios
1. **Invalid Pipeline Data**: Return 400 with error message
2. **DAG Validation Error**: Handle edge cases (disconnected nodes, self-loops)
3. **Server Error**: Return 500 with generic error message

## Testing Strategy

### Unit Tests
- Variable parser regex validation
- DAG validation algorithm
- Node configuration validation
- Handle generation logic

### Integration Tests
- Submit button → Backend → Alert flow
- Drag and drop node creation
- Variable detection and handle creation
- Node field updates

### Manual Testing Checklist
- [ ] Create all node types from toolbar
- [ ] Connect nodes with edges
- [ ] Test text node resizing
- [ ] Test variable detection with various patterns
- [ ] Test submit with valid DAG
- [ ] Test submit with cyclic graph
- [ ] Test submit with disconnected nodes
- [ ] Verify styling consistency across all nodes
- [ ] Test responsive behavior
- [ ] Test error scenarios

## Implementation Plan

### Phase 1: Node Abstraction (Priority: High)
1. Create BaseNode component
2. Define nodeConfigs.js with all configurations
3. Refactor existing 4 nodes to use BaseNode
4. Create 5 new node types using abstraction
5. Update toolbar to use new nodes

### Phase 2: Styling (Priority: High)
1. Create theme.js with design tokens
2. Style BaseNode component
3. Style toolbar with modern design
4. Style canvas background and controls
5. Style edges and connections
6. Style submit button
7. Add hover states and transitions

### Phase 3: Text Node Enhancement (Priority: High)
1. Implement auto-resize logic
2. Create variable parser utility
3. Implement dynamic handle generation
4. Update Zustand store to track variables
5. Test with multiple variables

### Phase 4: Backend Integration (Priority: High)
1. Update submit.js with API call
2. Implement backend DAG validation
3. Create alert component for results
4. Add error handling
5. Test end-to-end flow

### Phase 5: Polish (Priority: Medium)
1. Add loading states
2. Improve error messages
3. Add animations and transitions
4. Optimize performance
5. Final testing and bug fixes

## Performance Considerations

1. **Variable Detection**: Debounce text input to avoid excessive re-renders
2. **Handle Updates**: Batch handle updates to minimize ReactFlow re-renders
3. **Store Updates**: Use Zustand selectors to prevent unnecessary re-renders
4. **Large Pipelines**: Optimize for pipelines with 50+ nodes

## Security Considerations

1. **Input Validation**: Sanitize user input in text fields
2. **API Security**: Validate backend responses before processing
3. **XSS Prevention**: Escape user-generated content
4. **CORS**: Configure proper CORS headers on backend

## Accessibility

1. **Keyboard Navigation**: Ensure all interactions work with keyboard
2. **Screen Readers**: Add proper ARIA labels
3. **Color Contrast**: Ensure WCAG AA compliance
4. **Focus Indicators**: Clear focus states for all interactive elements

---

*This design provides a solid foundation for building a professional, maintainable, and extensible pipeline builder that meets all assessment requirements.*
