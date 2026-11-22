import { api, unwrapApiData } from './api';
function mapRawOrderDetail(raw) {
    const payments = raw.payments ?? [];
    const latestPayment = payments[payments.length - 1];
    const latestPaymentStatus = latestPayment?.status ?? undefined;
    return {
        ...raw,
        orderDate: raw.orderAt ?? raw.orderDate,
        items: (raw.orderDetails ?? raw.items ?? []).map((d) => ({
            productId: d.product?.id ?? d.productId,
            productName: d.product?.name ?? d.productName,
            productImage: d.product?.image ?? d.product?.images?.[0]?.url ?? d.productImage ?? null,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            subtotal: d.quantity * d.unitPrice,
        })),
        payments,
        invoices: raw.invoices ?? [],
        latestPaymentStatus,
        customer: raw.customerIdOrder ? {
            name: raw.customerIdOrder.name ?? '',
            email: raw.customerIdOrder.email ?? '',
            phone: raw.customerIdOrder.phone ?? null,
        } : (raw.guestName || raw.guestPhone) ? {
            name: raw.guestName ?? '',
            email: raw.guestEmail ?? '',
            phone: raw.guestPhone ?? null,
        } : raw.customer ?? null,
    };
}
const handleApiError = (error, fallback) => {
    if (error && typeof error === 'object' && 'response' in error) {
        const res = error
            .response?.data;
        throw new Error(res?.message ?? fallback);
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error(fallback);
};
export const orderService = {
    // ─── Client-facing methods ──────────────────────────────────────────────────
    async createOrder(dto) {
        try {
            const response = await api.post('/orders', dto);
            const data = unwrapApiData(response);
            return data.order;
        }
        catch (error) {
            return handleApiError(error, 'Đặt hàng thất bại');
        }
    },
    async getOrders(params = {}) {
        try {
            const query = new URLSearchParams();
            if (params.page)
                query.set('page', String(params.page));
            if (params.limit)
                query.set('limit', String(params.limit));
            if (params.status && params.status !== 'all')
                query.set('status', params.status);
            const qs = query.toString();
            const response = await api.get(`/orders${qs ? `?${qs}` : ''}`);
            return unwrapApiData(response);
        }
        catch (error) {
            return handleApiError(error, 'Không thể lấy danh sách đơn hàng');
        }
    },
    async getOrderStatistics() {
        try {
            const response = await api.get('/orders/statistics');
            const data = unwrapApiData(response);
            return data.statistics;
        }
        catch (error) {
            return handleApiError(error, 'Không thể lấy thống kê đơn hàng');
        }
    },
    async getOrderById(id) {
        try {
            const response = await api.get(`/orders/${id}`);
            const data = unwrapApiData(response);
            return data.order;
        }
        catch (error) {
            return handleApiError(error, 'Không thể lấy thông tin đơn hàng');
        }
    },
    async updateOrderStatus(id, status, cancelReason) {
        try {
            const response = await api.patch(`/orders/${id}/status`, {
                status,
                cancelReason,
            });
            const data = unwrapApiData(response);
            return data.order;
        }
        catch (error) {
            return handleApiError(error, 'Cập nhật trạng thái đơn hàng thất bại');
        }
    },
    async confirmDelivery(id) {
        try {
            const response = await api.post(`/orders/${id}/confirm-delivery`);
            const data = unwrapApiData(response);
            return data.order;
        }
        catch (error) {
            return handleApiError(error, 'Xác nhận đã nhận hàng thất bại');
        }
    },
    // ─── Guest-facing methods ───────────────────────────────────────────────────
    async getGuestOrder(orderId, email) {
        try {
            const response = await api.get('/orders/guest', {
                params: { orderId, email },
            });
            const data = unwrapApiData(response);
            return data.order;
        }
        catch (error) {
            return handleApiError(error, 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và email.');
        }
    },
    // ─── Staff-facing methods ───────────────────────────────────────────────────
    async getStaffOrders(params = {}) {
        try {
            const response = await api.get('/orders', { params });
            const body = unwrapApiData(response);
            const data = (body.data ?? []).map((raw) => {
                const custRaw = raw.customerIdOrder;
                const customer = custRaw
                    ? { name: custRaw.name ?? '', email: custRaw.email ?? '', phone: custRaw.phone ?? null }
                    : (raw.guestName || raw.guestPhone)
                        ? { name: raw.guestName ?? '', email: raw.guestEmail ?? '', phone: raw.guestPhone ?? null }
                        : null;
                // Xác định latestPaymentStatus từ payments array
                const payments = raw.payments ?? [];
                const latestPayment = payments[payments.length - 1];
                const latestPaymentStatus = latestPayment?.status ?? undefined;
                return {
                    id: raw._id ?? raw.id,
                    orderDate: raw.orderAt ?? raw.orderDate ?? '',
                    status: raw.status,
                    totalAmount: raw.totalAmount,
                    paymentMethod: raw.paymentMethod ?? '',
                    shippingAddress: raw.shippingAddress,
                    customer,
                    itemCount: (raw.orderDetails ?? raw.items ?? []).length,
                    latestPaymentStatus,
                    orderType: raw.orderType ?? 1,
                };
            });
            return { data, total: body.total, page: body.page, limit: body.limit };
        }
        catch (error) {
            return handleApiError(error, 'Không thể lấy danh sách đơn hàng');
        }
    },
    async getStaffOrderById(id) {
        try {
            const response = await api.get(`/orders/${id}`);
            const body = unwrapApiData(response);
            return mapRawOrderDetail(body.order);
        }
        catch (error) {
            return handleApiError(error, 'Không thể lấy thông tin chi tiết đơn hàng');
        }
    },
    async confirmOrder(id) {
        try {
            const response = await api.patch(`/orders/${id}/confirm`);
            const body = unwrapApiData(response);
            return mapRawOrderDetail(body.order);
        }
        catch (error) {
            return handleApiError(error, 'Xác nhận đơn hàng thất bại');
        }
    },
    async collectPayment(id, body) {
        try {
            const response = await api.patch(`/orders/${id}/collect-payment`, body);
            const res = unwrapApiData(response);
            return mapRawOrderDetail(res.order);
        }
        catch (error) {
            return handleApiError(error, 'Thu tiền thất bại');
        }
    },
    async staffConfirmDelivery(id) {
        try {
            const response = await api.patch(`/orders/${id}/deliver`);
            const body = unwrapApiData(response);
            return mapRawOrderDetail(body.order);
        }
        catch (error) {
            return handleApiError(error, 'Xác nhận giao hàng thất bại');
        }
    },
    async staffCancelOrder(id, cancelReason) {
        try {
            const response = await api.patch(`/orders/${id}/cancel`, { cancelReason });
            const body = unwrapApiData(response);
            return mapRawOrderDetail(body.order);
        }
        catch (error) {
            return handleApiError(error, 'Hủy đơn hàng thất bại');
        }
    },
    async staffMarkShipping(id) {
        try {
            const response = await api.patch(`/orders/${id}/ship`);
            const body = unwrapApiData(response);
            return mapRawOrderDetail(body.order);
        }
        catch (error) {
            return handleApiError(error, 'Cập nhật trạng thái thất bại');
        }
    },
    async staffMarkDeliveryFailed(id) {
        try {
            const response = await api.patch(`/orders/${id}/delivery-failed`);
            const body = unwrapApiData(response);
            return mapRawOrderDetail(body.order);
        }
        catch (error) {
            return handleApiError(error, 'Cập nhật giao thất bại thất bại');
        }
    },
    async staffRedeliverOrder(id) {
        try {
            const response = await api.patch(`/orders/${id}/redeliver`);
            const body = unwrapApiData(response);
            return mapRawOrderDetail(body.order);
        }
        catch (error) {
            return handleApiError(error, 'Giao lại thất bại');
        }
    },
    async createInStoreOrder(payload) {
        try {
            const response = await api.post('/orders/instore', payload);
            const data = unwrapApiData(response);
            if (!data?.order)
                throw new Error('Invalid order response');
            return data.order;
        }
        catch (error) {
            return handleApiError(error, 'Tạo đơn hàng tại cửa hàng thất bại');
        }
    },
    // ─── In-store payment confirmation ─────────────────────────────────────────
    async completeInStoreOrder(id) {
        try {
            await api.patch(`/orders/${id}/complete-instore`);
        }
        catch (error) {
            return handleApiError(error, 'Xác nhận thanh toán tiền mặt thất bại');
        }
    },
    async getInStorePayosLink(orderId) {
        try {
            const response = await api.post(`/payment/payos-link/${orderId}`, {});
            const data = unwrapApiData(response);
            return data.checkoutUrl;
        }
        catch (error) {
            return handleApiError(error, 'Không tạo được QR thanh toán');
        }
    },
    async getInStorePaymentStatus(orderId) {
        try {
            const response = await api.get(`/payment/status/${orderId}`);
            const data = unwrapApiData(response);
            return data.payment?.status ?? 'unknown';
        }
        catch {
            return 'unknown';
        }
    },
};
