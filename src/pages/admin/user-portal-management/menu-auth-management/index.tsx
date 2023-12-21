import TableSearchForm from '@/components/form/TableSearchForm';
import TreeSearchForm from '@/components/form/TreeSearchForm';
import { useCreateUserAuthMenu, useUpdateUserMenu } from '@/hooks/mutations/useMenuMutations';
import { useUserAuthAllList } from '@/hooks/queries/useAuthQueries';
import { useUserAuthMenuList, useUserMenuList } from '@/hooks/queries/useMenuQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ModalType, ValidType } from '@/models/common/Constants';
import { AuthModel } from '@/models/model/AuthModel';
import { UpdatedMenuModel } from '@/models/model/MenuModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { openModal } from '@/reducers/modalSlice';
import { convertToHierarchyInfo, getNodeCheckedListRecursive, sortChildrenRecursive } from '@/utils/ArrayUtil';
import { getTotalPage } from '@/utils/PagingUtil';
import { Button, Stack, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [authId, setAuthId] = useState<string>('');
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<AuthModel>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [treeData, setTreeData] = useState<Array<HierarchyInfo>>([]);
  const { data: response, isError, refetch } = useUserMenuList('menu-auth-mgmt');
  const { data: uaResponse, isError: uaIsError, refetch: uaRefetch } = useUserAuthAllList({ suspense: false });
  const { data: uamResponse, isError: uamIsError, refetch: uamRefetch } = useUserAuthMenuList(authId);
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMutate } = useUpdateUserMenu();
  const {
    data: cuaResponse,
    isSuccess: cuaIsSuccess,
    isError: cuaIsError,
    mutate: cuaMutate,
  } = useCreateUserAuthMenu();

  const columns = [
    { headerName: t('management:label.authId'), field: 'authId', colSpan: 5 },
    { headerName: t('management:label.authNm'), field: 'authNm', colSpan: 5 },
  ];

  const handleClickRow = (row: any, index: number, selected: boolean) => {
    setData((prevData) =>
      prevData.map((item) => {
        item.isChecked = false;
        return item;
      })
    );

    if (selected) {
      setAuthId(row.authId);
    } else {
      setAuthId('');
    }
  };

  const handleSave = () => {
    if (!authId) {
      toast({
        type: ValidType.INFO,
        content: t('management:toast.info.selectAuthGroup'),
      });
      return;
    }

    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.create'),
        content: t('common.modal.message.createConfirm'),
        onConfirm: () => {
          const menuIds = getNodeCheckedListRecursive(treeData).map((item) => item.menuId);
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
  }, [data]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.menuList'),
      });
    } else {
      if (response?.data) {
        setData(
          response.data.contents.map((item: any) => {
            item.isChecked = false;
            return item;
          })
        );
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (uamIsError || uamResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.authMenuList'),
      });
    } else {
      if (uamResponse?.data) {
        const authMenuData = uamResponse.data;
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
        content: t('management:toast.error.authlist'),
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
        content: t('common.toast.error.update'),
      });
    } else if (uIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.update'),
      });
      refetch();
    }
  }, [uResponse, uIsSuccess, uIsError, toast, refetch]);

  useEffect(() => {
    if (cuaIsError || cuaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.create'),
      });
    } else if (cuaIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.create'),
      });
      uamRefetch();
    }
  }, [cuaResponse, cuaIsSuccess, cuaIsError, toast, uamRefetch]);

  return (
    <Stack>
      <Stack direction="Vertical" className="width-100">
        <Stack gap="SM" alignItems="Start">
          <TableSearchForm
            title={t('management:header.authGroupList')}
            columns={columns}
            rows={rows}
            onClick={handleClickRow}
          />

          <TreeSearchForm treeData={treeData} initItem={initItem} />
        </Stack>

        <Stack gap="SM" justifyContent="End">
          <Button priority="Primary" appearance="Contained" size="LG" onClick={handleSave}>
            {t('common.button.reg')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default List;
