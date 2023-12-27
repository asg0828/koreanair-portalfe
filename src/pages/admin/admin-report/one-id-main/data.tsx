import { RowsInfo } from '@/models/components/Table';
import { Column, ColumnChild } from '@/models/model/CustomerInfoModel';
import {
  CtiVocData,
  DailyReportData,
  ErrLogData,
  MobMasterData,
  MobileData,
  OneIdSameData,
  PaxData,
  RelationData,
} from '@/models/oneId/OneIdInfo';

const oneIdPaxColumn: Column[] = [
  { headerName: 'NO', field: 'no' },
  { headerName: 'OneID번호', field: 'oneidNo' },
  { headerName: 'PNR번호', field: 'pnrNumber' },
  { headerName: 'UCIID', field: 'uciid' },
  { headerName: 'PotentialId', field: 'temporaryOneidNo' },
  { headerName: '사용여부', field: 'useYn' },
  { headerName: 'Skypass회원번호', field: 'skypassMemberNumber' },
  { headerName: '최초생성일시', field: 'creationDate' },
  { headerName: '최종갱신일시', field: 'lastUpdateDate' },
];

const onIdPaxData: PaxData[] = [
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
  {
    no: '1',
    oneidNo: 'Jan 14, 2023',
    pnrNumber: 'FUK-ICN',
    uciId: '1',
    temporaryOneidNo: '1',
    useYn: '1',
    skypassMemberNumber: '1',
    creationDate: '1',
    lastUpdateDate: '1',
  },
];
const reason = [
  { value: '0', text: '전체' },
  { value: '1', text: 'KOM' },
  { value: '2', text: 'ENM' },
  { value: '3', text: 'DOB' },
  { value: '4', text: 'MOB' },
  { value: '5', text: 'EML' },
  { value: '6', text: 'REU' },
  { value: '7', text: 'PSP' },
];

