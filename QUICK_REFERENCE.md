# VectorShift Assessment - Quick Reference

## 📌 What to Build (TL;DR)

1. **Node Abstraction** → BaseNode + configs + 5 new nodes
2. **Styling** → Dark theme, modern UI, VectorShift-inspired
3. **Text Node** → Auto-resize + `{{variable}}` detection → dynamic handles
4. **Backend** → Submit → Count nodes/edges + check DAG → Alert

---

## 🎯 The 4 Parts Explained Simply

### Part 1: Node Abstraction
**Current Problem**: 4 node files with duplicate code
**Your Solution**: 1 BaseNode + config file → create nodes by just adding config
**Demo**: Create 5 new nodes easily (API, Database, Transform, Filter, Merge)

### Part 2: Styling
**Current Problem**: No styling, looks basic
**Your Solution**: Dark theme, modern cards, shadows, animations
**Demo**: Show professional, cohesive design throughout

### Part 3: Text Node
**Current Problem**: Fixed size, no variable support
**Your Solution**: 
- Auto-resize as user types
- Detect `{{variableName}}` → create handle for each variable
**Demo**: Type "Hello {{name}}, {{status}}" → 2 handles appear on left

### Part 4: Backend
**Current Problem**: No validation
**Your Solution**:
- Frontend: Submit button → POST to backend
- Backend: Count nodes/edges, check if DAG
- Frontend: Show alert with results
**Demo**: Submit pipeline → see "5 nodes, 4 edges, is DAG: true"

---

## 🏗️ File Structure

```
src/
├── components/
│   └── BaseNode.js              ← The magic abstraction
├── nodes/
│   ├── nodeConfigs.js           ← All node definitions
│   ├── [existing 4 nodes]       ← Refactored to use BaseNode
│   └── [5 new nodes]            ← Easy to create!
├── styles/
│   └── theme.js                 ← Colors, fonts, spacing
├── utils/
│   └── variableParser.js        ← Parse {{variables}}
└── [other files updated]
```

---

## 💡 Key Concepts

### BaseNode Component
```javascript
// Instead of this (old way):
// inputNode.js - 50 lines
// llmNode.js - 50 lines (duplicate!)
// outputNode.js - 50 lines (duplicate!)

// Do this (new way):
// BaseNode.js - handles everything
// nodeConfigs.js - just data:
{
  type: 'api',
  label: 'API Call',
  inputs: [...],
  outputs: [...],
  fields: [...]
}
```

### Variable Detection
```javascript
Text: "Hello {{name}}, your {{status}} is ready"
Regex: /\{\{(\w+)\}\}/g
Result: ["name", "status"]
Action: Create 2 handles on left side
```

### DAG Validation
```
Valid DAG:     Invalid (cycle):
A → B → C      A → B → C
                ↑_______|
```

---

## 🎨 Design System

```javascript
Colors:
- Background: #0f172a (dark blue)
- Surface: #1e293b (lighter dark)
- Primary: #3b82f6 (blue)
- Text: #f1f5f9 (light)

Nodes:
- Border radius: 12px
- Shadow: 0 4px 6px rgba(0,0,0,0.3)
- Padding: 16px
- Min width: 200px
```

---

## ✅ Testing Checklist

**Node Abstraction**:
- [ ] Create all 9 node types
- [ ] All nodes look consistent
- [ ] Easy to add new nodes

**Styling**:
- [ ] Dark theme applied
- [ ] Nodes have shadows/gradients
- [ ] Toolbar looks professional
- [ ] Hover effects work

**Text Node**:
- [ ] Resizes with content
- [ ] `{{var}}` creates handle
- [ ] Multiple variables work
- [ ] Deleting variable removes handle

**Backend**:
- [ ] Submit sends data
- [ ] Backend counts correctly
- [ ] DAG detection works
- [ ] Alert shows results
- [ ] Cycle detection works

---

## 🎬 Screen Recording Outline

1. **Intro** (30s): "Hi, I'm Sachin. Here's my assessment."
2. **Node Abstraction** (1.5min): Show code + drag 9 nodes
3. **Styling** (1min): Pan around UI, show design
4. **Text Node** (1.5min): Type with variables, show handles
5. **Backend** (1.5min): Submit DAG, submit cycle
6. **Code** (1min): Quick walkthrough
7. **Outro** (30s): "All done, thank you!"

**Total**: 6-7 minutes

---

## 🚀 Implementation Order

**Day 1-2**: Foundation
1. Create theme.js
2. Create BaseNode.js
3. Create nodeConfigs.js

**Day 3-4**: Nodes
4. Refactor 4 existing nodes
5. Create 5 new nodes
6. Test all work

**Day 5-6**: Styling
7. Style everything
8. Polish and refine

**Day 7**: Text Node
9. Auto-resize
10. Variable detection
11. Dynamic handles

**Day 8**: Backend
12. Submit API call
13. DAG validation
14. Results alert

**Day 9**: Polish
15. Bug fixes
16. Testing
17. Cleanup

**Day 10**: Submit
18. Record video
19. Create zip
20. Submit!

---

## 💻 Code Snippets

### BaseNode Structure
```javascript
export const BaseNode = ({ id, data }) => {
  const config = data.config;
  
  return (
    <div className="base-node" style={getNodeStyle(config)}>
      {/* Render inputs */}
      {config.inputs?.map(input => (
        <Handle type="target" position={input.position} id={input.id} />
      ))}
      
      {/* Render content */}
      <div className="node-header">{config.label}</div>
      
      {/* Render fields */}
      {config.fields?.map(field => renderField(field))}
      
      {/* Render outputs */}
      {config.outputs?.map(output => (
        <Handle type="source" position={output.position} id={output.id} />
      ))}
    </div>
  );
};
```

### Variable Parser
```javascript
export const parseVariables = (text) => {
  const regex = /\{\{(\w+)\}\}/g;
  const variables = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    variables.add(match[1]);
  }
  return Array.from(variables);
};
```

### Submit Handler
```javascript
const handleSubmit = async () => {
  const { nodes, edges } = useStore.getState();
  
  const response = await fetch('http://localhost:8000/pipelines/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges })
  });
  
  const result = await response.json();
  alert(`Nodes: ${result.num_nodes}, Edges: ${result.num_edges}, DAG: ${result.is_dag}`);
};
```

---

## 🎯 Success Criteria

✅ **Functionality**: All 4 parts work perfectly
✅ **Code Quality**: Clean, organized, no duplication
✅ **Design**: Professional, cohesive, polished
✅ **Testing**: Thoroughly tested, no bugs
✅ **Recording**: Clear, confident, comprehensive

---

## 📞 Need Help?

If stuck:
1. Check ASSESSMENT_STRATEGY.md for detailed guidance
2. Check PROJECT_DOCUMENTATION.md for code understanding
3. Check .kiro/specs/ for requirements and design
4. Ask me! I'm here to help step by step

---

## 🎓 Remember

- **Quality > Speed**: Take time to do it right
- **Test Everything**: Don't assume it works
- **Design Matters**: Make it look professional
- **Practice Recording**: Do a dry run first
- **Stay Calm**: You've got this! 💪

---

**Ready to start? Let's build something amazing! 🚀**
