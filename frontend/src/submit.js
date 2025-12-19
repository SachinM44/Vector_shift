import { useStore } from "./store"

export const SubmitButton = () => {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)

    const handleSubmit = async () => {
        try {
            const pipelineDate = {
                nodes: nodes,
                edges: edges
            }
            console.log('submittting the pipelineda', pipelineDate)


            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(pipelineDate)
            });
            if (!response.ok) {
                throw new Error('failed to parse the data')
            }

            const result = await response.json();

            alert(
                `Pipeline Analysis:\n\n` +
                ` Number of Nodes: ${result.num_nodes}\n` +
                ` Number of Edges: ${result.num_edges}\n` +
                `${result.is_dag} Is DAG: ${result.is_dag ? 'Yes' : 'No (Contains Cycle)'}`
            );

        } catch (error) {
            console.error('Error:', error);
            alert(' Error: Could not connect to backend.');
        }


    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button type="submit" onClick={handleSubmit} style={styles.button}>
                Submit
            </button>
        </div>
    );
}

const styles = {
    button: {
        padding: '18px 18px',
        backgroundColor: '#87c31fff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    }
};