import VerticalTable from '@/components/table/VerticalTable';
import { Button, Pagination, Stack, TD, TH, TR, TextField } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { mobMasterColumn, mobMasterData, mobileColumn, mobileData } from '../data';
import { mobileSearch } from '@/models/oneId/OneIdInfo';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(2개)
export default function MobileNumber() {
  const [searchInfo, setSearchInfo] = useState<mobileSearch>({
    oneIdNum: '',
    pnrNum: '',
  });

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }

  /* 검색 버튼 */
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    retrieveMobile();
  };

  /* api 호출 */
  const retrieveMobile = async () => {
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

  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({ ...searchInfo, oneIdNum: '', pnrNum: '' });
  }

  return (
    <div>
      <div>
        <Stack>
          <form onSubmit={onsubmitHandler}>
            <div style={{ width: '1200px' }}>
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
                  <TH align="right">PNR 번호</TH>
                  <TD>
                    <TextField
                      placeholder="검색어를 입력하세요."
                      id="pnrNum"
                      value={searchInfo.pnrNum}
                      onChange={onSearchChangeHandler}
                    />
                  </TD>
                </TR>
              </HorizontalTable>
            </div>

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

      <Typography variant="h6">조회결과 {mobileData.length}</Typography>
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={mobileColumn} rows={mobileData} />
      </Stack>
      <Pagination />
      <Typography variant="h6">마스터 {mobMasterData.length}</Typography>
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={mobMasterColumn} rows={mobMasterData} />
      </Stack>
      <Pagination />
    </div>
  );
}
