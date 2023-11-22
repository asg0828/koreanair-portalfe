import { Button, DatePicker, Radio, Stack, TD, TH, TR, useToast } from '@ke-design/components';
import HorizontalTable from '@/components/table/HorizontalTable';
import { ctiVocColumn, ctiVocData } from '../../one-id-main/data';
import { CtiVocData, ctiVocSearch } from '@/models/oneId/OneIdInfo';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useCtiVoc } from '@/hooks/queries/useOneIdQueries';
import { useCallback, useEffect, useState } from 'react';
import DataGridChild from '@/components/grid/DataGridChild';

export default function Ctivoc() {
  const today = new Date();
  const [searchInfo, setSearchInfo] = useState<ctiVocSearch>({
    searchCri: 'tow',
    startDate: '',
    endDate: '',
  });
  const { toast } = useToast();
  const [isChanged, setIsChanged] = useState(false);
  const [page, setPage] = useState<PageModel>(initPage);
  const [row, setRows] = useState<Array<CtiVocData>>([]);
  const { refetch, data: response, isError } = useCtiVoc(searchInfo, page);

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
        // response.data.contents.forEach(() => {});
        setRows(response.data.contents);
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
      searchCri: 'one',
      startDate: '',
      endDate: '',
    });
  }

  /* 기간 별 버튼 */
  function duration(flag: string) {
    let enddate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let startdate = '';
    if (flag === 'today') {
      startdate = enddate;
    } else if (flag === 'oneMonth') {
      startdate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`;
    } else if (flag === 'sixMonth') {
      startdate = `${today.getFullYear()}-${today.getMonth() - 5}-${today.getDate() - 1}`;
    } else if (flag === 'oneYear') {
      startdate = `${today.getFullYear() - 1}-${today.getMonth() + 1}-${today.getDate() - 1}`;
    }
    setSearchInfo({ ...searchInfo, endDate: enddate, startDate: startdate });
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
                value={searchInfo.startDate}
                onValueChange={(nextVal) => {
                  setSearchInfo({ ...searchInfo, startDate: nextVal });
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
                value={searchInfo.endDate}
                onValueChange={(nextVal) => {
                  setSearchInfo({ ...searchInfo, endDate: nextVal });
                }}
              />
              <Button onClick={() => duration('today')}>당일</Button>
              <Button onClick={() => duration('oneMonth')}>1개월</Button>
              <Button onClick={() => duration('sixMonth')}>6개월</Button>
              <Button onClick={() => duration('oneYear')}>1년</Button>
            </TD>

            <TH colSpan={2} align="right">
              조회기준
            </TH>

            <TD colSpan={4}>
              <Radio
                id="searchCri"
                name="searchCri"
                onChange={(e) => radioHandler(e)}
                label="History단건"
                value="one"
                defaultChecked
              />
              <Radio
                id="searchCri"
                name="searchCri"
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
          <Button onClick={onClear} type="reset" size="LG">
            초기화
          </Button>
        </Stack>
      </form>

      <DataGridChild
        page={page}
        columns={ctiVocColumn}
        //row   = {row}
        rows={ctiVocData}
        enableSort={true}
        clickable={true}
        onChange={handlePage}
      />
    </Stack>
  );
}
