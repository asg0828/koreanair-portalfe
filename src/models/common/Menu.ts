export interface MenuItem {
  name: string;
  path: string;
  isPopup?: boolean;
  children: Array<MenuItem>;
}

export interface defaultPathInfo {
  [key: string]: string;
}
