import SearchForm, { FaqSearchKey as SearchKey, SearchInfo } from '@/components/form/SearchForm';
import AccordionGrid from '@/components/grid/AccordionGrid';
import { useDeleteFaq } from '@/hooks/mutations/useFaqMutations';
import { useFaqList } from '@/hooks/queries/useFaqQueries';
import useModal, { ModalType } from '@/hooks/useModal';
import { FaqInfo } from '@/models/Board/Faq';
import { PageInfo, initPage } from '@/models/components/Page';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const searchInfoList: SearchInfo[] = [
  { key: 'qstn', value: '제목' },
  { key: 'answ', value: '내용' },
];

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openModal } = useModal();
  const [searchKey, setSearchKey] = useState<SearchKey>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState<PageInfo>(initPage);
  const [isChanged, setIsChanged] = useState(false);
  const [rows, setRows] = useState<Array<FaqInfo>>([]);
  const [faqId, setFaqId] = useState<string>('');
  const { refetch, data: response, isError } = useFaqList(searchKey, searchValue, page);
  const { mutate, data: dResponse, isSuccess: dIsSuccess, isError: dIsError } = useDeleteFaq(faqId);

  const goToReg = () => {
    navigate('reg');
  };

  const handleChangeSearchKey = (e: any, value: any) => {
    setSearchKey(value);
  };

  const handleChangeSearchValue = (value: any) => {
    setSearchValue(value);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setSearchKey('all');
    setSearchValue('');
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePage = (page: PageInfo) => {
    setPage(page);
    setIsChanged(true);
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
    openModal({
      type: ModalType.CONFIRM,
      title: '삭제',
      content: '삭제하시겠습니까?',
      onConfirm: () => handleFaqId(faqId),
    });
  };

  useEffect(() => {
    faqId && mutate();
  }, [faqId, mutate]);

  useEffect(() => {
    isChanged && handleSearch();

    return () => {
      setIsChanged(false);
    };
  }, [isChanged, handleSearch]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        response.data.page.page = response.data.page.page - 1;
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '삭제 중 에러가 발생했습니다.',
      });
    } else if (dIsSuccess) {
      toast({
        type: 'Confirm',
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
              <Select appearance="Outline" placeholder="전체" className="select-basic" onChange={handleChangeSearchKey} value={searchKey}>
                {searchInfoList.map((searchInfo) => (
                  <SelectOption value={searchInfo.key}>{searchInfo.value}</SelectOption>
                ))}
              </Select>
              <TextField
                className="width-100"
                onKeyDown={handleKeyDown}
                value={searchValue}
                onChange={(e) => handleChangeSearchValue(e.target.value)}
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
