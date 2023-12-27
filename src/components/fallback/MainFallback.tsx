import '@/assets/styles/Fallback.scss';
import { Loader, Stack } from '@components/ui';
import { useTranslation } from 'react-i18next';

const MainFallback = () => {
  const { t } = useTranslation();

  return (
    <Stack justifyContent="Center" className="fallback">
      <Loader title={t('common.message.proceeding')} description={t('common.message.wait')} />
    </Stack>
  );
};

export default MainFallback;
