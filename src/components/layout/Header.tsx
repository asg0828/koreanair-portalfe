import { KeyboardArrowDownIcon, LogoutOutlinedIcon, MenuOutlinedIcon } from '@/assets/icons';
import { Avatar, DropdownMenu, Page, Stack, Typography } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType } from '@/models/common/Constants';
import { selectContextPath } from '@/reducers/authSlice';
import { selectIsDropMenu, selectMenuList, setIsDropMenu } from '@/reducers/menuSlice';
import { openModal } from '@/reducers/modalSlice';
import SessionApis from '@api/common/SessionApis';
import SessionUtil from '@utils/SessionUtil';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sessionApis = new SessionApis();
  const sessionUtil = new SessionUtil();
  const isDropMenu = useAppSelector(selectIsDropMenu());
  const menuList = useAppSelector(selectMenuList());
  const contextPath = useAppSelector(selectContextPath());
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [subActiveIndex, setSubActiveIndex] = useState<number>(-1);

  const goToHome = () => {
    navigate(contextPath);
  };

  const goToMyPage = () => {
    navigate(`${contextPath}/mypage`);
  };

  const handleTrigger = (index: number) => {
    if (!isDropMenu) {
      setActiveIndex(index);
    }
  };

  const handleSubTrigger = (index: number) => {
    setSubActiveIndex(index);
  };

  const handleClearTrigger = () => {
    setActiveIndex(-1);
    setSubActiveIndex(-1);
  };

  const handleNaviLink = (e: any, menu: any) => {
    if (menu.menuUrl.includes('/popup')) {
      e.preventDefault();
      sessionUtil.setLocalStorageInfo(sessionUtil.getAccessTokenRefreshTokenInfo());
      sessionUtil.setLocalStorageInfo(sessionUtil.getSessionRequestInfo());
      sessionUtil.setLocalStorageInfo(sessionUtil.getSessionInfo());

      window.open(`${menu.menuUrl}`, '_blank', 'noopener, noreferrer');
    }
  };

  const handleLogout = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '확인',
        content: '로그아웃 하시겠습니까?',
        onConfirm: async () => {
          await sessionApis.logoutSession();
          await sessionApis.revokeToken();
          sessionUtil.googleLogout();
        },
      })
    );
  };

  const handleDropMenu = () => {
    dispatch(setIsDropMenu(!isDropMenu));
  };

  return (
    <header id="header" className={contextPath === ContextPath.ADMIN ? 'admin' : ''}>
      <Page fixedSize={true} style={{ padding: '0 20px' }}>
        <Stack direction="Horizontal" justifyContent="Between">
          <Stack gap="XL" className="logo-wrap">
            <MenuOutlinedIcon className="dropMenuIcon" color="action" onClick={handleDropMenu} />
            <span className="home-logo" onClick={goToHome}>
              <div className="headerLogo"></div>
              {contextPath === ContextPath.ADMIN ? (
                `CDP ADMIN`
              ) : (
                <p>
                  Customer
                  <br /> Data Portal
                </p>
              )}
            </span>
          </Stack>

          <Stack className="menu-wrap" onMouseLeave={handleClearTrigger}>
            {menuList?.map((menu, index: number) => (
              <DropdownMenu.Root modal={false} key={`root-${index}`}>
                <DropdownMenu.Trigger
                  className={`dropdown-trigger ${activeIndex === index ? 'triger-active' : ''}`}
                  onMouseOver={() => handleTrigger(index)}
                >
                  <NavLink to={menu.menuUrl} end onClick={(e) => handleNaviLink(e, menu)}>
                    <Typography variant="h4" className="menu-title">
                      {menu.menuNm}
                    </Typography>
                  </NavLink>
                </DropdownMenu.Trigger>

                {menu.children.length > 0 && (
                  <DropdownMenu.Portal forceMount={index === activeIndex ? true : undefined}>
                    <DropdownMenu.Content className="dropdown-content" onMouseLeave={handleClearTrigger}>
                      {menu.children.map((subMenu: any, index: number) => (
                        <>
                          {subMenu.children.length > 0 && subMenu.children.find((item: any) => !item.isCrudPage) ? (
                            <DropdownMenu.Sub>
                              <DropdownMenu.SubTrigger
                                className="dropdown-item"
                                onMouseOver={() => handleSubTrigger(index)}
                              >
                                <Stack>
                                  <Typography variant="body1">{subMenu.menuNm}</Typography>
                                  <KeyboardArrowDownIcon />
                                </Stack>
                              </DropdownMenu.SubTrigger>

                              <DropdownMenu.Portal forceMount={index === subActiveIndex ? true : undefined}>
                                <DropdownMenu.SubContent className="dropdown-content">
                                  {subMenu.children.map((subMenuSecond: any, index: number) => (
                                    <DropdownMenu.Item
                                      key={`subMenuSecond-${index}`}
                                      className="dropdown-item"
                                      disabled
                                    >
                                      <NavLink to={subMenuSecond.menuUrl} end>
                                        {({ isActive }) => (
                                          <Typography variant="body1" className={isActive ? 'path-active' : ''}>
                                            {subMenuSecond.menuNm}
                                          </Typography>
                                        )}
                                      </NavLink>
                                    </DropdownMenu.Item>
                                  ))}
                                </DropdownMenu.SubContent>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Sub>
                          ) : (
                            <DropdownMenu.Item
                              key={`subMenu-${index}`}
                              className="dropdown-item"
                              disabled
                              onMouseOver={() => handleSubTrigger(-1)}
                            >
                              <NavLink to={subMenu.menuUrl} end>
                                {({ isActive }) => (
                                  <Typography variant="body1" className={isActive ? 'path-active' : ''}>
                                    {subMenu.menuNm}
                                  </Typography>
                                )}
                              </NavLink>
                            </DropdownMenu.Item>
                          )}
                        </>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                )}
              </DropdownMenu.Root>
            ))}
          </Stack>

          <Stack justifyContent="End" gap="XL" className="user-info-wrap">
            <Avatar status="02" onClick={goToMyPage} />
            <LogoutOutlinedIcon color="action" onClick={handleLogout} />
          </Stack>
        </Stack>
      </Page>

      <div className={`dropDownMenu ${isDropMenu ? 'open' : 'close'}`}>
        <Page fixedSize={true} style={{ padding: '0 20px' }}>
          <div className="dropDownWrap">
            {menuList?.map((menu, index: number) => (
              <div key={`menu-${index}`} className="dropDownItem">
                <Link to={menu.menuUrl} className="depth1" onClick={(e) => handleNaviLink(e, menu)}>
                  {menu.menuNm}
                </Link>
                {menu.children.length > 0 && (
                  <div>
                    {menu.children.map((subMenu: any, index: number) => (
                      <div key={`subMenu-${index}`}>
                        {!subMenu.children[0] || subMenu.children[0].children.length === 0 ? (
                          <Link to={subMenu.menuUrl} className="depth2" onClick={(e) => handleNaviLink(e, menu)}>
                            {subMenu.menuNm}
                          </Link>
                        ) : (
                          <div className="dropdown-subwrap">
                            <Typography variant="body1">{subMenu.menuNm}</Typography>
                            {subMenu.children.map((subMenuSecond: any, index: number) => (
                              <div key={`subMenuSecond-${index}`} className="dropdown-item">
                                <Link to={subMenuSecond.menuUrl} onClick={(e) => handleNaviLink(e, menu)}>
                                  <Typography variant="body1">{subMenuSecond.menuNm}</Typography>
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Page>
      </div>
    </header>
  );
};
export default Header;
