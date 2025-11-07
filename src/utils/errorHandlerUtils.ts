/**
 * 공통 에러 처리 유틸리티
 */

export enum ErrorType {
  MICROPHONE_PERMISSION = 'MICROPHONE_PERMISSION',
  AUDIO_CONTEXT = 'AUDIO_CONTEXT',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  userMessage: string;
}

/**
 * 에러 타입별 사용자 친화적 메시지 매핑
 */
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.MICROPHONE_PERMISSION]: '마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.',
  [ErrorType.AUDIO_CONTEXT]: '오디오를 시작할 수 없습니다. 브라우저를 새로고침해주세요.',
  [ErrorType.NETWORK]: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  [ErrorType.UNKNOWN]: '오류가 발생했습니다. 다시 시도해주세요.',
};

/**
 * 에러를 분석하여 타입과 메시지 반환
 */
export const analyzeError = (error: unknown): ErrorInfo => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('permission') || message.includes('마이크')) {
      return {
        type: ErrorType.MICROPHONE_PERMISSION,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorType.MICROPHONE_PERMISSION],
      };
    }

    if (message.includes('audio') || message.includes('context')) {
      return {
        type: ErrorType.AUDIO_CONTEXT,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorType.AUDIO_CONTEXT],
      };
    }

    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: ErrorType.NETWORK,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorType.NETWORK],
      };
    }
  }

  return {
    type: ErrorType.UNKNOWN,
    message: error instanceof Error ? error.message : String(error),
    userMessage: ERROR_MESSAGES[ErrorType.UNKNOWN],
  };
};

/**
 * 에러를 처리하고 사용자 메시지 반환
 */
export const handleError = (error: unknown): string => {
  const errorInfo = analyzeError(error);
  return errorInfo.userMessage;
};

