import VerticalTable from '@/components/table/VerticalTable';
import { Button, DatePicker, Pagination, Radio, Stack, TD, TH, TR } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn } from '../../one-id-main/data';

export default function SamePnrUcild() {
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
        <Stack>
          <HorizontalTable></HorizontalTable>
        </Stack>
        <div style={{ marginLeft: 1080 }}>
          <Stack>
            <Button onClick={onSearch}>검색</Button>
            {/* <Button onClick={onClear}>초기화</Button> */}
          </Stack>
        </div>
      </div>
      <Typography variant="h6">조회 결과 {onIdPaxData.length}</Typography>
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={oneIdPaxColumn} rows={onIdPaxData} />
      </Stack>
      <Pagination />
    </div>
  );
}
