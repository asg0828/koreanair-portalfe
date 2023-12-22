import { useTranslation } from 'react-i18next';

const TempPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('common.message.preparingPage')}</h1>
    </>
  );
};

export default TempPage;
