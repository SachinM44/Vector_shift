// frontend/src/toolbar.js

import { DraggableNode } from './draggableNode';
import { SubmitButton } from './submit';
export const PipelineToolbar = () => {
  return (
   <div style={styles.toolbar}>
      <div style={styles.container}>
        <div style={styles.nodeGrid}>
          <DraggableNode type='customInput' label='Input' />
          <DraggableNode type='llm' label='LLM' />
          <DraggableNode type='customOutput' label='Output' />
          <DraggableNode type='text' label='Text' />
          <DraggableNode type='api' label='API' />
          <DraggableNode type='database' label='Database' />
          <DraggableNode type='transform' label='Transform' />
          <DraggableNode type='filter' label='Filter' />
          <DraggableNode type='merge' label='Merge' />
        </div>
        <SubmitButton />
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    background: '#ffffff',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  nodeGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
};