const historyColumn: Column[] = [
  { headerName: 'No', field: 'no' },
  { headerName: 'OneID 번호', field: 'oneidNo' },
  { headerName: 'OneID 변경이유코드', field: 'oneidChgRsnCd' },
  { headerName: '변경전 OneID 유형코드', field: 'bfChgOneidTypeCd' },
  { headerName: '변경후 OneID 유형코드', field: 'afChgOneidTypeCd' },
  { headerName: '변경전 OneID 상태코드', field: 'bfChgOneidSttsCd' },
  { headerName: '변경후 OneID 상태코드', field: 'afChgOneidSttsCd' },
  { headerName: '변경전 OneID 최종변경 Channel코드', field: 'bfChgOneidFinalChgChnlCd' },
  { headerName: '변경후 OneID 최종변경 Channel코드', field: 'afChgOneidFinalChgChnlCd' },
  { headerName: '변경전 OneID 최종변경 관련번호', field: 'bfChgOneidFinalChgReltNo' },
  { headerName: '변경후 OneID 최종변경 관련번호', field: 'afChgOneidFinalChgReltNo' },
  { headerName: '변경전 OneID 최종변경 UCIID', field: 'bfChgOneidFnlChgUciId' },
  { headerName: '변경후 OneID 최종변경 UCIID', field: 'afChgOneidFnlChgUciId' },
  { headerName: '변경전영문 FirstName', field: 'bfChgEngFname' },
  { headerName: '변경후영문 FirstName', field: 'afChgEngFname' },
  { headerName: '변경전영문 LastName', field: 'bfChgEngLname' },
  { headerName: '변경후영문 LastName', field: 'afChgEngLname' },
  { headerName: '변경전 휴대전화번호정보', field: 'bfChgMobilePhoneNoInfo' },
  { headerName: '변경후 휴대전화번호정보', field: 'afChgMobilePhoneNoInfo' },
  { headerName: '변경전 E-Mail주소', field: 'bfChgEmailAdrs' },
  { headerName: '변경후 E-Mail주소', field: 'afChgEmailAdrs' },
  { headerName: '변경전 출생일자V', field: 'bfChgBirthDtv' },
  { headerName: '변경후 출생일자V', field: 'afChgBirthDtv' },
  { headerName: '변경전 한글 FirstName', field: 'bfChgKorFname' },
  { headerName: '변경후 한글 FirstName', field: 'afChgKorFname' },
  { headerName: '변경전 한글 LastName', field: 'bfChgKorLname' },
  { headerName: '변경후 한글 LastName', field: 'afChgKorLname' },
  { headerName: '변경전 영문 Soundex값', field: 'bfChgEngNmSoundexValue' },
  { headerName: '변경후 영문 Soundex값', field: 'afChgEngNmSoundexValue' },
  { headerName: '변경전 휴대전화정보 Hash값', field: 'bfChgMblfonNoInfoHashVlu' },
  { headerName: '변경후 휴대전화정보 Hash값', field: 'afChgMblfonNoInfoHashVlu' },
  { headerName: '변경전 E-Mail주소 Hash값', field: 'bfChgEmailAdrsHashValue' },
  { headerName: '변경후 E-Mail주소Hash값', field: 'afChgEmailAdrsHashValue' },
  { headerName: '변경전 여권국적 ISO3Letter 국가코드', field: 'bfChgPpNtnltyIsoL3CtrCd' },
  { headerName: '변경후 여권국적 ISO3Letter 국가코드', field: 'afChgPpNtnltyIsoL3CtrCd' },
  { headerName: '변경전 여권 만료일자V', field: 'bfChgPassportExpireDtv' },
  { headerName: '변경후 여권 만료일자V', field: 'afChgPassportExpireDtv' },
  { headerName: '최초 생성 일시', field: 'creationDate' },
  { headerName: '최종 갱신 일시', field: 'lastUpdateDate' },
];
const masterColumn: Column[] = [
  { headerName: '출생일자V', field: 'birthDatev', colSpan: 2 },
  { headerName: '최초 생성 일시', field: 'creationDate', colSpan: 2 },
  { headerName: 'E-Mail 주소', field: 'emailAddress', colSpan: 4 },
  { headerName: 'E-Mail 주소 Hash값', field: 'emailAdrsHashValue', colSpan: 3 },
  { headerName: '영문 FirstName', field: 'engFname', colSpan: 3 },
  { headerName: '영문 LastName', field: 'engLname', colSpan: 3 },
  { headerName: '영문명 Sounddex값', field: 'engNmSoundexValue', colSpan: 3 },
  { headerName: '최종 갱신 일시', field: 'finalInqDtim', colSpan: 3 },
  { headerName: '한글 FirstName', field: 'firstNameK', colSpan: 3 },
  { headerName: '한글 LastName', field: 'lastNameK', colSpan: 3 },
  { headerName: '최종 갱신 일시', field: 'lastUpdateDate', colSpan: 3 },
  { headerName: '휴대전화정보 Hash 값', field: 'mobilePhoneNoInfoHashVlu', colSpan: 3 },
  { headerName: '휴대전화정보', field: 'mobilePhoneNumberInfo', colSpan: 3 },
  { headerName: '복수여권여부', field: 'multiplePassportYn', colSpan: 3 },
  { headerName: 'No', field: 'no', colSpan: 3 },
  { headerName: 'OneID 최종변경 Channel코드', field: 'oneidFinalChgChnlCd', colSpan: 4 },
  { headerName: 'OneID 최종변경 관련코드', field: 'oneidFinalChgRelateNo', colSpan: 4 },
  { headerName: 'OneID 최종변경 UCIID', field: 'oneidFinalChgUciId', colSpan: 3 },
  { headerName: 'OneID번호', field: 'oneidNo', colSpan: 5 },
  { headerName: 'OneID 등록 Channel코드', field: 'oneidRegisChnlCd', colSpan: 4 },
  { headerName: 'OneID 상태코드', field: 'oneidSttsCd', colSpan: 3 },
  { headerName: 'OneID 유형코드', field: 'oneidTypeCd', colSpan: 3 },
  { headerName: '성별코드', field: 'sexCode', colSpan: 3 },
  { headerName: '성별등록 Channel코드', field: 'sexRegisChnlCd', colSpan: 3 },
  { headerName: '자택전화번호정보 Hash값', field: 'homePhoneNoInfoHashValue', colSpan: 3 },
  { headerName: '휴대전화번호정보 Hash값', field: 'mobilePhoneNoInfoHashVlu', colSpan: 3 },
  { headerName: 'E-Mail주소 Hash값', field: 'emailAdrsHashValue', colSpan: 3 },
  { headerName: '자택 전화번호 정보', field: 'homePhoneNumberInfo', colSpan: 3 },

  /* 확인 요망 */
  /*
  { headerName: '자동전환영문FirstName', field: '' },
  { headerName: '자동전환영문LastName', field: '' },
  { headerName: '사무실전화번호정보', field: '' },
  { headerName: '사무실전화번호정보Hash값', field: '' },
  { headerName: '개인정보사용동의여부', field: '' },
  { headerName: '대리점추정코드', field: 'presumeCode' },
  */
];

