import { api, unwrapApiData } from './api';
class ExportReportService {
    async getReport(query) {
        const response = await api.get('/reports/export', { params: query });
        return unwrapApiData(response);
    }
    async exportReport(query) {
        await this.downloadExport('/reports/export/excel', query, 'bao-cao-xuat-kho');
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
            console.error('Error exporting export report:', error);
            throw error;
        }
    }
}
export const exportReportService = new ExportReportService();
