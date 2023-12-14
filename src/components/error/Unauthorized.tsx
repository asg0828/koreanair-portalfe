import EmptyState from '@/components/emptyState/EmptyState';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';

const Unauthorized = () => {
  const contextPath = useAppSelector(selectContextPath());

  const handleConfirm = () => {
    window.location.href = contextPath;
  };

  return (
    <>
      <EmptyState type="warning" description="권한이 없습니다." confirmText="홈으로" onConfirm={handleConfirm} />
    </>
  );
};
export default Unauthorized;
