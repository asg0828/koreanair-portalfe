import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, Typography } from '@ke-design/components';
import { TextField } from '@mui/material';
import { useState } from 'react';

export default function DataConversion() {
  const [phoneNum, setPhoneNum] = useState('');
  const [eMail, setEMail] = useState('');
  const [fullName, setFullName] = useState('');

  const [phoneNumCR, setPhoneNumCR] = useState('');
  const [eMailCR, setEmailCR] = useState('');
  const [phoneNumHash, setPhoneNumHash] = useState('');
  const [eMailHash, setEmailHash] = useState('');
  const [fullNameCR, setFullNameCR] = useState('');

  function onSearchChangeHandler(e: any, target: string) {
    let currVal = e.target.value;
    if (target === 'fullName') {
      setFullName(currVal);
    } else if (target === 'eMail') {
      setEMail(currVal);
    } else if (target === 'phoneNum') {
      setPhoneNum(currVal);
    }
  }

  // 해쉬값 변환 버튼
  function convert(search: string, flag: string) {
    // 변환 로직 (api든 함수든)

    if (flag === 'phoneNum') {
      setPhoneNumCR(search);
      setPhoneNumHash(search);
    } else if (flag === 'eMail') {
      setEmailCR(search);
      setEmailHash(search);
    } else if (flag === 'fullName') {
      setFullNameCR(search);
    }
  }

  return (
    <Stack direction="Vertical">
      <Stack direction="Vertical">
        <Typography variant="h4">1. CleansingRule / Hash 변환 결과</Typography>
        <HorizontalTable>
          <TR>
            <Stack direction="Vertical" style={{ borderLeft: '1px solid #DADADA' }}>
              <TH style={{ borderBottom: '1px solid #DADADA', height: '50%' }}>
                <TR style={{ border: 'none' }}>
                  <Stack direction="Vertical">
                    <TH style={{ border: 'none' }}>휴대전화번호</TH>
                    <TH style={{ border: 'none' }}>E-mail주소</TH>
                  </Stack>
                </TR>
              </TH>
              <TD style={{ height: '25%', border: 'none' }}></TD>
              <TD style={{ height: '25%', border: 'none' }}></TD>
            </Stack>

            <Stack direction="Vertical" style={{ borderLeft: '1px solid #DADADA' }}>
              <TD style={{ borderBottom: '1px solid #DADADA', height: '50%', borderRight: 'none' }}>
                <TR style={{ border: 'none' }}>
                  <Stack direction="Vertical" style={{ border: 'none' }}>
                    <TextField
                      placeholder="검색어를 입력하세요."
                      onChange={(e) => onSearchChangeHandler(e, 'phoneNum')}
                      size="small"
                      style={{ border: 'none' }}
                    />
                    <TextField
                      placeholder="검색어를 입력하세요."
                      onChange={(e) => onSearchChangeHandler(e, 'eMail')}
                      size="small"
                      style={{ border: 'none' }}
                    />
                  </Stack>
                </TR>
              </TD>
              <TD style={{ height: '25%', border: 'none' }}></TD>
              <TD style={{ height: '25%', border: 'none' }}></TD>
            </Stack>

            <TD style={{ borderLeft: '1px solid #DADADA' }}>
              <Button
                appearance="Outline"
                priority="Normal"
                shape="Square"
                size="LG"
                onClick={() => {
                  convert(phoneNum, 'phoneNum');
                  convert(eMail, 'eMail');
                }}
              >
                변환
              </Button>
            </TD>

            <TH style={{ borderLeft: '0.1px solid #F5F5F5' }}>
              <Stack direction="Vertical">
                <TH>
                  <Stack direction="Vertical">
                    <TR style={{ border: 'none', height: '50%' }}>
                      <Stack direction="Vertical">
                        <TH style={{ border: 'none', marginBottom: '30px' }}>전화번호</TH>
                        <TH style={{ border: 'none' }}>E-mail주소</TH>
                      </Stack>
                    </TR>
                  </Stack>
                </TH>
              </Stack>
            </TH>

            <TH style={{ borderLeft: '0.1px solid #F5F5F5 ' }}>
              <Stack direction="Vertical">
                <TH style={{ border: 'none' }}>
                  <TR style={{ border: 'none' }}>
                    <Stack direction="Vertical">
                      <TH style={{ border: 'none' }}>Cleansing Rule</TH>
                      <TH style={{ border: 'none' }}>Hash값</TH>
                    </Stack>
                  </TR>
                </TH>

                <TH>
                  <TR style={{ border: 'none' }}>
                    <Stack direction="Vertical">
                      <TH style={{ border: 'none' }}>Cleansing Rule</TH>
                      <TH style={{ border: 'none' }}>Hash값</TH>
                    </Stack>
                  </TR>
                </TH>
              </Stack>
            </TH>

            <TD style={{ borderLeft: '0.1px solid #F5F5F5 ' }}>
              <Stack direction="Vertical">
                <TD style={{ border: 'none' }}>{phoneNumCR}</TD>
                <TD style={{ border: 'none' }}>{phoneNumHash}</TD>
                <TD style={{ border: 'none' }}>{eMailCR}</TD>
                <TD style={{ border: 'none' }}>{eMailHash}</TD>
              </Stack>
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical">
        <Typography variant="h4">2. Double Metaphone</Typography>
        <HorizontalTable>
          <TR>
            <TH>영문 이름 + 성</TH>
            <TD>
              <TextField
                name="fullName"
                placeholder="검색어를 입력하세요."
                value={fullName}
                onChange={(e) => onSearchChangeHandler(e, 'fullName')}
              />
            </TD>
            <TD>
              <Button
                appearance="Outline"
                priority="Normal"
                shape="Square"
                size="LG"
                onClick={() => convert(fullName, 'fullName')}
              >
                변환
              </Button>
            </TD>
            <TH>Double Metaphone 변환 결과</TH>
            <TD>{fullNameCR}</TD>
          </TR>
        </HorizontalTable>
      </Stack>
    </Stack>
  );
}
