import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RefreshTokenResponse } from '@/types/auth.types';

// 개발 환경에서는 프록시 사용, 프로덕션에서는 실제 URL 사용
const baseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || 'https://ttobaki.app';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중인지 체크하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 큐
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor: Authorization 헤더 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: 401 에러 시 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 큐에 넣고 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, logout } = useAuthStore.getState();

      if (!refreshToken) {
        // Refresh Token이 없으면 로그아웃
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // 토큰 갱신 요청
        const refreshBaseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || 'https://ttobaki.app';
        const response = await axios.post<RefreshTokenResponse>(
          `${refreshBaseURL}/api/v1/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.result.tokens;

        // 새 토큰 저장
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        // 큐에 대기 중인 요청들 처리
        processQueue(null, newAccessToken);

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
