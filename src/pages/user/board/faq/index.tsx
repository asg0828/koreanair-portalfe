import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import AccordionGrid from '@/components/grid/AccordionGrid';
import { useDeleteFaq } from '@/hooks/mutations/useFaqMutations';
import { useFaqById, useFaqList } from '@/hooks/queries/useFaqQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, GroupCodeType, ModalType, ValidType, View } from '@/models/common/Constants';
import { FaqModel, FaqParams } from '@/models/model/FaqModel';
import { FileModel } from '@/models/model/FileModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectContextPath } from '@/reducers/authSlice';
import { getCode } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const initFaqParams: FaqParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const location = useLocation();
  const beforeParams: FaqParams = location?.state?.params;
  const [params, setParams] = useState(beforeParams || initFaqParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<FaqModel>>([]);
  const [faqId, setFaqId] = useState<string>('');
  const [dFaqId, setDFaqId] = useState<string>('');
  const { data: response, isSuccess, isError, refetch } = useFaqList(params, page);
  const { data: gResponse, isSuccess: gIsSuccess, isError: gIsError, refetch: gRefetch } = useFaqById(faqId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteFaq(faqId);

  const searchInfoList = [
    { key: 'sj', value: t('board:label.sj') },
    { key: 'cn', value: t('board:label.cn') },
  ];

  const goToReg = () => {
    navigate(View.REG, {
      state: {
        params: params,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initFaqParams);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangeParams = (name: string, value: any) => {
    setParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteFaqId = (nFaqId: string) => {
    setDFaqId(nFaqId);
  };

  const goToEdit = (nFaqId: string) => {
    navigate('./edit', {
      state: {
        faqId: nFaqId,
        params: params,
      },
    });
  };

  const handleDelete = (nFaqId: string) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.delete'),
        content: t('common.modal.message.deleteConfirm'),
        onConfirm: () => handleDeleteFaqId(nFaqId),
      })
    );
  };

  const handlePage = (nPage: PageModel) => {
    setPage(nPage);
  };

  const handleClick = (nFaqId: string) => {
    setFaqId(nFaqId);
  };

  useDidMountEffect(() => {
    handleSearch();
  }, [page.page, page.pageSize, handleSearch]);

  useEffect(() => {
    faqId && gRefetch();
  }, [faqId, gRefetch]);

  useEffect(() => {
    dFaqId && mutate();
  }, [dFaqId, mutate]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.list'),
      });
    } else if (isSuccess) {
      if (response?.data) {
        response.data.contents.forEach(
          (item: FaqModel) => (item.codeNm = getCode(GroupCodeType.FAQ_TYPE, item.clCode)?.codeNm || '')
        );
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isSuccess, isError, toast]);

  useEffect(() => {
    if (gIsError || gResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.read'),
      });
    } else if (gIsSuccess && gResponse.data) {
      gResponse.data.fileList.forEach((item: FileModel) => (item.fileSizeNm = getFileSize(item.fileSize)));
      const data = gResponse.data;
      const newRows = [...rows];
      const index = newRows.findIndex((item) => item.faqId === data.faqId);
      data.codeNm = getCode(GroupCodeType.FAQ_TYPE, data.clCode)?.codeNm || '';
      newRows.splice(index, 1, data);
      setRows(newRows);
    }
  }, [gResponse, gIsSuccess, gIsError, toast]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.delete'),
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.delete'),
      });
      handleSearch();
    }
  }, [dResponse, dIsSuccess, dIsError, toast, navigate, handleSearch]);

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={handleClear}>
        <TR>
          <TH colSpan={1} align="right">
            {t('common.button.search')}
          </TH>
          <TD colSpan={5} align="left">
            <Stack gap="SM" className="width-100">
              <Select
                appearance="Outline"
                placeholder={t('common.placeholder.all')}
                className="select-basic"
                onChange={(e, value) => value && handleChangeParams('searchConditions', value || 'all')}
                value={params.searchConditions}
              >
                {searchInfoList.map((searchInfo) => (
                  <SelectOption value={searchInfo.key}>{searchInfo.value}</SelectOption>
                ))}
              </Select>
              <TextField
                className="width-100"
                onKeyDown={handleKeyDown}
                onChange={(e) => handleChangeParams('searchTable', e.target.value)}
                value={params.searchTable}
              />
            </Stack>
          </TD>
        </TR>
      </SearchForm>

      <AccordionGrid
        defaultValue={location?.state?.faqId}
        rows={rows}
        page={page}
        onClick={handleClick}
        onChange={handlePage}
        onUpdate={goToEdit}
        onDelete={handleDelete}
        buttonChildren={
          contextPath === ContextPath.ADMIN && (
            <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
              <AddIcon />
              {t('common.button.reg')}
            </Button>
          )
        }
      />
    </>
  );
};
export default List;
