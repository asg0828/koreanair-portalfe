import EmptyState from '@/components/emptyState/EmptyState';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';

const ErrorPage = () => {
  const contextPath = useAppSelector(selectContextPath());

  const handleConfirm = () => {
    window.history.pushState({}, '', contextPath);
  };

  return (
    <>
      <EmptyState type="error" description="에러가 발생했습니다." confirmText="홈으로" onConfirm={handleConfirm} />
    </>
  );
};
export default ErrorPage;
