import HorizontalTable from '@/components/table/HorizontalTable';
import { useConversionCleansingHash, useConversionMetaphone } from '@/hooks/queries/useOneIdQueries';
import { ConversionCleansingHashSearch, ConversionMetaphoneSearch } from '@/models/oneId/OneIdInfo';
import { useToast, Button, Stack, TD, TH, TR, Typography, Modal, TextField } from '@ke-design/components';
import { useCallback, useEffect, useState } from 'react';

export default function DataConversion() {
  const [searchInfo, setSearchInfo] = useState<ConversionCleansingHashSearch>({
    inptPhone: '',
    inptEmail: '',
  });
  const [searchInfo2, setSearchInfo2] = useState<ConversionMetaphoneSearch>({
    bfConvertDoubleMetaphone: '',
  });
  const [isOpen, setOpen] = useState(false);
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
  const handleSearch1 = () => {
    if (Object.values({ ...searchInfo }).every((value) => value === '' || value === ' ')) {
      setOpen(true);
    } else {
      if(searchInfo.inptEmail === '' && searchInfo.inptPhone !== '') {setSearchInfo({...searchInfo, inptEmail: ' '})
      searchFetch()
    } else if (searchInfo.inptPhone === '' && searchInfo.inptEmail !== ''){ setSearchInfo({...searchInfo, inptPhone: ' '})}
      searchFetch()
    }
  };

  const searchFetch = () => {
    refetch1();
  }

  // refetch2
  const handleSearch2 = () => {
    if (Object.values({ ...searchInfo2 }).every((value) => value === '')) {
      setOpen(true);
    } else {
      refetch2();
    }
  };

  /* input state관리1 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    if (id === 'inptPhone' && searchInfo.inptEmail === ''){
      setSearchInfo({ inptEmail: ' ', [id]: value });
    }else if(id === 'inptPhone' && searchInfo.inptEmail !== ''){
      setSearchInfo({ ...searchInfo, [id]: value });
    } else if(id === 'inptEmail' && searchInfo.inptPhone === ''){
      setSearchInfo({ inptPhone: ' ', [id]: value });
    } else if(id === 'inptEmail' && searchInfo.inptPhone !== ''){
      setSearchInfo({ ...searchInfo, [id]: value });
    } else {
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
        setEmailCR(response1.data.emailCleansingResult);
        setEmailHash(response1.data.emailHashValue);
        setPhoneNumCR(response1.data.phoneCleansingResult);
        setPhoneNumHash(response1.data.phoneHashValue);
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
        setAfConvertDoubleMetaphone(response2.data);
      }
    }
  }, [response2, isError2, toast]);

  return (
    <Stack direction="Vertical">
      <Stack direction="Vertical">
        <Typography variant="h4">1. CleansingRule / Hash 변환 결과</Typography>
        <HorizontalTable>
          <TR>
            <Stack direction="Vertical" style={{ borderRight: '1px solid #DADADA' }}>
              <TH style={{ height: '50%' }}>
                <TR style={{ border: 'none' }}>
                  <Stack direction="Vertical">
                    <TH style={{ border: 'none' }}>휴대전화번호</TH>
                    <TH style={{ border: 'none' }}>E-mail주소</TH>
                  </Stack>
                </TR>
              </TH>
            </Stack>

            <Stack direction="Vertical">
              <TD style={{ height: '50%', borderRight: 'none' }}>
                <TR style={{ border: 'none' }}>
                  <Stack direction="Vertical" style={{ minHeight: '50%', border: 'none' }}>
                    <div className="componentWrapper" style={{ width: '100%' }}>
                      <TextField
                        id="inptPhone"
                        placeholder="검색어를 입력하세요."
                        onChange={onSearchChangeHandler}
                        size="LG"
                        style={{ marginBottom: '2px' }}

                      />

                      <TextField
                        id="inptEmail"
                        placeholder="검색어를 입력하세요."
                        onChange={onSearchChangeHandler}
                        size="LG"
       
                      />
                    </div>
                  </Stack>
                </TR>
              </TD>
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

            <TD className="verticalTableTD" style={{ borderLeft: '0.1px solid #F5F5F5 ', minWidth: '40%' }}>
              <Stack direction="Vertical">
                <TD className="verticalTableTD" style={{ border: 'none' }}>
                  {phoneNumCR}
                </TD>
                <TD className="verticalTableTD" style={{ border: 'none' }}>
                  {phoneNumHash}
                </TD>
                <TD className="verticalTableTD" style={{ border: 'none' }}>
                  {eMailCR}
                </TD>
                <TD className="verticalTableTD" style={{ border: 'none' }}>
                  {eMailHash}
                </TD>
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
              <div className="componentWrapper" style={{ width: '100%' }}>
                <TextField
                  name="bfConvertDoubleMetaphone"
                  id="bfConvertDoubleMetaphone"
                  placeholder="검색어를 입력하세요."
                  value={searchInfo2.bfConvertDoubleMetaphone}
                  onChange={onSearchChangeHandler}
                  size="LG"
                />
              </div>
            </TD>
            <TD>
              <Button appearance="Outline" priority="Normal" shape="Square" size="LG" onClick={handleSearch2}>
                변환
              </Button>
            </TD>
            <TH>Double Metaphone 변환 결과</TH>
            <TD style={{ width: '40%' }}>{afConvertDoubleMetaphone}</TD>
          </TR>
        </HorizontalTable>
        <Modal open={isOpen} onClose={() => setOpen(false)}>
          <Modal.Header>오류</Modal.Header>
          <Modal.Body>값을 입력하세요.</Modal.Body>
          <Modal.Footer>
            <Button
              priority="Primary"
              appearance="Contained"
              onClick={() => {
                setOpen(false);
              }}
            >
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </Stack>
    </Stack>
  );
}
