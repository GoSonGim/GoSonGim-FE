import { useEffect, useRef } from 'react';

interface ChromaKeyOptions {
  minHue: number; // 최소 색상 값 (0-360)
  maxHue: number; // 최대 색상 값 (0-360)
  minSaturation: number; // 최소 채도 (0-1)
  threshold: number; // 녹색 감지 임계값
}

interface UseChromaKeyParams {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isSessionReady: boolean;
  backgroundImageUrl: string;
  options?: Partial<ChromaKeyOptions>;
}

const DEFAULT_OPTIONS: ChromaKeyOptions = {
  minHue: 60,
  maxHue: 180,
  minSaturation: 0.1,
  threshold: 1.0,
};

/**
 * HSV 기반 크로마키 처리 훅
 * HeyGen 공식 문서의 알고리즘을 기반으로 구현
 * @see https://docs.heygen.com/docs/adding-chroma-key-to-streaming-demo
 */
export function useChromaKey({
  videoRef,
  canvasRef,
  isSessionReady,
  backgroundImageUrl,
  options = {},
}: UseChromaKeyParams) {
  const animationIdRef = useRef<number | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const chromaOptions = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !isSessionReady) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: true });
    if (!ctx) return;

    // Canvas 크기를 video와 동일하게 설정
    const updateCanvasSize = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    video.addEventListener('loadedmetadata', updateCanvasSize);
    updateCanvasSize();

    // 배경 이미지 로드
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous'; // CORS 문제 방지
    bgImageRef.current = bgImage;

    /**
     * RGB를 HSV로 변환
     */
    const rgbToHsv = (r: number, g: number, b: number) => {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;

      // Hue 계산
      let h = 0;
      if (delta === 0) {
        h = 0;
      } else if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }

      h = Math.round(h * 60);
      if (h < 0) h += 360;

      // Saturation 계산
      const s = max === 0 ? 0 : delta / max;

      // Value 계산
      const v = max / 255;

      return { h, s, v };
    };

    /**
     * 크로마키 처리 함수
     */
    const processFrame = () => {
      if (video.readyState >= video.HAVE_CURRENT_DATA && !video.paused && !video.ended) {
        // 1. 비디오 프레임만 그리기
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        console.log('[CHROMA] Canvas:', canvas.width, 'x', canvas.height, 'BgImage complete:', bgImage.complete);

        // 2. 픽셀 데이터 가져오기
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 3. 각 픽셀 처리 (녹색을 투명하게)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // RGB → HSV 변환
          const { h, s, v } = rgbToHsv(r, g, b);

          // 녹색 범위 판단
          const isGreen =
            h >= chromaOptions.minHue &&
            h <= chromaOptions.maxHue &&
            s > chromaOptions.minSaturation &&
            v > 0.15 &&
            g > r * chromaOptions.threshold &&
            g > b * chromaOptions.threshold;

          // 녹색이면 투명도 적용
          if (isGreen) {
            const greenness = (g - Math.max(r, b)) / (g || 1);
            const alphaValue = Math.max(0, 1 - greenness * 4);
            data[i + 3] = alphaValue < 0.2 ? 0 : Math.round(alphaValue * 255);
          }
        }

        // 4. Canvas 클리어
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 5. 배경 이미지 먼저 그리기
        if (bgImage.complete) {
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        }

        // 6. 처리된 비디오를 배경 위에 합성
        // destination-over: 기존 내용(배경) 뒤에 그리기
        ctx.globalCompositeOperation = 'source-over';

        // 임시 canvas에 투명 처리된 비디오 그리기
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.putImageData(imageData, 0, 0);
          ctx.drawImage(tempCanvas, 0, 0);
        }

        // 합성 모드 복원
        ctx.globalCompositeOperation = 'source-over';
      }

      animationIdRef.current = requestAnimationFrame(processFrame);
    };

    // 배경 이미지 로드 및 처리 시작
    bgImage.onload = () => {
      console.log('[CHROMA] 배경 이미지 로드 완료:', bgImage.width, 'x', bgImage.height);
      processFrame();
    };

    bgImage.onerror = (e) => {
      console.error('[CHROMA] 배경 이미지 로드 실패:', backgroundImageUrl, e);
    };

    // 이미지 src 설정 (onload 설정 후에 해야 함)
    bgImage.src = backgroundImageUrl;

    // 이미 로드된 경우 즉시 시작
    if (bgImage.complete) {
      console.log('[CHROMA] 배경 이미지 이미 로드됨');
      processFrame();
    }

    // Cleanup
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      video.removeEventListener('loadedmetadata', updateCanvasSize);
    };
  }, [
    videoRef,
    canvasRef,
    isSessionReady,
    backgroundImageUrl,
    chromaOptions.minHue,
    chromaOptions.maxHue,
    chromaOptions.minSaturation,
    chromaOptions.threshold,
  ]);
}