const mobileColumn: Column[] = [
  { headerName: 'No', field: 'no' },
  { headerName: '대리점추정 휴대전화번호정보', field: 'presumeNum' },
  { headerName: '대리점추정 휴대전화번호정보 Hash값', field: 'presumeNumHash' },
  { headerName: '사용여부', field: 'useYn' },
];
const mobileData: MobileData[] = [
  {
    no: '1',
    presumeNum: 'asdfas',
    presumeNumHash: 'asdfdafdsaf',
    useYn: 'Y',
  },
  {
    no: '2',
    presumeNum: '',
    presumeNumHash: '',
    useYn: 'Y',
  },
  {
    no: '3',
    presumeNum: '',
    presumeNumHash: '',
    useYn: 'N',
  },
];

const mobMasterColumn: Column[] = [
  { headerName: 'No', field: 'no', colSpan: 0.8 },
  { headerName: 'OneID번호', field: 'oneId', colSpan: 0.8 },
  { headerName: '영문 FirstName', field: 'firstNameE', colSpan: 0.8 },
  { headerName: '영문 LastName', field: 'lastNameE', colSpan: 0.8 },
  { headerName: '휴대전화번호정보', field: 'phoneNum', colSpan: 0.9 },
  { headerName: 'E-Mail주소', field: 'eMailAdr', colSpan: 1.1 },
  { headerName: '출생일자V', field: 'birth', colSpan: 0.8 },
  { headerName: '한글 FirstName', field: 'firstNameK', colSpan: 0.8 },
  { headerName: '한글 LastName', field: 'lastNameK', colSpan: 0.8 },
  { headerName: '성별코드', field: 'gender', colSpan: 0.8 },
  { headerName: '대리점추정코드', field: 'presumeCode', colSpan: 0.8 },
];

const mobMasterData: MobMasterData[] = [
  {
    no: '1',
    oneId: '원아이디',
    firstNameE: 'LEE',
    lastNameE: 'GEONIL',
    phoneNum: '010-1111-2222',
    eMailAdr: '1234@kalmate.net',
    birth: '2023-10-35',
    firstNameK: '이',
    lastNameK: '건일',
    gender: 'M',
    presumeCode: '추정코드',
  },
  {
    no: '1',
    oneId: '원아이디',
    firstNameE: 'LEE',
    lastNameE: 'GEONIL',
    phoneNum: '010-1111-2222',
    eMailAdr: '1234@kalmate.net',
    birth: '2023-10-35',
    firstNameK: '이',
    lastNameK: '건일',
    gender: 'M',
    presumeCode: '추정코드',
  },
  {
    no: '1',
    oneId: '원아이디',
    firstNameE: 'LEE',
    lastNameE: 'GEONIL',
    phoneNum: '010-1111-2222',
    eMailAdr: '1234@kalmate.net',
    birth: '2023-10-35',
    firstNameK: '이',
    lastNameK: '건일',
    gender: 'M',
    presumeCode: '추정코드',
  },
  {
    no: '1',
    oneId: '원아이디',
    firstNameE: 'LEE',
    lastNameE: 'GEONIL',
    phoneNum: '010-1111-2222',
    eMailAdr: '1234@kalmate.net',
    birth: '2023-10-35',
    firstNameK: '이',
    lastNameK: '건일',
    gender: 'M',
    presumeCode: '추정코드',
  },
  {
    no: '1',
    oneId: '원아이디',
    firstNameE: 'LEE',
    lastNameE: 'GEONIL',
    phoneNum: '010-1111-2222',
    eMailAdr: '1234@kalmate.net',
    birth: '2023-10-35',
    firstNameK: '이',
    lastNameK: '건일',
    gender: 'M',
    presumeCode: '추정코드',
  },
  {
    no: '1',
    oneId: '원아이디',
    firstNameE: 'LEE',
    lastNameE: 'GEONIL',
    phoneNum: '010-1111-2222',
    eMailAdr: '1234@kalmate.net',
    birth: '2023-10-35',
    firstNameK: '이',
    lastNameK: '건일',
    gender: 'M',
    presumeCode: '추정코드',
  },
  {
    no: '1',
    oneId: '원아이디',
    firstNameE: 'LEE',
    lastNameE: 'GEONIL',
    phoneNum: '010-1111-2222',
    eMailAdr: '1234@kalmate.net',
    birth: '2023-10-35',
    firstNameK: '이',
    lastNameK: '건일',
    gender: 'M',
    presumeCode: '추정코드',
  },
];

