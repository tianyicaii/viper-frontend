import { useState } from 'react';
import { HealthCheckButton, ResponseDisplay } from './Renderer';

class HealthCheckService {

  static async checkHealth() {
    const response = await fetch('https://viper-backend.vercel.app/api/health', {
      method: 'GET',
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }
}

function useHealthCheck() {

  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const data = await HealthCheckService.checkHealth();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`错误: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    loading,
    error,
    checkHealth
  };
}


// 主应用组件 - 组合所有部分
function App() {
  const { response, loading, error, checkHealth } = useHealthCheck();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>health Check</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <HealthCheckButton 
          loading={loading} 
          onCheck={checkHealth} 
        />
      </div>

      <ResponseDisplay 
        response={response} 
        error={error} 
      />
    </div>
  );
}

export default App;
