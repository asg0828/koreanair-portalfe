import VerticalTable from '@/components/table/VerticalTable';
import { Button, DatePicker, Pagination, Radio, Stack, TD, TH, TR } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn } from '../../one-id-main/data';

export default function Ctivoc() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [oneIdNum, setOneIdNum] = useState('');
  const [pnrNum, setPnrNum] = useState('');
  const [uciid, setUciid] = useState('');

  const today = new Date();

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
        <Typography variant="h4">OneID CTI/VOC Report</Typography>
        <Stack>
          <HorizontalTable>
            <TR>
              <div style={{ width: 200 }}>
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
              <div style={{ width: 200 }}>
                <TH align="right">조회기준</TH>
              </div>
              <TD>
                <Radio name="criterion" label="History단건" value="" />
                <Radio name="criterion" label="해당History전체" value="" />
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
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={oneIdPaxColumn} rows={onIdPaxData} />
      </Stack>
      <Pagination />
    </div>
  );
}
