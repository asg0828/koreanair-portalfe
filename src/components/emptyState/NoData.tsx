import { TextSnippetOutlinedIcon } from '@/assets/icons';
import { Stack, Typography } from '@components/ui';
import './NoData.scss';

const NoData = () => {
  return (
    <Stack direction="Vertical" className="no-data" justifyContent="Center">
      <TextSnippetOutlinedIcon color="disabled" />
      <Typography variant="body1">No data.</Typography>
    </Stack>
  );
};

export default NoData;
