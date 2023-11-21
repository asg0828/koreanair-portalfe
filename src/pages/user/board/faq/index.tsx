import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import AccordionGrid from '@/components/grid/AccordionGrid';
import { useDeleteFaq } from '@/hooks/mutations/useFaqMutations';
import { useFaqList } from '@/hooks/queries/useFaqQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppDispatch } from '@/hooks/useRedux';
import { GroupCodeType, ModalType, ValidType, View } from '@/models/common/Constants';
import { FaqModel, FaqParams } from '@/models/model/FaqModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { getCode } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const searchInfoList = [
  { key: 'qstn', value: '제목' },
  { key: 'answ', value: '내용' },
];

const initParams: FaqParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params, setParams] = useState(initParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<FaqModel>>([]);
  const [faqId, setFaqId] = useState<string>('');
  const { data: response, isError, refetch } = useFaqList(params, page);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteFaq(faqId);

  const goToReg = () => {
    navigate(View.REG);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initParams);
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

  const handleFaqId = (faqId: string) => {
    setFaqId(faqId);
  };

  const handleUpdate = (faqId: string) => {
    navigate('./edit', {
      state: {
        faqId: faqId,
      },
    });
  };

  const handleDelete = (faqId: string) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '삭제',
        content: '삭제하시겠습니까?',
        onConfirm: () => handleFaqId(faqId),
      })
    );
  };

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  useEffect(() => {
    faqId && mutate();
  }, [faqId, mutate]);

  useDidMountEffect(() => {
    handleSearch();
  }, [page.page, page.pageSize, handleSearch]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        response.data.contents.forEach((item: FaqModel) => {
          item.clCode = getCode(GroupCodeType.FAQ_TYPE, item.clCode)?.codeNm || '';
        });
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

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
          <TD colSpan={3}>
            <Stack gap="SM" className="width-100">
              <Select
                appearance="Outline"
                placeholder="전체"
                className="select-basic"
                onChange={(e, value) => handleChangeParams('searchConditions', value || 'all')}
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
        rows={rows}
        onChange={handlePage}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        page={page}
        buttonChildren={
          <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
            <AddIcon />
            등록
          </Button>
        }
      />
    </>
  );
};
export default List;
