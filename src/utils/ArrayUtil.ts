import { HierarchyInfo } from '@/models/common/CommonInfo';

export const convertToHierarchyInfo = (flatArray: Array<HierarchyInfo>): Array<any> => {
  const map = new Map();
  const hierarchy: Array<HierarchyInfo> = [];

  flatArray.forEach((item: HierarchyInfo) => {
    map.set(item.id, { ...item, children: [] });
  });

  flatArray.forEach((item: HierarchyInfo) => {
    const parent = map.get(item.parentId);
    if (parent) {
      parent.children.push(map.get(item.id));
    } else {
      hierarchy.push(map.get(item.id));
    }
  });

  return hierarchy;
};

export const getNodeChildrenDeptCodeRecursive = (node: any, deptCodeList: any = new Set()) => {
  deptCodeList.add(node.deptCode);

  if (node.children) {
    node.children.forEach((n: any) => {
      deptCodeList.add(n.deptCode);
      getNodeChildrenDeptCodeRecursive(n, deptCodeList);
    });
  }

  return deptCodeList;
};
