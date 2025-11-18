export interface DeleteAccountResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  result: {
    deletedAt: string;
    purgeAt: string;
  };
}
