import { api, unwrapApiData } from './api';
class FacilityService {
    async getFacilities() {
        const response = await api.get('/facilities');
        return unwrapApiData(response);
    }
    async getFacilityById(id) {
        const response = await api.get(`/facilities/${id}`);
        return unwrapApiData(response);
    }
    async updateFacility(id, payload) {
        const response = await api.patch(`/facilities/${id}`, payload);
        return unwrapApiData(response);
    }
    async setActive(id, isActive) {
        const response = await api.patch(`/facilities/${id}/active`, { isActive });
        return unwrapApiData(response);
    }
}
export const facilityService = new FacilityService();
