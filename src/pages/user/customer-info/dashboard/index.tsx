import { useCustomerInfo } from '@/hooks/queries/useCustomerInfoQueires';
import { Profile } from '@/models/customer-info/CustomerInfo';
import { htmlTagReg } from '@/utils/RegularExpression';
import { Button, Modal, Select, Stack, TextField, Typography, useToast, SelectOption } from '@components/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { analysisResultData, contributeData, homepageData } from './data';
import { SelectValue } from '@mui/base/useSelect';

export default function List() {
  useEffect(() => {
    console.log('컴포넌트가 마운트되었습니다.');
    return () => {
      console.log('컴포넌트가 언마운트되었습니다.');
    };
  }, []);

  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  const batchDate = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

  const [profile, setProfile] = useState<Profile>();
  const [rows, setRows] = useState<Array<any>>([]);
  const [searchInfo, setSearchInfo] = useState<any>({ skypassNum: '', oneId: '' });
  const [skypassList, setSkypassList] = useState<Array<any>>([]);
  const intervalId = useRef<number | NodeJS.Timer | null>(null);
  const { refetch, data: response, isError } = useCustomerInfo(searchInfo);
  const { toast } = useToast();

  const validation = () => {
    let searchError = false;
    if (
      searchInfo.skypassNum.replace(htmlTagReg, '').trim() === '' &&
      searchInfo.oneId.replace(htmlTagReg, '').trim() === ''
    ) {
      setOpen(true);
      searchError = true;
    }
    return searchError;
  };

  // 등록가족 상세 모달 오픈 버튼
  const retrieveFamilyInfo = () => {
    setOpenFamilyInfo(true);
  };

  const handleSearch = useCallback(() => {
    // 유효성 검사 실패 시 종료
    const validation = () => {
      let searchError = false;
      if (
        searchInfo.skypassNum.replace(htmlTagReg, '').trim() === '' &&
        searchInfo.oneId.replace(htmlTagReg, '').trim() === ''
      ) {
        setOpen(true);
        searchError = true;
      }
      return searchError;
    };

    if (validation()) return;

    refetch();

    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
    }

    intervalId.current = setInterval(() => {
      refetch();
    }, 5000);
  }, [refetch, searchInfo, validation]);

  // style > 배경색 변경
  useEffect(() => {
    const bodyElement: HTMLElement | null = document.getElementById('body');
    if (bodyElement) {
      bodyElement.style.backgroundColor = '#f8f9fc';
      return () => {
        bodyElement.style.backgroundColor = '';
      };
    }
  }, []);

  //검색 조건 모달 state
  const [isOpen, setOpen] = useState(false);

  // 등록가족 상세 버튼 모달 state
  const [isOpenFamilyInfo, setOpenFamilyInfo] = useState(false);

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearInterval(intervalId.current as number);
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  };

  const [isListView1, setIsListView1] = useState(false);
  const [isListView2, setIsListView2] = useState(false);
  const [isListView3, setIsListView3] = useState(false);

  // 클릭 더보기 리스트 교체 함수
  const listClickChange = (flag: string) => {
    // 눌렀을때 -> LIST에 값이 들어감                                                       -> STATE변화 (열어줘야됨)
    // LIST에 값이 있는 상태로 누르면(다시 누르면) -> LIST가 비워짐      -> STATE변화(닫아줘야됨)
    // LIST에 값이 있는 상태로 다른걸 누르면 -> LIST가 다른걸로 채워짐  -> STATE변화(다른걸 열어줘야됨/ 열어주되 LIST를 갈아끼워줘야됨 )
    // LIST를 STATE로 관리하고 값을 넣었다 뺐다 하면서 USEeFFECT로 열고 닫고 해주면 될거같은데 -> 값이 변화하면 무조건 LIST가 열리게 값 변화가 없으면 닫기
  };

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    //setSearchInfo({ ...searchInfo, [`${id}`]: value });
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습1니다.',
      });
    } else {
      if (response?.data) {
        // response.data.contents.forEach(() => {});
        console.log(response);
        // setRows(response.data.contents);
      }
    }
  }, [response, isError, toast]);

  return (
    <Stack direction="Vertical" justifyContent="Start" className={'width-100'} wrap={true}>
      {/* searchBar 영역 */}
      <Stack>
        <div className="componentWrapper" style={{ width: '100%' }}>
          <TextField
            id="skypassNum"
            value={searchInfo.skypassNum}
            appearance="Outline"
            placeholder="Skypass Number"
            size="LG"
            textAlign="left"
            onChange={onchangeInputHandler}
            autoFocus
          />
        </div>
        <div className="componentWrapper" style={{ width: '100%' }}>
          <TextField
            value={searchInfo.oneId}
            id="oneId"
            appearance="Outline"
            placeholder="One ID NO."
            size="LG"
            textAlign="left"
            onChange={onchangeInputHandler}
          />
        </div>

        <Button priority="Primary" appearance="Contained" size="LG" onClick={handleSearch}>
          검색
        </Button>
        <Modal open={isOpen} onClose={() => setOpen(false)}>
          <Modal.Header>오류</Modal.Header>
          <Modal.Body>검색 조건을 입력해주세요</Modal.Body>
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
      {/* searchBar 영역 */}
      <div className="dashBoardWrap">
        <Stack direction="Vertical">
          <Stack style={{ position: 'relative' }}>
            <Typography variant="h3" className="dashboardTitle">
              Customer Info.
            </Typography>
            <h5 style={{ position: 'absolute', right: 10, bottom: 0, color: 'gray' }}>업데이트 날짜 : {batchDate}</h5>
          </Stack>
          <div className="topCard">
            <div className="dashBoardBox n1">
              <div className="name">
                홍길동
                <span className="en">gildong hong</span>
              </div>
              <div className="profile">
                <div className="top">
                  Profile
                  <div className="kr">프로파일</div>
                </div>
                <div className="item">
                  <div className="key">생년월일</div>
                  <div className="value">1920-01-01</div>
                </div>
                <div className="item">
                  <div className="key">만나이</div>
                  <div className="value">35</div>
                </div>
                <div className="item">
                  <div className="key">성별</div>
                  <div className="value">남</div>
                </div>
                <div className="item">
                  <div className="key">자택번호</div>
                  <div className="value">02-123-4124</div>
                </div>
                <div className="item">
                  <div className="key">휴대폰번호</div>
                  <div className="value">010-0101-0101</div>
                </div>
                <div className="item">
                  <div className="key">이메일</div>
                  <div className="value">exemail.exe</div>
                </div>
              </div>
            </div>
            <div className="dashBoardBox n2">
              <div className="top" style={{ position: 'relative' }}>
                SKYPASS
                <div className="kr">스카이패스</div>
                {isListView1 && (
                  <Select
                    appearance="Outline"
                    placeholder="스카이패스선택"
                    style={{ maxHeight: '80%', position: 'absolute', right: 0, fontSize: '80%', bottom: 2 }}
                    value={searchInfo.oneidChgRsnCd}
                    onChange={(
                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                      value: SelectValue<{}, false>
                    ) => {
                      onchangeSelectHandler(e, value, 'skypassSelect');
                    }}
                  >
                    {/* {skypassList.map((item, index) => (
                    <SelectOption key={index} value={item.value} style={{ maxHeight: '70%', fontSize: '70%'}}>
                      {item.text}
                    </SelectOption> 
                  ))} */}
                  </Select>
                )}
              </div>
              <div className="item">
                <div className="key">회원번호</div>
                <div className="value">1235213421532</div>
              </div>
              <div className="item">
                <div className="key">회원등급</div>
                <div className="value">GOLD</div>
              </div>
              <div className="item">
                <div className="key">휴면여부</div>
                <div className="value">None</div>
              </div>
              <div className="item">
                <div className="key">현등급최초시작일</div>
                <div className="value">2000-00-00</div>
              </div>
              <div className="item">
                <div className="key">잔여 마일리지</div>
                <div className="value">5,555</div>
              </div>
              <div className="item">
                <div className="key">소멸예정 마일리지</div>
                <div className="value">1,222</div>
              </div>
              <div className="item">
                <div className="key">등급유지조건(마일리지+횟수+기간)</div>
                <div className="value">0</div>
              </div>
              <div className="item">
                <div className="key">승급조건(마일리지+횟수)</div>
                <div className="value">000</div>
              </div>
            </div>
            <div className="dashBoardBox n3">
              <div className="top" style={{ position: 'relative' }}>
                Family Member
                <div className="kr">가족</div>
                <Button
                  priority="Normal"
                  appearance="Contained"
                  style={{ position: 'absolute', right: 0 }}
                  onClick={retrieveFamilyInfo}
                >
                  등록가족 상세
                </Button>
                <Modal open={isOpenFamilyInfo} onClose={() => setOpenFamilyInfo(false)}>
                  <Modal.Header>등록가족 상세 페이지</Modal.Header>
                  <Modal.Body>등록가족 상세 페이지</Modal.Body>
                  <Modal.Footer>
                    <Button
                      priority="Primary"
                      appearance="Contained"
                      onClick={() => {
                        setOpenFamilyInfo(false);
                      }}
                    >
                      확인
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
              <div className="middle">
                <div className="left">
                  등록가족
                  <span className="num">999</span>명
                </div>
                <div className="right">
                  합산가능마일리지
                  <span className="num">9,999,999</span>
                </div>
              </div>
              <div className="list">
                <table>
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="40%" />
                  </colgroup>
                  <thead>
                    <th>Relationship</th>
                    <th>Code</th>
                    <th>Name</th>
                  </thead>
                  <tbody>
                    {/*여기서 맵으로 상위 데이터 5개 뽑아주고 */}
                    <tr>
                      <td>path1</td>
                      <td>024</td>
                      <td>SunSin LEE</td>
                    </tr>
                    <tr>
                      <td>path1</td>
                      <td>024</td>
                      <td>SunSin LEE</td>
                    </tr>
                    <tr>
                      <td>path1</td>
                      <td>024</td>
                      <td>SunSin LEE</td>
                    </tr>
                    <tr>
                      <td>path1</td>
                      <td>024</td>
                      <td>SunSin LEE</td>
                    </tr>
                    <tr>
                      <td>path1</td>
                      <td>024</td>
                      <td>SunSin LEE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Typography variant="h3" className="dashboardTitle">
            Customer Reference.
          </Typography>
          <Stack className="width-100" gap="LG" alignItems="Start">
            <div className="dashBoardBox under width-50">
              <div className="top">
                MY Trips
                <div className="kr">여행</div>
              </div>
              <div className="itemWrap">
                <div className="item middle">
                  <Stack justifyContent="Between">
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView1(!isListView1);
                        }}
                      >
                        PNR
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">2</span>개
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView1(!isListView1);
                        }}
                      >
                        E-TKT
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">2</span>개
                    </div>
                  </Stack>
                </div>
              </div>
              {isListView1 && (
                <div className="hideContents">
                  <table>
                    <colgroup>
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Current PNR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            {/* left */}
                            <Stack gap="MD">
                              <div>64G000</div>
                              <div>Gil-Dong Hong</div>
                            </Stack>
                            {/* left end */}

                            {/* right */}
                            <div>
                              <Stack gap="MD">
                                <div>KE0092</div>
                                <div>A</div>
                                <div>125412</div>
                                <div>hhl1</div>
                              </Stack>
                              <Stack gap="MD">
                                <div>KE0092</div>
                                <div>A</div>
                                <div>125412</div>
                                <div>hhl1</div>
                              </Stack>
                              <Stack gap="MD">
                                <div>KE0092</div>
                                <div>A</div>
                                <div>125412</div>
                                <div>hhl1</div>
                              </Stack>
                            </div>
                            {/* right end */}
                          </Stack>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="button"
                className={'viewMore ' + (isListView1 ? 'true' : 'false')}
                onClick={() => {
                  setIsListView1(!isListView1);
                }}
              >
                {isListView1 ? '숨기기' : '더보기'}
              </button>
            </div>
            <Stack className="width-50" gap="LG">
              <div className="dashBoardBox under width-50">
                <div className="top">
                  Wallet
                  <div className="kr">지갑</div>
                </div>
                <div className="itemWrap">
                  <div className="item large">
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">보유쿠폰</div>
                      <div className="value">
                        <span className="num">2</span>개
                      </div>
                    </Stack>
                  </div>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">유효프로모션쿠폰</div>
                    <div className="value">
                      <span className="num">2</span>개
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">전자우대할인권</div>
                    <div className="value">
                      <span className="num">2</span>개
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">전자우대할인권</div>
                    <div className="value">
                      <span className="num">2</span>개
                    </div>
                  </Stack>
                </div>
              </div>
              <div className="dashBoardBox under width-50">
                <div className="top">
                  Preference
                  <div className="kr">선호도</div>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">최다 탑승 좌석</div>
                    <div className="value">Window</div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">선호 기내식</div>
                    <div className="value">한식</div>
                  </Stack>
                </div>
              </div>
            </Stack>
          </Stack>
          <Typography variant="h3" className="dashboardTitle">
            Customer History.
          </Typography>
          <Stack className="width-100" gap="LG" alignItems="Start">
            <div className="dashBoardBox under width-50">
              <div className="top">
                Boarding history
                <div className="kr">탑승 이력</div>
              </div>
              <div className="itemWrap">
                <div className="item middle">
                  <Stack justifyContent="Between">
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView2(!isListView2);
                        }}
                      >
                        탑승횟수
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">942</span>회
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView2(!isListView2);
                        }}
                      >
                        Pet 동반횟수
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">2</span>개
                    </div>
                  </Stack>
                </div>
              </div>
              {isListView2 && (
                <div className="hideContents">
                  <table>
                    <colgroup>
                      <col width="70%" />
                      <col width="30%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Itinerary Details</th>
                        <th>Ticket No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            <Stack gap="MD">
                              <div>64G000</div>
                              <div>Y</div>
                              <div>64G000</div>
                              <div>64G000</div>
                              <div>Gil-Dong Hong</div>
                            </Stack>
                          </Stack>
                        </td>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            <Stack gap="MD">
                              <div>1802414158807</div>
                            </Stack>
                          </Stack>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            <Stack gap="MD">
                              <div>64G000</div>
                              <div>Y</div>
                              <div>64G000</div>
                              <div>64G000</div>
                              <div>Gil-Dong Hong</div>
                            </Stack>
                          </Stack>
                        </td>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            <Stack gap="MD">
                              <div>1802414158807</div>
                            </Stack>
                          </Stack>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            <Stack gap="MD">
                              <div>64G000</div>
                              <div>Y</div>
                              <div>64G000</div>
                              <div>64G000</div>
                              <div>Gil-Dong Hong</div>
                            </Stack>
                          </Stack>
                        </td>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            <Stack gap="MD">
                              <div>1802414158807</div>
                            </Stack>
                          </Stack>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="button"
                className={'viewMore ' + (isListView2 ? 'true' : 'false')}
                onClick={() => {
                  setIsListView2(!isListView2);
                }}
              >
                {isListView2 ? '숨기기' : '더보기'}
              </button>
            </div>
            <div className="dashBoardBox under width-50">
              <div className="top">
                communication records
                {/* <div className="kr">
                  여행
                </div> */}
              </div>
              <div className="itemWrap">
                <Stack justifyContent="Between" gap="LG">
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(!isListView3);
                          }}
                        >
                          통화
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">2</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(!isListView3);
                          }}
                        >
                          인터넷
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">2</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(!isListView3);
                          }}
                        >
                          VOC
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">2</span>
                      </div>
                    </Stack>
                  </div>
                </Stack>
                <Stack justifyContent="Between" gap="LG">
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(!isListView3);
                          }}
                        >
                          SMS
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">2</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(!isListView3);
                          }}
                        >
                          E-mail
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">2</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(!isListView3);
                          }}
                        >
                          SNS
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">2</span>
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </div>
              {isListView3 && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="25%" />
                      <col width="25%" />
                      <col width="25%" />
                      <col width="25%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>발송일</th>
                        <th>휴대폰번호</th>
                        <th>발송상태</th>
                        <th>내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jan 12, 2023</td>
                        <td>010-0000-0000</td>
                        <td>OOOO</td>
                        <td>
                          <a href="" className="link">
                            보기
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="button"
                className={'viewMore ' + (isListView3 ? 'true' : 'false')}
                onClick={() => {
                  setIsListView3(!isListView3);
                }}
              >
                {isListView3 ? '숨기기' : '더보기'}
              </button>
            </div>
          </Stack>
        </Stack>
      </div>

      {/* <Stack direction="Horizontal" gap="XL" justifyContent="Start" className={'width-100'} wrap={true}>
        <Stack direction="Horizontal">
          <ProfileComp />
          <div style={{ marginLeft: '13px' }}>
            <Stack direction="Vertical">
              <Stack direction="Horizontal">
                <DetailDataComp init={hmpData} compName={'homepage'}></DetailDataComp>
                <DetailDataComp init={ctrbuteData} compName={'contribution'}></DetailDataComp>
              </Stack>
              <PnrTicketNumber></PnrTicketNumber>
              <Stack>
                <TableDataComp column={pnrTickerColumn} row={pnrData} flag={'voc'}></TableDataComp>
                <TableDataComp column={pnrTickerColumn} row={pnrData} flag={'cart'}></TableDataComp>
              </Stack>
            </Stack>
          </div>
        </Stack>
        <Stack direction="Vertical">
          <DetailDataComp init={analResultData} compName={'analysisResult'}></DetailDataComp>
          <AnalysisIndex />
        </Stack>
      </Stack>
      <div style={{ marginTop: 20 }}>
        <Contact></Contact>
      </div> */}
    </Stack>
  );
}
