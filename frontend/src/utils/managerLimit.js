// Tổng số manager tối đa được phép tồn tại trong toàn hệ thống (mọi cơ sở).
export const MAX_MANAGERS = 4;
// Thông báo hiển thị khi vượt quá giới hạn manager.
export const MANAGER_LIMIT_MESSAGE = 'cơ sở hiện tại đã có đủ manager';
// Chuẩn hoá role về dạng slug chữ thường để so sánh an toàn.
export const getRoleSlug = (role) => (typeof role === 'string' ? role : role?.slug || role?.name || '').toLowerCase();
const isManagerSlug = (slug) => slug.includes('manager');
/**
 * Đếm tổng số manager trong danh sách tài khoản (trên toàn bộ cơ sở).
 */
export const countManagers = (accounts) => accounts.filter((account) => isManagerSlug(getRoleSlug(account.role))).length;
/**
 * Kiểm tra xem sau khi áp dụng các thay đổi role (map: email -> roleSlug mới)
 * thì tổng số manager có còn nằm trong giới hạn cho phép hay không.
 *
 * Dùng chung cho cả chỉnh sửa từng tài khoản lẫn cập nhật hàng loạt, nên chỉ
 * chặn khi số manager thực sự tăng vượt ngưỡng — không cản trở việc hạ cấp
 * manager hay chỉnh sửa thông tin của manager sẵn có.
 */
export const isWithinManagerLimit = (accounts, roleChanges) => {
    const projectedManagerCount = accounts.reduce((count, account) => {
        const nextRoleSlug = roleChanges[account.email] ?? getRoleSlug(account.role);
        return isManagerSlug(nextRoleSlug) ? count + 1 : count;
    }, 0);
    return projectedManagerCount <= MAX_MANAGERS;
};
