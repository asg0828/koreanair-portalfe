import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from 'lodash';

import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@components/table/HorizontalTable';
import CustFeatParentChildListPop from '@/components/self-feature/CustFeatParentChildListPop';
import { listColumns as columns, selfFeatPgPpNm, TbRsCustFeatRule } from '@/models/selfFeature/FeatureInfo';
import { RowsInfo } from '@/models/components/Table';
import {
  Pagination,
  TR,
  TH,
  TD,
  Table,
  Modal,
  Button,
  Stack,
  TextField,
  Checkbox,
  Select,
  SelectOption,
  DatePicker,
  Label,
} from '@components/ui';

import { initTbRsCustFeatRule } from './data';

const category = [
  { value: '', text: '선택' },
  { value: '1', text: 'cate1' },
  { value: '2', text: 'cate2' },
];
const useYn = [
  { value: '', text: '선택' },
  { value: 'USE_Y', text: '사용' },
  { value: 'USE_N', text: '미사용' },
];
const submissionStatus = [
  { value: '', text: '전체' },
  { value: '1', text: '등록' },
  { value: '2', text: '승인 요청 정보 등록' },
  { value: '3', text: '승인 요청' },
  { value: '4', text: '승인 요청 취소' },
  { value: '5', text: '승인 완료' },
  { value: '6', text: '반려' },
];

