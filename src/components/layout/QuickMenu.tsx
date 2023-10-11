import { Stack, Typography } from '@components/ui';
import './QuickMenu.scss';

const QuickLink = () => {
  return (
    <aside id="aside">
      <Stack direction="Vertical" alignItems="Center" className="quickMenu-wrap">
        <Typography variant="h4">Quick Menu</Typography>

        <Stack direction="Vertical" alignItems="Center">
          <Typography variant="body2">데이터셋</Typography>
          <Typography variant="body2">Q&A</Typography>
          <Typography variant="body2">FAQ</Typography>
        </Stack>
      </Stack>
    </aside>
  );
};
export default QuickLink;
