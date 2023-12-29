import { Button, DatePicker, Radio, Stack, TD, TH, TR, useToast } from '@ke-design/components';
import HorizontalTable from '@/components/table/HorizontalTable';
import { ctiVocColumn, ctiVocTotal } from '../../one-id-main/data';
import { CtiVocData, ctiVocSearch } from '@/models/oneId/OneIdInfo';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useCtiVoc } from '@/hooks/queries/useOneIdQueries';
import { useCallback, useEffect, useState } from 'react';
import DataGridChild from '@/components/grid/DataGridChild';
import { RowsInfo } from '@/models/components/Table';

export default function Ctivoc() {
  const today = new Date();
  const endDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let startDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() - 7}`;
  const [searchInfo, setSearchInfo] = useState<ctiVocSearch>({
    criteria: 'daily',
    channel: 'CTI',
    aggrStartDate: startDate,
    aggrEndDate: endDate,
  });
  const { toast } = useToast();
  const [isChanged, setIsChanged] = useState(false);
  const [page, setPage] = useState<PageModel>(initPage);
  const [row, setRows] = useState<Array<CtiVocData>>([]);
  const { refetch, data: response, isError } = useCtiVoc(searchInfo, page);
  const [total, setTotal] = useState({});
  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePage = (page: PageModel) => {
    setPage(page);
    setIsChanged(true);
  };
  useEffect(() => {}, [total]);
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
        response.data.contents.forEach((row: RowsInfo, index: number) => {
          for (const key in row) {
            // 비율인 경우 평균값 계산 후 정수로 노출
            if (key.includes('Rate')) {
              if (index === response.data.contents.length - 1) {
                columnSums[key] = Math.floor(((columnSums[key] || 0) + (row[key] || 0)) / (index + 1)) + '%';
                // 건수인 경우는 누적 합
              } else {
                columnSums[key] = (columnSums[key] || 0) + (row[key] || 0);
              }
            } else if (typeof row[key] === 'number' || (row[key] === null && key in columnSums)) {
              columnSums[key] = (columnSums[key] || 0) + (row[key] || 0);
            } else if (row[key] === null && !(key in columnSums)) {
              columnSums[key] = 0;
            }
          }
        });
        setTotal((prevState) => ({ ...prevState, ...columnSums }));
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  /* 검색 버튼 */
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  /* radio 입력 함수 */
  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  };

  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({
      ...searchInfo,
      criteria: 'daily',
      channel: 'CTI',
      aggrStartDate: '',
      aggrEndDate: '',
    });
  }

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
    <Stack direction="Vertical" gap="LG" className="height-100">
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
              채널
            </TH>

            <TD colSpan={4}>
              <Radio
                id="channel"
                name="channel"
                onChange={(e) => radioHandler(e)}
                label="CTI"
                value="CTI"
                defaultChecked
              />
              <Radio id="channel" name="channel" onChange={(e) => radioHandler(e)} label="VOC" value="VOC" />
            </TD>
          </TR>
        </HorizontalTable>
        <br></br>
        <Stack gap="SM" justifyContent="Center">
          <Button type="submit" priority="Primary" appearance="Contained" size="LG">
            <span className="searchIcon"></span>
            검색
          </Button>
          <Button onClick={onClear} type="reset" size="LG">
            초기화
          </Button>
        </Stack>
      </form>

      <DataGridChild
        page={page}
        columns={ctiVocColumn}
        rows={row}
        totals={total}
        enableSort={false}
        clickable={true}
        onChange={handlePage}
      />
    </Stack>
  );
}
