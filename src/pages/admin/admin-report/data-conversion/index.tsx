import HorizontalTable from '@/components/table/HorizontalTable';
import { useConversionCleansingHash, useConversionMetaphone } from '@/hooks/queries/useOneIdQueries';
import { ConversionCleansingHashSearch, ConversionMetaphoneSearch } from '@/models/oneId/OneIdInfo';
import { useToast, Button, Stack, TD, TH, TR, Typography } from '@ke-design/components';
import { TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

export default function DataConversion() {
  const [searchInfo, setSearchInfo] = useState<ConversionCleansingHashSearch>({
    inptPhone: '',
    inptEmail: '',
  });
  const [searchInfo2, setSearchInfo2] = useState<ConversionMetaphoneSearch>({
    bfConvertDoubleMetaphone: '',
  });

  /* 변환된 값 */
  const [phoneNumCR, setPhoneNumCR] = useState('');
  const [eMailCR, setEmailCR] = useState('');
  const [phoneNumHash, setPhoneNumHash] = useState('');
  const [eMailHash, setEmailHash] = useState('');
  const [afConvertDoubleMetaphone, setAfConvertDoubleMetaphone] = useState('');

  const { refetch: refetch1, data: response1, isError: isError1 } = useConversionCleansingHash(searchInfo);
  const { refetch: refetch2, data: response2, isError: isError2 } = useConversionMetaphone(searchInfo2);
  const { toast } = useToast();

  // refetch1
  const handleSearch1 = useCallback(() => {
    if (Object.values({ ...searchInfo }).every((value) => value === '')) {
      alert('값을 입력하세요');
    } else {
      refetch1();
    }
  }, [refetch1]);

  // refetch2
  const handleSearch2 = useCallback(() => {
    if (Object.values({ ...searchInfo2 }).every((value) => value === '')) {
      alert('값을 입력하세요');
    } else {
      refetch2();
    }
  }, [refetch2]);

  /* input state관리1 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    if (id === 'inptPhone' || id === 'inptEmail') setSearchInfo({ ...searchInfo, [id]: value });
    else {
      setSearchInfo2({ ...searchInfo2, [id]: value });
    }
  }

  // master 정보 useEffect
  useEffect(() => {
    if (isError1 || response1?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response1?.data) {
      }
    }
  }, [response1, isError1, toast]);

  // history 정보 useEffect
  useEffect(() => {
    if (isError2 || response2?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response2?.data) {
        setAfConvertDoubleMetaphone(response2.data.contents);
      }
    }
  }, [response2, isError2, toast]);

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
                      onChange={onSearchChangeHandler}
                      size="small"
                      style={{ border: 'none' }}
                    />
                    <TextField
                      placeholder="검색어를 입력하세요."
                      onChange={onSearchChangeHandler}
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
              <Button appearance="Outline" priority="Normal" shape="Square" size="LG" onClick={handleSearch1}>
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
                name="bfConvertDoubleMetaphone"
                id="bfConvertDoubleMetaphone"
                placeholder="검색어를 입력하세요."
                value={searchInfo2.bfConvertDoubleMetaphone}
                onChange={onSearchChangeHandler}
              />
            </TD>
            <TD>
              <Button appearance="Outline" priority="Normal" shape="Square" size="LG" onClick={handleSearch2}>
                변환
              </Button>
            </TD>
            <TH>Double Metaphone 변환 결과</TH>
            <TD>{afConvertDoubleMetaphone}</TD>
          </TR>
        </HorizontalTable>
      </Stack>
    </Stack>
  );
}
