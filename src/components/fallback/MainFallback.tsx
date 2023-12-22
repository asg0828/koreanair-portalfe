import { Stack, Loader } from '@components/ui';
import '@/assets/styles/Fallback.scss';
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
