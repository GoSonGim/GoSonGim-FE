import { apiClient } from '@/apis/client';
import type {
  GetProfileResponse,
  GetStatsResponse,
  GetDailyWordsRequest,
  GetDailyWordsResponse,
  UpdateNicknameRequest,
  UpdateNicknameResponse,
  DeleteAccountResponse,
} from '@/types/profile';

export const getProfile = async (): Promise<GetProfileResponse> => {
  console.log('📡 API Call: GET /api/v1/users/me');
  const response = await apiClient.get<GetProfileResponse>('/api/v1/users/me');
  console.log('📡 API Response:', response.data);
  return response.data;
};

export const getStats = async (): Promise<GetStatsResponse> => {
  console.log('📡 API Call: GET /api/v1/users/me/stats');
  const response = await apiClient.get<GetStatsResponse>('/api/v1/users/me/stats');
  console.log('📡 API Response:', response.data);
  return response.data;
};

export const getDailyWords = async (params?: GetDailyWordsRequest): Promise<GetDailyWordsResponse> => {
  console.log('📡 API Call: GET /api/v1/users/me/stats/daily-words', params);
  const response = await apiClient.get<GetDailyWordsResponse>('/api/v1/users/me/stats/daily-words', {
    params: {
      page: params?.page || 1,
      size: params?.size || 50,
    },
  });
  console.log('📡 API Response:', response.data);
  return response.data;
};

export const updateNickname = async (data: UpdateNicknameRequest): Promise<UpdateNicknameResponse> => {
  console.log('📡 API Call: PUT /api/v1/users/me/nickname', data);
  const response = await apiClient.put<UpdateNicknameResponse>('/api/v1/users/me/nickname', data);
  console.log('📡 API Response:', response.data);
  return response.data;
};

export const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  console.log('📡 API Call: DELETE /api/v1/users/me');
  const response = await apiClient.delete<DeleteAccountResponse>('/api/v1/users/me');
  console.log('📡 API Response:', response.data);
  return response.data;
};

export const profileAPI = { getProfile, getStats, getDailyWords, updateNickname, deleteAccount };
