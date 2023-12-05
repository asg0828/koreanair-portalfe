import ErrorLabel from '@/components/error/ErrorLabel';
import TreeSearchForm from '@/components/form/TreeSearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useUpdateAdminMenu } from '@/hooks/mutations/useMenuMutations';
import { useAdminMenuList } from '@/hooks/queries/useMenuQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ModalType, ValidType } from '@/models/common/Constants';
import { MenuModel, UpdatedMenuModel } from '@/models/model/MenuModel';
import { openModal } from '@/reducers/modalSlice';
import { convertToHierarchyInfo } from '@/utils/ArrayUtil';
import { Button, Radio, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { MoveHandler } from 'react-arborist';
import { useForm } from 'react-hook-form';

const initItem = {
  upMenuId: '',
  menuNm: '',
  menuUrl: '',
  menuDsc: '',
  useYn: 'Y',
  ordSeq: 0,
};

const List = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [initData, setInitData] = useState<Array<MenuModel>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [treeData, setTreeData] = useState<Array<HierarchyInfo>>([]);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdatedMenuModel>({
    mode: 'onChange',
    defaultValues: { ...initItem },
  });
  const values = getValues();
  const { data: response, isError, refetch } = useAdminMenuList();
  const [selectedItem, setSelectedItem] = useState<HierarchyInfo>();
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMutate } = useUpdateAdminMenu();

  const checkValid = () => {
    if (data.find((item) => item.menuId === 'new-item')) {
      toast({
        type: ValidType.INFO,
        content: '저장되지 않은 메뉴가 있습니다.',
      });
      return false;
    }

    return true;
  };

  const handleClick = (item: any, parentItem: any) => {
    if (item.isSelected) {
      setSelectedItem(item);
      handleSelect({
        upMenuId: parentItem?.menuId,
        upMenuNm: parentItem?.menuNm,
        menuId: item.menuId,
        menuNm: item.menuNm,
        menuUrl: item.menuUrl,
        menuDsc: item.menuDsc,
        ordSeq: item.ordSeq,
        useYn: item.useYn,
      });
    } else {
      setSelectedItem(undefined);
      reset();
    }
  };

  const handleMove: MoveHandler<any> = (args) => {
    if (!checkValid()) {
      return;
    }

    const { dragIds, parentId, index } = args;

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
            .filter((item) => item.upMenuId === movedItem.upMenuId)
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
    if (!checkValid()) {
      return;
    }

    const upMenuId = selectedItem?.menuId;
    const upNemnNm = selectedItem?.menuNm;
    const ordSeq = selectedItem ? selectedItem.children.length : data.length;

    const newItem: any = {
      ...initItem,
      menuId: 'new-item',
      oprtrSe: 'C',
      isSelected: true,
      upMenuId: upMenuId,
      upMenuNm: upNemnNm,
      ordSeq: ordSeq,
    };

    setData((prevData) => prevData.concat(newItem));
    setSelectedItem(newItem);
    handleSelect(newItem);
  };

  const handleSelect = (item: UpdatedMenuModel) => {
    setValue('upMenuId', item.upMenuId);
    setValue('upMenuNm', item.upMenuNm);
    setValue('menuId', item.menuId);
    setValue('menuNm', item.menuNm);
    setValue('menuUrl', item.menuUrl);
    setValue('menuDsc', item.menuDsc);
    setValue('ordSeq', item.ordSeq);
    setValue('useYn', item.useYn);
  };

  const checkChildrenRecursive = (children: Array<any>, checkedList: Array<any> = []) => {
    children.forEach((item: any) => {
      if (item.isChecked) {
        checkedList.push(item);
      }
      if (item.children) {
        checkChildrenRecursive(item.children, checkedList);
      }
    });

    return checkedList;
  };

  const handleDelete = () => {
    const deleteList = checkChildrenRecursive(treeData);

    if (deleteList.length === 0) {
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
            setData((prevDate) => [...prevDate.filter((item) => item.menuId !== 'new-item')]);
            uMutate(
              deleteList
                .filter((item) => item.menuId !== 'new-item')
                .map((item) => ({ menuId: item.menuId, oprtrSe: 'D' }))
            );
          },
        })
      );
    }
  };

  const onSubmit = (formData: UpdatedMenuModel) => {
    if (formData.menuId === 'new-item') {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '저장',
          content: '등록하시겠습니까?',
          onConfirm: () => uMutate([{ ...formData, oprtrSe: 'C' }]),
        })
      );
    } else {
      if (!checkValid()) {
        return;
      }

      const newData = data.map((item) =>
        item.menuId === formData.menuId ? { ...formData, oprtrSe: 'U' } : { ...item, oprtrSe: 'U' }
      );

      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '수정',
          content: '수정하시겠습니까?',
          onConfirm: () => uMutate(newData),
        })
      );
    }
  };

  const sortChildrenRecursive = useCallback((children: Array<HierarchyInfo>) => {
    children.sort((a: HierarchyInfo, b: HierarchyInfo) => a.ordSeq - b.ordSeq);
    children.forEach((item: HierarchyInfo) => {
      sortChildrenRecursive(item.children);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const list = data.map((item: any) => ({
        ...item,
        id: item.menuId,
        name: item.menuNm,
        parentId: item.upMenuId || '',
      }));

      const hierarchyList: Array<HierarchyInfo> = convertToHierarchyInfo(list);
      sortChildrenRecursive(hierarchyList);
      setTreeData(hierarchyList);
      setIsEdit(JSON.stringify(data) !== JSON.stringify(initData));
    }
  }, [data, initData, sortChildrenRecursive]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '메뉴 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        setInitData(JSON.parse(JSON.stringify(response.data.contents)));
        setData(response.data.contents);
      }
    }
  }, [response, isError, toast]);

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
      reset();
      setSelectedItem(undefined);
    }
  }, [uResponse, uIsSuccess, uIsError, toast, refetch, reset, setSelectedItem]);

  return (
    <Stack alignItems="Start">
      <TreeSearchForm
        treeData={treeData}
        initItem={initItem}
        onClick={handleClick}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onMove={handleMove}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="height-100 width-50">
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

          <Stack gap="SM" justifyContent="End">
            <Button priority="Primary" appearance="Contained" size="LG" type="submit" disabled={!isEdit}>
              저장
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
export default List;
