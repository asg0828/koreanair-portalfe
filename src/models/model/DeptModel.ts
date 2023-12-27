export interface DeptParams {}

export interface DeptModel extends CreatedDeptModel {
  deptCode: string;
}

export interface CreatedDeptModel {
  deptNm?: string;
  upDeptCode: string;
  upDeptNm?: string;
  companyCode: string;
  userAuthId: string | null;
  userAuthNm?: string;
  mgrAuthId: string | null;
  mgrAuthNm?: string;
  useYn: string;
  ordSeq: number;
  oprtrSe?: 'C' | 'U' | 'D';
}

export interface UpdatedDeptModel extends CreatedDeptModel {
  deptCode: string;
  children?: Array<any>;
  rownum?: number;
}

export interface DeletedDeptModel {
  deptCode: string;
}
