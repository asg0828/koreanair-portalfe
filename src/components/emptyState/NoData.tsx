import { TextSnippetOutlinedIcon } from '@/assets/icons';
import { Stack, Typography } from '@components/ui';
import './NoData.scss';

export interface NoDataProps {
  className?: string;
}

const NoData = ({ className = '' }: NoDataProps) => {
  return (
    <Stack direction="Vertical" justifyContent="Center" alignItems="Center" className={`no-data ${className}`}>
      <TextSnippetOutlinedIcon color="disabled" />
      <Typography variant="body1">No data.</Typography>
    </Stack>
  );
};

export default NoData;
