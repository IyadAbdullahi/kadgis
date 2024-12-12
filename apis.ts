import { apiController, ApiResponse } from './axios';

interface ApiData {
    token: string;
    refreshToken: string;
    user: any;
}

class ApiService {
    async register(data: { email: string; password: string; name: string }): Promise<ApiResponse<ApiData>> {
        return await apiController.post<ApiResponse<ApiData>>('/user/register', data);
    }

    async login(data: { email: string; password: string }): Promise<ApiResponse<ApiData>> {
        // return await apiController.post<ApiResponse<ApiData>>('/user/login', data);
        const res = { ok: true, data: { user: 'Iyad Abdullahi', refreshToken: 'nsdhbbhdfbhjdfbhjdfb', token: 'hsdhdfgdhvfgyevdfgyrdevcfg' }, message: 'well' }
        return await res;
    }

    async verifyEmail(data: { email: string; password: string; name: string }): Promise<ApiResponse<ApiData>> {
        return await apiController.post<ApiResponse<ApiData>>('/user/verify-email', data);
    }

    async recoverAccount(data: { email: string }): Promise<ApiResponse<ApiData>> {
        return await apiController.post<ApiResponse<ApiData>>('/user/recover-account', data);
    }

    async validateOtp(data: { email: string, otp: string }): Promise<ApiResponse<ApiData>> {
        return await apiController.post<ApiResponse<ApiData>>('/user/validate-code', data);
    }

    async resetPassword(data: { token: string, password: string }): Promise<ApiResponse<ApiData>> {
        return await apiController.post<ApiResponse<ApiData>>('/user/reset-password', data);
    }





    async changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<ApiData>> {
        return await apiController.post<ApiResponse<ApiData>>('/user/change-password', data);
    }

    async logout(): Promise<ApiResponse<ApiData>> {
        return await apiController.post<ApiResponse<ApiData>>('/user/logout');
    }
}

export const apiService = new ApiService();
