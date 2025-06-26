
// UI组件 - 负责渲染
export function HealthCheckButton({ loading, onCheck }) {
  return (
    <button 
      onClick={onCheck}
      disabled={loading}
      style={{ 
        padding: '12px 24px', 
        fontSize: '16px', 
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: loading ? 'not-allowed' : 'pointer',
        minWidth: '140px'
      }}
    >
      {loading ? '检查中...' : '检查服务状态'}
    </button>
  );
}

export function ResponseDisplay({ response, error }) {
  if (!response && !error) return null;

  return (
    <div style={{
      padding: '15px',
      backgroundColor: error ? '#f8d7da' : '#f8f9fa',
      border: `1px solid ${error ? '#f5c6cb' : '#dee2e6'}`,
      borderRadius: '6px',
      marginTop: '20px'
    }}>
      <h3>Response:</h3>
      <pre style={{
        backgroundColor: error ? '#f1b0b7' : '#e9ecef',
        padding: '10px',
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '14px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        color: error ? '#721c24' : 'inherit'
      }}>
        {error || response}
      </pre>
    </div>
  );
}
