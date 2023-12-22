import { Loader, Stack } from '@components/ui';
import { useTranslation } from 'react-i18next';

const Fallback = () => {
  const { t } = useTranslation();

  return (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title={t('common.message.proceeding')} description={t('common.message.wait')} />
    </Stack>
  );
};

export default Fallback;
