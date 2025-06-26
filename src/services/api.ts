import {
  MessageRequest,
  MessageResponse,
  HistoryResponse,
  ApiResponse
} from '../types/api';

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // 移除末尾的斜杠
  }

  // 设置新的基础 URL
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, mergedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`网络请求失败: ${error.message}`);
      }
      throw new Error('未知的网络错误');
    }
  }

  // 发送消息
  async sendMessage(request: MessageRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>('/api/message', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // 获取历史记录
  async getHistory(limit?: number): Promise<HistoryResponse> {
    const queryParams = limit ? `?limit=${limit}` : '';
    return this.request<HistoryResponse>(`/api/history${queryParams}`);
  }

  // 获取特定历史记录
  async getHistoryById(id: string): Promise<HistoryResponse> {
    return this.request<HistoryResponse>(`/api/history?id=${id}`);
  }

  // 清空历史记录
  async clearHistory(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/api/history', {
      method: 'DELETE',
    });
  }

  // 健康检查
  async healthCheck(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/api/health');
  }

  // 测试连接
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// 创建默认的 API 服务实例
export const createApiService = (baseUrl: string): ApiService => {
  return new ApiService(baseUrl);
};