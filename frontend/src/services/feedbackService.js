import { api, unwrapApiData } from './api';
class FeedbackService {
    async getFeedbacksByProduct(productId) {
        try {
            const response = await api.get(`/feedbacks/product/${productId}`);
            const data = unwrapApiData(response);
            return Array.isArray(data?.feedbacks) ? data.feedbacks : [];
        }
        catch (error) {
            console.error('Error fetching feedbacks by product:', error);
            return [];
        }
    }
    async getManagementFeedbacks(params = {}) {
        const response = await api.get('/feedbacks/management', { params });
        return unwrapApiData(response);
    }
    async getFeedbackById(id) {
        const response = await api.get(`/feedbacks/${id}`);
        const data = unwrapApiData(response);
        if (!data?.feedback)
            throw new Error('Feedback not found');
        return data.feedback;
    }
    async getStatistics() {
        const response = await api.get('/feedbacks/statistics');
        const data = unwrapApiData(response);
        return data.statistics ?? {
            total: 0,
            visibleTotal: 0,
            hiddenCount: 0,
            repliedCount: 0,
            averageRating: 0,
            replyRate: 0,
        };
    }
    async createFeedback(input) {
        const response = await api.post('/feedbacks', input);
        const data = unwrapApiData(response);
        if (!data?.feedback)
            throw new Error('Create feedback failed');
        return data.feedback;
    }
    async replyToFeedback(id, managerContent) {
        const response = await api.patch(`/feedbacks/${id}/reply`, { managerContent });
        const data = unwrapApiData(response);
        if (!data?.feedback)
            throw new Error('Reply failed');
        return data.feedback;
    }
    async toggleHide(id, isHidden) {
        const response = await api.patch(`/feedbacks/${id}/hide`, { isHidden });
        const data = unwrapApiData(response);
        if (!data?.feedback)
            throw new Error('Update failed');
        return data.feedback;
    }
    async deleteFeedback(id) {
        await api.delete(`/feedbacks/${id}`);
    }
    async getMyFeedbacks() {
        const response = await api.get('/feedbacks/my-feedbacks');
        const data = unwrapApiData(response);
        return Array.isArray(data?.feedbacks) ? data.feedbacks : [];
    }
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return unwrapApiData(response);
    }
    async attachToFeedback(feedbackId, urls) {
        await api.post('/image/attach-to-feedback', {
            query: feedbackId,
            imagesURL: urls.join(','),
        });
    }
}
export const feedbackService = new FeedbackService();
