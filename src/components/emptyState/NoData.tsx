import { TextSnippetOutlinedIcon } from '@/assets/icons';
import { Stack, Typography } from '@components/ui';
import { useTranslation } from 'react-i18next';
import './NoData.scss';

export interface NoDataProps {
  className?: string;
}

const NoData = ({ className = '' }: NoDataProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="Vertical" justifyContent="Center" alignItems="Center" className={`no-data ${className}`}>
      <TextSnippetOutlinedIcon color="disabled" />
      <Typography variant="body1">{t('common.message.noData')}</Typography>
    </Stack>
  );
};

export default NoData;
