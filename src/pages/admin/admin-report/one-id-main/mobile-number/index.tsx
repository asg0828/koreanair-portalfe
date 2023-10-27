import VerticalTable from '@/components/table/VerticalTable';
import { Button, Pagination, Stack, TD, TH, TR, TextField } from '@ke-design/components';
import { useState } from 'react';
import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { mobMasterColumn, mobMasterData, mobileColumn, mobileData } from '../data';

export default function MobileNumber() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [oneIdNum, setOneIdNum] = useState('');
  const [pnrNum, setPnrNum] = useState('');
  const [uciid, setUciid] = useState('');

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

  return (
    <div>
      <div>
        <Stack>
          <div style={{ width: '1200px' }}>
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
                <TH align="right">PNR 번호</TH>
                <TD>
                  <TextField
                    placeholder="검색어를 입력하세요."
                    value={pnrNum}
                    onChange={(e) => onSearchChangeHandler(e, 'pnrNum')}
                  />
                </TD>
              </TR>
            </HorizontalTable>
          </div>
        </Stack>
        <div style={{ marginLeft: 1080 }}>
          <Stack>
            <Button onClick={onSearch}>검색</Button>
            <Button onClick={onClear}>초기화</Button>
          </Stack>
        </div>
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
