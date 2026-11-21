const MaterialIcon = ({ name, className = '', filled = false }) => {
    return (<span aria-hidden="true" className={`material-symbols-outlined ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}>
      {name}
    </span>);
};
export default MaterialIcon;