const relationColumn: Column[] = [
  { headerName: 'No', field: 'no', colSpan: 0.03 },
  { headerName: '병합 TargetOneID번호', field: 'mergeTargetOneidNo', colSpan: 0.1 },
  { headerName: '병합 SourceOneID번호', field: 'mergeSourceOneidNo', colSpan: 0.1 },
  { headerName: 'Skypass 회원번호', field: 'skypassNum', colSpan: 0.1 },
  { headerName: 'Skypass 회원번호(PAX)', field: 'skypassNumPax', colSpan: 0.1 },
  { headerName: '영문 FirstName', field: 'engLname', colSpan: 0.06 },
  { headerName: '영문 LastName', field: 'engFname', colSpan: 0.06 },
  { headerName: '한글 FirstName', field: 'korLname', colSpan: 0.06 },
  { headerName: '한글 LastName', field: 'korFname', colSpan: 0.06 },
  { headerName: 'E-Mail주소', field: 'emailAddress', colSpan: 0.1 },
  { headerName: '휴대전화번호 정보', field: 'mobilePhoneNumberInfo', colSpan: 0.08 },
  { headerName: '출생일자V', field: 'birthDatev', colSpan: 0.06 },
  { headerName: '최초 생성일시', field: 'creationDate', colSpan: 0.06 },
  { headerName: '최종 갱신일시', field: 'lastUpdateDate', colSpan: 0.06 },
  { headerName: 'OneID 병합상태코드', field: 'oneidMergeSttsCd', colSpan: 0.06 },
  { headerName: 'Skypass 회원번호', field: 'skypassMemberNumber', colSpan: 0.1 },
];

const relationData: RelationData[] = [
  {
    no: '1',
    mergeTargetOneidNo: '타겟원아이디',
    mergeSourceOneidNo: '소스원아이디',
    engLname: 'LEE',
    engFname: 'GEONIL',
    korLname: '이',
    korFname: '건일',
    emailAddress: '1234@kalmate.net',
    mobilePhoneNumberInfo: '010-1111-2222',
    birthDatev: '2023-10-35',
    creationDate: '2023-10-14',
    lastUpdateDate: '2023-10-14',
    oneidMergeSttsCd: '',
    skypassMemberNumber: '',
  },
];

// OneID 에러 이력 페이지 컬럼명
const errLogColumn: Column[] = [
  { headerName: 'No', field: 'no' },
  { headerName: '에러코드', field: 'errorNm' },
  { headerName: '상세에러코드', field: 'errCodeDtl' },
  { headerName: 'OneID 등록 Channel코드', field: 'oneidRegisChnlCd' },
  { headerName: 'PNR / Skypass번호', field: 'oneidFinalChgRelateNo' },
  { headerName: 'SKYPASS 액션', field: 'skypassAct' },
  { headerName: 'ODS Header', field: 'odsHeader' },
  { headerName: 'ODS M_GID', field: 'odsMGid' },
  { headerName: 'UCIID', field: 'uciid' },
  { headerName: '상세내역', field: 'errorContents' },
  { headerName: '처리여부', field: 'errorActionYn' },
  { headerName: '최초 생성 일시', field: 'creationDate' },
  { headerName: '최종 갱신 일시', field: 'lastUpdateDate' },
];

