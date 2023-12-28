import { Button, Radio, DatePicker, TD, TH, TR, useToast, Stack } from '@ke-design/components';
import { useCallback, useEffect, useState } from 'react';
import { dailyTotal, oneIdDailyColumn, oneIdDailyData } from '../../one-id-main/data';
import { DailyReportData, dailySearch } from '@/models/oneId/OneIdInfo';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useDaily } from '@/hooks/queries/useOneIdQueries';
import HorizontalTable from '@/components/table/HorizontalTable';
import DataGridChild from '@/components/grid/DataGridChild';
import { RowsInfo } from '@/models/components/Table';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(1개)
export default function Daily() {
  const today = new Date();
  const endDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let startDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() - 7}`;
  const [searchInfo, setSearchInfo] = useState<dailySearch>({
    criteria: 'daily',
    aggrStartDate: startDate,
    aggrEndDate: endDate,
  });
  const { toast } = useToast();
  const [isChanged, setIsChanged] = useState(false);
  const [page, setPage] = useState<PageModel>(initPage);
  const [row, setRows] = useState<Array<DailyReportData>>([]);
  const { refetch, data: response, isError } = useDaily(searchInfo, page);
  const [total, setTotal] = useState({});
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
        setRows(response.data.contents);

        // 각 컬럼 합
        const columnSums: RowsInfo = {};
        response.data.contents.forEach((row: RowsInfo) => {
          for (const key in row) {
            if (key !== 'no' && (typeof row[key] === 'number' || (row[key] === null && key in columnSums))) {
              columnSums[key] = (columnSums[key] || 0) + (row[key] || 0);
            } else if (key !== 'no' && row[key] === null && !(key in columnSums)) {
              columnSums[key] = 0;
            }
            // else if(typeof row[key] === 'string'){
            //   columnSums[key] = 'NaN'
            // }
          }
        });
        setTotal((prevState) => ({ ...prevState, ...columnSums }));
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({ ...searchInfo, criteria: 'daily', aggrEndDate: '', aggrStartDate: '' });
  }

  /* radio 입력 함수 */
  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  };

  /* 기간 별 버튼 */
  function duration(flag: string) {
    if (flag === 'thisWeek') {
      startDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() - 7}`;
    } else if (flag === 'oneMonth') {
      startDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`;
    } else if (flag === 'sixMonth') {
      startDate = `${today.getFullYear()}-${today.getMonth() - 5}-${today.getDate() - 1}`;
    } else if (flag === 'oneYear') {
      startDate = `${today.getFullYear() - 1}-${today.getMonth() + 1}-${today.getDate() - 1}`;
    }
    setSearchInfo({ ...searchInfo, aggrEndDate: endDate, aggrStartDate: startDate });
  }

  return (
    <Stack direction="Vertical" gap="LG" className="width-100">
      <form onSubmit={onsubmitHandler}>
        <HorizontalTable>
          <TR>
            <TH colSpan={2} className="width-100" align="right">
              최초 생성일
            </TH>
            <TD colSpan={9}>
              <DatePicker
                appearance="Outline"
                calendarViewMode="days"
                mode="single"
                shape="Square"
                size="MD"
                id="startDate"
                value={searchInfo.aggrStartDate}
                onValueChange={(nextVal) => {
                  setSearchInfo({ ...searchInfo, aggrStartDate: nextVal });
                }}
              />
              -
              <DatePicker
                appearance="Outline"
                calendarViewMode="days"
                mode="single"
                shape="Square"
                size="MD"
                id="endDate"
                value={searchInfo.aggrEndDate}
                onValueChange={(nextVal) => {
                  setSearchInfo({ ...searchInfo, aggrEndDate: nextVal });
                }}
              />
              <Button onClick={() => duration('thisWeek')}>1주일</Button>
              <Button onClick={() => duration('oneMonth')}>1개월</Button>
              <Button onClick={() => duration('sixMonth')}>6개월</Button>
              <Button onClick={() => duration('oneYear')}>1년</Button>
            </TD>

            <TH colSpan={2} align="right">
              조회기준
            </TH>
            <TD colSpan={4}>
              <Radio
                id="criteria"
                name="criteria"
                onChange={(e) => radioHandler(e)}
                label="History단건"
                value="daily"
                defaultChecked
              />
              <Radio
                id="criteria"
                name="criteria"
                onChange={(e) => radioHandler(e)}
                label="해당History전체"
                value="all"
              />
            </TD>
          </TR>
        </HorizontalTable>
        <br></br>
        <Stack gap="SM" justifyContent="Center">
          <Button type="submit" priority="Primary" appearance="Contained" size="LG">
            <span className="searchIcon"></span>
            검색
          </Button>
          <Button type="reset" size="LG" onClick={onClear}>
            초기화
          </Button>
        </Stack>
      </form>

      <DataGridChild
        columns={oneIdDailyColumn}
        rows={row}
        // rows={oneIdDailyData}
        totals={total}
        enableSort={false}
        clickable={true}
        page={page}
        onChange={handlePage}
      />
    </Stack>
  );
}
