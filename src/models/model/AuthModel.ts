import { CommonModel } from '@/models/model/CommonModel';

export interface AuthParams {}

export interface AuthModel extends CreatedAuthModel, CommonModel {
  authId: string;
}

export interface CreatedAuthModel {
  authNm: string;
  authDsc: string;
}

export interface UpdatedAuthModel extends CreatedAuthModel {
  authId: string;
}
