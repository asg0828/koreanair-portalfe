import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useMasterHistoryList } from '@/hooks/queries/useOneIdQueries';
import { PageModel, initPage } from '@/models/model/PageModel';
import { oneidHistorySearch } from '@/models/oneId/OneIdInfo';
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

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(2개)
export default function OneIdMasterHistory() {
  const { toast } = useToast();
  const [searchInfo, setSearchInfo] = useState<oneidHistorySearch>({
    oneidNum: '',
    oneidChgRsnCd: '',
    criteria: 'one',
    bfChgKorLname: '',
    bfChgKorFname: '',
    bfChgEngLname: '',
    bfChgEngFname: '',
    bfChgMobilePhoneNoInfo: '',
    bfChgEmailAdrs: '',
    bfChgBirthDtv: '',
    creationStartDate: '',
    creationEndDate: '',
  });
  const [page, setPage] = useState<PageModel>(initPage);
  const { refetch, data: response, isError } = useMasterHistoryList(searchInfo, page);
  // const { data2: response2, isError } = useHistoryList(searchInfo, page);
  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);
  const handlePage = (page: PageModel) => {
    setPage(page);
  };
  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        // response.data.contents.forEach(() => {});
        // setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  const today = new Date();

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }

  /* 검색 버튼 */
  // const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   retriveMasterHistory();
  // };

  /* api 호출 */
  // const retriveMasterHistory = async () => {
  //   let config = cloneDeep(initConfig);
  //   config.isLoarding = true;
  //   let request = cloneDeep(initApiRequest);
  //   request.method = Method.GET;
  //   request.url = '';
  //   request.service = Service.KAL_BE;
  //   request.params = {
  //     bodyParams: {
  //       searchInfo,
  //     },
  //   };
  //   let response = cloneDeep(initCommonResponse);
  //   response = await callApi(request);

  //   console.log(request.params);
  //   console.log('[retrieve360] Response :: ', response);
  // };

  // function handleClear() {
  //   setSearchInfo({
  //     ...searchInfo,
  //     oneIdNum: '',
  //     oneIdChgReason: '',
  //     searchCri: 'one',
  //     firstNameK: '',
  //     lastNameK: '',
  //     firstNameE: '',
  //     lastNameE: '',
  //     phoneNum: '',
  //     telephoneNum: '',
  //     eMailAdd: '',
  //     birth: '',
  //     startDate: '',
  //     endDate: '',
  //   });
  // }

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
      oneidNum: '',
      oneidChgRsnCd: '',
      criteria: 'one',
      bfChgKorLname: '',
      bfChgKorFname: '',
      bfChgEngLname: '',
      bfChgEngFname: '',
      bfChgMobilePhoneNoInfo: '',
      bfChgEmailAdrs: '',
      bfChgBirthDtv: '',
      creationStartDate: '',
      creationEndDate: '',
    });
  }

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

  return (
    <Stack direction="Vertical">
      <Stack className="height-100">
        <SearchForm onSearch={handleSearch} onClear={onClear}>
          <form>
            <HorizontalTable>
              <TR>
                <TH colSpan={1} align="right">
                  OneId 번호
                </TH>
                <TD colSpan={3}>
                  <TextField
                    className="width-100"
                    onChange={onSearchChangeHandler}
                    value={searchInfo.oneidNum}
                    placeholder="검색어를 입력하세요."
                    id="oneIdNum"
                  />
                </TD>
                <TH colSpan={1} align="right">
                  OneID변경이유코드
                </TH>
                <TD colSpan={3}>
                  <Select
                    appearance="Outline"
                    placeholder="전체"
                    className="width-100"
                    value={searchInfo.oneidChgRsnCd}
                    onChange={(
                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                      value: SelectValue<{}, false>
                    ) => {
                      onchangeSelectHandler(e, value, 'oneIdChgReason');
                    }}
                  >
                    {reason.map((item, index) => (
                      <SelectOption key={index} value={item.value}>
                        {item.text}
                      </SelectOption>
                    ))}
                  </Select>
                </TD>
                <TH colSpan={1} align="right">
                  조회기준
                </TH>
                <TD colSpan={3}>
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

              <TR>
                <TH colSpan={1} align="right">
                  한글이름
                </TH>
                <TD colSpan={3}>
                  <TextField
                    className="width-100"
                    id="firstNameK"
                    onChange={onSearchChangeHandler}
                    placeholder="성을 입력하세요."
                  />
                  <TextField
                    className="width-100"
                    id="lastNameK"
                    onChange={onSearchChangeHandler}
                    placeholder="이름을 입력하세요."
                  />
                </TD>
                <TH colSpan={1} align="right">
                  영문이름
                </TH>
                <TD colSpan={3}>
                  <TextField
                    className="width-100"
                    id="firstNameE"
                    onChange={onSearchChangeHandler}
                    placeholder="성을 입력하세요."
                  />
                  <TextField
                    className="width-100"
                    id="lastNameE"
                    onChange={(e) => onSearchChangeHandler(e)}
                    placeholder="이름을 입력하세요."
                  />
                </TD>
              </TR>

              <TR>
                <TH colSpan={1} align="right">
                  휴대전화번호
                </TH>
                <TD colSpan={2}>
                  <TextField
                    className="width-100"
                    id="phoneNum"
                    onChange={onSearchChangeHandler}
                    placeholder="01011112222"
                  />
                </TD>
                <TH colSpan={1} align="right">
                  일반전화번호
                </TH>
                <TD colSpan={2}>
                  <TextField
                    id="telephoneNum"
                    className="width-100"
                    onChange={onSearchChangeHandler}
                    placeholder="성을 입력하세요."
                  />
                </TD>
              </TR>

              <TR>
                <TH colSpan={1} align="right">
                  E-mail주소
                </TH>
                <TD colSpan={2}>
                  <TextField
                    className="width-100"
                    id="eMailAdd"
                    onChange={onSearchChangeHandler}
                    placeholder="검색어를 입력하세요."
                  />
                </TD>
                <TH colSpan={1} align="right">
                  출생일자
                </TH>
                <TD colSpan={2}>
                  <DatePicker
                    appearance="Outline"
                    calendarViewMode="days"
                    mode="single"
                    shape="Square"
                    size="MD"
                    id="birth"
                    value={searchInfo.bfChgBirthDtv}
                    onValueChange={(nextVal) => {
                      setSearchInfo({ ...searchInfo, bfChgBirthDtv: nextVal });
                    }}
                  />
                </TD>
              </TR>

              <TR>
                <TH colSpan={1} align="right">
                  최초 생성일
                </TH>
                <TD colSpan={5}>
                  <DatePicker
                    appearance="Outline"
                    calendarViewMode="days"
                    mode="single"
                    shape="Square"
                    size="MD"
                    id="startDate"
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
                    id="endDate"
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
          </form>
        </SearchForm>
      </Stack>

      <Typography variant="h4">마스터 </Typography>
      <DataGrid columns={masterColumn} rows={onIdPaxData} enableSort={true} page={page} onChange={handlePage} />

      <Typography variant="h4">히스토리 </Typography>
      <DataGrid columns={historyColumn} rows={onIdPaxData} enableSort={true} page={page} onChange={handlePage} />
    </Stack>
  );
}
