import ErrorLabel from '@/components/error/ErrorLabel';
import TreeSearchForm from '@/components/form/TreeSearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useUpdateDept } from '@/hooks/mutations/useDeptMutations';
import { useAdminAuthAllList, useUserAuthAllList } from '@/hooks/queries/useAuthQueries';
import { useDeptAllList } from '@/hooks/queries/useDeptQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ModalType, ValidType } from '@/models/common/Constants';
import { AuthModel } from '@/models/model/AuthModel';
import { DeptModel, UpdatedDeptModel } from '@/models/model/DeptModel';
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
import { useTranslation } from 'react-i18next';

const initItem: UpdatedDeptModel = {
  deptCode: '',
  deptNm: '',
  upDeptCode: '',
  upDeptNm: '',
  companyCode: '',
  userAuthId: '',
  userAuthNm: '',
  mgrAuthId: '',
  mgrAuthNm: '',
  useYn: 'Y',
  ordSeq: 0,
};

const List = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [userAuthList, setUserAuthList] = useState<Array<AuthModel>>([]);
  const [adminAuthList, setAdminAuthList] = useState<Array<AuthModel>>([]);
  const [initData, setInitData] = useState<Array<DeptModel>>([]);
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
  } = useForm<UpdatedDeptModel>({
    mode: 'onChange',
    defaultValues: { ...initItem },
  });
  const values = getValues();
  const { data: response, isSuccess, isError, isFetching, refetch } = useDeptAllList();
  const { data: uaResponse, isError: uaIsError, refetch: uaRefetch } = useUserAuthAllList();
  const { data: aaResponse, isError: aaIsError, refetch: aaUreftch } = useAdminAuthAllList();
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMutate } = useUpdateDept();

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
          content: t('management:toast.info.saveMenu'),
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
        content: t('management:toast.info.saveMenu'),
      });
      return;
    }

    let { dragIds, parentId, index } = args;
    if (parentId === '__REACT_ARBORIST_INTERNAL_ROOT__') {
      parentId = null;
    }

    setData((prevState) => {
      const toChildren = prevState.filter((item) => item.upDeptCode === parentId).sort((a, b) => a.ordSeq - b.ordSeq);
      dragIds.forEach((id, i) => {
        const movedItem = prevState.find((item) => item.deptCode === id);
        const toIndex = index + i;

        if (movedItem) {
          if (parentId === movedItem.upDeptCode) {
            const toIndex = toChildren.findIndex((item) => item.deptCode === movedItem.deptCode);
            toChildren.splice(toIndex, 1);
          }

          const fromChildren = prevState
            .filter((item) => item.upDeptCode === movedItem.upDeptCode || !item.upDeptCode)
            .sort((a, b) => a.ordSeq - b.ordSeq);
          const fromIndex = fromChildren.findIndex((item) => item.deptCode === movedItem.deptCode);
          fromChildren.splice(fromIndex, 1);
          fromChildren.forEach((item, index) => (item.ordSeq = index));

          toChildren.splice(toIndex, 0, movedItem);
          toChildren.forEach((item, index) => (item.ordSeq = index));

          movedItem.upDeptCode = parentId;
        }
      });

      return [...prevState];
    });
  };

  const handleCreate = () => {
    if (findCreatedItem()) {
      toast({
        type: ValidType.INFO,
        content: t('management:toast.info.saveMenu'),
      });
      return;
    }

    const ordSeq = treeData[treeData.length - 1].ordSeq;
    const newItem: any = {
      ...initItem,
      oprtrSe: 'C',
      upDeptCode: null,
      upDeptNm: '',
      ordSeq: ordSeq ? ordSeq + 1 : treeData.length,
      isSelected: true,
    };

    if (values.deptCode) {
      newItem.upDeptCode = values.deptCode;
      newItem.upDeptNm = values.deptNm;
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
        content: t('management:toast.info.selectMenu'),
      });
    } else {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: t('common.modal.title.delete'),
          content: t('common.modal.message.deleteConfirm'),
          onConfirm: () => {
            const hasIdList = checkedList.filter((item) => item.deptCode);

            if (checkedList.length !== hasIdList.length) {
              setData((prevDate) => prevDate.filter((item) => item.deptCode));
            }

            if (hasIdList.length > 0) {
              uMutate(hasIdList.map((item) => ({ deptCode: item.deptCode, oprtrSe: 'D' })));
            }
          },
        })
      );
    }
  };

  const onSubmit = (formData: UpdatedDeptModel) => {
    if (findCreatedItem()) {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: t('common.modal.title.create'),
          content: t('common.modal.message.createConfirm'),
          onConfirm: () => uMutate([{ ...formData, oprtrSe: 'C' }]),
        })
      );
    } else {
      const updatedList = findUpdatedArray(initData, data);

      if (updatedList.length === 0) {
        toast({
          type: ValidType.INFO,
          content: t('management:toast.info.notChangedMenu'),
        });
      } else {
        dispatch(
          openModal({
            type: ModalType.CONFIRM,
            title: t('common.modal.title.update'),
            content: t('common.modal.message.updateConfirm'),
            onConfirm: () => uMutate(updatedList.map((item) => ({ ...item, oprtrSe: 'U' }))),
          })
        );
      }
    }
  };

  useEffect(() => {
    const newItem = watch();
    if (newItem.deptCode) {
      setData((prevState) => {
        const item = prevState.find((item) => item.deptCode === newItem.deptCode);
        if (item) {
          item.deptNm = newItem.deptNm;
          item.userAuthId = newItem.userAuthId;
          item.mgrAuthId = newItem.mgrAuthId;
        }
        return prevState;
      });
    }
  }, [watch('deptNm'), watch('userAuthId'), watch('mgrAuthId')]);

  useEffect(() => {
    if (data.length > 0) {
      const list = data.map((item: any) => ({
        ...item,
        id: item.deptCode || 'new-item',
        name: item.deptNm,
        parentId: item.upDeptCode || '',
      }));

      const hierarchyList: Array<HierarchyInfo> = convertToHierarchyInfo(list);
      sortChildrenRecursive(hierarchyList);
      setTreeData(hierarchyList);
    }
  }, [data, initData]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.menuList'),
      });
    } else {
      if (response?.data) {
        setInitData(JSON.parse(JSON.stringify(response.data.contents)));
        setData([...response.data.contents]);
      }
    }
  }, [response, isError, isSuccess, isFetching, toast]);

  useEffect(() => {
    if (uaIsError || uaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.userAuthList'),
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
        content: t('management:toast.error.mgmtAuthList'),
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
        content: t('common.toast.error.update'),
      });
    } else if (uIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.update'),
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

        <form id="form" onSubmit={handleSubmit(onSubmit)} className="height-100 width-50">
          <Stack direction="Vertical" gap="SM" className="height-100 width-100">
            <HorizontalTable>
              <TR>
                <TH colSpan={1} align="right">
                  {t('management:label.upDeptNm')}
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('upDeptNm', {
                        maxLength: { value: 100, message: t('common.validate.maxLength') },
                      })}
                      validation={errors?.upDeptNm?.message ? 'Error' : undefined}
                      disabled
                      autoFocus
                    />
                    <ErrorLabel message={errors?.upDeptNm?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right" required>
                  {t('management:label.deptNm')}
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('deptNm', {
                        required: { value: true, message: t('common.validate.required') },
                        maxLength: { value: 100, message: t('common.validate.maxLength') },
                        validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                      })}
                      validation={errors?.deptNm?.message ? 'Error' : undefined}
                    />
                    <ErrorLabel message={errors?.deptNm?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right" required>
                  {t('management:label.deptCode')}
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('deptCode', {
                        required: { value: true, message: t('common.validate.required') },
                        maxLength: { value: 16, message: t('common.validate.maxLength') },
                        validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                      })}
                      validation={errors?.deptCode?.message ? 'Error' : undefined}
                    />
                    <ErrorLabel message={errors?.deptCode?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right">
                  {t('management:label.userAuthId')}
                </TH>
                <TD colSpan={2}>
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <Controller
                      name="userAuthId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          appearance="Outline"
                          placeholder={t('common.placeholder.all')}
                          className="width-100"
                          ref={field.ref}
                          status={errors?.userAuthId?.message ? 'error' : undefined}
                          onChange={(e, value) => value && field.onChange(value === 'nonAuth' ? null : value)}
                          value={field.value || 'nonAuth'}
                        >
                          <SelectOption value="nonAuth">{t('common.label.nonAuth')}</SelectOption>
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
                <TH colSpan={1} align="right">
                  {t('management:label.mgrAuthId')}
                </TH>
                <TD colSpan={2}>
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <Controller
                      name="mgrAuthId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          appearance="Outline"
                          placeholder={t('common.placeholder.all')}
                          className="width-100"
                          ref={field.ref}
                          status={errors?.mgrAuthId?.message ? 'error' : undefined}
                          onChange={(e, value) => value && field.onChange(value === 'nonAuth' ? null : value)}
                          value={field.value || 'nonAuth'}
                        >
                          <SelectOption value="nonAuth">{t('common.label.nonAuth')}</SelectOption>
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
        </form>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" type="submit" form="form">
          {t('common.button.reg')}
        </Button>
      </Stack>
    </Stack>
  );
};
export default List;
