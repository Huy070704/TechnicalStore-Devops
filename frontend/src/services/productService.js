import { api, unwrapApiData } from './api';
const pickProducts = (data) => Array.isArray(data?.products) ? data.products : [];
const pickProduct = (data) => data?.product ?? null;
const pickCategories = (data) => Array.isArray(data?.categories) ? data.categories : [];
class ProductService {
    async getAllProducts() {
        try {
            const response = await api.get('/products');
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error('Error fetching all products:', error);
            return [];
        }
    }
    /** Lấy sản phẩm theo tồn kho cơ sở của nhân viên đang đăng nhập (dùng cho bán hàng tại quầy). */
    async getStaffInstoreProducts() {
        try {
            const response = await api.get('/products/instore');
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error('Error fetching instore products:', error);
            return [];
        }
    }
    /** Lấy tất cả sản phẩm (kể cả hết hàng) với stock tại cơ sở của manager. */
    async getManagerProducts() {
        try {
            const response = await api.get('/products/manager/all');
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error('Error fetching manager products:', error);
            return [];
        }
    }
    async getProductsByCategory(categoryId) {
        try {
            const response = await api.get(`/products/category/${categoryId}`);
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    }
    async getCategories() {
        try {
            const response = await api.get('/products/categories/all');
            const data = unwrapApiData(response);
            return pickCategories(data);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
    async getProductById(id) {
        try {
            const response = await api.get(`/products/${id}`);
            const data = unwrapApiData(response);
            return pickProduct(data);
        }
        catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }
    async getProductByIdForAdmin(id) {
        try {
            const response = await api.get(`/products/${id}/admin`);
            const data = unwrapApiData(response);
            return pickProduct(data);
        }
        catch (error) {
            console.error("Error fetching admin product:", error);
            return null;
        }
    }
    async getNewProducts(limit = 8) {
        try {
            const response = await api.get(`/products/new?limit=${limit}`);
            const data = unwrapApiData(response);
            const grouped = data?.products;
            return {
                laptops: grouped?.laptops ?? [],
                pcs: grouped?.pcs ?? [],
                accessories: grouped?.accessories ?? [],
            };
        }
        catch (error) {
            console.error('Error fetching new products:', error);
            return { laptops: [], pcs: [], accessories: [] };
        }
    }
    async getTopSellingProducts(limit = 8) {
        try {
            const response = await api.get(`/products/top-selling?limit=${limit}`);
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error('Error fetching top selling products:', error);
            return [];
        }
    }
    async getFeaturedProducts(limit = 8) {
        try {
            const response = await api.get(`/products/featured?limit=${limit}`);
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    }
    async getProductsByCategoryName(categoryName) {
        try {
            const response = await api.get(`/products/category-name/${encodeURIComponent(categoryName)}`);
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error(`Error fetching products by category name ${categoryName}:`, error);
            return [];
        }
    }
    async searchProducts(keyword) {
        try {
            const response = await api.get(`/products/search?q=${encodeURIComponent(keyword)}`);
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error('Error searching products:', error);
            try {
                const allProducts = await this.getAllProducts();
                const keywordLower = keyword.toLowerCase();
                return allProducts.filter((product) => product.name.toLowerCase().includes(keywordLower) ||
                    (product.category?.name || '')
                        .toLowerCase()
                        .includes(keywordLower) ||
                    (product.description || '').toLowerCase().includes(keywordLower));
            }
            catch {
                return [];
            }
        }
    }
    async getProductsByType(type, limit = 8) {
        try {
            const response = await api.get(`/products/type/${type}?limit=${limit}`);
            const data = unwrapApiData(response);
            return pickProducts(data);
        }
        catch (error) {
            console.error(`Error fetching products by type ${type}:`, error);
            return [];
        }
    }
    async createProduct(payload) {
        const body = {
            ...payload,
            url: payload.imageUrl,
        };
        const response = await api.post('/products', body);
        const data = unwrapApiData(response);
        const product = pickProduct(data);
        if (product)
            return product;
        throw new Error('Invalid create product response');
    }
    async updateProduct(id, payload) {
        const body = {
            ...payload,
            url: payload.imageUrl,
        };
        const response = await api.patch(`/products/${id}`, body);
        const data = unwrapApiData(response);
        const product = pickProduct(data);
        if (product)
            return product;
        throw new Error('Invalid update product response');
    }
    async attachImageToProduct(productId, imageUrl) {
        await api.post('/image/attach-to-product', {
            query: productId,
            imagesURL: imageUrl,
        });
    }
    async deleteProduct(id) {
        await api.delete(`/products/${id}`);
    }
}
export const productService = new ProductService();
