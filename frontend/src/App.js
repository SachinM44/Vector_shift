import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  return (
    <div style={styles.app}>
      <PipelineToolbar />
      <PipelineUI />
      
    </div>
  );
}

const styles = {
  app: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f8fafc',
  },
};

export default App;
