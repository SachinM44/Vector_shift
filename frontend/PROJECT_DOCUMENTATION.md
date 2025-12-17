# Visual Pipeline Builder - Complete Technical Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [What This Application Does](#what-this-application-does)
3. [Technology Stack](#technology-stack)
4. [Architecture Overview](#architecture-overview)
5. [File-by-File Deep Dive](#file-by-file-deep-dive)
6. [Key Concepts Explained](#key-concepts-explained)
7. [Data Flow Diagram](#data-flow-diagram)
8. [How Everything Works Together](#how-everything-works-together)

---

## 🎯 Project Overview

This is a **Visual Pipeline Builder** application that allows users to create data processing workflows by dragging and dropping nodes onto a canvas and connecting them together. Think of it like a visual programming interface where you can:
- Drag nodes (Input, LLM, Output, Text) from a toolbar
- Drop them onto a canvas
- Connect nodes together to create a data flow pipeline
- Configure each node with specific properties

**Real-world analogy**: It's like building a flowchart where each box represents a step in your data processing pipeline, and arrows show how data flows from one step to another.

---

## 🚀 What This Application Does

### Core Functionality:
1. **Visual Node Editor**: Users can visually design data pipelines without writing code
2. **Drag-and-Drop Interface**: Intuitive interaction for adding nodes to the canvas
3. **Node Connection**: Connect nodes to define data flow between components
4. **Node Configuration**: Each node can be customized with specific settings
5. **Pipeline Submission**: Submit the complete pipeline for processing (backend integration ready)

### Use Cases:
- Building LLM (Large Language Model) processing pipelines
- Creating data transformation workflows
- Designing input → processing → output flows
- Visual programming for non-technical users

---

## 🛠 Technology Stack

### Frontend Dependencies:

- **React 18.2.0**: JavaScript library for building user interfaces
- **ReactFlow 11.8.3**: Specialized library for building node-based editors and diagrams
- **Zustand**: Lightweight state management library (imported via `create`)
- **React Scripts 5.0.1**: Build tooling and development server

### Backend:
- **FastAPI**: Python web framework for building APIs
- **Python**: Backend processing

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        APPLICATION                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Toolbar    │  │   Canvas     │  │    Submit    │      │
│  │  (Draggable  │  │  (ReactFlow  │  │    Button    │      │
│  │    Nodes)    │  │     UI)      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Zustand Store │                        │
│                    │  (Global State)│                        │
│                    └────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Backend API   │
                    │   (FastAPI)    │
                    └────────────────┘
```

### Component Hierarchy:
```
App (Root)
├── PipelineToolbar (Draggable node buttons)
├── PipelineUI (Main canvas with ReactFlow)
│   ├── InputNode
│   ├── LLMNode
│   ├── OutputNode
│   └── TextNode
└── SubmitButton (Submit pipeline)
```

---

## 📁 File-by-File Deep Dive


### 1. `index.js` - Application Entry Point

**Purpose**: Bootstrap the React application and mount it to the DOM.

**Line-by-Line Breakdown**:
```javascript
import React from 'react';              // Import React library
import ReactDOM from 'react-dom/client'; // Import React DOM for rendering
import './index.css';                   // Import global styles
import App from './App';                // Import root App component

// Create a root React element attached to the 'root' div in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside React.StrictMode
// StrictMode helps identify potential problems in the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**What it does**: 
- Finds the HTML element with id="root" in `public/index.html`
- Creates a React root and renders the entire application inside it
- Wraps app in StrictMode for development warnings

---

### 2. `App.js` - Root Component

**Purpose**: Main application component that assembles all UI pieces.

**Line-by-Line Breakdown**:
```javascript
import { PipelineToolbar } from './toolbar';  // Import toolbar with draggable nodes
import { PipelineUI } from './ui';            // Import main canvas area
import { SubmitButton } from './submit';      // Import submit button

function App() {
  return (
    <div>
      <PipelineToolbar />  {/* Toolbar at top with draggable nodes */}
      <PipelineUI />       {/* Main canvas area for building pipeline */}
      <SubmitButton />     {/* Submit button at bottom */}
    </div>
  );
}

export default App;
```

**What it does**:
- Combines three main UI sections vertically
- No logic here - just layout composition
- Acts as the container for the entire application

---

### 3. `store.js` - Global State Management (Zustand)

**Purpose**: Centralized state management for nodes, edges, and all operations.

**Line-by-Line Breakdown**:

```javascript
import { create } from "zustand";  // Import Zustand state management
import {
    addEdge,              // Helper to add connections between nodes
    applyNodeChanges,     // Helper to update nodes (move, delete, etc.)
    applyEdgeChanges,     // Helper to update edges (delete, etc.)
    MarkerType,           // Arrow types for edge endpoints
} from 'reactflow';

export const useStore = create((set, get) => ({
    // STATE: Array of all nodes on the canvas
    nodes: [],
    
    // STATE: Array of all connections (edges) between nodes
    edges: [],
    
    // ACTION: Generate unique IDs for new nodes
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};  // Copy current ID counters
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;  // Initialize counter for this node type
        }
        newIDs[type] += 1;  // Increment counter
        set({nodeIDs: newIDs});  // Update state
        return `${type}-${newIDs[type]}`;  // Return "llm-1", "text-2", etc.
    },
    
    // ACTION: Add a new node to the canvas
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]  // Append new node to array
        });
    },
    
    // ACTION: Handle node changes (position, selection, deletion)
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),  // Apply changes
        });
    },
    
    // ACTION: Handle edge changes (deletion, selection)
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),  // Apply changes
        });
    },
    
    // ACTION: Create connection between two nodes
    onConnect: (connection) => {
        set({
            edges: addEdge({
                ...connection,           // Source and target info
                type: 'smoothstep',      // Curved line style
                animated: true,          // Animated dashed line
                markerEnd: {             // Arrow at the end
                    type: MarkerType.Arrow,
                    height: '20px',
                    width: '20px'
                }
            }, get().edges),
        });
    },
    
    // ACTION: Update a specific field in a node's data
    updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, [fieldName]: fieldValue };
                }
                return node;
            }),
        });
    },
}));
```

**What it does**:
- **Zustand Store**: Like Redux but simpler - holds all application state
- **nodes**: Array of all node objects on canvas
- **edges**: Array of all connections between nodes
- **Actions**: Functions to modify state (add nodes, connect nodes, update properties)
- **ID Generation**: Ensures each node gets a unique ID like "llm-1", "text-2"

---


### 4. `draggableNode.js` - Draggable Node Component

**Purpose**: Creates draggable node buttons in the toolbar.

**Line-by-Line Breakdown**:
```javascript
export const DraggableNode = ({ type, label }) => {
    // Handler when user starts dragging
    const onDragStart = (event, nodeType) => {
        const appData = { nodeType }  // Package node type info
        event.target.style.cursor = 'grabbing';  // Change cursor to grabbing hand
        
        // Store node type in drag data transfer object
        event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
        event.dataTransfer.effectAllowed = 'move';  // Set drag effect
    };
  
    return (
        <div
            className={type}  // CSS class for styling
            onDragStart={(event) => onDragStart(event, type)}  // Start drag
            onDragEnd={(event) => (event.target.style.cursor = 'grab')}  // Reset cursor
            style={{ 
                cursor: 'grab',           // Open hand cursor
                minWidth: '80px',         // Minimum width
                height: '60px',           // Fixed height
                display: 'flex',          // Flexbox layout
                alignItems: 'center',     // Center vertically
                borderRadius: '8px',      // Rounded corners
                backgroundColor: '#020916ff',  // Dark background
                justifyContent: 'center', // Center horizontally
                flexDirection: 'column'   // Stack items vertically
            }} 
            draggable  // Make element draggable
        >
            <span style={{ color: '#18992fff' }}>{label}</span>  {/* White text */}
        </div>
    );
};
```

**What it does**:
- Creates a draggable box with a label (Input, LLM, Output, Text)
- When dragged, stores the node type in the drag event
- Changes cursor from "grab" (open hand) to "grabbing" (closed hand)
- Styled as a dark rounded rectangle with white text

**Key Concept - Drag and Drop**:
1. User clicks and holds on a DraggableNode
2. `onDragStart` fires, storing node type in `event.dataTransfer`
3. User drags over the canvas
4. User releases mouse - canvas receives the drop event with node type data

---

### 5. `toolbar.js` - Toolbar Component

**Purpose**: Displays all available node types that can be dragged onto canvas.

**Line-by-Line Breakdown**:
```javascript
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div style={{ padding: '10px' }}>  {/* Container with padding */}
            <div style={{ 
                marginTop: '20px',    // Space from top
                display: 'flex',      // Flexbox layout
                flexWrap: 'wrap',     // Wrap to next line if needed
                gap: '10px'           // Space between items
            }}>
                {/* Four draggable node types */}
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
            </div>
        </div>
    );
};
```

**What it does**:
- Creates a horizontal toolbar with 4 draggable node types
- Each node can be dragged onto the canvas
- Uses flexbox for responsive layout

---


### 6. `ui.js` - Main Canvas Component (ReactFlow)

**Purpose**: The main canvas where users build their pipeline by dropping and connecting nodes.

**Line-by-Line Breakdown**:
```javascript
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import 'reactflow/dist/style.css';

const gridSize = 20;  // Grid snap size in pixels
const proOptions = { hideAttribution: true };  // Hide ReactFlow watermark

// Map node type strings to actual React components
const nodeTypes = {
    customInput: InputNode,
    llm: LLMNode,
    customOutput: OutputNode,
    text: TextNode,
};

// Selector to extract needed state from Zustand store
const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    getNodeID: state.getNodeID,
    addNode: state.addNode,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);  // Reference to canvas container
    const [reactFlowInstance, setReactFlowInstance] = useState(null);  // ReactFlow instance
    
    // Get state and actions from Zustand store
    const {
        nodes,
        edges,
        getNodeID,
        addNode,
        onNodesChange,
        onEdgesChange,
        onConnect
    } = useStore(selector, shallow);

    // Initialize node data when created
    const getInitNodeData = (nodeID, type) => {
        let nodeData = { id: nodeID, nodeType: `${type}` };
        return nodeData;
    }

    // Handler when user drops a node onto canvas
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
    
            // Get canvas boundaries for position calculation
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            
            // Extract node type from drag data
            if (event?.dataTransfer?.getData('application/reactflow')) {
                const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
                const type = appData?.nodeType;
      
                // Validate node type
                if (typeof type === 'undefined' || !type) {
                    return;
                }
      
                // Convert mouse position to canvas coordinates
                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });

                // Generate unique ID and create new node
                const nodeID = getNodeID(type);
                const newNode = {
                    id: nodeID,
                    type,
                    position,
                    data: getInitNodeData(nodeID, type),
                };
      
                // Add node to store
                addNode(newNode);
            }
        },
        [reactFlowInstance]
    );

    // Handler when dragging over canvas (required for drop to work)
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <>
        <div ref={reactFlowWrapper} style={{width: '100wv', height: '70vh'}}>
            <ReactFlow
                nodes={nodes}                    // Array of nodes to display
                edges={edges}                    // Array of edges to display
                onNodesChange={onNodesChange}    // Handle node updates
                onEdgesChange={onEdgesChange}    // Handle edge updates
                onConnect={onConnect}            // Handle new connections
                onDrop={onDrop}                  // Handle node drops
                onDragOver={onDragOver}          // Handle drag over
                onInit={setReactFlowInstance}    // Store ReactFlow instance
                nodeTypes={nodeTypes}            // Custom node components
                proOptions={proOptions}          // Configuration options
                snapGrid={[gridSize, gridSize]}  // Snap to grid
                connectionLineType='smoothstep'  // Curved connection lines
            >
                <Background color="#aaa" gap={gridSize} />  {/* Grid background */}
                <Controls />                                {/* Zoom/pan controls */}
                <MiniMap />                                 {/* Mini overview map */}
            </ReactFlow>
        </div>
        </>
    )
}
```

**What it does**:
- **ReactFlow Canvas**: Main interactive area for building pipelines
- **Drop Handler**: Converts dragged nodes into actual nodes on canvas
- **Position Calculation**: Converts mouse coordinates to canvas coordinates
- **Node Management**: Connects to Zustand store for state management
- **Visual Features**: Grid background, zoom controls, minimap

**Key Concept - ReactFlow**:
ReactFlow is a library specifically designed for building node-based editors. It handles:
- Rendering nodes and edges
- Dragging nodes around
- Creating connections between nodes
- Zooming and panning
- Selection and deletion

---


### 7. `nodes/inputNode.js` - Input Node Component

**Purpose**: Represents an input source in the pipeline (where data enters).

**Line-by-Line Breakdown**:
```javascript
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const InputNode = ({ id, data }) => {
    // State for input name (default: input_1, input_2, etc.)
    const [currName, setCurrName] = useState(
        data?.inputName || id.replace('customInput-', 'input_')
    );
    
    // State for input type (Text or File)
    const [inputType, setInputType] = useState(data.inputType || 'Text');

    // Update name when user types
    const handleNameChange = (e) => {
        setCurrName(e.target.value);
    };

    // Update type when user selects from dropdown
    const handleTypeChange = (e) => {
        setInputType(e.target.value);
    };

    return (
        <div style={{width: 200, height: 80, border: '1px solid black'}}>
            <div>
                <span>Input</span>  {/* Node title */}
            </div>
            <div>
                {/* Name input field */}
                <label>
                    Name:
                    <input 
                        type="text" 
                        value={currName} 
                        onChange={handleNameChange} 
                    />
                </label>
                
                {/* Type dropdown */}
                <label>
                    Type:
                    <select value={inputType} onChange={handleTypeChange}>
                        <option value="Text">Text</option>
                        <option value="File">File</option>
                    </select>
                </label>
            </div>
            
            {/* Connection point on the right side */}
            <Handle
                type="source"              // This node outputs data
                position={Position.Right}  // Handle on right side
                id={`${id}-value`}        // Unique handle ID
            />
        </div>
    );
}
```

**What it does**:
- Displays an input node with configurable name and type
- Has one output handle (source) on the right side
- Users can connect this output to other nodes' inputs
- Stores configuration in local state

**Key Concept - Handles**:
- **Handle**: Connection point on a node
- **Source Handle**: Output - data flows OUT from here
- **Target Handle**: Input - data flows IN to here
- Handles are what you click and drag to create connections

---

### 8. `nodes/llmNode.js` - LLM Node Component

**Purpose**: Represents a Large Language Model processing step.

**Line-by-Line Breakdown**:
```javascript
import { Handle, Position } from 'reactflow';

export const LLMNode = ({ id, data }) => {
    return (
        <div style={{width: 200, height: 80, border: '1px solid black'}}>
            {/* Input handle for system prompt (top third) */}
            <Handle
                type="target"              // This is an input
                position={Position.Left}   // On left side
                id={`${id}-system`}       // Unique ID for system input
                style={{top: `${100/3}%`}} // Position at 33% from top
            />
            
            {/* Input handle for user prompt (bottom third) */}
            <Handle
                type="target"
                position={Position.Left}
                id={`${id}-prompt`}
                style={{top: `${200/3}%`}} // Position at 66% from top
            />
            
            <div>
                <span>LLM</span>  {/* Node title */}
            </div>
            <div>
                <span>This is a LLM.</span>  {/* Description */}
            </div>
            
            {/* Output handle for LLM response */}
            <Handle
                type="source"              // This is an output
                position={Position.Right}  // On right side
                id={`${id}-response`}     // Unique ID for output
            />
        </div>
    );
}
```

**What it does**:
- Displays an LLM processing node
- Has 2 input handles (system prompt, user prompt) on the left
- Has 1 output handle (response) on the right
- Represents where LLM processing happens in the pipeline

---


### 9. `nodes/outputNode.js` - Output Node Component

**Purpose**: Represents where data exits the pipeline (final output).

**Line-by-Line Breakdown**:
```javascript
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const OutputNode = ({ id, data }) => {
    // State for output name (default: output_1, output_2, etc.)
    const [currName, setCurrName] = useState(
        data?.outputName || id.replace('customOutput-', 'output_')
    );
    
    // State for output type (Text or Image)
    const [outputType, setOutputType] = useState(data.outputType || 'Text');

    // Update name when user types
    const handleNameChange = (e) => {
        setCurrName(e.target.value);
    };

    // Update type when user selects from dropdown
    const handleTypeChange = (e) => {
        setOutputType(e.target.value);
    };

    return (
        <div style={{width: 200, height: 80, border: '1px solid black'}}>
            {/* Input handle on the left */}
            <Handle
                type="target"              // This is an input
                position={Position.Left}   // On left side
                id={`${id}-value`}        // Unique handle ID
            />
            
            <div>
                <span>Output</span>  {/* Node title */}
            </div>
            <div>
                {/* Name input field */}
                <label>
                    Name:
                    <input 
                        type="text" 
                        value={currName} 
                        onChange={handleNameChange} 
                    />
                </label>
                
                {/* Type dropdown */}
                <label>
                    Type:
                    <select value={outputType} onChange={handleTypeChange}>
                        <option value="Text">Text</option>
                        <option value="File">Image</option>
                    </select>
                </label>
            </div>
        </div>
    );
}
```

**What it does**:
- Displays an output node with configurable name and type
- Has one input handle (target) on the left side
- Receives data from other nodes
- Represents the final output of the pipeline

---

### 10. `nodes/textNode.js` - Text Node Component

**Purpose**: Represents a static text value or template in the pipeline.

**Line-by-Line Breakdown**:
```javascript
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
    // State for text content (default: {{input}})
    const [currText, setCurrText] = useState(data?.text || '{{input}}');

    // Update text when user types
    const handleTextChange = (e) => {
        setCurrText(e.target.value);
    };

    return (
        <div style={{width: 200, height: 80, border: '1px solid black'}}>
            <div>
                <span>Text</span>  {/* Node title */}
            </div>
            <div>
                {/* Text input field */}
                <label>
                    Text:
                    <input 
                        type="text" 
                        value={currText} 
                        onChange={handleTextChange} 
                    />
                </label>
            </div>
            
            {/* Output handle on the right */}
            <Handle
                type="source"              // This is an output
                position={Position.Right}  // On right side
                id={`${id}-output`}       // Unique handle ID
            />
        </div>
    );
}
```

**What it does**:
- Displays a text node with editable content
- Has one output handle (source) on the right
- Can contain static text or templates like `{{input}}`
- Useful for providing prompts or static values

---

### 11. `submit.js` - Submit Button Component

**Purpose**: Button to submit the completed pipeline for processing.

**Line-by-Line Breakdown**:
```javascript
export const SubmitButton = () => {
    return (
        <div style={{
            display: 'flex',           // Flexbox layout
            alignItems: 'center',      // Center vertically
            justifyContent: 'center'   // Center horizontally
        }}>
            <button type="submit">Submit</button>  {/* Submit button */}
        </div>
    );
}
```

**What it does**:
- Displays a centered submit button
- Currently just a UI element (no functionality attached yet)
- Would trigger pipeline submission to backend when implemented

---

### 12. `backend/main.py` - Backend API

**Purpose**: FastAPI backend to receive and process pipelines.

**Line-by-Line Breakdown**:
```python
from fastapi import FastAPI, Form

app = FastAPI()  # Create FastAPI application

# Health check endpoint
@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

# Pipeline parsing endpoint
@app.get('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    return {'status': 'parsed'}
```

**What it does**:
- Provides REST API endpoints
- `/` - Health check endpoint
- `/pipelines/parse` - Receives pipeline data for processing
- Currently returns mock responses (not fully implemented)

---


## 🔑 Key Concepts Explained

### What is ReactFlow?

**ReactFlow** is a specialized React library for building node-based editors, diagrams, and workflows. Think of it as a framework that handles all the complex logic for:

1. **Node Rendering**: Displaying boxes (nodes) on a canvas
2. **Edge Rendering**: Drawing lines (connections) between nodes
3. **Interactions**: Dragging nodes, creating connections, zooming, panning
4. **Layout Management**: Positioning and organizing nodes
5. **Selection**: Selecting multiple nodes/edges
6. **Deletion**: Removing nodes/edges

**Why use ReactFlow?**
- Building a node editor from scratch is extremely complex
- ReactFlow handles all the low-level canvas operations
- Provides hooks and components for easy customization
- Optimized for performance with many nodes

### What is a Node?

A **node** is a visual representation of a step or component in your pipeline. Each node:

1. **Has a Type**: Input, LLM, Output, Text
2. **Has Data**: Configuration and properties
3. **Has Handles**: Connection points for data flow
4. **Has a Position**: X, Y coordinates on canvas
5. **Has an ID**: Unique identifier

**Node Structure**:
```javascript
{
    id: "llm-1",              // Unique identifier
    type: "llm",              // Node type
    position: { x: 100, y: 200 },  // Canvas position
    data: {                   // Custom data
        id: "llm-1",
        nodeType: "llm"
    }
}
```

### What is an Edge?

An **edge** is a connection between two nodes, representing data flow. Each edge:

1. **Has a Source**: The node where data comes from
2. **Has a Target**: The node where data goes to
3. **Has a Style**: Line type, animation, arrows
4. **Has an ID**: Unique identifier

**Edge Structure**:
```javascript
{
    id: "e1-2",                    // Unique identifier
    source: "text-1",              // Source node ID
    sourceHandle: "text-1-output", // Source handle ID
    target: "llm-1",               // Target node ID
    targetHandle: "llm-1-prompt",  // Target handle ID
    type: "smoothstep",            // Curved line
    animated: true,                // Animated dashes
    markerEnd: {                   // Arrow at end
        type: MarkerType.Arrow
    }
}
```

### What is Zustand?

**Zustand** is a lightweight state management library (alternative to Redux). It:

1. **Stores Global State**: Data accessible from any component
2. **Provides Actions**: Functions to modify state
3. **Triggers Re-renders**: Components update when state changes
4. **Simple API**: Much easier than Redux

**Why use Zustand?**
- Multiple components need access to nodes/edges
- State needs to persist across component re-renders
- Simpler than Redux, more powerful than useState

### What is Drag and Drop?

The drag-and-drop system works in several steps:

1. **Drag Start**: User clicks and holds on a DraggableNode
   - `onDragStart` event fires
   - Node type is stored in `event.dataTransfer`
   - Cursor changes to "grabbing"

2. **Drag Over**: User drags over the canvas
   - `onDragOver` event fires continuously
   - Must call `event.preventDefault()` to allow drop

3. **Drop**: User releases mouse over canvas
   - `onDrop` event fires
   - Extract node type from `event.dataTransfer`
   - Calculate position from mouse coordinates
   - Create new node at that position
   - Add node to Zustand store

4. **Render**: ReactFlow displays the new node
   - Store update triggers re-render
   - ReactFlow receives updated nodes array
   - New node appears on canvas

---


## 📊 Data Flow Diagram

### Complete Application Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTIONS                            │
└─────────────────────────────────────── ─────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ Drag Node    │ │ Move Node    │ │ Connect      │
            │ from Toolbar │ │ on Canvas    │ │ Nodes        │
            └──────────────┘ └──────────────┘ └──────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                        ┌───────────────────────┐
                        │   EVENT HANDLERS      │
                        │  (in ui.js)           │
                        │  - onDrop             │
                        │  - onNodesChange      │
                        │  - onConnect          │
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   ZUSTAND STORE       │
                        │   (store.js)          │
                        │                       │
                        │  State:               │
                        │  - nodes: []          │
                        │  - edges: []          │
                        │                       │
                        │  Actions:             │
                        │  - addNode()          │
                        │  - onNodesChange()    │
                        │  - onConnect()        │
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   STATE UPDATE        │
                        │   (triggers re-render)│
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   REACTFLOW           │
                        │   (ui.js)             │
                        │                       │
                        │  Renders:             │
                        │  - All nodes          │
                        │  - All edges          │
                        │  - Background         │
                        │  - Controls           │
                        └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   VISUAL UPDATE       │
                        │   (user sees changes) │
                        └───────────────────────┘
```

### Detailed Flow: Adding a Node

```
1. USER ACTION
   │
   ├─> User drags "LLM" from toolbar
   │
   └─> User drops it on canvas at position (300, 200)

2. DRAG START (draggableNode.js)
   │
   ├─> onDragStart() fires
   │
   ├─> Store node type in event.dataTransfer
   │   Data: { nodeType: "llm" }
   │
   └─> Change cursor to "grabbing"

3. DROP (ui.js)
   │
   ├─> onDrop() fires
   │
   ├─> Extract node type from event.dataTransfer
   │   nodeType = "llm"
   │
   ├─> Calculate canvas position
   │   position = { x: 300, y: 200 }
   │
   ├─> Generate unique ID
   │   getNodeID("llm") → "llm-1"
   │
   ├─> Create node object
   │   {
   │     id: "llm-1",
   │     type: "llm",
   │     position: { x: 300, y: 200 },
   │     data: { id: "llm-1", nodeType: "llm" }
   │   }
   │
   └─> Call addNode(newNode)

4. STORE UPDATE (store.js)
   │
   ├─> addNode() executes
   │
   ├─> Update nodes array
   │   nodes = [...nodes, newNode]
   │
   └─> Trigger re-render of subscribed components

5. REACTFLOW RE-RENDER (ui.js)
   │
   ├─> Receives updated nodes array
   │
   ├─> Renders LLMNode component
   │
   └─> Node appears on canvas at (300, 200)

6. USER SEES
   │
   └─> New LLM node visible on canvas
```

### Detailed Flow: Connecting Two Nodes

```
1. USER ACTION
   │
   ├─> User clicks on output handle of Text node
   │
   ├─> User drags to input handle of LLM node
   │
   └─> User releases mouse

2. REACTFLOW INTERNAL
   │
   ├─> Detects connection attempt
   │
   ├─> Creates connection object
   │   {
   │     source: "text-1",
   │     sourceHandle: "text-1-output",
   │     target: "llm-1",
   │     targetHandle: "llm-1-prompt"
   │   }
   │
   └─> Calls onConnect(connection)

3. STORE UPDATE (store.js)
   │
   ├─> onConnect() executes
   │
   ├─> Create edge with styling
   │   {
   │     ...connection,///existing connections
   │     type: "smoothstep",
   │     animated: true,
   │     markerEnd: { type: Arrow }
   │   }
   │
   ├─> Add to edges array
   │   edges = [...edges, newEdge]
   │
   └─> Trigger re-render

4. REACTFLOW RE-RENDER
   │
   ├─> Receives updated edges array
   │
   ├─> Renders curved line between nodes
   │
   └─> Shows animated dashes and arrow

5. USER SEES
   │
   └─> Animated connection line between nodes
```

---


## 🔄 How Everything Works Together

### Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                          App.js                              │
│  (Root component - assembles the UI)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              PipelineToolbar                        │    │
│  │  (toolbar.js)                                       │    │
│  │                                                     │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │    │
│  │  │  Input   │ │   LLM    │ │  Output  │ │ Text │ │    │
│  │  │ (Drag)   │ │  (Drag)  │ │  (Drag)  │ │(Drag)│ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────┘ │    │
│  │       ▲            ▲                       ▲      │    │
│  │       └────────────┴────────────┴───────────┘      │    │
│  │              DraggableNode.js                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │              PipelineUI                            │    │
│  │  (ui.js - Main Canvas)                             │    │
│  │                                                    │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │         ReactFlow Canvas                    │   │    │
│  │  │                                             │   │    │
│  │  │  ┌──────┐      ┌──────┐      ┌──────┐       │   │    │
│  │  │  │Input │─────>│ LLM  │─────>│Output│       │   │    │
│  │  │  │Node  │      │Node  │      │Node  │       │   │    │
│  │  │  └──────┘      └──────┘      └──────┘       │   │    │
│  │  │                                             │   │    │
│  │  │  [Background Grid]                          │   │    │
│  │  │  [Zoom Controls]                            │   │    │
│  │  │  [MiniMap]                                  │   │    │
│  │  └────────────────────────────────────────────┘    │    │
│  │                      ▲                             │    │
│  │                      │                             │    │
│  │              Uses node types:                      │    │
│  │         InputNode, LLMNode,                        │    │
│  │         OutputNode, TextNode                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              SubmitButton                           │    │
│  │  (submit.js)                                       │    │
│  │                                                     │    │
│  │              [Submit Button]                        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ All components access
                              ▼
                  ┌───────────────────────┐
                  │   Zustand Store       │
                  │   (store.js)          │
                  │                       │
                  │  - nodes[]            │
                  │  - edges[]            │
                  │  - actions            │
                  └───────────────────────┘
```

### State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ZUSTAND STORE (store.js)                  │
│                                                              │
│  STATE:                                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │ nodes: [                                            │    │
│  │   { id: "input-1", type: "customInput", ... },     │    │
│  │   { id: "llm-1", type: "llm", ... },               │    │
│  │   { id: "output-1", type: "customOutput", ... }    │    │
│  │ ]                                                   │    │
│  │                                                     │    │
│  │ edges: [                                            │    │
│  │   { source: "input-1", target: "llm-1", ... },     │    │
│  │   { source: "llm-1", target: "output-1", ... }     │    │
│  │ ]                                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ACTIONS:                                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ addNode(node)         → Add new node to array      │    │
│  │ onNodesChange(changes) → Update node positions     │    │
│  │ onEdgesChange(changes) → Update edges              │    │
│  │ onConnect(connection)  → Create new edge           │    │
│  │ updateNodeField(...)   → Update node data          │    │
│  │ getNodeID(type)        → Generate unique ID        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Components subscribe
                              ▼
        ┌─────────────────────────────────────────┐
        │  Any component can:                     │
        │  - Read state (nodes, edges)            │
        │  - Call actions (addNode, onConnect)    │
        │  - Auto re-render on state changes      │
        └─────────────────────────────────────────┘
```

### Example Pipeline Execution Flow

Let's trace what happens when a user builds this pipeline:
**Input → Text → LLM → Output**

```
STEP 1: User drags Input node
├─> DraggableNode stores type="customInput"
├─> User drops on canvas
├─> onDrop creates node object
├─> addNode() adds to store
└─> ReactFlow renders InputNode component

STEP 2: User drags Text node
├─> DraggableNode stores type="text"
├─> User drops on canvas
├─> onDrop creates node object
├─> addNode() adds to store
└─> ReactFlow renders TextNode component

STEP 3: User drags LLM node
├─> DraggableNode stores type="llm"
├─> User drops on canvas
├─> onDrop creates node object
├─> addNode() adds to store
└─> ReactFlow renders LLMNode component

STEP 4: User drags Output node
├─> DraggableNode stores type="customOutput"
├─> User drops on canvas
├─> onDrop creates node object
├─> addNode() adds to store
└─> ReactFlow renders OutputNode component

STEP 5: User connects Input → Text
├─> User drags from Input's source handle
├─> User drops on Text's target handle
├─> onConnect() creates edge
├─> Edge added to store
└─> ReactFlow renders connection line

STEP 6: User connects Text → LLM
├─> User drags from Text's source handle
├─> User drops on LLM's target handle
├─> onConnect() creates edge
├─> Edge added to store
└─> ReactFlow renders connection line

STEP 7: User connects LLM → Output
├─> User drags from LLM's source handle
├─> User drops on Output's target handle
├─> onConnect() creates edge
├─> Edge added to store
└─> ReactFlow renders connection line

FINAL STATE in Zustand Store:
nodes: [
  { id: "customInput-1", type: "customInput", position: {...}, data: {...} },
  { id: "text-1", type: "text", position: {...}, data: {...} },
  { id: "llm-1", type: "llm", position: {...}, data: {...} },
  { id: "customOutput-1", type: "customOutput", position: {...}, data: {...} }
]

edges: [
  { source: "customInput-1", target: "text-1", ... },
  { source: "text-1", target: "llm-1", ... },
  { source: "llm-1", target: "customOutput-1", ... }
]
```

---


## 🎨 Visual Data Flow Diagram (Venn-Style)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                         ENTIRE APPLICATION                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │                      USER INTERFACE LAYER                        │  │
│  │                                                                   │  │
│  │   ┌─────────────┐         ┌──────────────┐                      │  │
│  │   │  Toolbar    │         │   Canvas     │                      │  │
│  │   │             │         │              │                      │  │
│  │   │ [Input]     │         │  ┌────────┐  │                      │  │
│  │   │ [LLM]       │────────>│  │ Nodes  │  │                      │  │
│  │   │ [Output]    │  Drag   │  │ Edges  │  │                      │  │
│  │   │ [Text]      │         │  └────────┘  │                      │  │
│  │   │             │         │              │                      │  │
│  │   └─────────────┘         └──────────────┘                      │  │
│  │         │                        │                               │  │
│  │         │                        │                               │  │
│  │         └────────────┬───────────┘                               │  │
│  │                      │                                           │  │
│  └──────────────────────┼───────────────────────────────────────────┘  │
│                         │                                               │
│                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │                    STATE MANAGEMENT LAYER                       │  │
│  │                      (Zustand Store)                            │  │
│  │                                                                  │  │
│  │    ┌──────────────────────────────────────────────────┐        │  │
│  │    │                                                   │        │  │
│  │    │  STATE:           │         ACTIONS:             │        │  │
│  │    │  • nodes[]        │         • addNode()          │        │  │
│  │    │  • edges[]        │         • onConnect()        │        │  │
│  │    │  • nodeIDs{}      │         • onNodesChange()    │        │  │
│  │    │                   │         • onEdgesChange()    │        │  │
│  │    │                   │         • updateNodeField()  │        │  │
│  │    │                   │         • getNodeID()        │        │  │
│  │    │                                                   │        │  │
│  │    └──────────────────────────────────────────────────┘        │  │
│  │                         │                                       │  │
│  └─────────────────────────┼───────────────────────────────────────┘  │
│                            │                                           │
│                            ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │                    RENDERING LAYER                              │  │
│  │                      (ReactFlow)                                │  │
│  │                                                                  │  │
│  │    ┌────────────────────────────────────────────────┐          │  │
│  │    │                                                 │          │  │
│  │    │  • Renders nodes at positions                  │          │  │
│  │    │  • Draws edges between nodes                   │          │  │
│  │    │  • Handles drag interactions                   │          │  │
│  │    │  • Manages zoom/pan                            │          │  │
│  │    │  • Displays background grid                    │          │  │
│  │    │  • Shows minimap                               │          │  │
│  │    │                                                 │          │  │
│  │    └────────────────────────────────────────────────┘          │  │
│  │                         │                                       │  │
│  └─────────────────────────┼───────────────────────────────────────┘  │
│                            │                                           │
│                            ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │                    NODE COMPONENTS LAYER                        │  │
│  │                                                                  │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │  │
│  │   │ Input   │  │   LLM   │  │ Output  │  │  Text   │          │  │
│  │   │  Node   │  │  Node   │  │  Node   │  │  Node   │          │  │
│  │   │         │  │         │  │         │  │         │          │  │
│  │   │ • Name  │  │ • System│  │ • Name  │  │ • Text  │          │  │
│  │   │ • Type  │  │ • Prompt│  │ • Type  │  │ • Output│          │  │
│  │   │ • Output│  │ • Output│  │ • Input │  │         │          │  │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Future Integration
                                  ▼
                        ┌──────────────────┐
                        │  Backend API     │
                        │  (FastAPI)       │
                        │                  │
                        │  • Parse         │
                        │  • Execute       │
                        │  • Return Results│
                        └──────────────────┘
```

### Data Flow Between Layers

```
USER ACTION (Click, Drag, Drop)
        │
        ▼
┌───────────────────┐
│  UI LAYER         │  ← User sees and interacts
│  (Components)     │
└───────────────────┘
        │
        │ Event (onDrop, onConnect, etc.)
        ▼
┌───────────────────┐
│  STATE LAYER      │  ← Data stored and managed
│  (Zustand)        │
└───────────────────┘
        │
        │ State update triggers re-render
        ▼
┌───────────────────┐
│  RENDERING LAYER  │  ← ReactFlow draws everything
│  (ReactFlow)      │
└───────────────────┘
        │
        │ Renders specific node types
        ▼
┌───────────────────┐
│  NODE LAYER       │  ← Individual node components
│  (Node Components)│
└───────────────────┘
        │
        │ Visual output
        ▼
    USER SEES UPDATE
```

---


## 🔍 Deep Dive: How Each Line of Code Works

### Example: Complete Flow of Dropping a Node

Let's trace EVERY line of code that executes when you drag an LLM node onto the canvas:

#### 1. User Clicks on LLM Button (toolbar.js)

```javascript
// toolbar.js line 8
<DraggableNode type='llm' label='LLM' />
```
- Creates a DraggableNode component
- Props: type='llm', label='LLM'

#### 2. DraggableNode Renders (draggableNode.js)

```javascript
// draggableNode.js line 3
export const DraggableNode = ({ type, label }) => {
```
- Receives props: type='llm', label='LLM'

```javascript
// line 4-8
const onDragStart = (event, nodeType) => {
    const appData = { nodeType }  // { nodeType: 'llm' }
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
};
```
- Defines function to handle drag start
- Will store node type in drag event

```javascript
// line 11-25
return (
    <div
        className={type}  // className='llm'
        onDragStart={(event) => onDragStart(event, type)}  // Attach handler
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={{ ... }}
        draggable  // Makes div draggable
    >
        <span style={{ color: '#fff' }}>{label}</span>  // Displays 'LLM'
    </div>
);
```
- Renders a draggable div
- Shows "LLM" text
- Has drag event handlers attached

#### 3. User Starts Dragging

```javascript
// onDragStart fires (draggableNode.js line 4)
const appData = { nodeType: 'llm' }
```
- Creates object with node type

```javascript
// line 6
event.target.style.cursor = 'grabbing';
```
- Changes cursor to closed hand

```javascript
// line 7
event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
```
- Stores '{"nodeType":"llm"}' in drag data
- This data travels with the drag operation

#### 4. User Drags Over Canvas

```javascript
// ui.js line 78-81
const onDragOver = useCallback((event) => {
    event.preventDefault();  // Required to allow drop
    event.dataTransfer.dropEffect = 'move';  // Show move cursor
}, []);
```
- Fires continuously while dragging over canvas
- Must call preventDefault() or drop won't work

#### 5. User Releases Mouse (Drop)

```javascript
// ui.js line 48
const onDrop = useCallback((event) => {
```
- Drop handler begins

```javascript
// line 49
event.preventDefault();
```
- Prevent default browser behavior

```javascript
// line 51
const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
```
- Get canvas position and size
- Example: { left: 10, top: 100, width: 1200, height: 600 }

```javascript
// line 52-53
if (event?.dataTransfer?.getData('application/reactflow')) {
    const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
```
- Retrieve stored data: '{"nodeType":"llm"}'
- Parse to object: { nodeType: 'llm' }

```javascript
// line 54
const type = appData?.nodeType;  // type = 'llm'
```
- Extract node type

```javascript
// line 57-59
if (typeof type === 'undefined' || !type) {
    return;  // Exit if invalid
}
```
- Validate node type exists

```javascript
// line 61-64
const position = reactFlowInstance.project({
    x: event.clientX - reactFlowBounds.left,
    y: event.clientY - reactFlowBounds.top,
});
```
- Convert mouse coordinates to canvas coordinates
- Example: Mouse at (500, 400), canvas at (10, 100)
- Result: { x: 490, y: 300 }

```javascript
// line 66
const nodeID = getNodeID(type);
```
- Calls Zustand store action to generate ID

#### 6. Generate Node ID (store.js)

```javascript
// store.js line 13
getNodeID: (type) => {
```
- Receives type='llm'

```javascript
// line 14
const newIDs = {...get().nodeIDs};
```
- Copy current ID counters
- Example: { customInput: 2, llm: 1, text: 3 }

```javascript
// line 15-17
if (newIDs[type] === undefined) {
    newIDs[type] = 0;
}
```
- Initialize counter if first node of this type

```javascript
// line 18
newIDs[type] += 1;
```
- Increment counter
- newIDs.llm = 2

```javascript
// line 19
set({nodeIDs: newIDs});
```
- Update store with new counters

```javascript
// line 20
return `${type}-${newIDs[type]}`;
```
- Return "llm-2"

#### 7. Create Node Object (ui.js)

```javascript
// ui.js line 67-72
const newNode = {
    id: nodeID,              // "llm-2"
    type,                    // "llm"
    position,                // { x: 490, y: 300 }
    data: getInitNodeData(nodeID, type),
};
```
- Create complete node object

```javascript
// line 40-43
const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
};
```
- Returns: { id: "llm-2", nodeType: "llm" }

Final newNode object:
```javascript
{
    id: "llm-2",
    type: "llm",
    position: { x: 490, y: 300 },
    data: { id: "llm-2", nodeType: "llm" }
}
```

#### 8. Add Node to Store

```javascript
// ui.js line 74
addNode(newNode);
```
- Calls Zustand store action

```javascript
// store.js line 22-26
addNode: (node) => {
    set({
        nodes: [...get().nodes, node]
    });
},
```
- Get current nodes array
- Append new node
- Update store
- This triggers re-render of all subscribed components

#### 9. ReactFlow Re-renders

```javascript
// ui.js line 85-100
<ReactFlow
    nodes={nodes}  // Now includes new node
    edges={edges}
    ...
    nodeTypes={nodeTypes}  // { llm: LLMNode, ... }
    ...
>
```
- ReactFlow receives updated nodes array
- Finds node with type="llm"
- Looks up nodeTypes.llm → LLMNode component
- Renders LLMNode at position (490, 300)

#### 10. LLMNode Renders

```javascript
// llmNode.js line 5
export const LLMNode = ({ id, data }) => {
```
- Receives props: id="llm-2", data={ id: "llm-2", nodeType: "llm" }

```javascript
// line 7-42
return (
    <div style={{width: 200, height: 80, border: '1px solid black'}}>
        <Handle type="target" position={Position.Left} id={`${id}-system`} ... />
        <Handle type="target" position={Position.Left} id={`${id}-prompt`} ... />
        <div><span>LLM</span></div>
        <div><span>This is a LLM.</span></div>
        <Handle type="source" position={Position.Right} id={`${id}-response`} />
    </div>
);
```
- Renders node with:
  - 2 input handles on left (system, prompt)
  - 1 output handle on right (response)
  - "LLM" title and description

#### 11. User Sees Result

- New LLM node appears on canvas at drop position
- Node has proper styling and handles
- Ready to be connected to other nodes

---


## 🧩 How Files Interrelate

### Dependency Graph

```
index.js
    │
    └─> App.js
            │
            ├─> toolbar.js
            │       │
            │       └─> draggableNode.js
            │
            ├─> ui.js
            │       │
            │       ├─> store.js (Zustand)
            │       │
            │       └─> Node Components
            │               ├─> inputNode.js
            │               ├─> llmNode.js
            │               ├─> outputNode.js
            │               └─> textNode.js
            │
            └─> submit.js
```

### File Interaction Matrix

| File | Imports From | Exports To | Purpose |
|------|-------------|------------|---------|
| **index.js** | App.js | - | Entry point, renders App |
| **App.js** | toolbar.js, ui.js, submit.js | index.js | Root component, layout |
| **store.js** | zustand, reactflow | ui.js, (any component) | Global state management |
| **draggableNode.js** | - | toolbar.js | Draggable node buttons |
| **toolbar.js** | draggableNode.js | App.js | Toolbar with node types |
| **ui.js** | store.js, reactflow, all node components | App.js | Main canvas |
| **inputNode.js** | reactflow | ui.js | Input node component |
| **llmNode.js** | reactflow | ui.js | LLM node component |
| **outputNode.js** | reactflow | ui.js | Output node component |
| **textNode.js** | reactflow | ui.js | Text node component |
| **submit.js** | - | App.js | Submit button |

### Communication Patterns

#### Pattern 1: Parent-Child Props
```
App.js
  └─> PipelineToolbar (no props)
        └─> DraggableNode (props: type, label)
```

#### Pattern 2: Global State (Zustand)
```
store.js (holds state)
    ↕
ui.js (reads/writes state)
    ↕
Node Components (could read/write state)
```

#### Pattern 3: Event Bubbling
```
User drags DraggableNode
    │
    └─> Drag data stored in event
            │
            └─> Event bubbles to ui.js
                    │
                    └─> onDrop handler processes
                            │
                            └─> Updates Zustand store
```

---

## 💡 Key Takeaways

### What This App Does (Simple Explanation)

Imagine you're building a recipe for processing data:
1. **Toolbar** = Your ingredient shelf (Input, LLM, Output, Text)
2. **Canvas** = Your kitchen counter where you arrange ingredients
3. **Nodes** = Individual ingredients or steps
4. **Edges** = How ingredients flow from one step to another
5. **Store** = Your recipe book that remembers everything

### Why Each Technology Was Chosen

1. **React**: Industry standard for building UIs, component-based
2. **ReactFlow**: Specialized for node-based editors, saves months of development
3. **Zustand**: Simpler than Redux, perfect for this use case
4. **FastAPI**: Fast Python backend, easy to integrate with AI/ML

### What Makes This Architecture Good

1. **Separation of Concerns**: Each file has one clear purpose
2. **Reusability**: Node components can be easily extended
3. **Maintainability**: Clear data flow, easy to debug
4. **Scalability**: Easy to add new node types
5. **State Management**: Centralized state prevents bugs

---

## 🚀 How to Extend This Application

### Adding a New Node Type

1. **Create node component** (`src/nodes/myNode.js`):
```javascript
import { Handle, Position } from 'reactflow';

export const MyNode = ({ id, data }) => {
    return (
        <div style={{width: 200, height: 80, border: '1px solid black'}}>
            <Handle type="target" position={Position.Left} id={`${id}-input`} />
            <div><span>My Custom Node</span></div>
            <Handle type="source" position={Position.Right} id={`${id}-output`} />
        </div>
    );
}
```

2. **Register in ui.js**:
```javascript
import { MyNode } from './nodes/myNode';

const nodeTypes = {
    customInput: InputNode,
    llm: LLMNode,
    customOutput: OutputNode,
    text: TextNode,
    myCustom: MyNode,  // Add here
};
```

3. **Add to toolbar** (toolbar.js):
```javascript
<DraggableNode type='myCustom' label='My Node' />
```

### Implementing Submit Functionality

```javascript
// submit.js
import { useStore } from './store';

export const SubmitButton = () => {
    const { nodes, edges } = useStore();
    
    const handleSubmit = async () => {
        const pipeline = { nodes, edges };
        
        const response = await fetch('http://localhost:8000/pipelines/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pipeline)
        });
        
        const result = await response.json();
        console.log('Pipeline result:', result);
    };
    
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
```

---

## 📚 Additional Resources

### ReactFlow Documentation
- Official Docs: https://reactflow.dev/
- Examples: https://reactflow.dev/examples
- API Reference: https://reactflow.dev/api-reference

### Zustand Documentation
- GitHub: https://github.com/pmndrs/zustand
- Getting Started: https://docs.pmnd.rs/zustand/getting-started/introduction

### React Documentation
- Official Docs: https://react.dev/
- Hooks Reference: https://react.dev/reference/react

---

## 🎓 Summary

This application is a **Visual Pipeline Builder** that allows users to create data processing workflows through a drag-and-drop interface. It uses:

- **React** for the UI framework
- **ReactFlow** for the node-based editor
- **Zustand** for state management
- **FastAPI** for the backend (ready for integration)

The architecture is clean, maintainable, and extensible. Each component has a single responsibility, and data flows predictably through the Zustand store. The application is production-ready for the frontend, with backend integration points prepared.

**Core Flow**: User drags nodes → Drops on canvas → Store updates → ReactFlow renders → User sees visual pipeline → User connects nodes → Store updates → ReactFlow renders connections → User submits → Backend processes (when implemented)

---

*End of Documentation*
