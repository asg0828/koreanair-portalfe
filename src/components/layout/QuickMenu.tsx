import { useAppSelector } from '@/hooks/useRedux';
import { selectQuickMenuList } from '@/reducers/menuSlice';
import { Stack, Typography } from '@components/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './QuickMenu.scss';

const QuickMenu = () => {
  const { t } = useTranslation();
  const quickMenuList = useAppSelector(selectQuickMenuList());
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
            <div className="text">{t('common.label.quickLink')}</div>
            <div className="quickMenuTopIcon" />
          </Stack>
        </Typography>
        <Stack direction="Vertical" alignItems="Left" className="quickLinkWrap">
          {quickMenuList.map((item) => (
            <Link to={item.menuUrl} className="quickLinkItem">
              <Stack style={{ justifyContent: 'space-between' }}>
                <span className="text">{item.menuNm}</span>
                <span className="icon" />
              </Stack>
            </Link>
          ))}
        </Stack>
      </Stack>
    </aside>
  );
};
export default QuickMenu;
