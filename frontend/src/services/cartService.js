import { api, unwrapApiData } from './api';
/**
 * API giỏ hàng (yêu cầu Bearer token).
 * Response sau interceptor: { success, statusCode, data: ServerCart }
 */
export const cartService = {
    /** GET /api/cart/view */
    async viewCart() {
        const response = await api.get('/cart/view');
        return unwrapApiData(response);
    },
    /** POST /api/cart/add */
    async addToCart(productId, quantity) {
        const response = await api.post('/cart/add', { productId, quantity });
        return unwrapApiData(response);
    },
    /** POST /api/cart/increase */
    async increaseQuantity(productId, amount = 1) {
        const response = await api.post('/cart/increase', { productId, amount });
        return unwrapApiData(response);
    },
    /** POST /api/cart/decrease */
    async decreaseQuantity(productId, amount = 1) {
        const response = await api.post('/cart/decrease', { productId, amount });
        return unwrapApiData(response);
    },
    /** PATCH /api/cart/remove */
    async removeItem(productId) {
        const response = await api.patch('/cart/remove', { productId });
        return unwrapApiData(response);
    },
    /** POST /api/cart/clear */
    async clearCart() {
        const response = await api.post('/cart/clear');
        return unwrapApiData(response);
    },
    /** POST /api/cart/merge-guest — sau đăng nhập */
    async mergeGuestLines(lines) {
        const response = await api.post('/cart/merge-guest', { lines });
        return unwrapApiData(response);
    },
};
