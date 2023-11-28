import { CommonModel } from '@/models/model/CommonModel';
import { FileInfo } from '@/models/model/FileModel';

export interface DeptParams {}

export interface DeptModel extends CreatedDeptModel, CommonModel {
  deptCode: string;
}

export interface CreatedDeptModel extends FileInfo {
  deptNm: string;
  upDeptCode: string;
  modiSe: string;
  companyCode: string;
}

export interface UpdatedDeptModel extends CreatedDeptModel {
  deptCode: string;
}
