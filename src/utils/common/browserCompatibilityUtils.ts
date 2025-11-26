/**
 * Browser compatibility utilities for cross-browser audio support
 * Provides webkit fallbacks for iOS Safari/Chrome compatibility
 */

import '@/types/common/browser.types';

/**
 * Detect if the current device is iOS
 */
export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Check for iOS via userAgent
  const isIOSUserAgent = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

  // Check for iOS 13+ (iPad on Safari identifies as Macintosh)
  const isIOSPlatform =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !(window as any).MSStream;

  return isIOSUserAgent || isIOSPlatform;
};

/**
 * Detect if the current browser is Safari
 */
export const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const userAgent = navigator.userAgent;
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);

  return isSafariBrowser;
};

/**
 * Detect if the current browser is webkit-based (Safari, iOS browsers)
 */
export const isWebkitBrowser = (): boolean => {
  return isIOS() || isSafari();
};

/**
 * Get AudioContext constructor with webkit fallback
 * @returns AudioContext constructor
 */
export const getAudioContext = (): typeof AudioContext => {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext is not available (not in browser environment)');
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error('AudioContext not supported');
  }

  return AudioContextClass;
};

/**
 * Create AudioContext instance with webkit fallback
 * @param options - AudioContext options
 * @returns AudioContext instance
 */
export const createAudioContext = (options?: AudioContextOptions): AudioContext => {
  const AudioContextClass = getAudioContext();
  return new AudioContextClass(options);
};

/**
 * Get user media with webkit fallback
 * @param constraints - MediaStream constraints
 * @returns Promise<MediaStream>
 */
export const getUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  if (typeof navigator === 'undefined') {
    throw new Error('getUserMedia is not available (not in browser environment)');
  }

  // Modern API: navigator.mediaDevices.getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  // Webkit legacy API: navigator.webkitGetUserMedia
  if (navigator.webkitGetUserMedia) {
    return new Promise<MediaStream>((resolve, reject) => {
      navigator.webkitGetUserMedia!(
        constraints,
        (stream: MediaStream) => resolve(stream),
        (error: Error) => reject(error)
      );
    });
  }

  throw new Error('getUserMedia not supported');
};

/**
 * Check if MediaRecorder is supported
 * @returns boolean
 */
export const isMediaRecorderSupported = (): boolean => {
  return typeof MediaRecorder !== 'undefined';
};

/**
 * Get the best supported audio mimeType for MediaRecorder
 * Tests mimeTypes in order of preference and returns the first supported one
 * @returns Supported mimeType string
 */
export const getSupportedAudioMimeType = (): string => {
  if (!isMediaRecorderSupported()) {
    throw new Error('MediaRecorder not supported');
  }

  const mimeTypes = [
    'audio/webm;codecs=opus', // Chrome, Firefox - best quality
    'audio/webm', // Chrome, Firefox fallback
    'audio/mp4', // Safari, iOS
    'audio/ogg;codecs=opus', // Firefox
    'audio/wav', // Universal fallback (large file size)
  ];

  for (const mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  // If no specific type is supported, return empty string
  // MediaRecorder will use default (usually works but less predictable)
  return '';
};

/**
 * Get browser audio capabilities
 * @returns Object with browser capability flags
 */
export interface BrowserAudioCapabilities {
  hasAudioContext: boolean;
  hasGetUserMedia: boolean;
  hasMediaRecorder: boolean;
  supportedMimeTypes: string[];
  requiresWebkitPrefix: boolean;
  isIOS: boolean;
  isSafari: boolean;
}

export const getBrowserAudioCapabilities = (): BrowserAudioCapabilities => {
  const hasAudioContext = !!(window.AudioContext || window.webkitAudioContext);
  const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia || navigator.webkitGetUserMedia);
  const hasMediaRecorder = isMediaRecorderSupported();
  const requiresWebkitPrefix = isWebkitBrowser();

  const allMimeTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav',
  ];

  const supportedMimeTypes = hasMediaRecorder
    ? allMimeTypes.filter((type) => MediaRecorder.isTypeSupported(type))
    : [];

  return {
    hasAudioContext,
    hasGetUserMedia,
    hasMediaRecorder,
    supportedMimeTypes,
    requiresWebkitPrefix,
    isIOS: isIOS(),
    isSafari: isSafari(),
  };
};
