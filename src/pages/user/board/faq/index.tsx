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
import { useLocation, useNavigate } from 'react-router-dom';

const searchInfoList = [
  { key: 'qstn', value: '제목' },
  { key: 'answ', value: '내용' },
];

export const initFaqParams: FaqParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
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

  const handleDeleteFaqId = (faqId: string) => {
    setDFaqId(faqId);
  };

  const goToEdit = (faqId: string) => {
    navigate('./edit', {
      state: {
        faqId: faqId,
        params: params,
      },
    });
  };

  const handleDelete = (faqId: string) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '삭제',
        content: '삭제하시겠습니까?',
        onConfirm: () => handleDeleteFaqId(faqId),
      })
    );
  };

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  const handleClick = (faqId: string) => {
    setFaqId(faqId);
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
        content: '조회 중 에러가 발생했습니다.',
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
        content: '조회 중 에러가 발생했습니다.',
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
        content: '삭제 중 에러가 발생했습니다.',
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '삭제되었습니다.',
      });
      handleSearch();
    }
  }, [dResponse, dIsSuccess, dIsError, toast, navigate, handleSearch]);

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={handleClear}>
        <TR>
          <TH colSpan={1} align="right">
            검색
          </TH>
          <TD colSpan={5} align="left">
            <Stack gap="SM" className="width-100">
              <Select
                appearance="Outline"
                placeholder="전체"
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
              등록
            </Button>
          )
        }
      />
    </>
  );
};
export default List;