const ctiVocColumn: ColumnChild[] = [
  { headerName: '일자', field: 'reqDatev' },
  { headerName: '전체건수', field: 'totalCntLastUpd' },
  { headerName: 'OneID 미연결건수', field: 'totalCntCaseClose' },
  {
    headerName: 'OneID 연결 건수',
    field: '',
    childName: [
      { headerName: '회원(S)', field: 'oneidConnectSkypassCnt' },
      { headerName: '비회원(P)', field: 'oneidConnectNonSkypassCnt' },
      { headerName: '전체', field: 'oneidConnectTotalCnt' },
      { headerName: '연결%', field: 'oneidConnectRate' },
    ],
  },
  { headerName: '조회건수 / 전체건수', field: 'oneidCtiSearchTotalRate' },
  { headerName: '연결건수 / Return건수', field: 'oneidCtiConnectReturnRate' },
  {
    headerName: '조회 Key 별 OneID 조회건수',
    field: '',
    childName: [
      { headerName: '회원번호', field: 'oneidSearchSkypassCnt' },
      { headerName: '회원번호 이외', field: 'oneidSearchNonSkypassCnt' },
      { headerName: '전체', field: 'oneidSearchTotalCnt' },
    ],
  },
  {
    headerName: '조회 Key Hit Ratio(추정)',
    field: '',
    childName: [
      { headerName: '전체', field: 'oneidHitTotalRate' },
      { headerName: '회원번호 이외', field: 'oneidHitNonSkypassRate' },
    ],
  },
  {
    headerName: 'OneID Return 건수별 조회횟수',
    field: '',
    childName: [
      { headerName: '0', field: 'oneidNonHitCnt' },
      { headerName: '1~10', field: 'oneidMultiHitCnt' },
      { headerName: '10초과', field: 'oneidOverHitCnt' },
    ],
  },
];

const ctiVocData: CtiVocData[] = [
  {
    channel: '1',
    creationDate: '2023-11-09 06:10:20.906',
    lastUpdateDate: '2023-11-09 06:10:20.906',
    oneidConnectNonSkypassCnt: 0,
    oneidConnectRate: 64,
    oneidConnectSkypassCnt: 172,
    oneidConnectTotalCnt: 172,
    oneidCtiConnectReturnRate: 162,
    oneidCtiSearchTotalRate: 42,
    oneidHitTotalRate: 94,
    oneidMultiHitCnt: 106,
    oneidNonHitCnt: 7,
    oneidOverHitCnt: 0,
    oneidSearchNonSkypassCnt: 0,
    oneidSearchSkypassCnt: 113,
    oneidSearchTotalCnt: 113,
    reqDatev: '20231108',
    totalCntCaseClose: 96,
    totalCntLastUpd: 268,
    oneidHitNonSkypassRate: 71,
  },
];
const ctiVocTotal = {
  totalCntLastUpd: 1,
  totalCntCaseClose: 2,
  oneidConnectSkypassCnt: 3,
  oneidConnectNonSkypassCnt: 4,
  oneidConnectTotalCnt: 5,
  oneidConnectRate: 6,
  oneidCtiSearchTotalRate: 7,
  oneidCtiConnectReturnRate: 8,
  oneidSearchSkypassCnt: 9,
  oneidSearchNonSkypassCnt: 10,
  oneidSearchTotalCnt: 11,
  oneidHitTotalRate: 12,
  oneidHitNonSkypassRate: 13,
  oneidNonHitCnt: 14,
  oneidMultiHitCnt: 15,
  oneidOverHitCnt: 16,
};

