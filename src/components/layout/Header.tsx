import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { ReducerType } from '@reducers';
import { MenuOutlinedIcon, LogoutOutlinedIcon, KeyboardArrowDownIcon } from '@/assets/icons';
import { Avatar, Typography, Stack, DropdownMenu, Page } from '@/components/ui';
import './Header.scss';

const Header = () => {
  const menuList = useSelector((state: ReducerType) => state.menu.menuList);
  const isAdminPage = useSelector((state: ReducerType) => state.auth.isAdminPage);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [subActiveIndex, setSubActiveIndex] = useState<number>(-1);

  const goToHome = () => {
    navigate(isAdminPage ? '/admin' : '/');
  };

  const handleTrigger = (index: number) => {
    setActiveIndex(index);
  }

  const handleSubTrigger = (index: number) => {
    setSubActiveIndex(index);
  }

  const handleClearTrigger = () => {
    setActiveIndex(-1);
    setSubActiveIndex(-1);
  }

  return (
    <header id="header">
      <Page fixedSize={true} style={{padding:'0 20px'}}>
        <Stack direction="Horizontal" justifyContent="Between">
          <Stack gap="XL" className="logo-wrap">
            <span className="home-logo" onClick={goToHome}>
              대한항공 Customer Data Portal
            </span>
            
          </Stack>

          <Stack className="menu-wrap" onMouseLeave={handleClearTrigger}>
            {menuList?.map((menu, index: number) => (
              <DropdownMenu.Root modal={false} key={`root-${index}`}>
                <DropdownMenu.Trigger
                  className={`dropdown-trigger ${activeIndex === index ? 'triger-active' : ''}`}
                  onMouseOver={() => handleTrigger(index)}
                >
                  <NavLink to={menu.path} end>
                    <Typography variant="h4" className="menu-title">
                      {menu.name}
                    </Typography>
                  </NavLink>
                </DropdownMenu.Trigger>

                {menu.children.length > 0 && (
                  <DropdownMenu.Portal forceMount={index === activeIndex ? true : undefined}>
                    <DropdownMenu.Content className="dropdown-content" onMouseLeave={handleClearTrigger}>
                        {menu.children.map((subMenu, index: number) => (
                          <>
                          {!subMenu.children[0] || subMenu.children[0].children.length === 0 ? (
                            <DropdownMenu.Item key={`subMenu-${index}`} className="dropdown-item" disabled onMouseOver={() => handleSubTrigger(-1)}>
                              <NavLink to={subMenu.path} end>
                                {({ isActive }) => <Typography variant="body1" className={isActive ? 'path-active' : ''}>{subMenu.name}</Typography>}
                              </NavLink>
                            </DropdownMenu.Item>
                          ):
                          (
                            <DropdownMenu.Sub>
                              <DropdownMenu.SubTrigger
                                className="dropdown-item"
                                onMouseOver={() => handleSubTrigger(index)}
                              >
                                <Stack>
                                  <Typography variant="body1">{subMenu.name}</Typography>
                                  <KeyboardArrowDownIcon />
                                </Stack>
                              </DropdownMenu.SubTrigger>

                              <DropdownMenu.Portal forceMount={index === subActiveIndex ? true : undefined}>
                                <DropdownMenu.SubContent className="dropdown-content">
                                  {subMenu.children.map((subMenuSecond, index: number) => (
                                    <DropdownMenu.Item key={`subMenuSecond-${index}`} className="dropdown-item" disabled>
                                      <NavLink to={subMenuSecond.path} end>
                                        {({ isActive }) => <Typography variant="body1" className={isActive ? 'path-active' : ''}>{subMenuSecond.name}</Typography>}
                                      </NavLink>
                                    </DropdownMenu.Item>
                                  ))}
                                </DropdownMenu.SubContent>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Sub>
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
            <Avatar status="01" />
            <LogoutOutlinedIcon color="action" />
            <MenuOutlinedIcon color="action" />
          </Stack>
        </Stack>
      </Page>
    </header>
  );
};
export default Header;
