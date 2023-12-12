import ErrorLabel from '@/components/error/ErrorLabel';
import TreeSearchForm from '@/components/form/TreeSearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useUpdateAdminMenu } from '@/hooks/mutations/useMenuMutations';
import { useAdminMenuList } from '@/hooks/queries/useMenuQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ModalType, ValidType } from '@/models/common/Constants';
import { UpdatedMenuModel } from '@/models/model/MenuModel';
import { openModal } from '@/reducers/modalSlice';
import {
  convertToHierarchyInfo,
  findUpdatedArray,
  getNodeCheckedListRecursive,
  sortChildrenRecursive,
} from '@/utils/ArrayUtil';
import { Button, Radio, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { MoveHandler } from 'react-arborist';
import { useForm } from 'react-hook-form';

const initItem: UpdatedMenuModel = {
  menuId: '',
  upMenuId: '',
  upMenuNm: '',
  menuNm: '',
  menuUrl: '',
  menuDsc: '',
  useYn: 'Y',
  oprtrSe: 'U',
  ordSeq: 0,
};

const List = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [initData, setInitData] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [treeData, setTreeData] = useState<Array<HierarchyInfo>>([]);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdatedMenuModel>({
    mode: 'onChange',
    defaultValues: { ...initItem },
  });
  const values = getValues();
  const { data: response, isSuccess, isFetching, isError, refetch } = useAdminMenuList('menu-mgmt');
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMutate } = useUpdateAdminMenu();

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
      const toChildren = prevState.filter((item) => item.upMenuId === parentId).sort((a, b) => a.ordSeq - b.ordSeq);
      dragIds.forEach((id, i) => {
        const movedItem = prevState.find((item) => item.menuId === id);
        const toIndex = index + i;

        if (movedItem) {
          if (parentId === movedItem.upMenuId) {
            const toIndex = toChildren.findIndex((item) => item.menuId === movedItem.menuId);
            toChildren.splice(toIndex, 1);
          }

          const fromChildren = prevState
            .filter((item) => item.upMenuId === movedItem.upMenuId || !item.upMenuId)
            .sort((a, b) => a.ordSeq - b.ordSeq);
          const fromIndex = fromChildren.findIndex((item) => item.menuId === movedItem.menuId);
          fromChildren.splice(fromIndex, 1);
          fromChildren.forEach((item, index) => (item.ordSeq = index));

          toChildren.splice(toIndex, 0, movedItem);
          toChildren.forEach((item, index) => (item.ordSeq = index));

          movedItem.upMenuId = parentId;
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
      upMenuId: '',
      upMenuNm: '',
      ordSeq: ordSeq ? ordSeq + 1 : treeData.length,
      isSelected: true,
    };

    if (values.menuId) {
      newItem.upMenuId = values.menuId;
      newItem.upMenuNm = values.menuNm;
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
            const hasIdList = checkedList.filter((item) => item.menuId);

            if (checkedList.length !== hasIdList.length) {
              setData((prevDate) => prevDate.filter((item) => item.menuId));
            }

            if (hasIdList.length > 0) {
              uMutate(hasIdList.map((item) => ({ menuId: item.menuId, oprtrSe: 'D' })));
            }
          },
        })
      );
    }
  };

  const onSubmit = (formData: UpdatedMenuModel) => {
    if (findCreatedItem()) {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '저장',
          content: '등록하시겠습니까?',
          onConfirm: () => uMutate([{ ...formData, oprtrSe: 'C' }]),
        })
      );
    } else {
      const updatedList = findUpdatedArray(initData, data);

      if (updatedList.length === 0) {
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
            onConfirm: () => uMutate(updatedList.map((item) => ({ ...item, oprtrSe: 'U' }))),
          })
        );
      }
    }
  };

  useEffect(() => {
    const newItem = watch();
    if (newItem.menuId) {
      setData((prevState) => {
        const item = prevState.find((item) => item.menuId === newItem.menuId);
        if (item) {
          item.menuNm = newItem.menuNm;
          item.menuUrl = newItem.menuUrl;
          item.menuDsc = newItem.menuDsc;
          item.useYn = newItem.useYn;
        }
        return prevState;
      });
    }
  }, [watch('menuNm'), watch('menuUrl'), watch('menuDsc'), watch('useYn')]);

  useEffect(() => {
    if (data.length > 0) {
      const list = data.map((item: any) => ({
        ...item,
        id: item.menuId || 'new-item',
        parentId: item.upMenuId || '',
        name: item.menuNm,
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
        content: '메뉴 조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      if (response?.data) {
        setInitData(JSON.parse(JSON.stringify(response.data.contents)));
        setData([...response.data.contents]);
      }
    }
  }, [response, isError, isSuccess, isFetching, toast]);

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
                  상위메뉴명
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('upMenuNm', {
                        maxLength: { value: 16, message: 'max length exceeded' },
                      })}
                      validation={errors?.upMenuNm?.message ? 'Error' : undefined}
                      disabled
                      autoFocus
                    />
                    <ErrorLabel message={errors?.upMenuNm?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right" required>
                  메뉴명
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('menuNm', {
                        required: { value: true, message: 'menuNm is required.' },
                        maxLength: { value: 100, message: 'max length exceeded' },
                      })}
                      validation={errors?.menuNm?.message ? 'Error' : undefined}
                    />
                    <ErrorLabel message={errors?.menuNm?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right" required>
                  메뉴 URL
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('menuUrl', {
                        required: { value: true, message: 'menuUrl is required.' },
                        maxLength: { value: 256, message: 'max length exceeded' },
                      })}
                      validation={errors?.menuUrl?.message ? 'Error' : undefined}
                    />
                    <ErrorLabel message={errors?.menuUrl?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right">
                  메뉴 설명
                </TH>
                <TD colSpan={2} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <TextField
                      className="width-100"
                      {...register('menuDsc', {
                        maxLength: { value: 1000, message: 'max length exceeded' },
                      })}
                      validation={errors?.menuDsc?.message ? 'Error' : undefined}
                    />
                    <ErrorLabel message={errors?.menuDsc?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right">
                  사용여부
                </TH>
                <TD colSpan={2} align="left">
                  <Radio label="사용" defaultChecked={values?.useYn === 'Y'} value="Y" {...register('useYn')} />
                  <Radio label="미사용" defaultChecked={values?.useYn === 'N'} value="N" {...register('useYn')} />
                </TD>
              </TR>
            </HorizontalTable>
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