const SelfFeature = () => {
  const navigate = useNavigate();

  const [searchInfo, setSearchInfo] = useState<{}>({
    name: '',
    category: '',
    useYn: '',
    submissionStatus: '',
  });
  const [selfFeatureList, setSelfFeatureList] = useState<Array<TbRsCustFeatRule>>([]);
  const [delList, setDelList] = useState<Array<TbRsCustFeatRule>>([]);

  useEffect(() => {
    // 공통 코드 API CALL && 초기 LIST 조회 API CALL
    retrieveCustFeatRules();
  }, []);

  const retrieveCustFeatRules = () => {
    console.log(`RETRIEVE API CALL!`);
    // retrieveCustFeatRules
    // api Url :: (GET)/api/v1/customerfeatures?mstrSgmtRuleId=&custFeatRuleName=&useYn=&category=&submissionStatus=

    let list: Array<TbRsCustFeatRule> = [];
    for (let i = 0; i < 10; i++) {
      let selfFeature: TbRsCustFeatRule = cloneDeep(initTbRsCustFeatRule);
      selfFeature.id = `ID_${String(i)}`; //custFeatRuleId
      selfFeature.name = `NAME_${String(i)}`;
      selfFeature.description = `DESCRIPTION_${String(i)}`;
      selfFeature.lastUpdDttm = `2023-10-16 10:11:1${String(i)}`;
      selfFeature.lastUpdUserNm = 'UPDUSER_' + String(i);
      if (i % 2) {
        selfFeature.useYn = 'Y';
        selfFeature.submissionStatus = `reg`;
      } else {
        selfFeature.useYn = 'N';
        selfFeature.submissionStatus = `subInfo`;
      }
      list.push(selfFeature);
    }
    setSelfFeatureList((prevState: Array<TbRsCustFeatRule>) => {
      prevState = list;
      return cloneDeep(prevState);
    });
  };

  const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {
    if (pageNm === selfFeatPgPpNm.DETL) {
      navigate(pageNm, { state: rows });
    } else if (pageNm === selfFeatPgPpNm.PRNTCHLD) {
      // 팝업 component mount시 호출
      // retrieveCustFeatParentChildList
      // api Url :: (GET)/api/v1/customerfeatures/parent-child?mstrSgmtRuleId=&custFeatRuleName=
      console.log('Feature 선후행 관계 팝업 open!');
    } else {
      navigate(pageNm);
    }
  };

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  };
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: value });
  };
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`SEARCH PARAM INFO :: `, searchInfo);
    console.log(`SEARCH RETRIEVE API CALL!`);
    //retrieveSelfFeatureList()
  };

  const getCheckList = (checkedList: Array<number>) => {
    setDelList(() => {
      let delList = checkedList.map((delItemIdx) => selfFeatureList[delItemIdx]);
      return cloneDeep(delList);
    });
  };

  const deleteSelfFeature = () => {
    console.log('DELETE SELF FEATURE INFO :: ', delList);
    if (delList.length > 0) console.log('DELETE API CALL!');
    else alert(`삭제할 항목이 없습니다.`);
  };

  // Feature 선후행 관계 팝업 state
  const [isOpenPopup01,setIsOpenPopup01] = useState(false);
  // Feature 선후행 관계 팝업 state
  return (
    <Stack direction="Vertical" gap="MD" className="height-100">
      <Stack direction="Horizontal" gap="MD" justifyContent="End">
        {/* Feature 선후행 관계 팝업 */}
      <Modal open={isOpenPopup01} onClose={() => setIsOpenPopup01(false)} size='LG'>
        <Modal.Header>Feature 선후행 관계</Modal.Header>
        <Modal.Body className='width-100'>
          <Stack direction="Vertical" className='width-100' gap="MD">
          <HorizontalTable className='width-100'>
            <TR>
              <TH colSpan={1} align="right">
                Feature 명
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className='width-100'>
                  <TextField className='width-100'/>
                  <Button type="submit" priority="Primary" appearance="Contained" size="MD">
                    <span className="searchIcon"></span>
                </Button>
                </Stack>
              </TD>
              </TR>
            </HorizontalTable>
            <Stack justifyContent="Between" className='width-100'>
              <Label>
                총 <span className="total">7</span> 개
              </Label>
              <Select appearance="Outline" size="LG" defaultValue={5} className="select-page">
                <SelectOption value={5}>5개</SelectOption>
                <SelectOption value={10}>10개</SelectOption>
                <SelectOption value={25}>25개</SelectOption>
              </Select>
            </Stack>
            <Table className='width-100'>
              <TR>
                <TH colSpan={1}>
                  순서
                </TH>
                <TH colSpan={3}>
                  Feature 명
                </TH>
                <TH colSpan={2}>
                  진행 상태
                </TH>
                <TH colSpan={3}>
                  선행 Feature
                </TH>
                <TH colSpan={3}>
                  후행 Feature
                </TH>
              </TR>
              <TR>
                <TD colSpan={1}>
                  1
                </TD>
                <TD colSpan={3}>
                  Feature 명 1234
                </TD>
                <TD colSpan={2}>
                  진행 상태 asdgf
                </TD>
                <TD colSpan={3}>
                  선행 Feature 135421
                </TD>
                <TD colSpan={3}>
                  후행 Feature 2154125
                </TD>
              </TR>
              <TR>
                <TD colSpan={1}>
                  2
                </TD>
                <TD colSpan={3}>
                  Feature 명 1234
                </TD>
                <TD colSpan={2}>
                  진행 상태 asdgf
                </TD>
                <TD colSpan={3}>
                  선행 Feature 135421
                </TD>
                <TD colSpan={3}>
                  후행 Feature 2154125
                </TD>
              </TR>
              <TR>
                <TD colSpan={1}>
                  3
                </TD>
                <TD colSpan={3}>
                  Feature 명 1234
                </TD>
                <TD colSpan={2}>
                  진행 상태 asdgf
                </TD>
                <TD colSpan={3}>
                  선행 Feature 135421
                </TD>
                <TD colSpan={3}>
                  후행 Feature 2154125
                </TD>
              </TR>
            </Table>
          </Stack>
          <Pagination size="MD" className="pagination" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsOpenPopup01(false)}  priority="Normal" appearance="Outline" size="LG" >닫기</Button>
        </Modal.Footer>
      </Modal>
      {/* Feature 선후행 관계 팝업 */}
      <Stack direction="Horizontal" justifyContent="End">
        <Button priority="Normal" appearance="Contained" size="LG" onClick={() => setIsOpenPopup01(true)}>
          Feature 선후행 관계
        </Button>
      </Stack>
      </Stack>
      {/* 검색 영역 */}
      <form onSubmit={onsubmitHandler}>
        <Stack direction="Vertical" gap="MD">
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              카테고리
            </TH>
            <TD colSpan={5.01}>
              <Select
                appearance="Outline"
                placeholder="선택"
                className="width-100"
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'category');
                }}
              >
                {category.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))}
              </Select>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              Feature 명
            </TH>
            <TD colSpan={5.01}>
              <TextField className="width-100" id="name" onChange={onchangeInputHandler} />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">사용 여부</TH>
            <TD colSpan={2}>
              <Select
                appearance="Outline"
                placeholder="선택"
                className="width-100"
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'useYn');
                }}
              >
                {useYn.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))}
              </Select>
            </TD>
            <TH colSpan={1} align="right">진행 상태</TH>
            <TD colSpan={2}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'submissionStatus');
                }}
              >
                {submissionStatus.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))}
              </Select>
            </TD>
          </TR>
        </HorizontalTable>

        <Stack gap="SM" justifyContent="Center">
        <Button type="submit" priority="Primary" appearance="Contained" size="LG">
            <span className="searchIcon"></span>
            검색
        </Button>
        </Stack>
        </Stack>
      </form>
      {/* 검색 영역 */}

      <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
        <Stack justifyContent="Between">
          <Label>총 <span className="total">{selfFeatureList.length}</span> 건</Label>
          <Select appearance="Outline" size="LG" defaultValue={10} className="select-page">
            <SelectOption value={10}>10건</SelectOption>
            <SelectOption value={50}>50건</SelectOption>
            <SelectOption value={100}>100건</SelectOption>
          </Select>
        </Stack>
        <VerticalTable
          columns={columns}
          rows={selfFeatureList}
          enableSort={false}
          clickable={true}
          rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
          onClick={(rows: RowsInfo) => onClickPageMovHandler('detail', rows)}
        />
        <Stack>
          <Stack justifyContent="End" gap="SM" className="width-100">
            {/* <Button size="LG">엑셀다운로드</Button> */}
            <Button priority="Normal" appearance="Outline" size="LG" onClick={deleteSelfFeature}>
              삭제
            </Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('reg')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"></path>
              </svg>
              Rule 등록
            </Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('reg')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"></path>
              </svg>
              SQL 등록
            </Button>
          </Stack>
        </Stack>
        <Pagination size="LG" className="pagination" />
      </Stack>
    </Stack>
  );
};
export default SelfFeature;
