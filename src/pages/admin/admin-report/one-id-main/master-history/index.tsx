import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useHistoryList, useMasterHistoryList } from '@/hooks/queries/useOneIdQueries';
import { PageModel, initPage } from '@/models/model/PageModel';
import { OneIdHistoryData, oneidHistorySearch } from '@/models/oneId/OneIdInfo';
import {
  Button,
  DatePicker,
  Radio,
  Select,
  SelectOption,
  Stack,
  TD,
  TH,
  TR,
  TextField,
  useToast,
} from '@ke-design/components';
import { SelectValue } from '@mui/base/useSelect';
import { Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { historyColumn, masterColumn, onIdPaxData, reason } from '../data';
import useDidMountEffect from '@/hooks/useDidMountEffect';
//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(2개)
export default function OneIdMasterHistory() {
  const { toast } = useToast();
  const [searchInfo, setSearchInfo] = useState<oneidHistorySearch>({
    oneidNo: '',
    oneidChgRsnCd: '',
    criteria: 'equal',
    bfChgKorLname: '',
    bfChgKorFname: '',
    bfChgEngLname: '',
    bfChgEngFname: '',
    bfChgMobilePhoneNoInfo: '',
    bfChgEmailAdrs: '',
    bfChgBirthDtv: '',
    creationStartDate: '',
    creationEndDate: '',
    bfChgEmailAdrsHashValue: '',
    bfChgMblfonNoInfoHashVlu: '',
  });
  const [page, setPage] = useState<PageModel>(initPage);
  const [page2, setPage2] = useState<PageModel>(initPage);
  const [row, setRows] = useState<Array<OneIdHistoryData>>([]);
  const [row2, setRows2] = useState<Array<OneIdHistoryData>>([]);
  const { refetch: refetch1, data: response1, isError: isError1 } = useMasterHistoryList(searchInfo, page);
  const { refetch: refetch2, data: response2, isError: isError2 } = useHistoryList(searchInfo, page);

  // refetch
  const handleSearch = useCallback(() => {
    refetch1();
    refetch2();
  }, [refetch1, refetch2]);

  const handlePage = (page: PageModel, flag: string) => {
    if (flag === 'master') {
      setPage(page);
    } else {
      setPage2(page);
    }
  };

  useDidMountEffect(() => {
    handleSearch();
  }, [page.page, page.pageSize, handleSearch]);
  // master 정보 useEffect
  useEffect(() => {
    if (isError1 || response1?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response1?.data) {
        // response.data.contents.forEach(() => {});
        setRows(response1.data.contents);
        setPage(response1.data.page);
      }
    }
  }, [response1, isError1, toast]);

  // history 정보 useEffect
  useEffect(() => {
    if (isError2 || response2?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response2?.data) {
        // response.data.contents.forEach(() => {});
        setRows2(response2.data.contents);
        setPage2(response2.data.page);
      }
    }
  }, [response2, isError2, toast]);

  const today = new Date();

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: value });
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
      oneidNo: '',
      oneidChgRsnCd: '',
      criteria: 'equal',
      bfChgKorLname: '',
      bfChgKorFname: '',
      bfChgEngLname: '',
      bfChgEngFname: '',
      bfChgMobilePhoneNoInfo: '',
      bfChgEmailAdrs: '',
      bfChgBirthDtv: '',
      creationStartDate: '',
      creationEndDate: '',
      bfChgEmailAdrsHashValue: '',
      bfChgMblfonNoInfoHashVlu: '',
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
    setSearchInfo({ ...searchInfo, creationEndDate: enddate, creationStartDate: startdate });
  }

  return (
    <>
      <Stack direction="Vertical" gap="LG" className="width-100">
        <SearchForm onSearch={handleSearch} onClear={onClear}>
          <form>
            <HorizontalTable>
              <TR>
                <TH colSpan={1.002} align="right">
                  OneId 번호
                </TH>
                <TD colSpan={2}>
                  <TextField
                    className="width-100"
                    onChange={onSearchChangeHandler}
                    value={searchInfo.oneidNo}
                    placeholder="검색어를 입력하세요."
                    id="oneidNo"
                  />
                </TD>
                <TH colSpan={1} align="right">
                  OneID변경이유코드
                </TH>
                <TD colSpan={2}>
                  <Select
                    appearance="Outline"
                    placeholder="전체"
                    className="width-100"
                    value={searchInfo.oneidChgRsnCd}
                    onChange={(
                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                      value: SelectValue<{}, false>
                    ) => {
                      onchangeSelectHandler(e, value, 'oneidChgRsnCd');
                    }}
                  >
                    {reason.map((item, index) => (
                      <SelectOption key={index} value={item.value}>
                        {item.text}
                      </SelectOption>
                    ))}
                  </Select>
                </TD>
                <TH colSpan={1.002} align="right">
                  조회기준
                </TH>
                <TD colSpan={2}>
                  <Radio
                    id="criteria"
                    name="criteria"
                    onChange={(e) => radioHandler(e)}
                    label="History단건"
                    value="equal"
                    defaultChecked
                  />
                  <Radio
                    id="criteria"
                    name="criteria"
                    onChange={(e) => radioHandler(e)}
                    label="해당History전체"
                    value="oneid"
                  />
                </TD>
              </TR>

              <TR>
                <TH colSpan={1} align="right">
                  한글이름
                </TH>
                <TD colSpan={5}>
                  <TextField
                    className="width-100"
                    id="bfChgKorFname"
                    onChange={onSearchChangeHandler}
                    placeholder="성을 입력하세요."
                    value={searchInfo.bfChgKorFname}
                  />
                  <TextField
                    className="width-100"
                    id="bfChgKorLname"
                    onChange={onSearchChangeHandler}
                    placeholder="이름을 입력하세요."
                    value={searchInfo.bfChgKorLname}
                  />
                </TD>
                <TH colSpan={1} align="right">
                  휴대전화번호
                </TH>
                <TD colSpan={2}>
                  <TextField
                    className="width-100"
                    id="bfChgMobilePhoneNoInfo"
                    onChange={onSearchChangeHandler}
                    placeholder="01011112222"
                    value={searchInfo.bfChgMobilePhoneNoInfo}
                  />
                </TD>
              </TR>

              <TR>
                <TH colSpan={1} align="right">
                  영문이름
                </TH>
                <TD colSpan={5}>
                  <TextField
                    className="width-100"
                    id="bfChgEngFname"
                    onChange={onSearchChangeHandler}
                    placeholder="성을 입력하세요."
                    value={searchInfo.bfChgEngFname}
                  />
                  <TextField
                    className="width-100"
                    id="bfChgEngLname"
                    onChange={(e) => onSearchChangeHandler(e)}
                    placeholder="이름을 입력하세요."
                    value={searchInfo.bfChgEngLname}
                  />
                </TD>
                <TH colSpan={1} align="right">
                  일반전화번호
                </TH>
                <TD colSpan={2}>
                  <TextField
                    id="homePhoneNumberInfo"
                    className="width-100"
                    onChange={onSearchChangeHandler}
                    placeholder="성을 입력하세요."
                    // value={searchInfo.}
                  />
                </TD>
              </TR>

              <TR>
                <TH colSpan={1} align="right">
                  출생일자
                </TH>
                <TD colSpan={5}>
                  <DatePicker
                    appearance="Outline"
                    calendarViewMode="days"
                    mode="single"
                    shape="Square"
                    size="MD"
                    id="bfChgBirthDtv"
                    value={searchInfo.bfChgBirthDtv}
                    onValueChange={(nextVal) => {
                      setSearchInfo({ ...searchInfo, bfChgBirthDtv: nextVal });
                    }}
                  />
                </TD>
                <TH colSpan={1} align="right">
                  E-mail주소
                </TH>
                <TD colSpan={2}>
                  <TextField
                    className="width-100"
                    id="bfChgEmailAdrs"
                    onChange={onSearchChangeHandler}
                    placeholder="이메일을 입력하세요."
                    value={searchInfo.bfChgEmailAdrs}
                  />
                </TD>
              </TR>

              <TR>
                <TH colSpan={0.999} align="right">
                  최초 생성일
                </TH>
                <TD colSpan={8}>
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
                  <Button onClick={() => duration('thisWeek')}>1주일</Button>
                  <Button onClick={() => duration('oneMonth')}>1개월</Button>
                  <Button onClick={() => duration('sixMonth')}>6개월</Button>
                  <Button onClick={() => duration('oneYear')}>1년</Button>
                </TD>
              </TR>
            </HorizontalTable>
          </form>
        </SearchForm>
      </Stack>

      <Typography variant="h4">마스터 </Typography>
      <DataGrid
        columns={masterColumn}
        rows={row}
        enableSort={false}
        page={page}
        onChange={(flag: 'master') => handlePage(page, flag)}
      />

      <Typography variant="h4">히스토리 </Typography>
      <DataGrid
        columns={historyColumn}
        rows={row2}
        enableSort={false}
        page={page2}
        onChange={(flag: 'history') => handlePage(page2, flag)}
      />
    </>
  );
}
