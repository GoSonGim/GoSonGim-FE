/**
 * AudioBuffer를 WAV 형식의 ArrayBuffer로 변환
 * @param audioBuffer - 변환할 AudioBuffer
 * @param sampleRate - 샘플레이트 (기본값: 16000Hz)
 * @returns WAV 형식의 ArrayBuffer
 */
export const audioBufferToWav = (audioBuffer: AudioBuffer, sampleRate: number = 16000): ArrayBuffer => {
  const numChannels = 1; // 모노
  const format = 1; // PCM
  const bitDepth = 16;

  // 샘플레이트가 다르면 리샘플링 (간단한 방법)
  const samples = audioBuffer.getChannelData(0);
  let buffer: Float32Array;

  if (audioBuffer.sampleRate !== sampleRate) {
    // 리샘플링
    const ratio = audioBuffer.sampleRate / sampleRate;
    const newLength = Math.round(samples.length / ratio);
    buffer = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, samples.length - 1);
      const t = srcIndex - srcIndexFloor;
      buffer[i] = samples[srcIndexFloor] * (1 - t) + samples[srcIndexCeil] * t;
    }
  } else {
    buffer = samples;
  }

  const dataLength = buffer.length * (bitDepth / 8);
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // WAV 파일 헤더 작성
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true); // 파일 크기 - 8
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true); // audio format (1 = PCM)
  view.setUint16(22, numChannels, true); // number of channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // byte rate
  view.setUint16(32, numChannels * (bitDepth / 8), true); // block align
  view.setUint16(34, bitDepth, true); // bits per sample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true); // data chunk size

  // PCM 샘플 데이터 작성
  floatTo16BitPCM(view, 44, buffer);

  return arrayBuffer;
};

/**
 * DataView에 문자열 쓰기
 */
const writeString = (view: DataView, offset: number, string: string): void => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

/**
 * Float32 배열을 16비트 PCM으로 변환하여 DataView에 쓰기
 */
const floatTo16BitPCM = (view: DataView, offset: number, input: Float32Array): void => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};

/**
 * Blob을 Base64 문자열로 변환
 * @param blob - 변환할 Blob
 * @returns Base64 문자열
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // "data:audio/wav;base64," 부분 제거
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Audio Blob 검증 결과
 */
export interface BlobValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Audio Blob이 유효한지 검증
 * @param blob - 검증할 Blob
 * @returns 검증 결과
 */
export const validateAudioBlob = (blob: Blob | null): BlobValidationResult => {
  if (!blob) {
    return { isValid: false, error: 'Audio blob is null' };
  }
  if (blob.size === 0) {
    return { isValid: false, error: 'Audio blob is empty (0 bytes)' };
  }
  if (blob.size < 100) {
    return { isValid: false, error: `Audio blob too small (${blob.size} bytes)` };
  }
  return { isValid: true };
};
