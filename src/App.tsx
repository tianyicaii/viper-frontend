import { useState } from 'react';

// 添加全局样式重置
const GlobalStyles = () => (
  <style>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body, #root {
      height: 100%;
      width: 100%;
    }
    
    body {
      margin: 0;
      padding: 0;
    }
  `}</style>
);

// 导航按钮组件
function NavigationButton({ title, description, onClick, colorClasses = 'bg-blue-500 hover:bg-blue-600' }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        flex-1 h-28 mx-2 p-4
        ${colorClasses}
        text-white border-none rounded-xl
        text-lg font-bold cursor-pointer
        shadow-md hover:shadow-lg
        transition-all duration-300 ease-in-out
        hover:-translate-y-0.5
        min-w-0
      `}
    >
      <div className="text-xl mb-2 whitespace-nowrap">{title}</div>
      <div className="text-xs opacity-90 text-center leading-tight">
        {description}
      </div>
    </button>
  );
}

// 主页组件
function HomePage({ onNavigate }) {
  return (
    <>
      <GlobalStyles />
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-4xl bg-white rounded-xl p-10 shadow-lg text-center mx-5">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Navigation
          </h1>

          {/* 三个按钮并排显示 */}
          <div className="flex gap-4 justify-center items-stretch">
            <NavigationButton
              title="Health Check"
              description=""
              onClick={() => onNavigate('healthcheck')}
              colorClasses="bg-green-500 hover:bg-green-600"
            />
            
            <NavigationButton
              title="History"
              description=""
              onClick={() => onNavigate('history')}
              colorClasses="bg-blue-500 hover:bg-blue-600"
            />
            
            <NavigationButton
              title="Message"
              description=""
              onClick={() => onNavigate('message')}
              colorClasses="bg-yellow-500 hover:bg-yellow-600"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// 健康检查页面的组件
// 业务逻辑层 - 处理API调用
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

// 自定义Hook - 管理状态和业务逻辑
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

// UI组件 - 负责渲染
function HealthCheckButton({ loading, onCheck }) {
  return (
    <button 
      onClick={onCheck}
      disabled={loading}
      className={`
        px-6 py-3 text-base font-medium
        bg-green-500 hover:bg-green-600
        text-white border-none rounded-md
        min-w-36 transition-colors duration-200
        ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
      `}
    >
      {loading ? '检查中...' : '检查服务状态'}
    </button>
  );
}

// UI组件 - 显示响应结果
function ResponseDisplay({ response, error }) {
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
    <div className={`
      flex flex-col items-center p-8 mt-8 rounded-xl text-center
      ${isSuccess 
        ? 'bg-green-100 border-2 border-green-500' 
        : 'bg-red-100 border-2 border-red-500'
      }
    `}>
      {/* 状态图标 */}
      <div className={`
        text-5xl mb-4
        ${isSuccess ? 'text-green-500' : 'text-red-500'}
      `}>
        {isSuccess ? '✅' : '❌'}
      </div>

      {/* 状态文本 */}
      <h3 className={`
        text-xl font-semibold mb-3
        ${isSuccess ? 'text-green-800' : 'text-red-800'}
      `}>
        {isSuccess ? '服务状态正常' : '服务异常'}
      </h3>

      {/* 时间戳显示（仅成功时） */}
      {timestamp && (
        <p className="text-green-800 text-base font-bold mb-4">
          检查时间：{timestamp}
        </p>
      )}

      {/* 错误信息显示（仅失败时） */}
      {error && (
        <div className="bg-red-200 p-3 rounded-md text-red-800 text-sm font-mono max-w-full overflow-auto">
          {error}
        </div>
      )}

      {/* 详细响应数据（可折叠） */}
      {response && (
        <details className="mt-4 w-full">
          <summary className="cursor-pointer text-green-800 text-sm mb-3 hover:text-green-600">
            查看详细响应
          </summary>
          <pre className="bg-green-50 p-3 rounded text-xs font-mono text-left overflow-auto">
            {response}
          </pre>
        </details>
      )}
    </div>
  );
}

// 健康检查页面
function HealthCheckPage({ onBack }) {
  const { response, loading, error, checkHealth } = useHealthCheck();

  return (
    <>
      <GlobalStyles />
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-2xl bg-white rounded-xl p-10 shadow-lg text-center mx-5">
          {/* 返回按钮单独放在顶部 */}
          <div className="flex justify-start mb-6">
            <button 
              onClick={onBack} 
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white border-none rounded cursor-pointer transition-colors duration-200"
            >
              ← 返回
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Health Check
          </h1>

          <div className="mb-5">
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
      </div>
    </>
  );
}

// 历史记录页面
function HistoryPage({ onBack }) {
  return (
    <>
      <GlobalStyles />
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-2xl bg-white rounded-xl p-10 shadow-lg text-center mx-5">
          {/* 返回按钮单独放在顶部 */}
          <div className="flex justify-start mb-6">
            <button 
              onClick={onBack} 
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white border-none rounded cursor-pointer transition-colors duration-200"
            >
              ← 返回
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            History
          </h1>

          <p className="text-gray-600 text-base">
            历史记录页面正在开发中...
          </p>
        </div>
      </div>
    </>
  );
}

// 消息页面
function MessagePage({ onBack }) {
  return (
    <>
      <GlobalStyles />
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-2xl bg-white rounded-xl p-10 shadow-lg text-center mx-5">
          {/* 返回按钮单独放在顶部 */}
          <div className="flex justify-start mb-6">
            <button 
              onClick={onBack} 
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white border-none rounded cursor-pointer transition-colors duration-200"
            >
              ← 返回
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Message
          </h1>

          <p className="text-gray-600 text-base">
            消息管理页面正在开发中...
          </p>
        </div>
      </div>
    </>
  );
}

// 主应用组件
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  // 根据当前页面渲染不同组件
  switch (currentPage) {
    case 'healthcheck':
      return <HealthCheckPage onBack={handleBack} />;
    case 'history':
      return <HistoryPage onBack={handleBack} />;
    case 'message':
      return <MessagePage onBack={handleBack} />;
    default:
      return <HomePage onNavigate={handleNavigate} />;
  }
}

export default App;