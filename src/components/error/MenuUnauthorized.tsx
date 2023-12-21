import EmptyState from '@/components/emptyState/EmptyState';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const MenuUnauthorized = () => {
  const { t } = useTranslation();
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
        description={t('common.message.menuUnauthorized')}
        confirmText={t('common.button.home')}
        cancleText={t('common.button.prev')}
        onConfirm={handleConfirm}
        onCancle={handleCancel}
      />
    </>
  );
};
export default MenuUnauthorized;
