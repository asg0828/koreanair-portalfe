import VerticalTable from '@/components/table/VerticalTable';
import { Button, Pagination, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField } from '@ke-design/components';
import { useState } from 'react';
import { Typography, radioClasses } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn, reason } from '../../one-id-main/data';
import { SelectValue } from '@mui/base/useSelect';

export default function Daily() {
  // 셀렉트박스 > 선택된 value값
  const [value, setValue] = useState('');

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

    // OneId 번호
    formData.append('oneIdNum', oneIdNum);
    // OneID 변경 이유 코드
    formData.append('reason', value);
    // 조회기준

    // formData.append('criterion',  );
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
    <div style={{ width: '1200px' }}>
      <div>
        <Typography variant="h4">OneID Daily Report</Typography>
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
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    {
                      onSearchChangeHandler(e, 'reason');
                      setValue(String(value));
                    }
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
                <Radio name="criterion" label="History단건" value="1" />
                <Radio name="criterion" label="해당History전체" value="2" />
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
