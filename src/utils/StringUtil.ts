/**
 * 등록/수정/삭제 CRUD 메뉴인 경우 메뉴 관리로 관리가 되지 않기 때문에 -reg, -detail, -edit 등
 * 가상 menuId로 관리된다. ID는 13자리로 관리되기 때문에 앞에서 13자리를 가져와 실제 menuId를
 * 얻는다.
 */
export const getRealMenuId = (crudMenuId: string = '') => {
  return crudMenuId.substring(0, 13);
};
