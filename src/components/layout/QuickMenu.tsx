import { Link } from 'react-router-dom';
import { Stack, Typography } from '@components/ui';
import './QuickMenu.scss';

const QuickLink = () => {
  return (
    <aside id="aside">
      <Stack direction="Vertical" alignItems="Left" className="quickMenu-wrap shadowBox1">
        <Typography variant="h4" className='quickMenuTop'>
          <Stack justifyContent='Between' className="width-100">
            <div className="text">
              Quick Link
            </div>
            <div className="quickMenuTopIcon"></div>
          </Stack>
        </Typography>
        <Stack direction="Vertical" alignItems="Left" className="quickLinkWrap">
          <Link to="/" className='quickLinkItem'>
            <Stack style={{justifyContent:"space-between"}}>
              <span className='text'>
                테이블정의서
              </span>
              <span className="icon"></span>
            </Stack>
          </Link>
          <Link to="/" className='quickLinkItem'>
            <Stack style={{justifyContent:"space-between"}}>
              <span className='text'>
                Q&A
              </span>
              <span className="icon"></span>
            </Stack>
          </Link>
          <Link to="/" className='quickLinkItem'>
            <Stack style={{justifyContent:"space-between"}}>
              <span className='text'>
                FAQ
              </span>
              <span className="icon"></span>
            </Stack>
          </Link>
          <Link to="/" className='quickLinkItem'>
            <Stack style={{justifyContent:"space-between"}}>
              <span className='text'>
                Feature
              </span>
              <span className="icon"></span>
            </Stack>
          </Link>
        </Stack>
      </Stack>
    </aside>
  );
};
export default QuickLink;
