import axios from 'axios';

const HEYGEN_API_BASE = 'https://api.heygen.com';

/**
 * HeyGen 세션 토큰 생성
 * @returns 세션 토큰 문자열
 */
export const createSessionToken = async (): Promise<string> => {
  const apiKey = import.meta.env.VITE_HEYGEN_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_HEYGEN_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }

  console.log('Requesting session token from HeyGen...');

  try {
    const response = await axios.post(
      `${HEYGEN_API_BASE}/v1/streaming.create_token`,
      {},
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    console.log('Session token created successfully');
    return response.data.data.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      const status = error.response?.status;
      console.error('Session token creation failed:', { status, error: errorMsg, data: error.response?.data });

      if (status === 401 || status === 403) {
        throw new Error('API 키가 유효하지 않습니다. HeyGen 대시보드에서 API 키를 확인해주세요.');
      }

      throw new Error(`세션 토큰 발급 실패 (${status}): ${errorMsg}`);
    }
    throw error;
  }
};

