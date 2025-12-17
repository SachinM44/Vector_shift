# VectorShift Frontend Assessment - Implementation Tasks

## Task Overview

This implementation plan breaks down the assessment into manageable, sequential tasks. Each task builds upon previous work to create a complete, polished solution.

---

## Phase 1: Node Abstraction System

- [ ] 1. Create design system and theme configuration
  - Create `src/styles/theme.js` with color palette, typography, spacing
  - Define consistent design tokens matching VectorShift aesthetic
  - Export theme object for use across components
  - _Requirements: 2.1, 2.2_

- [ ] 2. Create node configuration system
  - Create `src/nodes/nodeConfigs.js` file
  - Define configuration schema for node types
  - Migrate existing 4 node types to configuration format
  - Add validation for node configurations
  - _Requirements: 1.1, 1.2_

- [ ] 3. Build BaseNode component
  - Create `src/components/BaseNode.js`
  - Implement handle generation from configuration
  - Implement field rendering from configuration
  - Add state management for field values
  - Apply theme styling to base component
  - _Requirements: 1.1, 1.3, 1.5, 2.2_

- [ ] 4. Refactor existing nodes to use BaseNode
  - Update `inputNode.js` to use BaseNode with configuration
  - Update `llmNode.js` to use BaseNode with configuration
  - Update `outputNode.js` to use BaseNode with configuration
  - Keep `textNode.js` separate (will be enhanced later)
  - Test that existing functionality still works
  - _Requirements: 1.1, 1.2_

- [ ] 5. Create five new node types
  - Add configuration for: API node, Database node, Transform node, Filter node, Merge node
  - Register new nodes in nodeTypes mapping
  - Add new nodes to toolbar
  - Demonstrate variety in handle configurations and fields
  - _Requirements: 1.4_

---

## Phase 2: Professional UI Styling

- [ ] 6. Style the toolbar component
  - Apply modern card-based layout for node buttons
  - Add icons to node types (can use emoji or react-icons)
  - Implement hover effects and transitions
  - Add color coding by node category
  - Improve spacing and visual hierarchy
  - _Requirements: 2.3, 2.4_

- [ ] 7. Style the canvas and ReactFlow components
  - Update background pattern and colors
  - Style the minimap component
  - Style zoom controls
  - Add custom edge styling with gradients
  - Improve node selection indicators
  - _Requirements: 2.5, 2.6_

- [ ] 8. Style the submit button
  - Create prominent call-to-action button
  - Add loading state styling
  - Implement hover and active states
  - Position appropriately in layout
  - _Requirements: 2.7_

- [ ] 9. Apply global styling and polish
  - Update `App.js` layout with proper spacing
  - Add background gradient or pattern
  - Ensure consistent spacing throughout
  - Add smooth transitions for interactions
  - Test responsive behavior
  - _Requirements: 2.1, 2.2_

---

## Phase 3: Dynamic Text Node

- [ ] 10. Implement text node auto-resize
  - Update `textNode.js` to use textarea instead of input
  - Calculate content dimensions dynamically
  - Update node size based on text content
  - Set minimum and maximum dimensions
  - Test with various text lengths
  - _Requirements: 3.1_

- [ ] 11. Create variable parser utility
  - Create `src/utils/variableParser.js`
  - Implement regex to detect `{{variableName}}` pattern
  - Validate JavaScript identifier rules
  - Extract unique variable names from text
  - Add unit tests for edge cases
  - _Requirements: 3.2, 3.3_

- [ ] 12. Implement dynamic handle generation
  - Detect variables in text node on every change
  - Generate handle IDs for each variable
  - Calculate vertical positions for multiple handles
  - Update node data with variable information
  - _Requirements: 3.3, 3.4, 3.6_

- [ ] 13. Implement handle lifecycle management
  - Add handles when new variables detected
  - Remove handles when variables deleted
  - Update handle positions when variables change
  - Ensure real-time updates without full re-render
  - Test with multiple variables being added/removed
  - _Requirements: 3.5, 3.7_

---

## Phase 4: Backend Integration

- [ ] 14. Implement frontend submit functionality
  - Update `submit.js` to extract nodes and edges from store
  - Serialize pipeline data to JSON
  - Implement POST request to `/pipelines/parse`
  - Add loading state during request
  - Handle network errors gracefully
  - _Requirements: 4.1, 4.2, 4.9_

- [ ] 15. Implement backend DAG validation
  - Update `backend/main.py` endpoint
  - Count nodes in pipeline
  - Count edges in pipeline
  - Implement DAG detection algorithm (topological sort or DFS)
  - Return response in required format
  - Handle edge cases (empty pipeline, disconnected nodes)
  - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [ ] 16. Create results alert component
  - Create custom alert/modal component
  - Display num_nodes, num_edges, is_dag in user-friendly format
  - Add visual indicators (checkmark for DAG, warning for cycle)
  - Style alert to match design system
  - Add close button
  - _Requirements: 4.7, 4.8_

- [ ] 17. Test end-to-end integration
  - Test with valid DAG pipeline
  - Test with cyclic pipeline
  - Test with empty pipeline
  - Test with disconnected nodes
  - Test error scenarios
  - Verify alert displays correctly
  - _Requirements: 4.1-4.9_

---

## Phase 5: Final Polish and Testing

- [ ] 18. Add loading and error states
  - Add loading spinner during API call
  - Disable submit button while loading
  - Show error messages for failed requests
  - Add retry functionality
  - _Requirements: 4.9, 5.1_

- [ ] 19. Code cleanup and documentation
  - Add JSDoc comments to key functions
  - Remove console.logs and debug code
  - Ensure consistent code formatting
  - Add README with setup instructions
  - Document new node creation process
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 20. Final testing and bug fixes
  - Test all node types creation
  - Test all connections and edge cases
  - Test text node with complex variable patterns
  - Test backend integration thoroughly
  - Verify styling consistency
  - Fix any discovered bugs
  - _Requirements: All_

- [ ] 21. Prepare submission materials
  - Create zip file with proper naming
  - Record screen recording demonstrating:
    - Creating various node types
    - Connecting nodes
    - Text node variable functionality
    - Submit and DAG validation
    - Code walkthrough
  - Ensure recording is clear and professional
  - Submit through provided form

---

## Notes

- Each task should be completed and tested before moving to the next
- Commit code frequently with clear commit messages
- Test in both development and production builds
- Keep VectorShift's design aesthetic in mind throughout
- Focus on code quality and maintainability
- The assessment values both functionality AND code architecture

## Success Criteria

✅ All 4 parts of assessment completed
✅ 5 new node types created using abstraction
✅ Professional, cohesive UI design
✅ Text node resizes and detects variables
✅ Backend integration works end-to-end
✅ Code is clean, well-organized, and documented
✅ Screen recording clearly demonstrates all features
