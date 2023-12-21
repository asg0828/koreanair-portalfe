import EmptyState from '@/components/emptyState/EmptyState';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { useTranslation } from 'react-i18next';

const Unauthorized = () => {
  const { t } = useTranslation();
  const contextPath = useAppSelector(selectContextPath());

  const handleConfirm = () => {
    window.location.href = contextPath;
  };

  return (
    <>
      <EmptyState
        type="warning"
        description={t('common.message.unauthorized')}
        confirmText={t('common.button.home')}
        onConfirm={handleConfirm}
      />
    </>
  );
};
export default Unauthorized;
