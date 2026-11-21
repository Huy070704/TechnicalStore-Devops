import { useCallback, useState } from 'react';
import { orderService } from '@/services/orderService';
export const useOrders = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cancelOrder = useCallback(async (orderId, cancelReason) => {
        setLoading(true);
        setError(null);
        try {
            return await orderService.updateOrderStatus(orderId, 'CANCELLED', cancelReason);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Hủy đơn hàng thất bại';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const confirmDelivery = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            return await orderService.confirmDelivery(orderId);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Xác nhận nhận hàng thất bại';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const updateStatus = useCallback(async (orderId, status, cancelReason) => {
        setLoading(true);
        setError(null);
        try {
            return await orderService.updateOrderStatus(orderId, status, cancelReason);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Cập nhật đơn hàng thất bại';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { cancelOrder, confirmDelivery, updateStatus, loading, error };
};
