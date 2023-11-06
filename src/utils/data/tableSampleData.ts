import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui';

const tableColumns = [
  { headerName: '물리명', field: 'column1', colSpan: 1 },
  { headerName: '논리명', field: 'column2', colSpan: 2 },
  { headerName: '테이블 정의', field: 'column3', colSpan: 3 },
  { headerName: '원천 테이블명', field: 'column4', colSpan: 2 },
  { headerName: 'DB명', field: 'column5', colSpan: 2 },
];

const tableRows = [
  {
    column1: 'OneID',
    column2: '고객',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: 'OneID',
    column2: '고객',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: '회원',
    column2: 'SKYPASS회원정보',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: '회원',
    column2: 'SKYPASS회원정보',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: '회원',
    column2: 'SKYPASS회원정보',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: '회원',
    column2: 'SKYPASS회원정보',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: '회원',
    column2: 'SKYPASS회원정보',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: '회원',
    column2: 'SKYPASS회원정보',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
  {
    column1: '회원',
    column2: 'SKYPASS회원정보',
    column3: '국제선 60분 이상 지연 (기상, 정비, 공항 사정)',
    column4: '',
    column5: '',
  },
];

const qnaColumns = [
  { headerName: 'No', field: 'column1', colSpan: 1 },
  { headerName: '분류', field: 'column2', colSpan: 1 },
  { headerName: '제목', field: 'column3', colSpan: 3 },
  { headerName: '상태', field: 'column4', colSpan: 1 },
  { headerName: '공개여부', field: 'column5', colSpan: 1 },
  { headerName: '작성자', field: 'column6', colSpan: 1 },
  { headerName: '등록일', field: 'column7', colSpan: 1 },
  { headerName: '조회수', field: 'column8', colSpan: 1 },
];

const qnaRows = [
  {
    column1: '10',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '확인중',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '9',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '답변 완료',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '8',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '답변 완료',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '7',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '미확인',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '6',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '답변 완료',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '5',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '미확인',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '4',
    column2: '시스템템',
    column3: '제목명입니다.',
    column4: '답변 완료',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '3',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '답변 완료',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '2',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '답변 완료',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
  {
    column1: '1',
    column2: '기타',
    column3: '제목명입니다.',
    column4: '답변 완료',
    column5: '공개',
    column6: '서비스개발본부관리자',
    column7: '0000-00-00',
    column8: '00',
  },
];

const archiveColumns = [
  { headerName: 'No', field: 'column1', colSpan: 1 },
  { headerName: '제목', field: 'column2', colSpan: 2 },
  { headerName: '내용', field: 'column3', colSpan: 4 },
  { headerName: '등록자', field: 'column4', colSpan: 2 },
  { headerName: '등록일', field: 'column5', colSpan: 1 },
];

const archiveRows = [
  {
    column1: '10',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '9',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '8',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '7',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '6',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '5',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '4',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '3',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '2',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
  {
    column1: '1',
    column2: '제목명입니다.',
    column3: '내용명입니다.',
    column4: '서비스개발본부관리자',
    column5: '0000-00-00',
  },
];

const interestColumns = [
  // 체크박스 어떻게 넣어야 할지 모르곘어요...
  // { headerName: '<Checkbox checked={checked} onCheckedChange={() => { setChecked(!checked); }}/>', field: 'column1', colSpan: 1 },
  // { headerName: '', field: 'column1' },
  { headerName: '대구분', field: 'column2', colSpan: 1 },
  { headerName: '중구분', field: 'column3', colSpan: 1 },
  { headerName: 'Feature 한글명', field: 'column4', colSpan: 2 },
  { headerName: 'Feature 영문명', field: 'column5', colSpan: 1 },
  { headerName: '정의', field: 'column6', colSpan: 3 },
  { headerName: 'Feature 신청자', field: 'column7', colSpan: 1 },
  { headerName: '신청부서', field: 'column8', colSpan: 1 },
];

const interestRows = [
  {
    // 체크박스 어떻게 넣어야 할지 모르곘어요...
    // column1: '<Checkbox checked={checked} onCheckedChange={() => { setChecked(!checked); }}/>',
    // column1: '',
    column2: '회원',
    column3: 'SKYPASS회원정보',
    column4: '회원한글명 일치여부',
    column5: 'member_yn',
    column6: 'SKYPASS 회원 한글명과',
    column7: '홍길동',
    column8: '여객마케팅부',
  },
];

const popularColumns = [
  // 체크박스 어떻게 넣어야 할지 모르곘어요...
  // { headerName: '<Checkbox checked={checked} onCheckedChange={() => { setChecked(!checked); }}/>', field: 'column1', colSpan: 1 },
  // { headerName: '', field: 'column1' },
  { headerName: '순위', field: 'column1', colSpan: 1 },
  { headerName: '대구분', field: 'column2', colSpan: 1 },
  { headerName: '중구분', field: 'column3', colSpan: 1 },
  { headerName: 'Feature 한글명', field: 'column4', colSpan: 2 },
  { headerName: 'Feature 영문명', field: 'column5', colSpan: 1 },
  { headerName: '정의', field: 'column6', colSpan: 3 },
  { headerName: 'Feature 신청자', field: 'column7', colSpan: 1 },
  { headerName: '신청부서', field: 'column8', colSpan: 1 },
];

const popularRows = [
  {
    // 체크박스 어떻게 넣어야 할지 모르곘어요...
    // column1: '<Checkbox checked={checked} onCheckedChange={() => { setChecked(!checked); }}/>',
    // column1: '',
    column1: '1',
    column2: '회원',
    column3: 'SKYPASS회원정보',
    column4: '회원한글명 일치여부',
    column5: 'member_yn',
    column6: 'SKYPASS 회원 한글명과',
    column7: '홍길동',
    column8: '여객마케팅부',
  },
];

const listColumns = [
  { headerName: 'No', field: 'column1', colSpan: 1 },
  { headerName: '제목', field: 'column2', colSpan: 7 },
  { headerName: '등록일', field: 'column3', colSpan: 1 },
  { headerName: '조회수', field: 'column4', colSpan: 1 },
];

const listRows = [
  {
    // column1 확성기 아이콘 넣고 싶은데 어떻게 넣어야 할지 모르곘어요...
    column1: '<CampaignIcon />',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '9',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '8',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '7',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '6',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '5',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '4',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '3',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '2',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
  {
    column1: '1',
    column2: '항공 보상',
    column3: 'DATASET01003(10)',
    column4: 'DICD0100001',
  },
];

const regColumns = [
  { headerName: '영문명', field: 'column1', colSpan: 2 },
  { headerName: '한글명', field: 'column2', colSpan: 2 },
  { headerName: '원천 컬럼명', field: 'column3', colSpan: 2 },
  { headerName: '정의', field: 'column3', colSpan: 3 },
  { headerName: '산출로직', field: 'column4', colSpan: 1 },
];

const regRows = [
  {
    column1: '',
    column2: '',
    column3: '',
    // column4 '<Button>보기</<Button>' 어떻게 넣어야 할지 모르곘어요...
    column4: '',
  },
];

export { popularColumns, popularRows, interestColumns, interestRows, tableColumns, tableRows, listColumns, listRows, archiveColumns, archiveRows, qnaColumns, qnaRows, regColumns, regRows };
