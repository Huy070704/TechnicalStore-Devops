import { api, unwrapApiData } from './api';
export const paymentService = {
    // ─── Customer-facing methods ───────────────────────────────────────────────
    async createPayosLink(orderId, guestEmail) {
        const response = await api.post(`/payment/payos-link/${orderId}`, {
            email: guestEmail,
        });
        const data = unwrapApiData(response);
        return data.checkoutUrl;
    },
    async getPaymentStatus(orderId) {
        const response = await api.get(`/payment/status/${orderId}`);
        const data = unwrapApiData(response);
        return data.payment;
    },
    // ─── Staff-facing methods ───────────────────────────────────────────────────
    async getAll() {
        try {
            const response = await api.get('/payments');
            const data = unwrapApiData(response);
            return Array.isArray(data?.payments) ? data.payments : [];
        }
        catch (error) {
            console.error('Error fetching payments:', error);
            return [];
        }
    },
    async confirm(id) {
        const response = await api.patch(`/payments/${id}/confirm`);
        const data = unwrapApiData(response);
        if (!data?.payment)
            throw new Error('Invalid payment response');
        return data.payment;
    },
};
