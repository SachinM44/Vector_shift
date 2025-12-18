
export const SubmitButton = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button type="submit" style={styles.button}>
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