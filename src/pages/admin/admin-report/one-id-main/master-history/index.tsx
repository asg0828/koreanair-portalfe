import VerticalTable from '@/components/table/VerticalTable';
import {
  Button,
  DatePicker,
  Pagination,
  Radio,
  Select,
  SelectOption,
  Stack,
  TD,
  TH,
  TR,
  TextField,
} from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import { SelectValue } from '@mui/base/useSelect';
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn, reason } from '../data';
import { oneIdHistorySearch } from '@/models/oneId/OneIdInfo';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(2개)
export default function OneIdMasterHistory() {
  const [searchInfo, setSearchInfo] = useState<oneIdHistorySearch>({
    oneIdNum: '',
    oneIdChgReason: '',
    searchCri: 'one',
    firstNameK: '',
    lastNameK: '',
    firstNameE: '',
    lastNameE: '',
    phoneNum: '',
    telephoneNum: '',
    eMailAdd: '',
    birth: '',
    startDate: '',
    endDate: '',
  });

  const today = new Date();

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }

  /* 검색 버튼 */
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    retriveMasterHistory();
  };

  /* api 호출 */
  const retriveMasterHistory = async () => {
    let config = cloneDeep(initConfig);
    config.isLoarding = true;
    let request = cloneDeep(initApiRequest);
    request.method = Method.GET;
    request.url = '';
    request.service = Service.KAL_BE;
    request.params = {
      bodyParams: {
        searchInfo,
      },
    };
    let response = cloneDeep(initCommonResponse);
    response = await callApi(request);

    console.log(request.params);
    console.log('[retrieve360] Response :: ', response);
  };

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
      oneIdNum: '',
      oneIdChgReason: '',
      searchCri: 'one',
      firstNameK: '',
      lastNameK: '',
      firstNameE: '',
      lastNameE: '',
      phoneNum: '',
      telephoneNum: '',
      eMailAdd: '',
      birth: '',
      startDate: '',
      endDate: '',
    });
  }

  /* 기간 별 버튼 */
  function duration(flag: string) {
    let date = '';
    if (flag === 'today') {
      date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      setSearchInfo({ ...searchInfo, endDate: date, startDate: date });
    } else if (flag === 'oneMonth') {
      date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`;
      setSearchInfo({ ...searchInfo, startDate: date });
    } else if (flag === 'sixMonth') {
      date = `${today.getFullYear()}-${today.getMonth() - 5}-${today.getDate() - 1}`;
      setSearchInfo({ ...searchInfo, startDate: date });
    } else if (flag === 'oneYear') {
      date = `${today.getFullYear() - 1}-${today.getMonth() + 1}-${today.getDate() - 1}`;
      setSearchInfo({ ...searchInfo, startDate: date });
    }
  }

  return (
    <div style={{ width: '1200px' }}>
      <div>
        <Stack>
          <form onSubmit={onsubmitHandler}>
            <HorizontalTable>
              <TR>
                <TH align="right">OneId 번호</TH>
                <TD>
                  <TextField onChange={onSearchChangeHandler} placeholder="검색어를 입력하세요." id="oneIdNum" />
                </TD>
                <TH align="right">OneID변경이유코드</TH>
                <TD>
                  <Select
                    appearance="Outline"
                    placeholder="전체"
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
                <TH align="right">조회기준</TH>
                <TD>
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
                <TH align="right">한글이름</TH>
                <TD>
                  <TextField id="firstNameK" onChange={onSearchChangeHandler} placeholder="성을 입력하세요." />
                  <TextField id="lastNameK" onChange={onSearchChangeHandler} placeholder="이름을 입력하세요." />
                </TD>
              </TR>

              <TR>
                <TH align="right">영문이름</TH>
                <TD>
                  <TextField id="firstNameE" onChange={onSearchChangeHandler} placeholder="성을 입력하세요." />
                  <TextField
                    id="lastNameE"
                    onChange={(e) => onSearchChangeHandler(e)}
                    placeholder="이름을 입력하세요."
                  />
                </TD>
                <TH align="right">휴대전화번호</TH>
                <TD>
                  <TextField id="phoneNum" onChange={onSearchChangeHandler} placeholder="01011112222" />
                </TD>
              </TR>

              <TR>
                <TH align="right">일반전화번호</TH>
                <TD>
                  <TextField id="telephoneNum" onChange={onSearchChangeHandler} placeholder="성을 입력하세요." />
                </TD>
                <TH align="right">E-mail주소</TH>
                <TD>
                  <TextField id="eMailAdd" onChange={onSearchChangeHandler} placeholder="검색어를 입력하세요." />
                </TD>
                <TH align="right">출생일자</TH>
                <TD>
                  <DatePicker
                    appearance="Outline"
                    calendarViewMode="days"
                    mode="single"
                    shape="Square"
                    size="MD"
                    id="birth"
                    value={searchInfo.birth}
                    onValueChange={(nextVal) => {
                      setSearchInfo({ ...searchInfo, birth: nextVal });
                    }}
                  />
                </TD>
              </TR>

              <TR>
                <div style={{ width: 500 }}>
                  <TH align="right">최초 생성일</TH>
                </div>
                <TD>
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
              </TR>
            </HorizontalTable>
            <div style={{ marginLeft: 1080 }}>
              <Stack>
                <Button type="submit">검색</Button>
                <Button type="reset" onClick={onClear}>
                  초기화
                </Button>
              </Stack>
            </div>
          </form>
        </Stack>
      </div>

      <Typography variant="h6">마스터 {onIdPaxData.length}</Typography>
      <div style={{ overflowX: 'scroll' }}>
        <Stack>
          <VerticalTable enableSort={true} showHeader={true} columns={oneIdPaxColumn} rows={onIdPaxData} />
        </Stack>
      </div>
      <Pagination />

      <Typography variant="h6">히스토리 {onIdPaxData.length}</Typography>
      <div style={{ overflowX: 'scroll' }}>
        <Stack>
          <VerticalTable enableSort={true} showHeader={true} columns={oneIdPaxColumn} rows={onIdPaxData} />
        </Stack>
      </div>
      <Pagination />
    </div>
  );
}
