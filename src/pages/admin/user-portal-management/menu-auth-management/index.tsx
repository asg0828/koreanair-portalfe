import TableSearchForm from '@/components/form/TableSearchForm';
import TreeSearchForm from '@/components/form/TreeSearchForm';
import { useCreateUserAuthMenu, useUpdateUserMenu } from '@/hooks/mutations/useMenuMutations';
import { useUserAuthAllList } from '@/hooks/queries/useAuthQueries';
import { useUserAuthMenuList, useUserMenuList } from '@/hooks/queries/useMenuQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ModalType, ValidType } from '@/models/common/Constants';
import { AuthModel } from '@/models/model/AuthModel';
import { AuthMenuModel, MenuModel } from '@/models/model/MenuModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { openModal } from '@/reducers/modalSlice';
import { convertToHierarchyInfo } from '@/utils/ArrayUtil';
import { getTotalPage } from '@/utils/PagingUtil';
import { Button, Stack, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { MoveHandler } from 'react-arborist';

const columns = [
  { headerName: '권한그룹ID', field: 'authId', colSpan: 5 },
  { headerName: '권한그룹명', field: 'authNm', colSpan: 5 },
];

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
  const [authId, setAuthId] = useState<string>('');
  const [authMenuData, setAuthMenuData] = useState<AuthMenuModel>();
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<AuthModel>>([]);
  const [selectedItem, setSelectedItem] = useState<HierarchyInfo>();
  const [initData, setInitData] = useState<Array<MenuModel>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [treeData, setTreeData] = useState<Array<HierarchyInfo>>([]);
  const { data: response, isError, refetch } = useUserMenuList();
  const { data: uaResponse, isError: uaIsError, refetch: uaRefetch } = useUserAuthAllList();
  const { data: uamResponse, isError: uamIsError, refetch: uamRefetch } = useUserAuthMenuList(authId);
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMutate } = useUpdateUserMenu();
  const {
    data: cuaResponse,
    isSuccess: cuaIsSuccess,
    isError: cuaIsError,
    mutate: cuaMutate,
  } = useCreateUserAuthMenu();

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
    } else {
      setSelectedItem(undefined);
    }

    setTreeData([...treeData]);
  };

  const handleMove: MoveHandler<any> = (args) => {
    if (!checkValid()) {
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

  const sortChildrenRecursive = useCallback((children: Array<HierarchyInfo>) => {
    children.sort((a: HierarchyInfo, b: HierarchyInfo) => a.ordSeq - b.ordSeq);
    children.forEach((item: HierarchyInfo) => {
      sortChildrenRecursive(item.children);
    });
  }, []);

  const handleClickRow = (row: any, index: number, selected: boolean) => {
    if (selected) {
      setAuthId(row.authId);
    } else {
      setAuthId('');
    }
  };

  const handleSave = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '저장',
        content: '저장하시겠습니까?',
        onConfirm: () => {
          const menuIds = checkChildrenRecursive(treeData).map((item) => item.menuId);
          cuaMutate({
            authId: authId,
            menuIds: menuIds,
          });
        },
      })
    );
  };

  useEffect(() => {
    authId && uamRefetch();
  }, [authId, uamRefetch]);

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
    if (uamIsError || uamResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '권한 메뉴 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (uamResponse?.data) {
        const authMenuData = uamResponse.data;
        setAuthMenuData(authMenuData);
        setData((prevData) => {
          prevData.forEach((item) => {
            if (authMenuData.menuIds.includes(item.menuId)) {
              item.isChecked = true;
            } else {
              item.isChecked = false;
            }
          });

          return [...prevData];
        });
      }
    }
  }, [uamResponse, uamIsError, toast]);

  useEffect(() => {
    if (uaIsError || uaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (uaResponse?.data) {
        setRows(uaResponse.data);
        setPage((prevState) => ({
          ...prevState,
          totalCount: uaResponse.data.length,
          totalPage: getTotalPage(uaResponse.data.length, page.pageSize),
        }));
      }
    }
  }, [uaResponse, uaIsError, page.pageSize, toast]);

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
      setSelectedItem(undefined);
    }
  }, [uResponse, uIsSuccess, uIsError, toast, refetch, setSelectedItem]);

  useEffect(() => {
    if (cuaIsError || cuaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '저장 중 에러가 발생했습니다.',
      });
    } else if (cuaIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '저장되었습니다.',
      });
      uamRefetch();
    }
  }, [cuaResponse, cuaIsSuccess, cuaIsError, toast, uamRefetch]);

  return (
    <Stack>
      <Stack direction="Vertical" className="width-100">
        <Stack gap="SM" alignItems="Start">
          <TableSearchForm title="권한그룹 목록" columns={columns} rows={rows} onClick={handleClickRow} />

          <TreeSearchForm
            treeData={treeData}
            initItem={initItem}
            onClick={handleClick}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onMove={handleMove}
          />
        </Stack>

        <Stack gap="SM" justifyContent="End">
          <Button priority="Primary" appearance="Contained" size="LG" onClick={handleSave}>
            저장
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default List;