const errLogData: ErrLogData[] = [
  {
    no: '1',
    errorNm: 'error1',
    errCodeDtl: 'error1-1',
    oneidRegisChnlCd: 'oneId 채널 코드',
    oneidFinalChgRelateNo: 'pnrsky-1',
    uciid: 'uciid',
    errorContents: '상세내역',
    errorActionYn: 'Y',
    creationDate: '2023-10-26',
    lastUpdateDate: '2023-10-26',
    skypassAct: '액션',
    odsHeader: 'odsH',
    odsMGid: 'odsMGid',
  },
];

const oneIdDailyColumn: ColumnChild[] = [
  { headerName: 'No', field: 'no', colSpan: 1, rowSpan: 0.35 },
  { headerName: '일자', field: 'aggrDate', colSpan: 1, rowSpan: 0.345 },
  {
    headerName: 'PNR',
    field: '',
    colSpan: 8,
    childName: [
      { headerName: '총 PNR 수', field: 'pnrTotal', colSpan: 1, rowSpan: 0.67 },
      {
        headerName: 'UCI ID',
        field: '',
        colSpan: 6,
        childName: [
          { headerName: '총 UCI ID 수', field: 'pnrUci', colSpan: 1 },
          { headerName: '신규 OneID', field: 'pnrNewOneid', colSpan: 1 },
          { headerName: 'SKYPASS OneID 재사용', field: 'pnrReuseSkypass', colSpan: 1 },
          { headerName: '기존 비회원 OneID 재사용', field: 'pnrReuseNonSkypass', colSpan: 1 },
          { headerName: '신규 Potentail OneID', field: 'pnrNewPotentialid', colSpan: 1 },
          { headerName: 'OneID 미생성', field: 'pnrSkipped', colSpan: 1 },
        ],
      },
    ],
  },
  {
    headerName: '신규OneID(Potential 제외)',
    field: '',

    childName: [
      {
        headerName: 'ODS',
        field: '',
        colSpan: 3,
        childName: [
          { headerName: '당일 PNR', field: 'newOneidTodayPnr' },
          { headerName: '이전 PNR', field: 'newOneidPastPnr' },
          { headerName: '이전 Potential 전환', field: 'newOneidPotentialConv' },
        ],
      },
      { headerName: 'SKYPASS', field: 'newOneidSkypass' },
      { headerName: 'Total', field: 'newOneidTotal' },
      { headerName: '대리점 추정 Mobile OneID', field: 'newOneidAgentMobile' },
    ],
  },

  {
    headerName: '전체 OneID(Potential 제외)',
    field: '',
    colSpan: 4,
    childName: [
      { headerName: '총 OneID 개수(Master/Active)', field: 'oneidTotal', colSpan: 1 },
      { headerName: '총 단독 OneID 개수', field: 'oneidAlone', colSpan: 1 },
      { headerName: '총 Target OneID 개수', field: 'oneidTarget', colSpan: 1 },
      { headerName: '총 Source OneID 개수', field: 'oneidSource', colSpan: 1 },
    ],
  },

  {
    headerName: 'Merged(Source)OneID',
    field: '',

    childName: [
      {
        headerName: 'OneID 엔진',
        field: '',
        colSpan: 3,
        childName: [
          { headerName: '회원+회원', field: 'mergedSkypassToSkypass' },
          { headerName: '회원+비회원', field: 'mergedNonSkypassToSkypass' },
          { headerName: '비회원+비회원', field: 'mergedNonSkypassToNonSkypass' },
        ],
      },
      { headerName: 'SKYPASS 요청', field: 'mergedSkypassRequest' },
    ],
  },
];

