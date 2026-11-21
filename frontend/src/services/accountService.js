// gom api lien quan den quan ly tai khoan, chi danh cho admin
// chi goi api toi backend, ko xu ly logic gi o day, de de bao tri va tach biet ro rang giua api va logic
import { api, unwrapApiData } from './api';
export const adminAccountService = {
    /**
     * Lấy danh sách tất cả tài khoản
     */
    async getAllAccounts() {
        const response = await api.get('/account/all');
        return unwrapApiData(response);
    },
    /**
     * Cập nhật thông tin tài khoản (gồm cả block/unblock)
     */
    async updateAccount(email, payload) {
        const response = await api.patch('/account/update', { email, ...payload });
        return unwrapApiData(response);
    },
    /**
     * Lấy danh sách các roles hệ thống (không bao gồm admin)
     */
    async getRoles() {
        const response = await api.get('/auth/roles');
        return unwrapApiData(response);
    },
};
