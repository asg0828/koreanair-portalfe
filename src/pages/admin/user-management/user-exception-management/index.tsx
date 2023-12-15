import ErrorLabel from '@/components/error/ErrorLabel';
import TreeSearchForm from '@/components/form/TreeSearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useUpdateUserEGroup } from '@/hooks/mutations/useGroupMutations';
import { useAdminAuthAllList, useUserAuthAllList } from '@/hooks/queries/useAuthQueries';
import { useUserEGroupAllList, useUserEGroupUserList } from '@/hooks/queries/useGroupQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ModalType, ValidType } from '@/models/common/Constants';
import { AuthModel } from '@/models/model/AuthModel';
import { EGroupUserModel, UpdatedEGroupModel, UpdatedEGroupUserModel } from '@/models/model/GroupModel';
import { UserModel } from '@/models/model/UserModel';
import { openModal } from '@/reducers/modalSlice';
import {
  convertToHierarchyInfo,
  findUpdatedArray,
  getNodeCheckedListRecursive,
  sortChildrenRecursive,
} from '@/utils/ArrayUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { MoveHandler } from 'react-arborist';
import { Controller, useForm } from 'react-hook-form';

const initItem: UpdatedEGroupModel = {
  groupCode: '',
  groupNm: '',
  upGroupCode: '',
  upGroupNm: '',
  userAuthId: '',
  mgrAuthId: '',
  useYn: 'Y',
  oprtrSe: 'U',
  ordSeq: 0,
};

