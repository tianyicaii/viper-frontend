
export function MainPage({response, loading, error, onCheck }) {

  return (
    <div style={{ 
        display: 'flex',
        justifyContent: 'center',  // 水平居中
        alignItems: 'center',      // 垂直居中
        minHeight: '100vh',        // 占满整个视口高度
        margin: 0,
        padding: 0
    }}>
      <div style={{
          padding: '40px', 
          maxWidth: '600px', 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1>healthCheck</h1>
        <div style={{ marginBottom: '20px' }}>
          <HealthCheckButton 
            loading={loading} 
            onCheck={onCheck} 
          />
        </div>
        <ResponseDisplay 
          response={response} 
          error={error} 
        />
      </div>
    </div>
  );
}

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

  // 解析响应数据获取时间戳
  const getTimestamp = () => {
    try {
      const data = JSON.parse(response);
      if (data.time) {
        // 转换为东八区时间
        const date = new Date(data.time);
        return date.toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const timestamp = getTimestamp();
  const isSuccess = !error && response;

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '30px',
      backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
      border: `2px solid ${isSuccess ? '#28a745' : '#dc3545'}`,
      borderRadius: '12px',
      marginTop: '30px',
      textAlign: 'center'
    }}>
      {/* 状态图标 */}
      <div style={{
        fontSize: '48px',
        marginBottom: '15px',
        color: isSuccess ? '#28a745' : '#dc3545'
      }}>
        {isSuccess ? '✅' : '❌'}
      </div>

      {/* 状态文本 */}
      <h3 style={{
        margin: '0 0 10px 0',
        color: isSuccess ? '#155724' : '#721c24',
        fontSize: '20px'
      }}>
        {isSuccess ? '服务状态正常' : '服务异常'}
      </h3>

      {/* 时间戳显示（仅成功时） */}
      {timestamp && (
        <p style={{
          margin: '0 0 15px 0',
          color: '#155724',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          检查时间：{timestamp}
        </p>
      )}

      {/* 错误信息显示（仅失败时） */}
      {error && (
        <div style={{
          backgroundColor: '#f1b0b7',
          padding: '10px',
          borderRadius: '6px',
          color: '#721c24',
          fontSize: '14px',
          fontFamily: 'monospace',
          maxWidth: '100%',
          overflow: 'auto'
        }}>
          {error}
        </div>
      )}

      {/* 详细响应数据（可折叠） */}
      {response && (
        <details style={{ marginTop: '15px', width: '100%' }}>
          <summary style={{ 
            cursor: 'pointer', 
            color: '#155724',
            fontSize: '14px',
            marginBottom: '10px'
          }}>
            查看详细响应
          </summary>
          <pre style={{ 
            backgroundColor: '#e2f3e6',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            fontFamily: 'monospace',
            textAlign: 'left',
            margin: 0
          }}>
            {response}
          </pre>
        </details>
      )}
    </div>
  );
}