const oneIdDailyData: DailyReportData[] = [
  {
    aggrDate: '일자',
    mergedNonSkypassToNonSkypass: '비회원+비회원',
    mergedNonSkypassToSkypass: '회원+비회원',
    mergedSkypassRequest: 'SKYPASS 요청',
    mergedSkypassToSkypass: '회원+회원',
    oneidTotal: '총 OneID 개수',
    newOneidPastPnr: '이전PNR',
    newOneidPotentialConv: '이전 Potential 전환',
    newOneidSkypass: 'SKYPASS',
    newOneidTodayPnr: '당일 PNR',
    newOneidTotal: 'Total',
    no: 'No',
    oneidAlone: '총 단독 OneID',
    oneidSource: '총 Source OneID 개수',
    oneidTarget: '총 Target OneID 개수',
    newOneidAgentMobile: '대리점추정',
    pnrNewOneid: '신규OneID',
    pnrNewPotentialid: '신규 포텐셜',
    pnrReuseNonSkypass: '기존 비회원 OneID 재사용',
    pnrReuseSkypass: 'SKYPASS OneID 재사용',
    pnrSkipped: 'OneID 미생성',
    pnrTotal: '총pnr수',
    pnrUci: '총Uciid수',
  },
  {
    aggrDate: '일자',
    mergedNonSkypassToNonSkypass: '1',
    mergedNonSkypassToSkypass: '2',
    mergedSkypassRequest: '3',
    mergedSkypassToSkypass: '4',
    newOneidAgentMobile: '5',
    newOneidPastPnr: '6',
    newOneidPotentialConv: '7',
    newOneidSkypass: '7',
    newOneidTodayPnr: '8',
    newOneidTotal: '8',
    no: 'No',
    oneidAlone: '011',
    oneidSource: '133',
    oneidTarget: '12',
    oneidTotal: '1444',
    pnrNewOneid: '55',
    pnrNewPotentialid: '66',
    pnrReuseNonSkypass: '131',
    pnrReuseSkypass: '131',
    pnrSkipped: '131',
    pnrTotal: '총pnr수',
    pnrUci: '131',
  },
];

