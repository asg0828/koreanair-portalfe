import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from "lodash";

import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@components/table/HorizontalTable';
import { listColumns as columns, selfFeatPgPpNm, TbRsCustFeatRule } from '@/models/selfFeature/FeatureInfo'
import { RowsInfo } from "@/models/components/Table";
import {
    Pagination,
    TR,
    TH,
    TD,
    Button,
    Stack,
    TextField,
    Checkbox,
    Select,
    SelectOption,
    DatePicker,
    Label,
  } from '@components/ui';

import { 
  initTbRsCustFeatRule 
} from "./data";

const category = [
  { value: '', text: '선택' },
  { value: '1', text: 'cate1' },
  { value: '2', text: 'cate2' },
]
const useYn = [
  { value: '', text: '선택' },
  { value: 'USE_Y', text: '사용' },
  { value: 'USE_N', text: '미사용' },
]
const submissionStatus = [
  { value: '', text: '전체' },
  { value: '1', text: '등록' },
  { value: '2', text: '승인 요청 정보 등록' },
  { value: '3', text: '승인 요청' },
  { value: '4', text: '승인 요청 취소' },
  { value: '5', text: '승인 완료' },
  { value: '6', text: '반려' },
]

const SelfFeature = () => {

    const navigate = useNavigate();

    const [ searchInfo, setSearchInfo ] = useState<{}>({
      name: '',
      category: '',
      useYn: '',
      submissionStatus: '',
    })
    const [ selfFeatureList, setSelfFeatureList ] = useState<Array<TbRsCustFeatRule>>([])
    const [ delList, setDelList ] = useState<Array<TbRsCustFeatRule>>([])

    useEffect(() => {
      // 공통 코드 API CALL && 초기 LIST 조회 API CALL
      retrieveCustFeatRules()
    }, [])

    const retrieveCustFeatRules = () => {
      console.log(`RETRIEVE API CALL!`)
      // retrieveCustFeatRules
      // api Url :: (GET)/api/v1/customerfeatures?mstrSgmtRuleId=&custFeatRuleName=&useYn=&category=&submissionStatus=

      let list: Array<TbRsCustFeatRule> = []
      for (let i = 0; i < 10; i++) {
        let selfFeature: TbRsCustFeatRule = cloneDeep(initTbRsCustFeatRule)
        selfFeature.id = `ID_${String(i)}` //custFeatRuleId
        selfFeature.name = `NAME_${String(i)}`
        selfFeature.description = `DESCRIPTION_${String(i)}`
        selfFeature.lastUpdDttm = `2023-10-16 10:11:1${String(i)}`
        selfFeature.lastUpdUserNm = "UPDUSER_" + String(i)
        if (i % 2) {
          selfFeature.useYn = "Y"
          selfFeature.submissionStatus = `reg`
        } else {
          selfFeature.useYn = "N"
          selfFeature.submissionStatus = `subInfo`
        }
        list.push(selfFeature)
      }
      setSelfFeatureList((prevState: Array<TbRsCustFeatRule>) => {
        prevState = list
        return cloneDeep(prevState)
      })
    }

    const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {
      if (pageNm === selfFeatPgPpNm.DETL) {
          navigate(pageNm, { state: rows })
      } else if (pageNm === selfFeatPgPpNm.PRNTCHLD) {
        // 팝업 component mount시 호출
        // retrieveCustFeatParentChildList
        // api Url :: (GET)/api/v1/customerfeatures/parent-child?mstrSgmtRuleId=&custFeatRuleName=
        console.log("Feature 선후행 관계 팝업 open!")
      } else {
          navigate(pageNm)
      }
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target
      setSearchInfo({...searchInfo, [id]: value,})
    }
    const onchangeSelectHandler = (
      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
      value: SelectValue<{}, false>,
      id?: String
    ) => {
      setSearchInfo({...searchInfo, [`${id}`]: value ,})
    }
    const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      console.log(`SEARCH PARAM INFO :: `, searchInfo)
      console.log(`SEARCH RETRIEVE API CALL!`)
      //retrieveSelfFeatureList()
    }

    const getCheckList = (checkedList: Array<number>) => {
      setDelList(() => {
        let delList = checkedList.map((delItemIdx) => selfFeatureList[delItemIdx])
        return cloneDeep(delList)
      })
    }

    const deleteSelfFeature = () => {
      console.log("DELETE SELF FEATURE INFO :: ", delList)
      if (delList.length > 0) console.log("DELETE API CALL!")
      else alert(`삭제할 항목이 없습니다.`)
    }

    return (
      <Stack direction="Vertical" gap="MD" className="height-100">
        <Stack direction="Horizontal" gap="MD" justifyContent="End">
          <Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.PRNTCHLD)}>
            Feature 선후행 관계
          </Button>
        </Stack>
        {/* 검색 영역 */}
        <form onSubmit={onsubmitHandler}>
          <HorizontalTable>
            <TR>
              <TH colSpan={1} align="right">카테고리</TH>
              <TD colSpan={3}>
                <Select 
                  appearance="Outline" 
                  placeholder="선택" 
                  className="width-100" 
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    onchangeSelectHandler(e, value, "category")
                  }}
                >
                  {category.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                  ))}
                </Select>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">Feature 명</TH>
              <TD colSpan={3}>
                <TextField className="width-100" id="name" onChange={onchangeInputHandler}/>
              </TD>
            </TR>
            <TR>
              <TH align="right">사용 여부</TH>
              <TD>
                <Select 
                  appearance="Outline" 
                  placeholder="선택" 
                  className="width-100" 
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    onchangeSelectHandler(e, value, "useYn")
                  }}
                >
                  {useYn.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                  ))}
                </Select>
              </TD>
              <TH align="right">진행 상태</TH>
              <TD>
                <Select 
                  appearance="Outline" 
                  placeholder="전체" 
                  className="width-100" 
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    onchangeSelectHandler(e, value, "submissionStatus")
                  }}
                >
                  {submissionStatus.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                  ))}
                </Select>
              </TD>
            </TR>
          </HorizontalTable>

          <Stack gap="SM" justifyContent="Center">
            <Button type="submit" priority="Primary" appearance="Contained" size="LG" >
              검색
            </Button>
          </Stack>
        </form>
        {/* 검색 영역 */}

        <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
          <Label>총 {selfFeatureList.length} 건</Label>
          <VerticalTable
            columns={columns}
            rows={selfFeatureList}
            enableSort={true}
            clickable={true}
            rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
            onClick={(rows: RowsInfo) => onClickPageMovHandler(selfFeatPgPpNm.DETL, rows)}
          />
          <Stack className="pagination-layout">
            <Select appearance="Outline" size="LG" defaultValue={10} className="select-page">
              <SelectOption value={10}>10</SelectOption>
              <SelectOption value={30}>30</SelectOption>
              <SelectOption value={50}>50</SelectOption>
            </Select>
  
            <Pagination size="LG" className="pagination" />
  
            <Stack justifyContent="End" gap="SM" className="width-100">
              {/* <Button size="LG">엑셀다운로드</Button> */}
              <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.REG)}>
                등록
              </Button>
              <Button priority="Primary" appearance="Contained" size="LG" onClick={deleteSelfFeature}>
                삭제
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    )
  }
  export default SelfFeature;