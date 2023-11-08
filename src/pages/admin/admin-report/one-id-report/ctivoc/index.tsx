import VerticalTable from '@/components/table/VerticalTable';
import { Button, DatePicker, Pagination, Radio, Stack, TD, TH, TR } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn } from '../../one-id-main/data';
import { ctiVocSearch } from '@/models/oneId/OneIdInfo';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';

export default function Ctivoc() {
  const today = new Date();
  const [searchInfo, setSearchInfo] = useState<ctiVocSearch>({
    searchCri: 'one',
    startDate: '',
    endDate: '',
  });

  /* 검색 버튼 */
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    retriveCtiVoc();
  };

  /* api 호출 */
  const retriveCtiVoc = async () => {
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
                <div style={{ width: 200 }}>
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
                <div style={{ width: 200 }}>
                  <TH align="right">조회기준</TH>
                </div>
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
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={oneIdPaxColumn} rows={onIdPaxData} />
      </Stack>
      <Pagination />
    </div>
  );
}
