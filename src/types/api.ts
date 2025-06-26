// API 请求和响应的类型定义

export interface MessageRequest {
  name: string;
  message: string;
}

export interface MessageMetadata {
  wordCount: number;
  hasQuestion: boolean;
  hasGreeting: boolean;
  responseType?: string;
}

export interface MessageResponseData {
  message: string;
  metadata?: MessageMetadata;
  timestamp: string;
}

export interface MessageResponse {
  success: boolean;
  data?: MessageResponseData;
  error?: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string | number;
  input: {
    name: string;
    message: string;
    timestamp: string;
  };
  output: string;
  timestamp: string;
  metadata?: MessageMetadata;
  clientInfo?: {
    userAgent?: string;
    ip?: string;
  };
}

export interface HistoryStats {
  totalMessages: number;
  successfulMessages: number;
  errorRate: number;
  averageWordCount: number;
}

export interface HistoryResponseData {
  history: HistoryItem[];
  stats: HistoryStats;
  total: number;
}

export interface HistoryResponse {
  success: boolean;
  data?: HistoryResponseData;
  error?: string;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// 应用状态类型
export interface AppState {
  name: string;
  message: string;
  apiUrl: string;
  response: string;
  metadata: MessageMetadata | null;
  history: HistoryItem[];
  loading: boolean;
  error: string;
}

// 本地存储类型
export interface LocalStorageData {
  name: string;
  apiUrl: string;
}