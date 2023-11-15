import { Button, DatePicker, Stack, TD, TH, TR, TextField, useToast } from '@ke-design/components';
import { useCallback, useEffect, useState } from 'react';
import HorizontalTable from '@/components/table/HorizontalTable';
import { relationColumn, relationData } from '../data';
import { RelationData, relationSearch } from '@/models/oneId/OneIdInfo';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useRelation } from '@/hooks/queries/useOneIdQueries';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(1개)
export default function RelationshipHistoryTable() {
  const [searchInfo, setSearchInfo] = useState<relationSearch>({
    oneidNum: '',
    creationStartDate: '',
    creationEndDate: '',
  });
  const today = new Date();
  const { toast } = useToast();
  const [isChanged, setIsChanged] = useState(false);
  const [page, setPage] = useState<PageModel>(initPage);
  const [row, setRows] = useState<Array<RelationData>>([]);
  const { refetch, data: response, isError } = useRelation(searchInfo, page);

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePage = (page: PageModel) => {
    setPage(page);
    setIsChanged(true);
  };

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
        // response.data.contents.forEach(() => {});
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }

  /* 검색 버튼 */
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  /* 기간 별 버튼 */
  function duration(flag: string) {
    let date = '';
    if (flag === 'today') {
      date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      setSearchInfo({ ...searchInfo, creationEndDate: date, creationStartDate: date });
    } else if (flag === 'oneMonth') {
      date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`;
      setSearchInfo({ ...searchInfo, creationStartDate: date });
    } else if (flag === 'sixMonth') {
      date = `${today.getFullYear()}-${today.getMonth() - 5}-${today.getDate() - 1}`;
      setSearchInfo({ ...searchInfo, creationStartDate: date });
    } else if (flag === 'oneYear') {
      date = `${today.getFullYear() - 1}-${today.getMonth() + 1}-${today.getDate() - 1}`;
      setSearchInfo({ ...searchInfo, creationStartDate: date });
    }
  }

  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({ ...searchInfo, oneidNum: '', creationStartDate: '', creationEndDate: '' });
  }

  return (
    <>
      <form onSubmit={onsubmitHandler}>
        <div style={{ width: 1210 }}>
          <HorizontalTable>
            <TR>
              <TH colSpan={1} align="right">
                OneId 번호
              </TH>
              <TD colSpan={4}>
                <TextField
                  className="width-100"
                  onChange={onSearchChangeHandler}
                  placeholder="검색어를 입력하세요."
                  value={searchInfo.oneidNum}
                  id="oneidNum"
                />
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                최초 생성일
              </TH>
              <TD colSpan={4}>
                <DatePicker
                  appearance="Outline"
                  calendarViewMode="days"
                  mode="single"
                  shape="Square"
                  size="MD"
                  id="creationStartDate"
                  value={searchInfo.creationStartDate}
                  onValueChange={(nextVal) => {
                    setSearchInfo({ ...searchInfo, creationStartDate: nextVal });
                  }}
                />
                -
                <DatePicker
                  appearance="Outline"
                  calendarViewMode="days"
                  mode="single"
                  shape="Square"
                  size="MD"
                  id="creationEndDate"
                  value={searchInfo.creationEndDate}
                  onValueChange={(nextVal) => {
                    setSearchInfo({ ...searchInfo, creationEndDate: nextVal });
                  }}
                />
                <Button onClick={() => duration('today')}>당일</Button>
                <Button onClick={() => duration('oneMonth')}>1개월</Button>
                <Button onClick={() => duration('sixMonth')}>6개월</Button>
                <Button onClick={() => duration('oneYear')}>1년</Button>
              </TD>
            </TR>
          </HorizontalTable>
          <Stack gap="SM" justifyContent="Center">
            <Button type="submit" priority="Primary" appearance="Contained" size="LG">
              <span className="searchIcon"></span>
              검색
            </Button>
            <Button onClick={onClear} type="reset" size="LG">
              초기화
            </Button>
          </Stack>
        </div>
      </form>

      <DataGrid
        columns={relationColumn}
        //row   = {row}
        rows={relationData}
        enableSort={true}
        clickable={true}
        page={page}
        onChange={handlePage}
      />
    </>
  );
}
