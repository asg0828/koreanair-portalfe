import { htmlTagReg } from '@/utils/RegularExpression';
import NoResult from '@/components/emptyState/NoData';
import { Button, Modal, Select, Stack, TextField, Typography, useToast, SelectOption, Loader, TR, TD, THead, TH, Table, Label } from '@components/ui';
import { useEffect, useRef, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import {
  familyColumn,
  initFamily,
  initProfile, initSearchInfoC, initSkypass,
} from '../dashboard/data';
import {
  Profile,
  Skypass,
  Wallet,
  Preference,
  Cnt,
  Pnr,
  Etkt,
  BoardingList,
  Voc,
  Internet,
  Call,
  Sms,
  Sns,
  Email,
  ProfileList,
  FamilyMembers,
} from '@/models/model/CustomerInfoModel';
import { selectCLevelModal, setCLevelModal } from '@/reducers/menuSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useProfile, useProfileCLevel, useSkypass } from '@/hooks/queries/useCustomerInfoQueires';
import Close from '@mui/icons-material/Close';
import { ValidType, menuIconSx } from '@/models/common/Constants';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash'

export default function List() {
  /* 수집기준시간 */
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  const batchDate = `${yesterday.getFullYear()}-${(`0` + (yesterday.getMonth() + 1)).slice(-2)}-${(
    `0` + yesterday.getDate()
  ).slice(-2)}`;

  // skypass 조회용 변수 (searchType: B 만 검색가능)
  const [skypassNmSearch, setSkypassNmSearch] = useState<any>({
    searchType: '',
    skypassMemberNumber: ''
  })
  /* 프로필 */
  const [profile, setProfile] = useState<Profile>(initProfile);
  /* 검색 결과가 많은 경우 모달에 뿌려줄 리스트(화면 우측 파란 < 버튼) */
  const [profileList, setProfileList] = useState<Array<ProfileList>>([]);
  /* 검색 조건 */
  const [searchInfo, setSearchInfo] = useState<any>(initSearchInfoC);
  // profile 조회 api
  const { refetch: refetchProfile, data: responseProfile, isError: isErrorProfile } = useProfile(skypassNmSearch);
  // profileList 조회(CLevel) api
  const { refetch: refetchProfileCLvl, data: responseProfileCLvl, isError: isErrorProfileCLvl, isFetching: isFetchingCLvl} = useProfileCLevel(searchInfo);
  // skypass 조회 api
  const { refetch: refetchSkypass, data: responseSkypass, isError: isErrorSkypass, isFetching: isFetchingSkypass} = useSkypass(skypassNmSearch.skypassMemberNumber);
  const [key, setKey] = useState(Date.now());
  const [modalText, setModalText] = useState<any>([])
  const [skypass, setSkypass] = useState<Array<Skypass>>([]);
  const [family, setFamily] = useState<Array<FamilyMembers>>([]);
  const [wallet, setWallet] = useState<Wallet>();
  const [preference, setPreference] = useState<Preference>();
  const [cnt, setCnt] = useState<Cnt>();
  const [pnr, setPnr] = useState<Array<Pnr>>([]);
  const [etkt, setEtkt] = useState<Array<Etkt>>([]);
  const [boardingLists, setBoardingLists] = useState<Array<BoardingList>>([]);
  const [calls, setCalls] = useState<Array<Call>>([]);
  const [vocs, setVocs] = useState<Array<Voc>>([]);
  const [internets, setInternets] = useState<Array<Internet>>([]);
  const [smss, setSmss] = useState<Array<Sms>>([]);
  const [snss, setSnss] = useState<Array<Sns>>([]);
  const [emails, setEmails] = useState<Array<Email>>([]);
  const [rows, setRows] = useState<Array<any>>([]);
  
  const [selectedSkypass, setSelectedSkypass] = useState<Skypass>(initSkypass);
  const intervalId = useRef<number | NodeJS.Timer | null>(null);
  const { toast } = useToast();
  
  // CLevel용 검색 state
  const [searchText, setSearchText] = useState<any>();

  // CLevel용 검색 하이라이트 효과 함수 
  const searchHighlight = (text: any, search: any) => {
    const regex = new RegExp(`(${search})`, 'gi');
    return text.split(regex).map((part: any, index: number) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // CLevel용 팝업 검색창 onChange 함수 
  const onchangeModalInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchText(value);
  };

  // 등록가족 상세 모달 오픈 버튼
  const retrieveFamilyInfo = () => {
    setOpenFamilyInfo(true);
  };
 
  // 스카이패스 마일리지 모달 오픈 버튼
  const retrieveMileDtl = () => {
    setOpenMileDtl(true)
  }
  /* 검색 버튼 */
  const handleSearch =() => {

    // 유효성 검사 실패 시 종료
    const validation = () => {

      let searchError = false;
      if (
        skypassNmSearch.skypassMemberNumber?.replace(htmlTagReg, '').trim() === '' &&
        searchInfo.mobilePhoneNumber?.replace(htmlTagReg, '').trim() === '' &&
        (searchInfo.engFname?.replace(htmlTagReg, '').trim() === '' && searchInfo.engLname?.replace(htmlTagReg, '').trim() === '') && 
        (searchInfo.korFname?.replace(htmlTagReg, '').trim() === '' && searchInfo.korLname?.replace(htmlTagReg, '').trim() === '')
      ) {
        setOpen(true);
        searchError = true;
        setModalText('검색 조건을 하나라도')
      } else if((searchInfo.engFname.replace(htmlTagReg, '').trim() !== '' && searchInfo.engLname.replace(htmlTagReg, '').trim() === '') || 
                (searchInfo.engFname.replace(htmlTagReg, '').trim() === '' && searchInfo.engLname.replace(htmlTagReg, '').trim() !== '')){
        setOpen(true);
        searchError = true;
        setModalText('성과 이름을 모두 ')
      } else if((searchInfo.korFname.replace(htmlTagReg, '').trim() !== '' && searchInfo.korLname.replace(htmlTagReg, '').trim() === '') || 
                (searchInfo.korFname.replace(htmlTagReg, '').trim() === '' && searchInfo.korLname.replace(htmlTagReg, '').trim() !== '')){
        setOpen(true);
        searchError = true;
        setModalText('성과 이름을 모두 ')
      }
     
      return searchError;
    }
    if (validation()) return;

    // searchType 세팅
    if(skypassNmSearch.skypassMemberNumber !== ''){
      setSkypassNmSearch({...skypassNmSearch, searchType: 'B'})
      setProfileList([])
    } else if(searchInfo.mobilePhoneNumber !== ''){
      setSearchInfo({...searchInfo, searchType: 'C'})
    } else if(searchInfo.engFname !== ''){
      setSearchInfo({...searchInfo, searchType: 'B'})
    } else if(searchInfo.korFname !== ''){
      setSearchInfo({...searchInfo, searchType: 'A'})
    } 
  };
  
  // 초기화 버튼
  const onClear = () => {
    setSearchInfo({    
      searchType: '',
      skypassMemberNumber: '',
      mobilePhoneNumber: '',
      korFname: '',
      korLname: '',
      engLname: '',
      engFname: ''})
    setSkypassNmSearch({
      searchType: '',
      skypassMemberNumber: ''
    })
  }

  // api 호출 useEffect
  useEffect(() => {
    if(searchInfo.searchType !== '') {
      refetchProfileCLvl() 
      setKey(Date.now());
    } else if(skypassNmSearch.searchType !== ''){
      refetchProfile()
      setKey(Date.now());
      setSkypassNmSearch({...skypassNmSearch, searchType: '' })      
    }
  }, [searchInfo, skypassNmSearch])
  
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

  // 마일리지 상세 버튼 모달 state
  const [openMileDtl, setOpenMileDtl] = useState(false)

  // 검색 조건 onChange 함수(skypassMemberNumber와 나머지 조건의 검색 api가 다르기 때문에 searchType을 초기화 -> searchType으로 검색버튼 클릭 시 다른 api를 태움)
  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearInterval(intervalId.current as number);
    const { id, value } = e.target;
    if(id === 'skypassMemberNumber'){
      setSkypassNmSearch({ searchType: '' , [id] : value })
    } else {
      if(skypassNmSearch.skypassMemberNumber !== ''){
        setSkypassNmSearch({ ...skypassNmSearch, skypassMemberNumber: '' })
      }
      setSearchInfo({ ...searchInfo, [id]: value, searchType: '' });
    }
  };

  // skypassNmSearch의 searchType이 있을 경우 api호출 후 searchType 초기화
  useEffect(() => { 
    if(skypassNmSearch.skypassMemberNumber !== '' && skypassNmSearch.searchType !== '') {
      refetchSkypass()
      setKey(Date.now());
      setSearchInfo({...searchInfo, searchType: ''})
    }
  }, [skypassNmSearch])

  // My trips(예약, E-TKT) 항목
  const [isListView1, setIsListView1] = useState({ open: false, contents: '' });
  // Boarding history 항목
  const [isListView2, setIsListView2] = useState(false);
  // communication records(상담, 캠페인, VOC, TMS) 항목
  const [isListView3, setIsListView3] = useState({ open: false, contents: '' });

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
    value: SelectValue<{}, false>
  ) => {
    setSkypassNmSearch({ searchType: 'B', skypassMemberNumber: String(value)})
  };

  /* CLevel 모달 */
  const dispatch = useAppDispatch();
  const cLevelModal = useAppSelector(selectCLevelModal());
  const toggleDropMenu = (e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    dispatch(setCLevelModal(!cLevelModal));
  };


  // 프로필 조회(핸드폰번호, 이름)
  useEffect(() => { 
    if( searchInfo.searchType !== '')   {
      if (isErrorProfileCLvl || responseProfileCLvl?.successOrNot === 'N') {
        toast({
          type: ValidType.ERROR,
          content: responseProfileCLvl?.message
        });
        setProfile(initProfile)
        setSkypass([])
        setSelectedSkypass(initSkypass)
        setFamily([])
      } else {
        if (responseProfileCLvl) {
          setProfile(initProfile)
          setSkypass([])
          setSelectedSkypass(initSkypass)
          setFamily([])
          dispatch(setCLevelModal(true));
          setProfileList(responseProfileCLvl?.data)
        }
      }

    }
  }, [responseProfileCLvl, isErrorProfileCLvl, searchInfo.searchType, key]);

  // 프로필 조회(skypassNumber)
  useEffect(() => {
    if (isErrorProfile || responseProfile?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: responseProfile?.message,
      });
      setProfile(initProfile)
      setSkypass([])
      setFamily([])
      setSelectedSkypass(initSkypass)
    } else { 
      if (responseProfile?.data) {
        setProfile(responseProfile?.data);
      }
    }
  }, [responseProfile, isErrorProfile, key]);

    // skypass 조회
    useEffect(() => {
      if (isErrorSkypass || responseSkypass?.successOrNot === 'N') {
        toast({
          type: ValidType.ERROR,
          content: responseSkypass?.message,
        });
      } else {
        if (responseSkypass) {
          setSkypass(responseSkypass?.data);
        }
      }
    }, [isErrorSkypass, responseSkypass, key]);

  /* 모달 행 클릭 함수(searchInfo 변경 후 profile 조회 api 호출 및 모달 닫기) */
  const searchProfile = (skypassMemberNumber: string) => {
    setSkypassNmSearch({skypassMemberNumber: skypassMemberNumber, searchType: 'B'})
    dispatch(setCLevelModal(false));
  }

  /* profileList(중복된 검색 결과가 있는 경우)가 존재하는 경우 profile api 조회 */
  useEffect(() => {
    if(searchInfo.skypassMemberNumber !== '' && !cLevelModal && searchInfo.searchType !== '' ){
      refetchProfile()
      refetchSkypass()
      setKey(Date.now());
    }
  }, [cLevelModal, searchInfo, profileList])

  // skypass 조회
  useEffect(() => {
    if (isErrorSkypass || responseSkypass?.successOrNot === 'N') {
      setSelectedSkypass(initSkypass)
      setFamily(initFamily)
      toast({
        type: ValidType.ERROR,
        content: responseSkypass?.message,
      });
    } else {
      if (responseSkypass) {
        setSelectedSkypass(responseSkypass.data)
        setFamily(responseSkypass.data.familyMembers)
      }
    }
  }, [isErrorSkypass, responseSkypass, key]);
  
  /* 로딩바 */
  const { t } = useTranslation()

  // CLevel 페이지와 일반 360 Dashboard페이지 간 이동 시 같은 메뉴 아래에 있고 변수 명이 같아 clean-up 함수 필수
  useEffect(() => {
		reset()
	}, [])

  // Clean-up 함수 
  const reset = () => {
		setProfile((state: Profile) => {
			let rtn = cloneDeep(state)
			rtn = cloneDeep(initProfile)
			return rtn
		})
    setSkypass((prevState) => {
			return cloneDeep([])
		})
    setFamily((prevState) => {
			return cloneDeep([])	
		})
    setSelectedSkypass((state: Skypass) => {
			let rtn = cloneDeep(state)
			rtn = cloneDeep(initSkypass)
			return rtn
		})
    setSearchInfo(initSearchInfoC)
    setSkypassNmSearch({skypassMemberNumber: '', searchType: ''})
  }

  return (
    <Stack
      onClick={() => {
        dispatch(setCLevelModal(false));
      }}
      direction="Vertical"
      justifyContent="Start"
      className={'width-100'}
      wrap={true}
    >
      {/* searchBar 영역 */}
      <Stack>
        <Stack className={'width-100'}>
          <Stack direction={'Vertical'} className={'width-100'}>
            <Stack>
              <div className="componentWrapper" style={{ width: '100%' }}>
                <TextField
                  id="skypassMemberNumber"
                  value={skypassNmSearch.skypassMemberNumber}
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
                  value={searchInfo.mobilePhoneNumber}
                  id="mobilePhoneNumber"
                  appearance="Outline"
                  placeholder="핸드폰번호"
                  size="LG"
                  textAlign="left"
                  onChange={onchangeInputHandler}
                />
              </div>
            </Stack>
            <Stack>
              <div className="componentWrapper" style={{ width: '100%' }}>
                <TextField
                  value={searchInfo.korFname}
                  id="korFname"
                  appearance="Outline"
                  placeholder="KOR. - Last Name"
                  size="LG"
                  textAlign="left"
                  onChange={onchangeInputHandler}
                />
              </div>
              <div className="componentWrapper" style={{ width: '100%' }}>
                <TextField
                  value={searchInfo.korLname}
                  id="korLname"
                  appearance="Outline"
                  placeholder="KOR. - First Name"
                  size="LG"
                  textAlign="left"
                  onChange={onchangeInputHandler}
                />
              </div>{' '}
              <div className="componentWrapper" style={{ width: '100%' }}>
                <TextField
                  value={searchInfo.engFname}
                  id="engFname"
                  appearance="Outline"
                  placeholder="ENG. - Last Name"
                  size="LG"
                  textAlign="left"
                  onChange={onchangeInputHandler}
                />
              </div>
              <div className="componentWrapper" style={{ width: '100%' }}>
                <TextField
                  value={searchInfo.engLname}
                  id="engLname"
                  appearance="Outline"
                  placeholder="ENG. - First Name"
                  size="LG"
                  textAlign="left"
                  onChange={onchangeInputHandler}
                />
              </div>
            </Stack>
          </Stack>
          <Stack >
            <Button
              priority="Primary"
              appearance="Contained"
              size="LG"
              style={{ minHeight: '72px' }}
              onClick={handleSearch}
            >
              <span className="searchIcon"></span>
              검색
            </Button>
            <Button
              size="LG"
              style={{ minHeight: '72px' }}
              onClick={onClear}
            >
              초기화
            </Button>
          </Stack>
        </Stack>
        <Modal open={isOpen} onClose={() => setOpen(false)}>
          <Modal.Header>알림</Modal.Header>
          <Modal.Body>{modalText} 입력 후 검색해 주세요.</Modal.Body>
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
        {isFetchingCLvl || isFetchingSkypass ? 
         <Loader
         style={{
             width: "100%",
             height: "100%",
             backgroundColor : '#f8f9fc'
         }}
         type="Bubble"
         title={t('common.message.proceeding')}
         description={"데이터를 불러오고 있습니다."}
     /> : 
     <>
          <Stack>
            <Typography variant="h3" className="dashboardTitle">
              Customer Info.
            </Typography>
          </Stack>
          <div style={{ position: 'relative' }} className="topCard">
            <h5 style={{ fontWeight: '400', position: 'absolute', left: 250, top: 10, color: 'white' }}>
              {batchDate} 기준
            </h5>
            <div className="dashBoardBox n1">
              <div className="name">
                  {profile?.korLname}{profile?.korFname}
                <span className="en">
                  {profile?.engLname}
                  &nbsp;
                  {profile?.engFname}
                </span>
              </div>
              <div className="profile">
                <div className="top">
                  Profile
                  <div className="kr">프로파일</div>
                </div>
                <div className="item">
                  <div className="key">생년월일</div>
                  <div className="value">{profile?.birthDatev.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>
                </div>
                <div className="item">
                  <div className="key">만나이</div>
                  <div className="value">{profile?.age}</div>
                </div>
                <div className="item">
                  <div className="key">성별</div>
                  <div className="value">{profile?.sexCode}</div>
                </div>

                <div className="item">
                  <div className="key">휴대폰번호</div>
                  <div className="value">
                    {profile?.mobilePhoneNumber
                      // .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                      // .split('-')
                      // .reduce((pre, cur, idx) => (idx === 1 ? pre + '-****-' : pre + cur), '')
                      }
                  </div>{' '}
                </div>
                <div className="item">
                  <div className="key">이메일</div>
                  {profile?.emailAddress && (
                    <div className="value">{`${'*'.repeat(profile?.emailAddress.split('@')[0].length)}@${
                      profile?.emailAddress.split('@')[1]
                    }`}</div>
                  )}
                  {/* @ 앞부분 마스킹(*) 필요 */}
                </div>
                <div className="item">
                  <div className="key">특이사항</div>
                  {/* <div className="value">{profile?.significant}</div> */}
                  {/* 특이사항 컬럼 필요 (ex. VIP) */}
                </div>
              </div>
            </div>
            <div className="dashBoardBox n2">
              <div className="top" style={{ position: 'relative' }}>
                SKYPASS
                <div className="kr">스카이패스</div>
                {profile?.skypassInfos && profile?.skypassInfos.length > 1 && (
                  <Select
                    id="searchSkypassNm"
                    defaultValue={profile.skypassInfos.length > 1 ? profile.skypassInfos[0].skypassMemberNumber : ''}
                    appearance="Outline"
                    placeholder="스카이패스선택"
                    style={{ maxHeight: '80%', position: 'absolute', right: 0, fontSize: '80%', bottom: 2 }}
                    value={skypassNmSearch.skypassMemberNumber}
                    onChange={(
                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                      value: SelectValue<{}, false>
                    ) => {
                      onchangeSelectHandler(e, value);
                    }}
                  >
                    {profile?.skypassInfos?.map((item: any, index: number) => (
                      <SelectOption key={index} value={item.skypassMemberNumber} style={{ maxHeight: '70%', fontSize: '13px' }}>
                        {item.skypassMemberNumber}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </div>
              <div className="item">
                <div className="key">회원번호</div>
                <div className="value">{selectedSkypass?.skypassMemberNumber}</div>
              </div>
              <div className="item">
                <div className="key">회원등급</div>
                <div className="value">{selectedSkypass?.memberLevel}</div>
              </div>
              <div className="item">
                <div className="key">휴면여부</div>
                <div className="value">{selectedSkypass?.memberStatusNm}</div>
              </div>
              <div className="item">
                <div className="key">현등급최초시작일</div>
                <div className="value">{selectedSkypass?.effectiveFrom.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>
              </div>
              <div className="item">
                <div className="key">적립 마일리지</div>
                <div className="value">{selectedSkypass?.totalAccrued}</div>
              </div>
              <div className="item">
                <div className="key">사용 마일리지</div>
                <div className="value">{selectedSkypass?.totalRedeemed}</div>
              </div>
              <div className="item">
                <div className="key">잔여 마일리지</div>
                <div className="value">{selectedSkypass?.remainMileage} <Button style={{ float: 'right'}} onClick={retrieveMileDtl}>상세</Button></div>
              </div>
              <div className="item">
                <div className="key">PLCC 카드보유</div>
                <div className="value">{selectedSkypass?.isPlccCard ? 'Y' : 'N'}</div>
              </div>
            </div>
            <Modal size={70} open={openMileDtl} onClose={() => setOpenMileDtl(false)}>
                  <Modal.Header>잔여 마일리지 상세</Modal.Header>
                  <Modal.Body>
                    <Label>
                      {t('common.label.countingUnit.total')}
                      <span className="total">{` ${selectedSkypass.expiredMileages.length} `}</span>
                      {t('common.label.countingUnit.thing')}
                    </Label>
                    <Table variant="vertical" size="normal" align="center" className={`verticalTable`}>
                      <div className="verticalTableDiv">
                      <THead className='verticalTableDivHeader'>
                        <TR>
                          <TH>
                            유효기간
                          </TH>
                          <TH>
                            마일리지
                          </TH>
                        </TR>
                      </THead>
                      {selectedSkypass.expiredMileages.length > 0 ? (selectedSkypass.expiredMileages.map((list) =>(
                        <TR>
                          <TD className='verticalTableTD'>{list.expiration.length === 4 ? list.expiration.replace(/(\d{2})(\d{2})/, '20$1-$2') : '평생'}</TD>
                          <TD className='verticalTableTD'>{list.remainMileage}</TD>
                        </TR>
                      ))) : (<NoResult/>)} 
                      </div>
                    </Table>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      priority="Primary"
                      appearance="Contained"
                      onClick={() => {
                        setOpenMileDtl(false);
                      }}
                    >
                      확인
                    </Button>
                  </Modal.Footer>
                </Modal>
            <div style={{ position: 'relative' }} className="dashBoardBox n3">
              <h5 style={{ fontWeight: '400', position: 'absolute', right: 30, top: 10, color: 'gray' }}>
                {batchDate} 기준
              </h5>

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
                <Modal size={70} open={isOpenFamilyInfo} onClose={() => setOpenFamilyInfo(false)}>
                  <Modal.Header>등록가족 상세</Modal.Header>
                  <Modal.Body>
                    <Label>
                      {t('common.label.countingUnit.total')}
                      <span className="total">{` ${family.length} `}</span>
                      {t('common.label.countingUnit.thing')}
                    </Label>
                    <Table variant="vertical" size="normal" align="center" className={`verticalTable`}>
                      <div className="verticalTableDiv">
                      <THead className='verticalTableDivHeader'>
                        <TR>
                        {familyColumn.map((column, index) => (
                          <TH 
                            key={`header-${index}`}
                            colSpan={column.colSpan ? column.colSpan : undefined}>
                              {column.headerName}
                            </TH>
                        ))}
                        </TR>
                      </THead>
                      {family.length > 0 ? (family.map((list) =>(
                        <TR>
                          <TD className='verticalTableTD'>{list.relationship}</TD>
                          <TD className='verticalTableTD'>{list.korFName}{list.korGName}</TD>
                          <TD className='verticalTableTD'>{list.engFName}{list.engGName}</TD>
                          <TD className='verticalTableTD'>{list.memberStatus}</TD>
                          <TD className='verticalTableTD'>{list.dateOfBirth?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</TD>
                          <TD className='verticalTableTD'>{list.skypassNumber}</TD>
                          <TD className='verticalTableTD'>{list.memberLevel}</TD>
                          <TD className='verticalTableTD'>{list.createdDate?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</TD>
                        </TR>
                        ))) : (<NoResult/>)} 
                      </div>
                    </Table>
                  </Modal.Body>
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
                  등록<br/>가족
                  <span className="num">{family[0]?.skypassNumber !== '' ? family.length : 0}</span>명
                </div>
                <div className="right">
                  합산가능<br/>마일리지
                  <span className="num">
                    {family.map((a)=> a.currentMileage).reduce(function add(sum, curVal) { return sum + curVal }, 0)}
                  </span>
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
                      family.length > 0 &&
                      family.map((list: any) => (
                        <tr>
                          <td>{list.relationship}</td>
                          <td>{list.skypassNumber}</td>
                          <td>{list.engFName} &nbsp;{list.engGName}</td>
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
            <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
              <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
                {batchDate} 기준
              </h5>
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
                          setIsListView1({ open: true, contents: 'pnr' });
                        }}
                      >
                        예약
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">{cnt?.pnr}</span>개
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView1({ open: true, contents: 'etkt' });
                        }}
                      >
                        E-TKT
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">{cnt?.eTkt}</span>개
                    </div>
                  </Stack>
                </div>
              </div>
              {isListView1.open && isListView1.contents === 'pnr' && (
                <div className="hideContents">
                  <table>
                    <colgroup>
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>예약번호</th>
                        <th>편명</th>
                        <th>BKG CLS</th>
                        <th>출발일</th>
                        <th>구간</th>
                        <th>예약상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            {/* left */}
                            <Stack direction="Vertical">
                              {pnr.map((item, index) => (
                                <Stack gap="MD">
                                  <div>{item?.reservationNum}</div>
                                  <div>{item?.engName}</div>
                                </Stack>
                              ))}
                            </Stack>
                            {/* left end */}

                            {/* right */}
                            <div>
                              {pnr.map((item, indx) => (
                                <Stack gap="MD">
                                  <div>{item.arrival}</div>
                                  <div>{item.class}</div>
                                  <div>{item.date}</div>
                                  <div>{item.status}</div>
                                </Stack>
                              ))}
                            </div>
                            {/* right end */}
                          </Stack>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {isListView1.open && isListView1.contents === 'etkt' && (
                <div className="hideContents">
                  <table>
                    <colgroup>
                      <col width="15%" />
                      <col width="20%" />           
                      <col width="20%" />
                      <col width="15%" />
                      <col width="10%" />
                      <col width="20%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>티켓번호</th>
                        <th>편명</th>
                        <th>BKG CLS</th>
                        <th>출발일</th>
                        <th>순서</th>
                        <th>구간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            {/* left */}
                            <Stack direction="Vertical">
                              {etkt.map((item, index) => (
                                <Stack gap="MD">
                                  <div>{item?.ticketNum}</div>
                                  <div>{item?.date}</div>
                                  <div>{item?.arrival}</div>
                                  <div>{item?.status}</div>
                                </Stack>
                              ))}
                            </Stack>
                            {/* left end */}
                          </Stack>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              <button
                type="button"
                className={'viewMore ' + (isListView1.open ? 'true' : 'false')}
                onClick={(event) => {
                  if (isListView1.contents === '') {
                    setIsListView1({ open: !isListView1.open, contents: 'pnr' });
                  } else {
                    setIsListView1({ open: !isListView1.open, contents: '' });
                  }
                }}
              >
                {isListView1.open ? '숨기기' : '더보기'}
              </button>
            </div>
            <Stack className="width-50" gap="LG">
              <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
                <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
                  {batchDate} 기준
                </h5>
                <div className="top">
                  Wallet
                  <div className="kr">지갑</div>
                </div>
                <div className="itemWrap">
                  <div className="item large">
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">보유쿠폰</div>
                      <div className="value">
                        <span className="num">{wallet?.coupon}</span>개
                      </div>
                    </Stack>
                  </div>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">항공권할인쿠폰보유여부</div>
                    <div className="value">
                      <span className="num">{wallet?.promotion}</span>
                    </div>
                  </Stack>
                </div>
              </div>
              <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
                <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
                  {batchDate} 기준
                </h5>
                <div className="top">
                  Preference
                  <div className="kr">선호도</div>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">최다 탑승 좌석</div>
                    <div className="value">{preference?.seat}</div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">선호 기내식</div>
                    <div className="value">{preference?.meal}</div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">골프여행 선호지수</div>
                    <div className="value">{preference?.meal}</div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">High Class 선호지수</div>
                    <div className="value">{preference?.meal}</div>
                  </Stack>
                </div>
              </div>
            </Stack>
          </Stack>
          <Typography variant="h3" className="dashboardTitle">
            Customer History.
          </Typography>
          <Stack className="width-100" gap="LG" alignItems="Start">
            <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
              <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
                {batchDate} 기준
              </h5>
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
                      <span className="num">{cnt?.boarding}</span>회
                    </div>
                  </Stack>
                </div>
              </div>
              {isListView2 && (
                <div className="hideContents">
                  <table>
                    <colgroup>
                      <col width="25%" />
                      <col width="15%" />
                      <col width="20%" />
                      <col width="15%" />
                      <col width="25%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>탑승일</th>
                        <th>편명</th>
                        <th>구간</th>
                        <th>CBN CLS</th>
                        <th>티켓번호</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardingLists.map((item, index) => (
                        <tr>
                          <td>
                            <Stack justifyContent="Between" alignItems={'Start'}>
                              <Stack gap="MD">
                                <div>{item?.itinerary1}</div>
                                <div>{item?.itinerary2}</div>
                                <div>{item?.itinerary3}</div>
                                <div>{item?.itinerary4}</div>
                                <div>{item?.itinerary5}</div>
                              </Stack>
                            </Stack>
                          </td>
                          <td>
                            <Stack justifyContent="Between" alignItems={'Start'}>
                              <Stack gap="MD">
                                <div>{item?.ticketNo}</div>
                              </Stack>
                            </Stack>
                          </td>
                        </tr>
                      ))}
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
            <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
              <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
                {batchDate} 기준
              </h5>
              <div className="top">communication records</div>
              <div className="itemWrap">
                <Stack justifyContent="Between" gap="LG">
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'call' });
                          }}
                        >
                          상담
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.call}</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'internet' });
                          }}
                        >
                          캠페인
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.internet}</span>
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
                            setIsListView3({ open: true, contents: 'voc' });
                          }}
                        >
                          VOC
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.voc}</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'tms' });
                          }}
                        >
                          TMS
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.sms}</span>
                      </div>
                    </Stack>
                  </div>
                  
            
                </Stack>
              </div>
              {isListView3.open && isListView3.contents === 'call' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="50%" />
                      <col width="50%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>상담 채널</th>
                        <th>최근 상담일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calls.map((item, index) => (
                        <>
                          <tr>
                            <td>서비스 센터</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>챗봇</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>채팅</td>
                            <td>{item?.date}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'internet' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="50%" />
                      <col width="50%" />
                    </colgroup>
                    <thead>
                      <tr className="width-100">
                        <th>캠페인 채널</th>
                        <th>최근 발송일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internets.map((item, index) => (
                        <>
                          <tr>
                            <td>카카오알림톡</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>SMS/LMS</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>APP PUSH</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>E-MAIL</td>
                            <td>{item?.date}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'voc' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="50%" />
                      <col width="50%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>VOC 유형</th>
                        <th>최근 VOC 접수일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vocs.map((item, index) => (
                      <>
                        <tr>
                          <td>불만</td>
                          <td>{item?.date}</td>
                        </tr>
                        <tr>
                          <td>제언</td>
                          <td>{item?.date}</td>
                        </tr>
                        <tr>
                          <td>Disruption</td>
                          <td>{item?.date}</td>
                        </tr>
                      </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'tms' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="50%" />
                      <col width="50%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>TMS 발송 채널</th>
                        <th>최근 발송일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {smss.map((item, index) => (
                        <>
                          <tr>
                            <td>카카오알림톡</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>SMS</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>APP PUSH</td>
                            <td>{item?.date}</td>
                          </tr>
                          <tr>
                            <td>E-MAIL</td>
                            <td>{item?.date}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {isListView3.open && isListView3.contents === 'tms' && (
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
                        <th>날짜</th>
                        <th>횟수</th>
                        <th>상담자</th>
                        <th>채널</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snss.map((item, index) => (
                        <tr>
                          <td>{item?.date}</td>
                          <td>{item?.useCnt}</td>
                          <td>{item?.counselor}</td>
                          <td>{item?.channel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                type="button"
                className={'viewMore ' + (isListView3.open ? 'true' : 'false')}
                onClick={(event) => {
                  if (isListView3.contents === '') {
                    setIsListView3({ open: !isListView3.open, contents: 'call' });
                  } else {
                    setIsListView3({ open: !isListView3.open, contents: '' });
                  }
                }}
              >
                {isListView3.open ? '숨기기' : '더보기'}
              </button>
            </div>
          </Stack>

          <div
            onClick={(e) => e.stopPropagation()}
            className={'c_level_right_modal_wrap ' + (cLevelModal ? 'panel_opened' : '')}
            style={{ zIndex: 90 }}
          >
            <Stack>
              <div className="right_modal_btn_wrap" onClick={(e) => toggleDropMenu(e)}>
                <div className="btn_modal_icon"></div>
              </div>
              <div className="right_modal_content_wrap height-100">
                <div className="right_modal_content height-100">
                  <div className="right_modal_content_inner height-100">
                    <Stack direction="Vertical">
                      <div style={{ paddingBottom: '10px' }}>
                        <Close sx={menuIconSx} onClick={(e) => toggleDropMenu(e)} style={{ float: 'right' }} />
                      </div>
                      <div className="right_modal_search_wrap">
                        <Stack>
                          <TextField
                            id="searchBar"
                            name="searchBar"
                            onChange={onchangeModalInputHandler}
                            value={searchText}
                            className="width-100"
                            size="LG"
                            placeholder="결과내 검색"
                          />
                          <Button id="searchBar1" appearance="Contained" priority="Primary" shape="Square" size="LG">
                            검색
                          </Button>
                        </Stack>
                      </div>
                      {profileList.length >= 100 && (
                      <div className="right_modal_box_wrap">
                        <div className="box_inner_txt">
                          <span className="point_txt">100명</span>을 초과하는 데이터입니다.
                        </div>
                        <div className="box_inner_sub">
                          (추가 데이터 조회는 모달을 닫으신 후 Skypass Number 혹은
                          <br />
                          핸드폰번호로 조회해주시기 바랍니다.)
                        </div>
                      </div>
                      )}
                      <div className="right_modal_table_wrap">
                      <div style={{ marginBottom: '-10px' }}>
                        <Label style={{ left: '20px', bottom: '20px' }}>총 <span className="total">{profileList.length}</span> 건</Label>
                      </div>
                        <div className="right_modal_table_inner height-100">
                          <table id="skypassSearch15">
                            <colgroup>
                              <col width="80px" />
                              <col width="130px" />
                              <col width="54px" />
                              <col width="100px" />
                              <col width="*" />
                            </colgroup>
                            <thead>
                              <tr>
                                <th>
                                  <div className="ellipsis1">
                                    이름
                                    <span className="subtxt">(KOR)</span>
                                  </div>
                                </th>
                                <th>
                                  <div className="ellipsis1">
                                    이름
                                    <span className="subtxt">(ENG)</span>
                                  </div>
                                </th>
                                <th>
                                  <div className="ellipsis1">성별</div>
                                </th>
                                <th>
                                  <div className="ellipsis1">출생년도</div>
                                </th>
                                <th>
                                  <div className="ellipsis1">Skypass No.</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {profileList?.map((list: ProfileList) => (
                                <tr style={{cursor: 'pointer'}} onClick={()=>searchProfile(list.skypassMemberNumber)}>
                                  <td>
                                    <div className="ellipsis1">
                                      {searchText &&
                                        ((list?.korLname ?? '-') + (list?.korFname ?? '-')).includes(searchText)
                                          ? searchHighlight((list.korLname + list.korFname), searchText)
                                          : ((list?.korLname ?? '-') || '-') + ((list?.korFname ?? '-') || '-')
                                      }
                                    </div>
                                  </td>
                                  <td>
                                    <div className="ellipsis1">
                                      {' '}
                                      {searchText && list.engLname && list.engFname && (list.engLname + list.engFname).toLowerCase().includes(searchText.toLowerCase())
                                        ? searchHighlight((list.engLname + list.engFname), searchText)
                                        : (list.engLname + list.engFname)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="ellipsis1">
                                      {' '}
                                      {searchText && list.sexCode.toLowerCase().includes(searchText.toLowerCase())
                                        ? searchHighlight(list.sexCode, searchText)
                                        : list.sexCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="ellipsis1">
                                      {' '}
                                      {searchText && list.birthDatev.slice(0, 4).includes(searchText)
                                        ? searchHighlight(list.birthDatev.slice(0, 4), searchText)
                                        : list.birthDatev.slice(0, 4)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="ellipsis1">
                                      {' '}
                                      {searchText && list.skypassMemberNumber
                                        ? searchHighlight(list.skypassMemberNumber, searchText)
                                        : list.skypassMemberNumber}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>
            </Stack>
          </div>
          </>
          }
        </Stack>
      </div>
    </Stack>
  );
}