const dailyTotal: any = [
  { total: 'pnrTotal', value: 1 },
  { total: 'pnrUci', value: 2 },
  { total: 'pnrNewOneid', value: 3 },
  { total: 'pnrReuseSkypass', value: 4 },
  { total: 'pnrReuseNonSkypass', value: 5 },
  { total: 'pnrNewPotentialid', value: 6 },
  { total: 'pnrSkipped', value: 7 },
  { total: 'newOneidTodayPnr', value: 8 },
  { total: 'newOneidPastPnr', value: 9 },
  { total: 'newOneidPotentialConv', value: 10 },
  { total: 'newOneidSkypass', value: 11 },
  { total: 'newOneidTotal', value: 12 },
  { total: 'oneidTotal', value: 13 },
  { total: 'no', value: '13-1' },
  { total: 'oneidAlone', value: 14 },
  { total: 'oneidTarget', value: 15 },
  { total: 'oneidSource', value: 16 },
  { total: 'mergedSkypassToSkypass', value: 17 },
  { total: 'mergedNonSkypassToSkypass', value: 18 },
  { total: 'mergedNonSkypassToNonSkypass', value: 19 },
  { total: 'mergedSkypassRequest', value: 20 },
];
const oneIdSameData: OneIdSameData[] = [
  {
    no: '61',
    oneIdSourceEngFname: 'JIWON',
    oneIdSourceEngLname: 'LEE',
    oneIdSourceSkypassNo: '112720473168',
    oneIdTargetEngFname: 'JIWON',
    oneIdTargetEngLname: 'LEE',
    oneIdTargetOneId: 'S200904027366703',
    oneIdTargetSkypassNo: '112720473168',
    sourcePaxMappingOneIdNo: 'S200904027366703',
    sourcePaxMappingPnrNo: '6S5ALC',
    sourcePaxMappingUciIdNo: '310EA24B00268F0C',
  },
  {
    no: '61',
    oneIdSourceEngFname: 'JIWON',
    oneIdSourceEngLname: 'LEE',
    oneIdSourceSkypassNo: '112720473168',
    oneIdTargetEngFname: 'JIWON',
    oneIdTargetEngLname: 'LEE',
    oneIdTargetOneId: 'S200904027366703',
    oneIdTargetSkypassNo: '112720473168',
    sourcePaxMappingOneIdNo: 'S200904027366703',
    sourcePaxMappingPnrNo: '6S5ALC',
    sourcePaxMappingUciIdNo: '310EA24B00268F0C',
  },
  {
    no: '61',
    oneIdSourceEngFname: 'JIWON',
    oneIdSourceEngLname: 'LEE',
    oneIdSourceSkypassNo: '112720473168',
    oneIdTargetEngFname: 'JIWON',
    oneIdTargetEngLname: 'LEE',
    oneIdTargetOneId: 'S200904027366703',
    oneIdTargetSkypassNo: '112720473168',
    sourcePaxMappingOneIdNo: 'S200904027366703',
    sourcePaxMappingPnrNo: '6S5ALC',
    sourcePaxMappingUciIdNo: '310EA24B00268F0C',
  },
  {
    no: '61',
    oneIdSourceEngFname: 'JIWON',
    oneIdSourceEngLname: 'LEE',
    oneIdSourceSkypassNo: '112720473168',
    oneIdTargetEngFname: 'JIWON',
    oneIdTargetEngLname: 'LEE',
    oneIdTargetOneId: 'S200904027366703',
    oneIdTargetSkypassNo: '112720473168',
    sourcePaxMappingOneIdNo: 'S200904027366703',
    sourcePaxMappingPnrNo: '6S5ALC',
    sourcePaxMappingUciIdNo: '310EA24B00268F0C',
  },
  {
    no: '61',
    oneIdSourceEngFname: 'JIWON',
    oneIdSourceEngLname: 'LEE',
    oneIdSourceSkypassNo: '112720473168',
    oneIdTargetEngFname: 'JIWON',
    oneIdTargetEngLname: 'LEE',
    oneIdTargetOneId: 'S200904027366703',
    oneIdTargetSkypassNo: '112720473168',
    sourcePaxMappingOneIdNo: 'S200904027366703',
    sourcePaxMappingPnrNo: '6S5ALC',
    sourcePaxMappingUciIdNo: '310EA24B00268F0C',
  },
  {
    no: '61',
    oneIdSourceEngFname: 'JIWON',
    oneIdSourceEngLname: 'LEE',
    oneIdSourceSkypassNo: '112720473168',
    oneIdTargetEngFname: 'JIWON',
    oneIdTargetEngLname: 'LEE',
    oneIdTargetOneId: 'S200904027366703',
    oneIdTargetSkypassNo: '112720473168',
    sourcePaxMappingOneIdNo: 'S200904027366703',
    sourcePaxMappingPnrNo: '6S5ALC',
    sourcePaxMappingUciIdNo: '310EA24B00268F0C',
  },
];
const oneIdSameColumn: Column[] = [
  { headerName: 'No', field: 'no', colSpan: 0.09 },
  { headerName: 'S-OneID FirstName', field: 'oneIdSourceEngFname', colSpan: 0.09 },
  { headerName: 'S-OneID LastName', field: 'oneIdSourceEngLname', colSpan: 0.09 },
  { headerName: 'T-OneID Skypass', field: 'oneIdSourceSkypassNo', colSpan: 0.09 },
  { headerName: 'T-OneID FirstName', field: 'oneIdTargetEngFname', colSpan: 0.09 },
  { headerName: 'T-OneID LastName', field: 'oneIdTargetEngLname', colSpan: 0.09 },
  { headerName: 'T-OneID OneID', field: 'oneIdTargetOneId', colSpan: 0.09 },
  { headerName: 'T-OneID SkypassNO', field: 'oneIdTargetSkypassNo', colSpan: 0.09 },
  { headerName: 'T-OneID paxMapping OneID', field: 'sourcePaxMappingOneIdNo', colSpan: 0.09 },
  { headerName: 'S-OneID paxMapping PnrNo', field: 'sourcePaxMappingPnrNo', colSpan: 0.09 },
  { headerName: 'S-OneID paxMapping Uci-IDNo', field: 'sourcePaxMappingUciIdNo', colSpan: 0.099 },
];

export {
  onIdPaxData,
  oneIdPaxColumn,
  reason,
  historyColumn,
  mobileColumn,
  mobileData,
  mobMasterColumn,
  mobMasterData,
  relationColumn,
  relationData,
  errLogColumn,
  errLogData,
  oneIdDailyColumn,
  oneIdSameData,
  oneIdSameColumn,
  oneIdDailyData,
  masterColumn,
  ctiVocData,
  ctiVocColumn,
  dailyTotal,
  ctiVocTotal,
};
