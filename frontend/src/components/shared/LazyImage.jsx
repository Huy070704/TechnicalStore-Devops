/**
 * Wrapper <img> với lazy loading chuẩn trình duyệt.
 * Dùng eager cho LCP (banner đầu, logo); lazy cho danh sách sản phẩm.
 */
export const LazyImage = ({ eager = false, loading, decoding, fetchPriority, ...props }) => (<img loading={loading ?? (eager ? 'eager' : 'lazy')} decoding={decoding ?? 'async'} fetchPriority={fetchPriority ?? (eager ? 'high' : undefined)} {...props}/>);
