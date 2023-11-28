import EmptyState from '@/components/emptyState/EmptyState';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();
  const contextPath = useAppSelector(selectContextPath());

  const handleConfirm = () => {
    navigate(contextPath);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <EmptyState
        type="warning"
        description="페이지가 존재하지 않습니다."
        confirmText="홈으로"
        cancleText="이전으로"
        onConfirm={handleConfirm}
        onCancle={handleCancel}
      />
    </>
  );
};
export default NotFound;
