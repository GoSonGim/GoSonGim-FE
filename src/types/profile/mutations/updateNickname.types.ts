export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateNicknameResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    nickname: string;
  };
}
