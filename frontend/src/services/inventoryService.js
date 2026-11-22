import { api, unwrapApiData } from './api';
class InventoryService {
    async getReport(query) {
        const response = await api.get('/inventory/report', { params: query });
        return unwrapApiData(response);
    }
    async getManagerReport(query) {
        const response = await api.get('/inventory/manager/report', { params: query });
        return unwrapApiData(response);
    }
    async getStaffReport(query) {
        const response = await api.get('/inventory/staff/report', { params: query });
        return unwrapApiData(response);
    }
    async adjustStock(payload) {
        const response = await api.patch('/inventory/adjust', payload);
        return unwrapApiData(response);
    }
    async exportReport(query) {
        await this.downloadExport('/inventory/export', query, 'bao-cao-ton-kho');
    }
    async exportManagerReport(query) {
        await this.downloadExport('/inventory/manager/export', query, 'bao-cao-ton-kho-manager');
    }
    async downloadExport(url, query, filenamePrefix) {
        try {
            const response = await api.get(url, {
                params: query,
                responseType: 'blob',
            });
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.setAttribute('download', `${filenamePrefix}-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(objectUrl);
        }
        catch (error) {
            console.error('Error exporting inventory report:', error);
            throw error;
        }
    }
}
export const inventoryService = new InventoryService();
