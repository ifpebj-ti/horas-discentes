import api from './api';

export interface ForgotPasswordRequest {
  email: string;
}
export interface ForgotPasswordResponse {
  message: string;
}

export interface ValidateCodeRequest {
  email: string;
  code: string;
}
export interface ValidateCodeResponse {
  valid: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}
export interface ResetPasswordResponse {
  message: string;
}

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const res = await api.post<ForgotPasswordResponse>(
    '/Auth/forgot-password',
    data
  );
  return res.data;
};

export const validateResetCode = async (
  data: ValidateCodeRequest
): Promise<ValidateCodeResponse> => {
  const res = await api.post<ValidateCodeResponse>('/Auth/validate-code', data);
  return res.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const res = await api.post<ResetPasswordResponse>(
    '/Auth/reset-password',
    data
  );
  return res.data;
};
