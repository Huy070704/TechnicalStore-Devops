const statusClasses = {
    Active: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    'Low Stock': 'bg-error-container text-on-error-container',
    'Out of Stock': 'bg-secondary-fixed text-on-secondary-fixed-variant',
    Archived: 'bg-surface-container-high text-secondary',
};
const dotClasses = {
    Active: 'bg-tertiary',
    'Low Stock': 'bg-error',
    'Out of Stock': 'bg-secondary',
    Archived: 'bg-secondary',
};
const statusLabels = {
    Active: 'Đang bán',
    'Low Stock': 'Sắp hết hàng',
    'Out of Stock': 'Hết hàng',
    Archived: 'Ngừng kinh doanh',
};
const ProductStatusBadge = ({ status }) => {
    return (<span className={`inline-flex items-center rounded-full px-sm py-1 text-label-xs ${statusClasses[status]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotClasses[status]}`}/>
      {statusLabels[status]}
    </span>);
};
export default ProductStatusBadge;
