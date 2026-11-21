import { api, unwrapApiData } from './api';
class StaffRequestService {
    async createRequest(payload) {
        const response = await api.post('/staff-requests', payload);
        const data = unwrapApiData(response);
        if (data.request)
            return data.request;
        return data;
    }
    async getMyRequests(page = 1, pageSize = 10) {
        const response = await api.get('/staff-requests/my', { params: { page, pageSize } });
        return unwrapApiData(response);
    }
    async getManagementRequests(status = 'all', page = 1, pageSize = 20) {
        const response = await api.get('/staff-requests/management', {
            params: { status, page, pageSize },
        });
        return unwrapApiData(response);
    }
    async approveRequest(id, adminNote) {
        const response = await api.patch(`/staff-requests/${id}/approve`, { adminNote });
        const data = unwrapApiData(response);
        if (!data.request)
            throw new Error('Approve failed');
        return data.request;
    }
    async rejectRequest(id, adminNote) {
        const response = await api.patch(`/staff-requests/${id}/reject`, { adminNote });
        const data = unwrapApiData(response);
        if (!data.request)
            throw new Error('Reject failed');
        return data.request;
    }
}
export const staffRequestService = new StaffRequestService();
export const STAFF_REQUEST_ROLE_LABELS = {
    staff: 'Nhân viên (Staff)',
    manager: 'Quản lý (Manager)',
    shipper: 'Giao hàng (Shipper)',
};
export const STAFF_REQUEST_STATUS_LABELS = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
};
