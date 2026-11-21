import { api, unwrapApiData } from './api';
class InvoiceService {
    async getAll() {
        try {
            const response = await api.get('/invoices');
            const data = unwrapApiData(response);
            return Array.isArray(data?.invoices) ? data.invoices : [];
        }
        catch (error) {
            console.error('Error fetching invoices:', error);
            return [];
        }
    }
    async markAsPaid(id, paymentMethod) {
        const response = await api.patch(`/invoices/${id}/mark-paid`, { paymentMethod });
        const data = unwrapApiData(response);
        if (!data?.invoice)
            throw new Error('Invalid invoice response');
        return data.invoice;
    }
    async cancel(id) {
        const response = await api.patch(`/invoices/${id}/cancel`);
        const data = unwrapApiData(response);
        if (!data?.invoice)
            throw new Error('Invalid invoice response');
        return data.invoice;
    }
}
export const invoiceService = new InvoiceService();
