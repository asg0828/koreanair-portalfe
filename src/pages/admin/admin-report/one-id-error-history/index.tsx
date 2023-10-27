import VerticalTable from '@/components/table/VerticalTable';
import { Button, DatePicker, Pagination, Stack, TD, TH, TR, TextField, Radio } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { errLogColumn, errLogData } from '../one-id-main/data';

export default function OneIdErrorHistory() {
  const [errCode, setErrCode] = useState('');
  const [errCodeDtl, setErrCodeDtl] = useState('');
  const [channelCode, setChannelCode] = useState('');
  const [pnrNum, setPnrNum] = useState('');
  const [uciid, setUciid] = useState('');
  const [skypassNum, setSkypassNum] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const today = new Date();

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

  //라디오 클릭시 값, input 초기화 함수
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

  // 검색 버튼
  function onSearch() {
    const formData = new FormData();

    formData.append('endDate', endDate);
    formData.append('startDate', startDate);
    formData.append('errCode', errCode);
    formData.append('errCodeDtl', errCodeDtl);
    formData.append('pnrNum', pnrNum);
    formData.append('uciid', uciid);

    // for (const x of formData.entries()) {
    //   console.log(x);
    // }
  }

  // 초기화 버튼
  function onClear() {
    setStartDate('');
    setEndDate('');
    setChannelCode('');
    setErrCode('');
    setErrCodeDtl('');
    setPnrNum('');
    setUciid('');
    setSkypassNum('');
  }

  // 기간 별 버튼
  function duration(flag: string) {
    let date = '';
    if (flag == 'today') {
      date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      setEndDate(date);
    } else if (flag == 'oneMonth') {
      date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    } else if (flag == 'sixMonth') {
      date = `${today.getFullYear()}-${today.getMonth() - 5}-${today.getDate()}`;
    } else if (flag == 'oneYear') {
      date = `${today.getFullYear() - 1}-${today.getMonth() + 1}-${today.getDate()}`;
    }
    setStartDate(date);
  }

  return (
    <div style={{ width: '1200px' }}>
      {/* <Accordion align="Right" size="MD" type="multiple"> */}
      <div>
        {/* <AccordionItem value={''} title={undefined} children={undefined}> */}
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
                <Radio name="channelCode" label="전체" onClick={(e) => radioVal(e)} value="total" defaultChecked />
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
        {/* </AccordionItem> */}
      </div>

      <Typography variant="h6">조회결과 {errLogData.length}</Typography>
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={errLogColumn} rows={errLogData} />
      </Stack>
      <Pagination />
      {/* </Accordion> */}
    </div>
  );
}
