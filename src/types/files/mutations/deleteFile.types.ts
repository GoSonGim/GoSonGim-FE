// 파일 삭제 요청 (query parameter)
export interface DeleteFileRequest {
  fileKey: string;
}

// 파일 삭제 응답
export interface DeleteFileResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: string; // 삭제된 fileKey
}

