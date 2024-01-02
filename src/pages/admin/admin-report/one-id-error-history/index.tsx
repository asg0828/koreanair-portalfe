import { Button, DatePicker, Stack, TD, TH, TR, TextField, Radio, useToast } from '@ke-design/components';
import { useCallback, useEffect, useState } from 'react';
import HorizontalTable from '@/components/table/HorizontalTable';
import { errLogColumn, errLogData } from '../one-id-main/data';
import { ErrLogData, errorSearch } from '@/models/oneId/OneIdInfo';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useErrorLog } from '@/hooks/queries/useOneIdQueries';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(1개)
export default function OneIdErrorHistory() {
  const today = new Date();
  const [searchInfo, setSearchInfo] = useState<errorSearch>({
    errorNm: '',
    detailErrorNm: '',
    oneidRegisChnlCd: '',
    oneidFinalChgRelateNo: '',
    creationStartDate: '',
    creationEndDate: '',
    uciId: '',
    pnrNumber: '',
  });

  const { toast } = useToast();
  const [isChanged, setIsChanged] = useState(false);
  const [page, setPage] = useState<PageModel>(initPage);
  const [row, setRows] = useState<Array<ErrLogData>>([]);
  const { refetch, data: response, isError } = useErrorLog(searchInfo, page);

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);
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
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);
  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }
  const handlePage = (page: PageModel) => {
    setPage(page);
    setIsChanged(true);
  };

  /* 라디오 클릭시 값, input 초기화 함수 */
  function radioVal(e: any) {
    let currVal = e.target.value;
    // 채널코드 변경 시 입력값 초기화
    if (currVal !== searchInfo.oneidRegisChnlCd) {
      setSearchInfo({ ...searchInfo, uciId: '', oneidFinalChgRelateNo: '', oneidRegisChnlCd: currVal });
    }
  }

  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({
      ...searchInfo,
      errorNm: '',
      detailErrorNm: '',
      oneidRegisChnlCd: '',
      oneidFinalChgRelateNo: '',
      creationStartDate: '',
      creationEndDate: '',
      uciId: '',
      pnrNumber: '',
    });
  }

  /* 검색 버튼 */
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  /* 기간 별 버튼 */
  function duration(flag: string) {
    let startDate;
    let startDay = today;
    let endDate = `${today.getFullYear()}-${(`0` + today.getMonth() + 1).slice(-2)}-${(`0` + today.getDate()).slice(
      -2
    )}`;

    if (flag === 'today') {
      startDate = endDate;
    } else if (flag === 'oneMonth') {
      startDay = new Date(today.setMonth(today.getMonth() - 1));
    } else if (flag === 'sixMonth') {
      startDay = new Date(today.setMonth(today.getMonth() - 6));
    } else if (flag === 'oneYear') {
      startDay = new Date(today.setFullYear(today.getFullYear() - 1));
    }
    startDate = `${startDay?.getFullYear()}-${('0' + (startDay?.getMonth() + 1)).slice(-2)}-${(
      '0' + startDay?.getDate()
    ).slice(-2)}`;

    setSearchInfo({ ...searchInfo, creationEndDate: endDate, creationStartDate: startDate });
  }

  return (
    <Stack direction="Vertical" gap="LG" className="width-100">
      <form onSubmit={onsubmitHandler}>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              에러코드
            </TH>

            <TD colSpan={2}>
              <TextField
                className="width-100"
                placeholder="검색어를 입력하세요."
                id="errorNm"
                value={searchInfo.errorNm}
                onChange={onSearchChangeHandler}
              />
            </TD>
            <TH colSpan={1} align="right">
              상세에러코드
            </TH>
            <TD colSpan={5}>
              <TextField
                id="detailErrorNm"
                className="width-100"
                placeholder="검색어를 입력하세요."
                value={searchInfo.detailErrorNm}
                onChange={onSearchChangeHandler}
              />
            </TD>
          </TR>

          <TR>
            <TH colSpan={1.01} align="right">
              OneIDChannel
            </TH>
            <TD colSpan={2.01} className="width-100">
              <Radio
                id="oneidRegisChnlCd"
                name="oneidRegisChnlCd"
                label="전체"
                checked={searchInfo.oneidRegisChnlCd === ''}
                onClick={(e) => radioVal(e)}
                value=""
                defaultChecked
              />
              <Radio
                id="oneidRegisChnlCd"
                name="oneidRegisChnlCd"
                label="ODS"
                onClick={(e) => radioVal(e)}
                value="ODS"
              />
              <Radio
                id="oneidRegisChnlCd"
                name="oneidRegisChnlCd"
                label="SKYPASS"
                onClick={(e) => radioVal(e)}
                value="SKYPASS"
              />
            </TD>
            <TH colSpan={1.01} align="right">
              PNR번호
            </TH>
            <TD colSpan={1}>
              <TextField
                id="pnrNumber"
                placeholder="검색어를 입력하세요."
                onChange={onSearchChangeHandler}
                value={searchInfo.pnrNumber}
                disabled={searchInfo.oneidRegisChnlCd === 'ODS' ? false : true}
              />
            </TD>
            <TH colSpan={1} align="right">
              UCIID
            </TH>
            <TD colSpan={1}>
              <TextField
                id="uciId"
                placeholder="검색어를 입력하세요."
                value={searchInfo.uciId}
                onChange={onSearchChangeHandler}
                disabled={searchInfo.oneidRegisChnlCd === 'ODS' ? false : true}
              />
            </TD>
            <TH colSpan={1} align="right">
              Skypass회원번호
            </TH>
            <TD colSpan={1}>
              <TextField
                id="oneidFinalChgRelateNo"
                placeholder="검색어를 입력하세요."
                value={searchInfo.oneidFinalChgRelateNo}
                onChange={onSearchChangeHandler}
                disabled={searchInfo.oneidRegisChnlCd === 'SKYPASS' ? false : true}
              />
            </TD>
          </TR>

          <TR>
            <TH colSpan={1} align="right">
              최초 생성일
            </TH>

            <TD colSpan={8}>
              <DatePicker
                id="startDate"
                value={searchInfo.creationStartDate}
                appearance="Outline"
                calendarViewMode="days"
                mode="single"
                shape="Square"
                size="MD"
                onValueChange={(nextVal) => {
                  setSearchInfo({ ...searchInfo, creationStartDate: nextVal });
                }}
              />
              -
              <DatePicker
                value={searchInfo.creationEndDate}
                appearance="Outline"
                calendarViewMode="days"
                mode="single"
                shape="Square"
                size="MD"
                id="endDate"
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

      <DataGrid
        columns={errLogColumn}
        rows={row}
        // rows={errLogData}
        enableSort={false}
        clickable={true}
        page={page}
        onChange={handlePage}
      />
    </Stack>
  );
}
