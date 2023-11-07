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

const dataroomColumns = [
  { headerName: 'No', field: 'column1', colSpan: 1 },
  { headerName: '제목', field: 'column2', colSpan: 2 },
  { headerName: '내용', field: 'column3', colSpan: 4 },
  { headerName: '등록자', field: 'column4', colSpan: 2 },
  { headerName: '등록일', field: 'column5', colSpan: 1 },
];

const dataroomRows = [
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
  { headerName: '물리명', field: 'column1' },
  { headerName: '논리명', field: 'column2' },
  { headerName: '정의', field: 'column3' },
  { headerName: '산출로직', field: 'column4' },
];

const regRows = [
  {
    column1: '',
    column2: '',
    column3: '',
    column4: '',
  },
];

export { listColumns, listRows, dataroomColumns, dataroomRows, qnaColumns, qnaRows, regColumns, regRows };
