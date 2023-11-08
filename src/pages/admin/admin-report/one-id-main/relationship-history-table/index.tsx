import VerticalTable from '@/components/table/VerticalTable';
import { Button, DatePicker, Pagination, Stack, TD, TH, TR, TextField } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { relationColumn, relationData } from '../data';
import { relationSearch } from '@/models/oneId/OneIdInfo';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(1개)
export default function RelationshipHistoryTable() {
  const [searchInfo, setSearchInfo] = useState<relationSearch>({
    oneIdNum: '',
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
    retrieveRelation();
  };

  /* api 호출 */
  const retrieveRelation = async () => {
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

  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({ ...searchInfo, oneIdNum: '', startDate: '', endDate: '' });
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
                  <TextField
                    onChange={onSearchChangeHandler}
                    placeholder="검색어를 입력하세요."
                    value={searchInfo.oneIdNum}
                    id="oneIdNum"
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

      <Typography variant="h6">조회결과 {relationData.length}</Typography>
      <Stack>
        <div style={{ overflowX: 'scroll' }}>
          <VerticalTable enableSort={true} showHeader={true} columns={relationColumn} rows={relationData} />
        </div>
      </Stack>
      <Pagination />
    </div>
  );
}
