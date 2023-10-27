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

    if (flag == 'phoneNum') {
      setPhoneNumCR(search);
      setPhoneNumHash(search);
    } else if (flag == 'eMail') {
      setEmailCR(search);
      setEmailHash(search);
    } else if (flag == 'fullName') {
      setFullNameCR(search);
    }
  }

  return (
    <Stack direction="Vertical">
      <Stack direction="Vertical">
        <Typography variant="h4">1. CleansingRule / Hash 변환 결과</Typography>
        <HorizontalTable>
          <TR>
            <Stack direction="Vertical">
              <TH>
                <TR>
                  <Stack direction="Vertical">
                    <TH>휴대전화번호</TH>
                    <TH>E-mail주소</TH>
                  </Stack>
                </TR>
              </TH>
              <TD></TD>
              <TD></TD>
            </Stack>

            <Stack direction="Vertical">
              <TD>
                <TR>
                  <Stack direction="Vertical">
                    <TextField
                      placeholder="검색어를 입력하세요."
                      onChange={(e) => onSearchChangeHandler(e, 'phoneNum')}
                      size="small"
                    />
                    <TextField
                      placeholder="검색어를 입력하세요."
                      onChange={(e) => onSearchChangeHandler(e, 'eMail')}
                      size="small"
                    />
                  </Stack>
                </TR>
              </TD>
              <TD></TD>
              <TD></TD>
            </Stack>

            <TD>
              <Button
                appearance="Outline"
                priority="Normal"
                shape="Square"
                size="MD"
                onClick={() => {
                  convert(phoneNum, 'phoneNum');
                  convert(eMail, 'eMail');
                }}
              >
                변환
              </Button>
            </TD>

            <TH>
              <Stack direction="Vertical">
                <TH>
                  <TR>
                    <Stack direction="Vertical">
                      <TH>전화번호</TH>
                      <TH>E-mail주소</TH>
                    </Stack>
                  </TR>
                </TH>
              </Stack>
            </TH>

            <TH>
              <Stack direction="Vertical">
                <TH>
                  <TR>
                    <Stack direction="Vertical">
                      <TH>Cleansing Rule</TH>
                      <TH>Hash값</TH>
                    </Stack>
                  </TR>
                </TH>

                <TH>
                  <TR>
                    <Stack direction="Vertical">
                      <TH>Cleansing Rule</TH>
                      <TH>Hash값</TH>
                    </Stack>
                  </TR>
                </TH>
              </Stack>
            </TH>

            <TD>
              <Stack direction="Vertical">
                <TD>{phoneNumCR}</TD>
                <TD>{phoneNumHash}</TD>
                <TD>{eMailCR}</TD>
                <TD>{eMailHash}</TD>
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
                size="MD"
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
