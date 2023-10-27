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
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn, reason } from '../data';

export default function MasterHistory() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [oneIdNum, setOneIdNum] = useState('');
  const [pnrNum, setPnrNum] = useState('');
  const [uciid, setUciid] = useState('');

  const today = new Date();

  function onSearchChangeHandler(e: any, target: string) {
    let currVal = e.target.value;
    if (target === 'oneId') {
      setOneIdNum(currVal);
    } else if (target === 'pnrNum') {
      setPnrNum(currVal);
    } else if (target === 'uciid') {
      setUciid(currVal);
    }
  }

  // 검색 버튼
  function onSearch() {
    const formData = new FormData();

    formData.append('endDate', endDate);
    formData.append('startDate', startDate);
    formData.append('oneIdNum', oneIdNum);
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
    setOneIdNum('');
    setPnrNum('');
    setUciid('');
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
      <div>
        <Stack>
          <HorizontalTable>
            <TR>
              <TH align="right">OneId 번호</TH>
              <TD>
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="검색어를 입력하세요."
                  value={oneIdNum}
                />
              </TD>
              <TH align="right">OneID변경이유코드</TH>
              <TD>
                <Select
                  appearance="Outline"
                  placeholder="전체"
                  onChange={(e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null) => {
                    onSearchChangeHandler(e, 'reason');
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
                <Radio name="criterion" label="History단건" value="" />
                <Radio name="criterion" label="해당History전체" value="" />
              </TD>
            </TR>

            <TR>
              <TH align="right">한글이름</TH>
              <TD>
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="성을 입력하세요."
                  value={oneIdNum}
                />
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="이름을 입력하세요."
                  value={oneIdNum}
                />
              </TD>
            </TR>

            <TR>
              <TH align="right">영문이름</TH>
              <TD>
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="성을 입력하세요."
                  value={oneIdNum}
                />
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="이름을 입력하세요."
                  value={oneIdNum}
                />
              </TD>
              <TH align="right">휴대전화번호</TH>
              <TD>
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="01011112222"
                  value={oneIdNum}
                />
              </TD>
            </TR>

            <TR>
              <TH align="right">일반전화번호</TH>
              <TD>
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="성을 입력하세요."
                  value={oneIdNum}
                />
              </TD>
              <TH align="right">E-mail주소</TH>
              <TD>
                <TextField
                  onChange={(e) => onSearchChangeHandler(e, 'oneId')}
                  placeholder="이름을 입력하세요.1"
                  value={oneIdNum}
                />
              </TD>
              <TH align="right">출생일자</TH>
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
