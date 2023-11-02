import { useState } from 'react';
import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography,Modal,Checkbox } from '@components/ui'


const SelfFeatureModal = () => {

  // 임의 팝업 테이블 데이터
  const columns = [
    { headerName: '단계', field: 'column1', colSpan: 2 },
    { headerName: '결재자', field: 'column2', colSpan: 4 },
    { headerName: '상태', field: 'column3', colSpan: 2 },
    { headerName: '일시', field: 'column4', colSpan: 3 },
    { headerName: '의견', field: 'column5', colSpan: 4 },
  ];
  const columnsType2 = [
    { headerName: '이름', field: 'column1', colSpan: 3 },
    { headerName: '이메일', field: 'column2', colSpan: 3 },
    { headerName: '소속팀명', field: 'column3', colSpan: 3 },
  ];
  const popupTableData = [
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
      column4: '9999-99-99 99:99:99',
      column5: '의견 123 의견 123',
    },
  ];
  const popupTableData2 = [
    {
      column1: '김김김',
      column2: 'test@testemail.com',
      column3: '데이터 기획팀',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
    },
    {
      column1: '1차',
      column2: '김길동',
      column3: '처리',
    },

  ];
  // 변환식 팝업 1 state
  const [isOpenPopup01, setIsOpenPopup01] = useState(false);
  // 변환식 팝업 1 state
  // 변환식 팝업 1 state
  const [isOpenPopup02, setIsOpenPopup02] = useState(false);
  // 변환식 팝업 1 state
  // 변환식 팝업 1 state
  const [isOpenPopup03, setIsOpenPopup03] = useState(false);
  // 변환식 팝업 1 state
  // 변환식 팝업 1 state
  const [isOpenPopup04, setIsOpenPopup04] = useState(false);
  // 변환식 팝업 1 state

  // 승인정보 팝업 state
  const [isOpenPopup05, setIsOpenPopup05] = useState(false);
  function closePopup5() {
    setIsOpenPopup05(false);
    setIsOpenPopup06('rightPopup openFalse');
  }
  // 승인정보 팝업 state
  // 결제자 추가 state
  const [isOpenPopup06, setIsOpenPopup06] = useState('rightPopup openFalse');
  // 결제자 추가 state
  function openPopup6() {
    setIsOpenPopup06('rightPopup openTrue');
  }
  function closePopup6() {
    setIsOpenPopup06('rightPopup openFalse');
  }
  return (
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
    <Stack gap="SM">
          {/* 변환식 팝업 1 */}
          <Button priority="Primary" appearance="Contained" size="LG" onClick={() => setIsOpenPopup01(true)}>
            변환식 팝업 1
          </Button>
          <Modal open={isOpenPopup01} onClose={() => setIsOpenPopup01(false)} size="SM">
            <Modal.Header>변환식</Modal.Header>
            <Modal.Body className="width-100">
              <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                  <TR>
                    <TH colSpan={1} align="right">
                      변환식
                    </TH>
                    <TD colSpan={2}>
                      <Stack gap="SM" className="width-100">
                        <TextField className="width-100" />
                      </Stack>
                    </TD>
                  </TR>
                </HorizontalTable>
                <HorizontalTable className="width-100 bdtb">
                  <TR>
                    <TH colSpan={1} align="right">
                      함수
                    </TH>
                    <TD colSpan={2}>
                      <Select appearance="Outline" placeholder="함수 선택" className="width-100">
                        <SelectOption value={1}>테스트</SelectOption>
                      </Select>
                    </TD>
                  </TR>
                </HorizontalTable>
              </Stack>
            </Modal.Body>
            <Modal.Footer>
              <Button priority="Normal" appearance="Outline" size="LG">
                초기화
              </Button>
              <Button priority="Primary" appearance="Contained" size="LG">
                적용
              </Button>
              <Button onClick={() => setIsOpenPopup01(false)} priority="Normal" appearance="Outline" size="LG">
                취소
              </Button>
            </Modal.Footer>
          </Modal>
          {/* 변환식 팝업 1 end */}
          {/* 변환식 팝업 2 */}
          <Button priority="Primary" appearance="Contained" size="LG" onClick={() => setIsOpenPopup02(true)}>
            변환식 팝업 2
          </Button>
          <Modal open={isOpenPopup02} onClose={() => setIsOpenPopup02(false)} size="SM">
            <Modal.Header>변환식</Modal.Header>
            <Modal.Body className="width-100">
              <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                  <TR>
                    <TH colSpan={1} align="right">
                      변환식
                    </TH>
                    <TD colSpan={2}>
                      <Stack gap="SM" className="width-100">
                        <TextField className="width-100" />
                      </Stack>
                    </TD>
                  </TR>
                </HorizontalTable>
                <HorizontalTable className="width-100 bdtb">
                  <TR>
                    <TH colSpan={1} align="right">
                      함수
                    </TH>
                    <TD colSpan={2}>
                      <Select appearance="Outline" placeholder="함수 선택" className="width-100">
                        <SelectOption value={1}>테스트</SelectOption>
                      </Select>
                    </TD>
                  </TR>
                  <TR>
                    <TH colSpan={1} align="right">
                      변수 1
                    </TH>
                    <TD colSpan={2}>
                      <Select appearance="Outline" placeholder="단위 선택" className="width-100">
                        <SelectOption value={1}>테스트</SelectOption>
                      </Select>
                    </TD>
                  </TR>
                  <TR>
                    <TH colSpan={1} align="right">
                      변수 2
                    </TH>
                    <TD colSpan={2} align="left">
                      <Stack gap="MD" className="width-100">
                        <Checkbox label="Calendar" />
                        <Select appearance="Outline" placeholder="시작일시 선택" className="width-100">
                          <SelectOption value={1}>테스트</SelectOption>
                        </Select>
                      </Stack>
                    </TD>
                  </TR>
                  <TR>
                    <TH colSpan={1} align="right">
                      변수 3
                    </TH>
                    <TD colSpan={2} align="left">
                      <Stack gap="MD" className="width-100">
                        <Checkbox label="Calendar" />
                        <Select appearance="Outline" placeholder="종료일시 선택" className="width-100">
                          <SelectOption value={1}>테스트</SelectOption>
                        </Select>
                      </Stack>
                    </TD>
                  </TR>
                </HorizontalTable>
              </Stack>
            </Modal.Body>
            <Modal.Footer>
              <Button priority="Normal" appearance="Outline" size="LG">
                초기화
              </Button>
              <Button priority="Primary" appearance="Contained" size="LG">
                적용
              </Button>
              <Button onClick={() => setIsOpenPopup02(false)} priority="Normal" appearance="Outline" size="LG">
                취소
              </Button>
            </Modal.Footer>
          </Modal>
          {/* 변환식 팝업 2 end */}
          {/* 변환식 팝업 3 */}
          <Button priority="Primary" appearance="Contained" size="LG" onClick={() => setIsOpenPopup03(true)}>
            변환식 팝업 3
          </Button>
          <Modal open={isOpenPopup03} onClose={() => setIsOpenPopup03(false)} size="SM">
            <Modal.Header>변환식</Modal.Header>
            <Modal.Body className="width-100">
              <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                  <TR>
                    <TH colSpan={1} align="right">
                      변환식
                    </TH>
                    <TD colSpan={2}>
                      <Stack gap="SM" className="width-100">
                        <TextField className="width-100" />
                      </Stack>
                    </TD>
                  </TR>
                </HorizontalTable>
                <HorizontalTable className="width-100 bdtb">
                  <TR>
                    <TH colSpan={1} align="right">
                      함수
                    </TH>
                    <TD colSpan={2}>
                      <Select appearance="Outline" placeholder="함수 선택" className="width-100">
                        <SelectOption value={1}>테스트</SelectOption>
                      </Select>
                    </TD>
                  </TR>
                  <TR>
                    <TH colSpan={1} align="right">
                      대체값
                    </TH>
                    <TD colSpan={2}>
                      <Stack gap="SM" className="width-100">
                        <TextField className="width-100" />
                      </Stack>
                    </TD>
                  </TR>
                </HorizontalTable>
              </Stack>
            </Modal.Body>
            <Modal.Footer>
              <Button priority="Normal" appearance="Outline" size="LG">
                초기화
              </Button>
              <Button priority="Primary" appearance="Contained" size="LG">
                적용
              </Button>
              <Button onClick={() => setIsOpenPopup03(false)} priority="Normal" appearance="Outline" size="LG">
                취소
              </Button>
            </Modal.Footer>
          </Modal>
          {/* 변환식 팝업 3 end */}

          {/* 변환식 팝업 4 */}
          <Button priority="Primary" appearance="Contained" size="LG" onClick={() => setIsOpenPopup04(true)}>
            변환식 팝업 4
          </Button>
          <Modal open={isOpenPopup04} onClose={() => setIsOpenPopup04(false)} size="SM">
            <Modal.Header>변환식</Modal.Header>
            <Modal.Body className="width-100">
              <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                  <TR>
                    <TH colSpan={1} align="right">
                      변환식
                    </TH>
                    <TD colSpan={2}>
                      <Stack gap="SM" className="width-100">
                        <TextField className="width-100" />
                      </Stack>
                    </TD>
                  </TR>
                </HorizontalTable>
                <HorizontalTable className="width-100 bdtb">
                  <TR>
                    <TH colSpan={1} align="right">
                      함수
                    </TH>
                    <TD colSpan={2}>
                      <Select appearance="Outline" placeholder="함수 선택" className="width-100">
                        <SelectOption value={1}>테스트</SelectOption>
                      </Select>
                    </TD>
                  </TR>
                  <TR>
                    <TH colSpan={1} align="right">
                      대체값
                    </TH>
                    <TD colSpan={2}>
                      <Stack gap="SM" className="width-100">
                        <TextField className="width-100" />
                      </Stack>
                    </TD>
                  </TR>
                </HorizontalTable>
              </Stack>
            </Modal.Body>
            <Modal.Footer>
              <Button priority="Normal" appearance="Outline" size="LG">
                초기화
              </Button>
              <Button priority="Primary" appearance="Contained" size="LG">
                적용
              </Button>
              <Button onClick={() => setIsOpenPopup04(false)} priority="Normal" appearance="Outline" size="LG">
                취소
              </Button>
            </Modal.Footer>
          </Modal>
          {/* 변환식 팝업 4 end */}
          {/* 승인요청 팝업 */}
          <Button priority="Primary" appearance="Contained" size="LG" onClick={() => setIsOpenPopup05(true)}>
            승인요청 팝업
          </Button>
          <Modal open={isOpenPopup05} onClose={closePopup5} size="MD" >
            <Stack className="width-100" style={{ position: 'relative' }} alignItems="Start">
              {/* 승인 정보 */}
              <div className="width-100">
                <Modal.Header>승인 정보</Modal.Header>
                <Modal.Body className="width-100" style={{maxHeight:"60vh"}}>
                  <Stack direction="Vertical" className="width-100" gap="MD">
                    <HorizontalTable className="width-100">
                      <TR>
                        <TH colSpan={1} align="right">
                          승인 번호
                        </TH>
                        <TD colSpan={2}>
                          <TextField className="width-100" readOnly value="TD-1234" />
                        </TD>
                        <TH colSpan={1} align="right">
                          요청자
                        </TH>
                        <TD colSpan={2}>
                          <TextField className="width-100" readOnly value="김아무개" />
                        </TD>
                      </TR>
                      <TR>
                        <TH colSpan={1} align="right">
                          승인 유형
                        </TH>
                        <TD colSpan={2}>
                          <TextField className="width-100" readOnly value="ruleDesign" />
                        </TD>
                        <TH colSpan={1} align="right">
                          승인 상태
                        </TH>
                        <TD colSpan={2}>
                          <TextField className="width-100" readOnly value="승인중" />
                        </TD>
                      </TR>
                      <TR>
                        <TH colSpan={1} align="right">
                          요청 일시
                        </TH>
                        <TD colSpan={5.01}>
                          <TextField className="width-100" readOnly value="2023-05-24 10:11:42" />
                        </TD>
                      </TR>
                      <TR>
                        <TH colSpan={1} align="right">
                          승인 제목
                        </TH>
                        <TD colSpan={5.01}>
                          <TextField className="width-100" />
                        </TD>
                      </TR>
                      <TR>
                        <TH colSpan={1} align="right">
                          승인 내용
                        </TH>
                        <TD colSpan={5.01}>
                          <TextField className="width-100" multiline />
                        </TD>
                      </TR>
                    </HorizontalTable>
                    <Stack justifyContent="Between" className="width-100">
                      <Typography variant="h4">결재선</Typography>
                      <Stack gap="SM">
                        <Button onClick={openPopup6}>추가</Button>
                        <Button>삭제</Button>
                      </Stack>
                    </Stack>
                    <VerticalTable
                      columns={columns}
                      rows={popupTableData}
                      enableSort={false}
                      clickable={true}
                      rowSelection={() => {}}
                    />
                  </Stack>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={closePopup5} priority="Normal" appearance="Outline" size="LG">
                    요청 취소
                  </Button>
                  <Button priority="Primary" appearance="Contained" size="LG">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.79502 15.8749L4.62502 11.7049L3.20502 13.1149L8.79502 18.7049L20.795 6.70492L19.385 5.29492L8.79502 15.8749Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                    저장
                  </Button>
                  <Button priority="Normal" appearance="Outline" size="LG">
                    승인 요청
                  </Button>
                </Modal.Footer>
              </div>
              {/* 승인 정보 */}

              {/* 결재자 추가 */}
              <div className={isOpenPopup06}>
                <div className="popupTop">
                  결재자 추가
                  <Button
                    onClick={closePopup6}
                    shape="Square"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="true"
                    aria-controls="radix-:r18:"
                    data-state="open"
                    className="sc-hZDyAQ hrrooe"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </Button>
                </div>
                <Modal.Body style={{maxHeight:"60vh"}}>
                  <Stack direction="Vertical" gap="SM">
                    <HorizontalTable className="width-100">
                      <TR>
                        <TH colSpan={1} align="right">
                          이름
                        </TH>
                        <TD colSpan={2}>
                          <TextField className="width-100" />
                        </TD>
                      </TR>
                      <TR>
                        <TH colSpan={1} align="right">
                          이메일
                        </TH>
                        <TD colSpan={2}>
                          <TextField className="width-100" />
                        </TD>
                      </TR>
                    </HorizontalTable>
                    <Stack justifyContent="End">
                      <Button type="submit" priority="Primary" appearance="Contained" size="MD">
                        <span className="searchIcon"></span>
                        조회
                      </Button>
                    </Stack>
                    <Stack justifyContent="End">
                      <Select appearance="Outline" size="MD" defaultValue={1}>
                        <SelectOption value={1}>전체</SelectOption>
                      </Select>
                    </Stack>
                    <VerticalTable
                      columns={columnsType2}
                      rows={popupTableData2}
                      enableSort={false}
                      clickable={true}
                      rowSelection={() => {}}
                    />
                  </Stack>
                </Modal.Body>
              </div>
              {/* 결재자 추가 */}
            </Stack>
          </Modal>
          {/* 승인요청 팝업 end */}
        </Stack>
    </Stack>
  )
}
export default SelfFeatureModal;