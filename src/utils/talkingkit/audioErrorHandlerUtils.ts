/**
 * 오디오/마이크 에러 처리 유틸리티
 */

import { isIOS, isWebkitBrowser } from '@/utils/common/browserCompatibilityUtils';

export const ErrorType = {
  MICROPHONE_PERMISSION: 'MICROPHONE_PERMISSION',
  MICROPHONE_PERMISSION_IOS: 'MICROPHONE_PERMISSION_IOS',
  AUDIO_CONTEXT: 'AUDIO_CONTEXT',
  AUDIO_CONTEXT_WEBKIT: 'AUDIO_CONTEXT_WEBKIT',
  AUDIO_DECODE_ERROR: 'AUDIO_DECODE_ERROR',
  AUDIO_DECODE_ERROR_IOS: 'AUDIO_DECODE_ERROR_IOS',
  AUDIO_EMPTY_BLOB: 'AUDIO_EMPTY_BLOB',
  MEDIARECORDER_NOT_SUPPORTED: 'MEDIARECORDER_NOT_SUPPORTED',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

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
  [ErrorType.MICROPHONE_PERMISSION_IOS]: 'iOS Safari에서 마이크 권한이 필요합니다. 설정 > Safari > 마이크에서 권한을 허용해주세요.',
  [ErrorType.AUDIO_CONTEXT]: '오디오를 시작할 수 없습니다. 브라우저를 새로고침해주세요.',
  [ErrorType.AUDIO_CONTEXT_WEBKIT]: 'iOS Safari에서 오디오 기능을 시작할 수 없습니다. 브라우저를 최신 버전으로 업데이트해주세요.',
  [ErrorType.AUDIO_DECODE_ERROR]: '녹음된 오디오를 처리할 수 없습니다. 다시 녹음해주세요.',
  [ErrorType.AUDIO_DECODE_ERROR_IOS]: 'iOS에서 오디오 처리 중 문제가 발생했습니다. 다시 녹음해주세요.',
  [ErrorType.AUDIO_EMPTY_BLOB]: '녹음된 오디오가 비어있습니다. 다시 녹음해주세요.',
  [ErrorType.MEDIARECORDER_NOT_SUPPORTED]: '현재 브라우저는 오디오 녹음을 지원하지 않습니다. Chrome 또는 Safari를 사용해주세요.',
  [ErrorType.NETWORK]: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  [ErrorType.UNKNOWN]: '오류가 발생했습니다. 다시 시도해주세요.',
};

/**
 * 에러를 분석하여 타입과 메시지 반환
 */
export const analyzeError = (error: unknown): ErrorInfo => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const isIOSDevice = isIOS();
    const isWebkit = isWebkitBrowser();

    // Permission errors
    if (message.includes('permission') || message.includes('notallowederror') || message.includes('마이크')) {
      return {
        type: isIOSDevice ? ErrorType.MICROPHONE_PERMISSION_IOS : ErrorType.MICROPHONE_PERMISSION,
        message: error.message,
        userMessage: ERROR_MESSAGES[isIOSDevice ? ErrorType.MICROPHONE_PERMISSION_IOS : ErrorType.MICROPHONE_PERMISSION],
      };
    }

    // MediaRecorder not supported
    if (message.includes('mediarecorder') && message.includes('not supported')) {
      return {
        type: ErrorType.MEDIARECORDER_NOT_SUPPORTED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorType.MEDIARECORDER_NOT_SUPPORTED],
      };
    }

    // Empty blob errors
    if (message.includes('비어있습니다') || message.includes('empty') || message.includes('너무 작습니다')) {
      return {
        type: ErrorType.AUDIO_EMPTY_BLOB,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorType.AUDIO_EMPTY_BLOB],
      };
    }

    // Audio decode errors
    if (message.includes('decode') || message.includes('디코딩') || message.includes('decodeaudiodata')) {
      return {
        type: isIOSDevice ? ErrorType.AUDIO_DECODE_ERROR_IOS : ErrorType.AUDIO_DECODE_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[isIOSDevice ? ErrorType.AUDIO_DECODE_ERROR_IOS : ErrorType.AUDIO_DECODE_ERROR],
      };
    }

    // Audio context errors
    if (message.includes('audio') || message.includes('context')) {
      return {
        type: isWebkit ? ErrorType.AUDIO_CONTEXT_WEBKIT : ErrorType.AUDIO_CONTEXT,
        message: error.message,
        userMessage: ERROR_MESSAGES[isWebkit ? ErrorType.AUDIO_CONTEXT_WEBKIT : ErrorType.AUDIO_CONTEXT],
      };
    }

    // Network errors
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

