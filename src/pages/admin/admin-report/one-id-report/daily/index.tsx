import VerticalTable from '@/components/table/VerticalTable';
import { Button, Pagination, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn, reason } from '../../one-id-main/data';
import { SelectValue } from '@mui/base/useSelect';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';
import { dailySearch } from '@/models/oneId/OneIdInfo';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(1개)
export default function Daily() {
  const [searchInfo, setSearchInfo] = useState<dailySearch>({
    oneIdNum: '',
    searchCri: 'one',
    oneIdChgReason: '',
  });
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

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: value });
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

  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({ ...searchInfo, oneIdNum: '', searchCri: 'one', oneIdChgReason: '' });
  }

  /* radio 입력 함수 */
  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  };

  return (
    <div>
      <form onSubmit={onsubmitHandler}>
        <Stack>
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
            </HorizontalTable>
            <div style={{ marginLeft: 1080 }}>
              <Stack>
                <Button type="submit">검색</Button>
                <Button type="reset" onClick={onClear}>
                  초기화
                </Button>
              </Stack>
            </div>
          </div>
        </Stack>
      </form>
      <Typography variant="h6">마스터 {onIdPaxData.length}</Typography>
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={oneIdPaxColumn} rows={onIdPaxData} />
      </Stack>
      <Pagination />
    </div>
  );
}
