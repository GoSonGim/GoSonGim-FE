import { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/auth.types';

export interface ParsedError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Axios 에러를 파싱하여 사용자 친화적인 메시지로 변환
 */
export const parseApiError = (error: unknown): ParsedError => {
  // Axios 에러인 경우
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse | undefined;

    // 서버에서 온 에러 메시지가 있는 경우
    if (errorData?.message) {
      return {
        message: errorData.message,
        code: errorData.error?.code,
        status: errorData.status,
      };
    }

    // HTTP 상태 코드별 기본 메시지
    const status = error.response?.status;
    switch (status) {
      case 400:
        return {
          message: '잘못된 요청입니다.',
          status,
        };
      case 401:
        return {
          message: '인증에 실패했습니다.',
          status,
        };
      case 403:
        return {
          message: '접근 권한이 없습니다.',
          status,
        };
      case 404:
        return {
          message: '요청한 리소스를 찾을 수 없습니다.',
          status,
        };
      case 409:
        return {
          message: '이미 존재하는 데이터입니다.',
          status,
        };
      case 410:
        return {
          message: '탈퇴한 계정입니다.',
          status,
        };
      case 500:
        return {
          message: '서버 오류가 발생했습니다.',
          status,
        };
      default:
        // 네트워크 에러인 경우
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          return {
            message: '요청 시간이 초과되었습니다.',
            code: 'TIMEOUT',
          };
        }
        if (error.code === 'ERR_NETWORK' || !error.response) {
          return {
            message: '네트워크 연결을 확인해주세요.',
            code: 'NETWORK_ERROR',
          };
        }
        return {
          message: '알 수 없는 오류가 발생했습니다.',
        };
    }
  }

  // Axios 에러가 아닌 경우
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: '알 수 없는 오류가 발생했습니다.',
  };
};

/**
 * 에러 메시지를 추출하는 헬퍼 함수
 */
export const getErrorMessage = (error: unknown): string => {
  return parseApiError(error).message;
};

