import { Link } from 'react-router-dom';
import { Stack, Typography } from '@components/ui';
import { useState } from 'react';
import './QuickMenu.scss';
import { useAppSelector } from '@/hooks/useRedux';
import { selectContextPath } from '@/reducers/authSlice';

const QuickLink = () => {
  const contextPath = useAppSelector(selectContextPath());
  const [isToggleOpen, setIsToggleOpen] = useState('open');

  const quickLinkToggle = () => {
    if (isToggleOpen === 'open') {
      setIsToggleOpen('close');
    } else if (isToggleOpen === 'close') {
      setIsToggleOpen('open');
    }
  };

  return (
    <aside id="aside" className={isToggleOpen}>
      <Stack direction="Vertical" alignItems="Left" className="quickMenu-wrap shadowBox1">
        <Typography variant="h4" className="quickMenuTop" onClick={quickLinkToggle}>
          <Stack justifyContent="Between" className="width-100">
            <div className="text">Quick Link</div>
            <div className="quickMenuTopIcon"></div>
          </Stack>
        </Typography>
        <Stack direction="Vertical" alignItems="Left" className="quickLinkWrap">
          <Link
            to={contextPath === '/admin' ? '/admin/biz-meta-management/dataset' : '/biz-meta/dataset'}
            className="quickLinkItem"
          >
            <Stack style={{ justifyContent: 'space-between' }}>
              <span className="text">테이블정의서</span>
              <span className="icon"></span>
            </Stack>
          </Link>
          <Link
            to={contextPath === '/admin' ? '/admin/user-portal-management/board-management/faq' : '/board/qna'}
            className="quickLinkItem"
          >
            <Stack style={{ justifyContent: 'space-between' }}>
              <span className="text">Q&A</span>
              <span className="icon"></span>
            </Stack>
          </Link>
          <Link
            to={contextPath === '/admin' ? '/admin/user-portal-management/board-management/qna' : '/board/faq'}
            className="quickLinkItem"
          >
            <Stack style={{ justifyContent: 'space-between' }}>
              <span className="text">FAQ</span>
              <span className="icon"></span>
            </Stack>
          </Link>
          <Link
            to={contextPath === '/admin' ? '/admin/biz-meta-management/feature' : '/biz-meta/feature'}
            className="quickLinkItem"
          >
            <Stack style={{ justifyContent: 'space-between' }}>
              <span className="text">Feature</span>
              <span className="icon"></span>
            </Stack>
          </Link>
        </Stack>
      </Stack>
    </aside>
  );
};
export default QuickLink;
