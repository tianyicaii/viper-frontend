import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!name) {
      alert('请填写姓名');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('https://viper-backend.vercel.app/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResponse(data.data.message);
        setMessage(''); // 清空输入
      } else {
        setResponse('错误: ' + data.error);
      }
    } catch (error) {
      setResponse('网络错误，请检查后端地址');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>💬 消息处理器</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>姓名:</label><br />
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的姓名"
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>消息:</label><br />
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入你的消息"
            rows={4}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
        
        <button 
          onClick={sendMessage}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '发送中...' : '发送消息'}
        </button>
      </div>

      {response && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <h3>🤖 回复:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;