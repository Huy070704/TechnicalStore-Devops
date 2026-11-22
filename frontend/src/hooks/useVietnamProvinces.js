import { useEffect, useState } from 'react';
import { fetchVietnamProvinces, formatProvincesData, } from '@/services/vietnamProvinces';
export const useVietnamProvinces = () => {
    const [provinces, setProvinces] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const raw = await fetchVietnamProvinces();
                if (!cancelled) {
                    setProvinces(formatProvincesData(raw));
                    setError(null);
                }
            }
            catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error
                        ? err.message
                        : 'Không tải được dữ liệu tỉnh/thành');
                }
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, []);
    return { provinces, loading, error };
};
