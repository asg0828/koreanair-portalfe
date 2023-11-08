import VerticalTable from '@/components/table/VerticalTable';
import { Button, DatePicker, Pagination, Stack, TD, TH, TR, TextField, Radio } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { errLogColumn, errLogData } from '../one-id-main/data';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(1개)
export default function OneIdErrorHistory() {
  /* 검색 조건 */
  const [errCode, setErrCode] = useState('');
  const [errCodeDtl, setErrCodeDtl] = useState('');
  const [channelCode, setChannelCode] = useState('');
  const [pnrNum, setPnrNum] = useState('');
  const [uciid, setUciid] = useState('');
  const [skypassNum, setSkypassNum] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const today = new Date();

  /* 검색조건 input 입력 함수 */
  function onSearchChangeHandler(e: any, target: string) {
    let currVal = e.target.value;
    if (target === 'errCode') {
      setErrCode(currVal);
    } else if (target === 'errCodeDtl') {
      setErrCodeDtl(currVal);
    } else if (target === 'pnrNum') {
      setPnrNum(currVal);
    } else if (target === 'uciid') {
      setUciid(currVal);
    } else if (target === 'skypassNum') {
      setSkypassNum(currVal);
    }
  }

  /* 라디오 클릭시 값, input 초기화 함수 */
  function radioVal(e: any) {
    let currVal = e.target.value;

    // 채널코드 변경 시 입력값 초기화
    if (currVal !== channelCode) {
      setPnrNum('');
      setSkypassNum('');
      setUciid('');
    }
    setChannelCode(currVal);
  }

  /* 검색 버튼 */
  function onSearch() {
    retrieveErrorHistory();
  }

  /* api 호출 */
  const retrieveErrorHistory = async () => {
    let config = cloneDeep(initConfig);
    config.isLoarding = true;
    let request = cloneDeep(initApiRequest);
    request.method = Method.GET;
    request.url = '';
    request.service = Service.KAL_BE;
    request.params = {
      bodyParams: {
        errCode: errCode,
        errCodeDtl: errCodeDtl,
        pnrNum: pnrNum,
        channelCode: channelCode,
        uciid: uciid,
        skypassNum: skypassNum,
        startDate: startDate,
        endDate: endDate,
      },
    };
    let response = cloneDeep(initCommonResponse);
    response = await callApi(request);

    console.log(request.params);
    console.log('[retrieve360] Response :: ', response);
  };

  /* 초기화 버튼 */
  function onClear() {
    setStartDate('');
    setEndDate('');
    setChannelCode('');
    setErrCode('');
    setErrCodeDtl('');
    setPnrNum('');
    setUciid('');
    setSkypassNum('');
    setChannelCode('');
  }

  /* 기간 별 버튼 */
  function duration(flag: string) {
    let date = '';
    if (flag === 'today') {
      date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      setEndDate(date);
    } else if (flag === 'oneMonth') {
      date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate() - 1}`;
    } else if (flag === 'sixMonth') {
      date = `${today.getFullYear()}-${today.getMonth() - 5}-${today.getDate() - 1}`;
    } else if (flag === 'oneYear') {
      date = `${today.getFullYear() - 1}-${today.getMonth() + 1}-${today.getDate() - 1}`;
    }
    setStartDate(date);
  }

  return (
    <div style={{ width: '1200px' }}>
      <div>
        <Stack>
          <HorizontalTable>
            <TR>
              <TH align="right">에러코드</TH>
              <TD>
                <TextField
                  placeholder="검색어를 입력하세요."
                  value={errCode}
                  onChange={(e) => onSearchChangeHandler(e, 'errCode')}
                />
              </TD>
              <TH align="right">상세에러코드</TH>
              <TD>
                <TextField
                  placeholder="검색어를 입력하세요."
                  value={errCodeDtl}
                  onChange={(e) => onSearchChangeHandler(e, 'errCodeDtl')}
                />
              </TD>
            </TR>

            <TR>
              <TH align="right">OneID등록Channel코드</TH>
              <TD>
                <Radio
                  name="channelCode"
                  label="전체"
                  checked={channelCode === ''}
                  onClick={(e) => radioVal(e)}
                  value="total"
                  defaultChecked
                />
                <Radio name="channelCode" label="ODS" onClick={(e) => radioVal(e)} value="ods" />
                <Radio name="channelCode" label="SKYPASS" onClick={(e) => radioVal(e)} value="skypass" />
              </TD>
              <TH align="right">PNR번호</TH>
              <TD>
                <TextField
                  name="pnrNum"
                  placeholder="검색어를 입력하세요."
                  value={pnrNum}
                  disabled={channelCode === 'ods' ? false : true}
                  onChange={(e) => onSearchChangeHandler(e, 'pnrNum')}
                />
              </TD>
              <TH align="right">UCIID</TH>
              <TD>
                <TextField
                  placeholder="검색어를 입력하세요."
                  value={uciid}
                  disabled={channelCode === 'ods' ? false : true}
                  onChange={(e) => onSearchChangeHandler(e, 'uciid')}
                />
              </TD>
              <TH align="right">Skypass회원번호</TH>
              <TD>
                <TextField
                  placeholder="검색어를 입력하세요."
                  value={skypassNum}
                  disabled={channelCode === 'skypass' ? false : true}
                  onChange={(e) => onSearchChangeHandler(e, 'skypassNum')}
                />
              </TD>
            </TR>

            <TR>
              <div style={{ width: 500 }}>
                <TH align="right">최초 생성일</TH>
              </div>
              <TD>
                <DatePicker
                  value={startDate}
                  appearance="Outline"
                  calendarViewMode="days"
                  mode="single"
                  shape="Square"
                  size="MD"
                  onValueChange={(nextVal) => {
                    setStartDate(nextVal);
                  }}
                />
                -
                <DatePicker
                  value={endDate}
                  appearance="Outline"
                  calendarViewMode="days"
                  mode="single"
                  shape="Square"
                  size="MD"
                  onValueChange={(nextVal) => {
                    setEndDate(nextVal);
                  }}
                />
                <Button onClick={() => duration('today')}>당일</Button>
                <Button onClick={() => duration('oneMonth')}>1개월</Button>
                <Button onClick={() => duration('sixMonth')}>6개월</Button>
                <Button onClick={() => duration('oneYear')}>1년</Button>
              </TD>
            </TR>
          </HorizontalTable>
        </Stack>
        <div style={{ marginLeft: 1080 }}>
          <Stack>
            <Button onClick={onSearch}>검색</Button>
            <Button onClick={onClear}>초기화</Button>
          </Stack>
        </div>
      </div>

      <Typography variant="h6">조회결과 {errLogData.length}</Typography>
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={errLogColumn} rows={errLogData} />
      </Stack>
      <Pagination />
    </div>
  );
}
