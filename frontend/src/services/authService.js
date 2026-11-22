import { env } from '@/config/env';
import { api, unwrapApiData } from './api';
const normalizeEmail = (email) => email.trim().toLowerCase();
const normalizeOtp = (otp) => {
    const digits = otp.replace(/\D/g, '');
    return digits.length >= 6 ? digits.slice(-6) : digits.padStart(6, '0');
};
// const getErrorMessage = (error: unknown, fallback: string): string => {
//   const axiosError = error as AxiosError<{ message?: string }>;
//   return axiosError.response?.data?.message ?? fallback;
// };
const mapAccountToUser = (account) => {
    const role = account.role;
    const facility = account.facility;
    return {
        accountId: account.id,
        email: account.email ?? '',
        name: account.name,
        phone: account.phone,
        address: account.address,
        addresses: account.addresses,
        role,
        facility,
        isRegistered: account.isRegistered,
        isBlocked: account.isBlocked,
    };
};
export const authService = {
    async register(payload) {
        const email = normalizeEmail(payload.email);
        const response = await api.post('/account/register', {
            email,
            password: payload.password,
            name: payload.name.trim(),
            phone: payload.phone ?? undefined,
        });
        return unwrapApiData(response);
    },
    async verifyRegister(email, otp) {
        const response = await api.post('/account/verify-register', {
            email: normalizeEmail(email),
            otp: normalizeOtp(otp),
        });
        const data = unwrapApiData(response);
        return data.accessToken;
    },
    async resendOtp(email) {
        const response = await api.post('/account/resend-otp', {
            email: normalizeEmail(email),
        });
        return unwrapApiData(response);
    },
    async login(credentials) {
        const response = await api.post('/account/login', {
            // Gửi identifier (email hoặc username), chuẩn hoá lowercase để khớp dữ liệu đã lưu.
            identifier: credentials.identifier.trim().toLowerCase(),
            password: credentials.password,
        });
        const data = unwrapApiData(response);
        return data.accessToken;
    },
    async forgotPassword(email) {
        const response = await api.post('/account/forgot-password', {
            email: normalizeEmail(email),
        });
        return unwrapApiData(response);
    },
    async sendOtp(email) {
        await api.post('/otp/send', { email: normalizeEmail(email) });
    },
    async verifyOtp(email, otp) {
        const response = await api.post('/otp/verify', {
            email: normalizeEmail(email),
            otp: normalizeOtp(otp),
        });
        const data = unwrapApiData(response);
        return data.verified === true;
    },
    async resetPassword(email, otp, newPassword) {
        const response = await api.post('/account/verify-change-password', {
            email: normalizeEmail(email),
            otp: normalizeOtp(otp),
            newPassword,
        });
        return unwrapApiData(response);
    },
    async getUserProfile() {
        const response = await api.get('/account/details');
        const account = unwrapApiData(response);
        return mapAccountToUser(account);
    },
    async updateProfile(email, payload) {
        const response = await api.patch('/account/update', {
            email,
            ...payload,
        });
        const account = unwrapApiData(response);
        const user = mapAccountToUser(account);
        const savedUser = this.getUser();
        if (savedUser) {
            this.persistSession({ ...savedUser, ...user }, this.getToken() || '');
        }
        return user;
    },
    async logout() {
        try {
            await api.post('/account/logout');
        }
        catch {
            /* Bỏ qua lỗi API (token hết hạn/mất mạng) — vẫn xoá phiên cục bộ bên dưới */
        }
        finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('user');
        }
    },
    isAuthenticated() {
        return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
    },
    getToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    },
    getUser() {
        const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    },
    persistSession(user, token, rememberMe = true) {
        if (rememberMe) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (user.email) {
                localStorage.setItem('rememberedEmail', user.email);
            }
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('user');
        }
        else {
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('user', JSON.stringify(user));
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('rememberedEmail');
        }
    },
};
export const getRoleName = (user) => {
    if (!user?.role)
        return null;
    return typeof user.role === 'object' ? user.role.name : user.role;
};
export const getAdminHomePath = (roleName) => {
    const role = String(roleName ?? '').toLowerCase();
    const paths = {
        admin: '/admin/dashboard',
        manager: '/manager/dashboard',
        staff: '/staff/dashboard',
        shipper: '/admin/shippers',
    };
    return paths[role] ?? null;
};
