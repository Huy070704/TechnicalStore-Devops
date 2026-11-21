import { LoadingIndicator } from './LoadingIndicator';
export const PageLoader = ({ label = 'Đang tải trang...', fullScreen = true, }) => (<div className={fullScreen
        ? 'loading-grid-bg flex min-h-screen items-center justify-center'
        : 'flex items-center justify-center py-xl'}>
    <LoadingIndicator label={label} variant={fullScreen ? 'page' : 'section'}/>
  </div>);
