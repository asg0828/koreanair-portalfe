import { Link } from 'react-router-dom';
import { Stack, Typography } from '@components/ui';
import { useState } from "react";
import './QuickMenu.scss';

const QuickLink = () => {
  const [isToggleOpen ,setIsToggleOpen] = useState("open");

  const quickLinkToggle = () => {
    if(isToggleOpen === "open"){
      setIsToggleOpen("close");
    }
    else if(isToggleOpen === "close"){
      setIsToggleOpen("open");
    }
  }
  return (
    <aside id="aside" className={isToggleOpen}>
      <Stack direction="Vertical" alignItems="Left" className="quickMenu-wrap shadowBox1">
        <Typography variant="h4" className='quickMenuTop' onClick={quickLinkToggle}>
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
