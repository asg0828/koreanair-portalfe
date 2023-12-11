import { updateUserEGroup } from '@/api/GroupAPI';
import { DeletedEGroupModel, UpdatedEGroupModel, UpdatedEGroupUserModel } from '@/models/model/GroupModel';
import { useMutation } from '@tanstack/react-query';

interface useUpdateUserEGroupParams {
  saveEgroup: Array<UpdatedEGroupModel> | Array<DeletedEGroupModel>;
  egroupUserUpdate?: Array<UpdatedEGroupUserModel>;
}

export const useUpdateUserEGroup = () => {
  return useMutation((params: useUpdateUserEGroupParams) =>
    updateUserEGroup(params.saveEgroup, params.egroupUserUpdate)
  );
};
