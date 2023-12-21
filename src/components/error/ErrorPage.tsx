import EmptyState from '@/components/emptyState/EmptyState';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  const contextPath = useAppSelector(selectContextPath());

  const handleConfirm = () => {
    window.location.href = contextPath;
  };

  return (
    <>
      <EmptyState
        type="error"
        description={t('common.message.error')}
        confirmText={t('common.button.home')}
        onConfirm={handleConfirm}
      />
    </>
  );
};
export default ErrorPage;
