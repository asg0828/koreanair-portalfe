export interface Hierarchy {
  id: string;
  parentId: string;
  children: Array<Hierarchy>;
  [key: string | number]: any;
}

export const convertToHierarchy = (flatArray: Array<Hierarchy>): Array<any> => {
  const map = new Map();
  const hierarchy: Array<Hierarchy> = [];

  flatArray.forEach((item: Hierarchy) => {
    map.set(item.id, { ...item, children: [] });
  });

  flatArray.forEach((item: Hierarchy) => {
    const parent = map.get(item.parentId);
    if (parent) {
      parent.children.push(map.get(item.id));
    } else {
      hierarchy.push(map.get(item.id));
    }
  });

  return hierarchy;
};
