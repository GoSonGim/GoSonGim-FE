/**
 * Browser compatibility type definitions for webkit-prefixed APIs
 */

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }

  interface Navigator {
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: Error) => void
    ) => void;
  }
}

export {};