const List = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [egroupUserUpdate, setEgroupUserUpdate] = useState<Array<UpdatedEGroupUserModel>>([]);
  const [eGroupUserList, setEGroupUserList] = useState<Array<EGroupUserModel>>([]);
  const [userAuthList, setUserAuthList] = useState<Array<AuthModel>>([]);
  const [adminAuthList, setAdminAuthList] = useState<Array<AuthModel>>([]);
  const [initData, setInitData] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [treeData, setTreeData] = useState<Array<HierarchyInfo>>([]);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdatedEGroupModel>({
    mode: 'onChange',
    defaultValues: { ...initItem },
  });
  const values = getValues();
  const { data: response, isSuccess, isError, isFetching, refetch } = useUserEGroupAllList();
  const { data: uguResponse, isError: uguIsError, refetch: uguRefetch } = useUserEGroupUserList(values.groupCode);
  const { data: uaResponse, isError: uaIsError, refetch: uaRefetch } = useUserAuthAllList();
  const { data: aaResponse, isError: aaIsError, refetch: aaUreftch } = useAdminAuthAllList();
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMutate } = useUpdateUserEGroup();

  const findCreatedItem = () => {
    return data.find((item) => item.oprtrSe === 'C');
  };

  const handleClick = (item: any) => {
    if (item.isSelected) {
      const createdItem = findCreatedItem();
      if (item.oprtrSe === 'C' || !createdItem) {
        reset(item);
      } else {
        toast({
          type: ValidType.INFO,
          content: '저장되지 않은 메뉴가 있습니다.',
        });
        setData([...data]);
      }
    } else {
      reset({ ...initItem });
    }
  };

  const handleMove: MoveHandler<any> = (args) => {
    if (findCreatedItem()) {
      toast({
        type: ValidType.INFO,
        content: '저장되지 않은 메뉴가 있습니다.',
      });
      return;
    }

    let { dragIds, parentId, index } = args;
    if (parentId === '__REACT_ARBORIST_INTERNAL_ROOT__') {
      parentId = null;
    }

    setData((prevState) => {
      const toChildren = prevState.filter((item) => item.upGroupCode === parentId).sort((a, b) => a.ordSeq - b.ordSeq);
      dragIds.forEach((id, i) => {
        const movedItem = prevState.find((item) => item.groupCode === id);
        const toIndex = index + i;

        if (movedItem) {
          if (parentId === movedItem.upGroupCode) {
            const toIndex = toChildren.findIndex((item) => item.groupCode === movedItem.groupCode);
            toChildren.splice(toIndex, 1);
          }

          const fromChildren = prevState
            .filter((item) => item.upGroupCode === movedItem.upGroupCode || !item.upGroupCode)
            .sort((a, b) => a.ordSeq - b.ordSeq);
          const fromIndex = fromChildren.findIndex((item) => item.groupCode === movedItem.groupCode);
          fromChildren.splice(fromIndex, 1);
          fromChildren.forEach((item, index) => (item.ordSeq = index));

          toChildren.splice(toIndex, 0, movedItem);
          toChildren.forEach((item, index) => (item.ordSeq = index));

          movedItem.upGroupCode = parentId;
        }
      });

      return [...prevState];
    });
  };

  const handleCreate = () => {
    if (findCreatedItem()) {
      toast({
        type: ValidType.INFO,
        content: '저장되지 않은 메뉴가 있습니다.',
      });
      return;
    }

    const ordSeq = treeData[treeData.length - 1].ordSeq;
    const newItem: any = {
      ...initItem,
      oprtrSe: 'C',
      upGroupCode: null,
      upGroupNm: '',
      ordSeq: ordSeq ? ordSeq + 1 : treeData.length,
      isSelected: true,
    };

    if (values.upGroupCode) {
      newItem.upMenuId = values.upGroupCode;
      newItem.upMenuNm = values.upGroupNm;
      newItem.ordSeq = values.children?.length || 0;
    }

    setData((prevData) => prevData.concat(newItem));
    reset(newItem);
  };

  const handleDelete = () => {
    const checkedList = getNodeCheckedListRecursive(treeData);

    if (checkedList.length === 0) {
      toast({
        type: ValidType.INFO,
        content: '메뉴를 선택해주세요.',
      });
    } else {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '삭제',
          content: '삭제하시겠습니까?',
          onConfirm: () => {
            const hasIdList = checkedList.filter((item) => item.groupCode);

            if (checkedList.length !== hasIdList.length) {
              setData((prevDate) => prevDate.filter((item) => item.groupCode));
            }

            if (hasIdList.length > 0) {
              uMutate({
                saveEgroup: hasIdList.map((item) => ({ groupCode: item.groupCode, oprtrSe: 'D' })),
                egroupUserUpdate: [],
              });
            }
          },
        })
      );
    }
  };

  const onSubmit = (formData: UpdatedEGroupModel) => {
    if (findCreatedItem()) {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '저장',
          content: '등록하시겠습니까?',
          onConfirm: () =>
            uMutate({
              saveEgroup: [{ ...formData, oprtrSe: 'C' }],
              egroupUserUpdate: [],
            }),
        })
      );
    } else {
      const updatedList = findUpdatedArray(initData, data);

      if (updatedList.length === 0 && egroupUserUpdate.length === 0) {
        toast({
          type: ValidType.INFO,
          content: '변경된 메뉴가 없습니다.',
        });
      } else {
        dispatch(
          openModal({
            type: ModalType.CONFIRM,
            title: '수정',
            content: '수정하시겠습니까?',
            onConfirm: () =>
              uMutate({
                saveEgroup: updatedList.map((item) =>
                  item.groupCode === formData.groupCode ? { ...formData, oprtrSe: 'U' } : { ...item, oprtSe: 'U' }
                ),
                egroupUserUpdate: egroupUserUpdate,
              }),
          })
        );
      }
    }
  };

  const handleClickUserModal = () => {
    if (findCreatedItem()) {
      toast({
        type: ValidType.INFO,
        content: '예외그룹 저장 후 추가해주세요.',
      });
      return;
    } else if (!values.groupCode) {
      toast({
        type: ValidType.INFO,
        content: '예외그룹을 선택해주세요.',
      });
    } else {
      const userIdList = eGroupUserList.map((item: EGroupUserModel) => item.userId);

      dispatch(
        openModal({
          type: ModalType.USER_SELECT,
          isMultiSelected: true,
          userIdList: userIdList,
          onConfirm: (users: Array<UserModel>) => {
            const newUserIdList = users.map((item) => item.userId);
            const updatedList = findUpdatedArray(userIdList, newUserIdList);
            const initList = egroupUserUpdate.filter((item) => item.groupCode !== values.groupCode);

            if (updatedList.length === 0) {
              setEgroupUserUpdate(initList);
            } else {
              setEgroupUserUpdate(
                initList.concat({
                  groupCode: values.groupCode,
                  userIds: newUserIdList,
                })
              );
            }
          },
        })
      );
    }
  };

  useEffect(() => {
    const newItem = watch();
    if (newItem.groupCode) {
      setData((prevState) => {
        const item = prevState.find((item) => item.groupCode === newItem.groupCode);
        if (item) {
          item.groupNm = newItem.groupNm;
          item.userAuthId = newItem.userAuthId;
          item.mgrAuthId = newItem.mgrAuthId;
        }
        return prevState;
      });
    }
  }, [watch('groupNm'), watch('userAuthId'), watch('mgrAuthId')]);

  useEffect(() => {
    if (data.length > 0) {
      const list = data.map((item: any) => ({
        ...item,
        id: item.groupCode || 'new-item',
        name: item.groupNm,
        parentId: item.upGroupCode || '',
      }));

      const hierarchyList: Array<HierarchyInfo> = convertToHierarchyInfo(list);
      sortChildrenRecursive(hierarchyList);
      setTreeData(hierarchyList);
    }
  }, [data]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '예외그룹 조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      if (response?.data) {
        setInitData(JSON.parse(JSON.stringify(response.data.contents)));
        setData([...response.data.contents]);
      }
    }
  }, [response, isError, isSuccess, isFetching, toast]);

  useEffect(() => {
    if (uguIsError || uguResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '예외그룹 사용자 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (uguResponse?.data) {
        setEGroupUserList(uguResponse.data);
      }
    }
  }, [uguResponse, uguIsError, toast]);

  useEffect(() => {
    if (uaIsError || uaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '사용자 권한그룹 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (uaResponse?.data) {
        setUserAuthList(uaResponse.data);
      }
    }
  }, [uaResponse, uaIsError, toast]);

  useEffect(() => {
    if (aaIsError || aaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '관리자 권한그룹 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (aaResponse?.data) {
        setAdminAuthList(aaResponse.data);
      }
    }
  }, [aaResponse, aaIsError, toast]);

  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '수정 중 에러가 발생했습니다.',
      });
    } else if (uIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '수정되었습니다.',
      });
      refetch();
      reset({ ...initItem });
    }
  }, [uResponse, uIsSuccess, uIsError, toast, refetch, reset]);

  return (
    <Stack direction="Vertical">
      <Stack alignItems="Start">
        <TreeSearchForm
          enableIcon={true}
          treeData={treeData}
          initItem={initItem}
          onClick={handleClick}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onMove={handleMove}
        />

        <form id="form" className="height-100 width-50" onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="Vertical" gap="SM" className="height-100 width-100">
            <HorizontalTable>
              <TR>
                <TH colSpan={1} align="right">
                  상위그룹명
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('upGroupNm', {
                        maxLength: { value: 100, message: 'max length exceeded' },
                      })}
                      validation={errors?.upGroupNm?.message ? 'Error' : undefined}
                      disabled
                      autoFocus
                    />
                    <ErrorLabel message={errors?.upGroupNm?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right" required>
                  예외그룹명
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('groupNm', {
                        required: { value: true, message: 'groupNm is required.' },
                        maxLength: { value: 100, message: 'max length exceeded' },
                      })}
                      validation={errors?.groupNm?.message ? 'Error' : undefined}
                    />
                    <ErrorLabel message={errors?.groupNm?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right">
                  예외그룹코드
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('groupCode', {
                        maxLength: { value: 16, message: 'max length exceeded' },
                      })}
                      validation={errors?.groupCode?.message ? 'Error' : undefined}
                      disabled
                    />
                    <ErrorLabel message={errors?.groupCode?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH required colSpan={1} align="right">
                  사용자권한그룹
                </TH>
                <TD colSpan={2}>
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <Controller
                      name="userAuthId"
                      control={control}
                      rules={{
                        required: 'userAuthId is required.',
                      }}
                      render={({ field }) => (
                        <Select
                          appearance="Outline"
                          placeholder="전체"
                          className="width-100"
                          ref={field.ref}
                          onChange={(e, value) => value && field.onChange(value)}
                          status={errors?.userAuthId?.message ? 'error' : undefined}
                          value={field.value}
                        >
                          {userAuthList?.map((item) => (
                            <SelectOption value={item.authId}>{item.authNm}</SelectOption>
                          ))}
                        </Select>
                      )}
                    />
                    <ErrorLabel message={errors?.userAuthId?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH required colSpan={1} align="right">
                  관리자권한그룹
                </TH>
                <TD colSpan={2}>
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <Controller
                      name="mgrAuthId"
                      control={control}
                      rules={{
                        required: 'mgrAuthId is required.',
                      }}
                      render={({ field }) => (
                        <Select
                          appearance="Outline"
                          placeholder="전체"
                          className="width-100"
                          ref={field.ref}
                          onChange={(e, value) => value && field.onChange(value)}
                          status={errors?.mgrAuthId?.message ? 'error' : undefined}
                          value={field.value}
                        >
                          {adminAuthList?.map((item) => (
                            <SelectOption value={item.authId}>{item.authNm}</SelectOption>
                          ))}
                        </Select>
                      )}
                    />
                    <ErrorLabel message={errors?.mgrAuthId?.message} />
                  </Stack>
                </TD>
              </TR>
            </HorizontalTable>
          </Stack>
          <Stack gap="SM" justifyContent="End">
            <Button
              priority="Primary"
              appearance="Contained"
              size="LG"
              className="width-100"
              onClick={handleClickUserModal}
            >
              {`멤버 관리 (사용자 추가/삭제)`}
            </Button>
          </Stack>
        </form>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" type="submit" form="form">
          저장
        </Button>
      </Stack>
    </Stack>
  );
};
export default List;
