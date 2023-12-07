import { FamilyMember, Skypass } from '@/models/model/CustomerInfoModel';
import { Stack, Typography, SelectOption, Select, Button, Modal } from '@ke-design/components';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import CloseIcon from '@mui/icons-material/Close';
import { familyMemberData, skypassData1 } from '../../customer-info/dashboard/data';
export default function DashBoardPopUp({ closeModal }: any) {
  const [isListView1, setIsListView1] = useState(false);
  const [isListView2, setIsListView2] = useState(false);
  const [isListView3, setIsListView3] = useState(false);
  const [skypass, setSkypass] = useState<Array<Skypass>>(skypassData1);
  const [family, setFamily] = useState<FamilyMember>(familyMemberData[0]);
  const [selectedSkypass, setSelectedSkypass] = useState<any>([]);
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  const batchDate = `${yesterday.getFullYear()}-${(`0` + yesterday.getMonth() + 2).slice(-2)}-${(
    `0` + yesterday.getDate()
  ).slice(-2)}`;
  const [searchInfo, setSearchInfo] = useState<any>({ skypassNum: '', oneId: '' });

  // 등록가족 상세 버튼 모달 state
  const [isOpenFamilyInfo, setOpenFamilyInfo] = useState(false);

  // 등록가족 상세 모달 오픈 버튼
  const retrieveFamilyInfo = () => {
    setOpenFamilyInfo(true);
  };

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: value });
    if (value === '112423935550') {
      setFamily(familyMemberData[0]);
      setSelectedSkypass(skypass[0]);
    } else if (value === '112345789375') {
      setFamily(familyMemberData[1]);
      setSelectedSkypass(skypass[1]);
    } else if (value === '112617209394') {
      setFamily(familyMemberData[2]);
      setSelectedSkypass(skypass[2]);
    }
  };

  useEffect(() => {
    setSelectedSkypass(skypass[0]);
  }, [skypass]);

  return (
    <Stack direction="Vertical" justifyContent="Start" className={'width-100'} wrap={true}>
      <div className="dashBoardWrap">
        <Stack direction="Vertical">
          <Stack style={{ position: 'relative' }}>
            <CloseIcon onClick={closeModal} style={{ position: 'absolute', right: '10px', top: '-2px' }}>
              CloseIcon
            </CloseIcon>
            <Typography variant="h3" className="dashboardTitle">
              Customer Info.
            </Typography>
            <h5 style={{ position: 'absolute', right: 10, bottom: 0, color: 'gray' }}>업데이트 날짜 : {batchDate}</h5>
          </Stack>
          <div className="topCard">
            <div className="dashBoardBox n1">
              <div className="name">
                <span className="kr">홍길동</span>
                <span className="en">gildong hong</span>
              </div>
              <div className="profile">
                <div className="top">
                  Profile
                  <div className="kr">프로파일</div>
                </div>
                <div className="item">
                  <div className="key">생년월일</div>
                  <div className="value">1939-10-07</div>
                </div>
                <div className="item">
                  <div className="key">만나이</div>
                  <div className="value">84</div>
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
                {skypass && skypass.length > 0 && (
                  <Select
                    id="skypassSelect"
                    defaultValue={skypass.length > 0 ? skypass[0].skypassNum : ''}
                    appearance="Outline"
                    placeholder="스카이패스선택"
                    style={{ maxHeight: '80%', position: 'absolute', right: 0, fontSize: '80%', bottom: 2 }}
                    value={searchInfo.skypassSelect}
                    onChange={(
                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                      value: SelectValue<{}, false>
                    ) => {
                      onchangeSelectHandler(e, value, 'skypassSelect');
                    }}
                  >
                    {skypass.map((item: any, index: number) => (
                      <SelectOption key={index} value={item.skypassNum} style={{ maxHeight: '70%', fontSize: '13px' }}>
                        {item.skypassNum}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </div>
              <div className="item">
                <div className="key">회원번호</div>
                <div className="value">{selectedSkypass?.skypassNum}</div>
              </div>
              <div className="item">
                <div className="key">회원등급</div>
                <div className="value">{selectedSkypass?.skypassGrade}</div>
              </div>
              <div className="item">
                <div className="key">휴면여부</div>
                <div className="value">{selectedSkypass?.useYn}</div>
              </div>
              <div className="item">
                <div className="key">현등급최초시작일</div>
                <div className="value">{selectedSkypass?.gradeStartDate}</div>
              </div>
              <div className="item">
                <div className="key">잔여 마일리지</div>
                <div className="value">{selectedSkypass?.mileage}</div>
              </div>
              <div className="item">
                <div className="key">소멸예정 마일리지</div>
                <div className="value">{selectedSkypass?.expireMileage}</div>
              </div>
              <div className="item">
                <div className="key">등급유지조건(마일리지+횟수+기간)</div>
                <div className="value">{selectedSkypass?.gradeCondtion}</div>
              </div>
              <div className="item">
                <div className="key">승급조건(마일리지+횟수)</div>
                <div className="value">{selectedSkypass?.upgradeCondition}</div>
              </div>
            </div>
            <div className="dashBoardBox n3">
              <div className="top" style={{ position: 'relative' }}>
                Family Member
                <div className="kr">가족</div>
                <Button
                  priority="Normal"
                  appearance="Contained"
                  style={{ position: 'absolute', right: 0, maxHeight: '80%', fontSize: '80%', bottom: 2 }}
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
                  <span className="num">{family?.familyCnt}</span>명
                </div>
                <div className="right">
                  합산가능마일리지
                  <span className="num">{family?.mergeMileage}</span>
                </div>
              </div>
              <div className="list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
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
                    {family &&
                      family.familyList.length > 0 &&
                      family.familyList.map((list, index) => (
                        <tr>
                          <td>{list.relationship}</td>
                          <td>{list.code}</td>
                          <td>{list.name}</td>
                        </tr>
                      ))}
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
                          setIsListView1(true);
                        }}
                      >
                        PNR
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">1</span>개
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView1(true);
                        }}
                      >
                        E-TKT
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">1</span>개
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
                    <div className="key">항공권할인쿠폰보유여부</div>
                    <div className="value">
                      <span className="num">Y</span>
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
                    <div className="value"></div>
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
                          setIsListView2(true);
                        }}
                      >
                        탑승횟수
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">2</span>회
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView2(true);
                        }}
                      >
                        Pet 동반횟수
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">1</span>회
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
                            setIsListView3(true);
                          }}
                        >
                          통화
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">1</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(true);
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
                            setIsListView3(true);
                          }}
                        >
                          VOC
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">3</span>
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
                            setIsListView3(true);
                          }}
                        >
                          SMS
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">5</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(true);
                          }}
                        >
                          E-mail
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">1</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3(true);
                          }}
                        >
                          SNS
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">6</span>
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
                        <td>발송완료</td>
                        <td></td>
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
          <Button
            priority="Primary"
            appearance="Contained"
            style={{ width: '100px', height: '40px', left: '520px', marginTop: '50px' }}
            onClick={closeModal}
          >
            확인
          </Button>
        </Stack>
      </div>
    </Stack>
  );
}
