export interface MenuInfo {
  menuList: Array<MenuItem> | [];
}

export interface MenuItem {
  name: string,
  path: string,
  children: Array<MenuItem> | [],
}

export interface defaultPathInfo {
  [key: string]: string,
}