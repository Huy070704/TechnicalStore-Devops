import { api, unwrapApiData } from './api';
class StatisticsService {
    async getAdminDashboardData(query = {}) {
        const params = {};
        if (query.timeRange)
            params.timeRange = query.timeRange;
        if (query.startDate)
            params.startDate = query.startDate;
        if (query.endDate)
            params.endDate = query.endDate;
        const response = await api.get('/statistics/admin-dashboard', { params });
        return unwrapApiData(response);
    }
    async getDashboardData(query) {
        const params = {};
        if (query?.timeRange)
            params.timeRange = query.timeRange;
        if (query?.startDate)
            params.startDate = query.startDate;
        if (query?.endDate)
            params.endDate = query.endDate;
        if (query?.categoryId)
            params.categoryId = query.categoryId;
        const response = await api.get('/statistics/dashboard', { params });
        return unwrapApiData(response);
    }
    async getManagerDetailedStats(query) {
        const params = {};
        if (query?.timeRange)
            params.timeRange = query.timeRange;
        if (query?.startDate)
            params.startDate = query.startDate;
        if (query?.endDate)
            params.endDate = query.endDate;
        if (query?.categoryId)
            params.categoryId = query.categoryId;
        const response = await api.get('/statistics/manager-stats', { params });
        return unwrapApiData(response);
    }
    async exportReport(query) {
        try {
            const params = {};
            if (query?.timeRange)
                params.timeRange = query.timeRange;
            if (query?.startDate)
                params.startDate = query.startDate;
            if (query?.endDate)
                params.endDate = query.endDate;
            const response = await api.get('/statistics/export', {
                params,
                responseType: 'blob',
            });
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Error exporting sales report:', error);
            throw error;
        }
    }
    async exportManagerStats(type, query) {
        const fileNames = {
            revenue: 'thong-ke-doanh-thu',
            orders: 'thong-ke-don-hang',
            products: 'thong-ke-san-pham',
            customers: 'thong-ke-khach-hang',
        };
        try {
            const params = { type };
            if (query?.timeRange)
                params.timeRange = query.timeRange;
            if (query?.startDate)
                params.startDate = query.startDate;
            if (query?.endDate)
                params.endDate = query.endDate;
            const response = await api.get('/statistics/manager-export', {
                params,
                responseType: 'blob',
            });
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `${fileNames[type]}-${date}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error(`Error exporting manager stats (${type}):`, error);
            throw error;
        }
    }
    async getRevenueData(query = {}) {
        const params = {};
        if (query.channel && query.channel !== 'all')
            params.channel = query.channel;
        if (query.timeRange)
            params.timeRange = query.timeRange;
        if (query.startDate)
            params.startDate = query.startDate;
        if (query.endDate)
            params.endDate = query.endDate;
        const response = await api.get('/statistics/revenue', { params });
        return unwrapApiData(response);
    }
}
export const statisticsService = new StatisticsService();
