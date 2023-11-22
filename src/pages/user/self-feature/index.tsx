import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from "lodash";

import { RowsInfo } from "@/models/components/Table";
import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@components/table/HorizontalTable';
import {
  Pagination,
  TR,
  TH,
  TD,
  Button,
  Stack,
  TextField,
  Select,
  SelectOption,
  Label,
  useToast,
} from '@components/ui';
import CustFeatParentChildListPop from "@/components/self-feature/popup/CustFeatParentChildListPop";
import { AddIcon } from '@/assets/icons';

import {  FeatListSrchProps, TbRsCustFeatRule } from '@/models/selfFeature/FeatureInfo'
import { 
  category,
  featListColumns as columns,
  submissionStatus,
} from "./data";
import { StatusCode } from "@/models/common/CommonResponse"
import {
  selfFeatPgPpNm,
  subFeatStatus,
  RuleId,
} from '@/models/selfFeature/FeatureCommon';
import { useCustFeatRules } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries";
import { ValidType } from "@/models/common/Constants";

const SelfFeature = () => {


  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const [ searchInfo, setSearchInfo ] = useState<FeatListSrchProps>({
    mstrSgmtRuleId: RuleId.MASTERPROF,
    custFeatRuleName: '',
    category: '',
    useYn: '',
    submissionStatus: '',
  })
  const { data: response, isError, refetch } = useCustFeatRules(searchInfo)

  const [ selfFeatureList, setSelfFeatureList ] = useState<Array<TbRsCustFeatRule>>([])

  const [ isOpenFeatPrntChldPop, setIsOpenFeatPrntChldPop ] = useState<boolean>(false)

  useEffect(() => {
    if (location.state) {
      if (location.state.submissionStatus === "reg") {
        setSearchInfo((state: FeatListSrchProps) => {
          state.submissionStatus = subFeatStatus.SAVE
          return cloneDeep(state)
        })
      } else {
        setSearchInfo((state: FeatListSrchProps) => {
          state.submissionStatus = location.state.submissionStatus
          return cloneDeep(state)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
        toast({
            type: ValidType.ERROR,
            content: '조회 중 에러가 발생했습니다.',
        });
    } else {
        if (response) {
            console.log(response)
            if (response.statusCode === StatusCode.SUCCESS) {
              setSelfFeatureList(() => {
                let rtn = cloneDeep(response.result)
        
                rtn = rtn.map((sf: TbRsCustFeatRule) => {
                  let t = cloneDeep(sf)
                  if (
                    !t.submissionStatus
                    || t.submissionStatus === "" 
                    || t.submissionStatus === submissionStatus[1].value
                  ) {
                    t.submissionStatusNm = submissionStatus[1].text
                  } else if (
                    t.submissionStatus === "requested" 
                    || t.submissionStatus === submissionStatus[2].value
                  ) {
                    t.submissionStatusNm = submissionStatus[2].text
                  } else if (t.submissionStatus === submissionStatus[3].value) {
                    t.submissionStatusNm = submissionStatus[3].text
                  } else if (t.submissionStatus === submissionStatus[4].value) {
                    t.submissionStatusNm = submissionStatus[4].text
                  }
                  return t
                })
                return rtn
              })
            }
        }
    }
  }, [response, isError, refetch, toast])
  
  const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {
    if (pageNm === selfFeatPgPpNm.DETL) {
      navigate(pageNm, { state: rows })
    } else if (pageNm === selfFeatPgPpNm.PRNTCHLD) {
      setIsOpenFeatPrntChldPop((prevState) => !prevState)
    } else if (pageNm === selfFeatPgPpNm.RULE_REG || pageNm === selfFeatPgPpNm.SQL_REG) {
      navigate(selfFeatPgPpNm.REG, { state: { regType: pageNm } })
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
    setSearchInfo({...searchInfo, [`${id}`]: String(value),})
  }
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    refetch()
  }

  return (
  <Stack direction="Vertical" gap="LG" className="height-100">
    {/* 관리자(1차)인 경우만 노출 */}
    {/* <Stack direction="Horizontal" gap="MD" justifyContent="End">
      <Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.PRNTCHLD)}>
      Feature 연결 관계
      </Button>
    </Stack> */}
    {/* 검색 영역 */}
    <form onSubmit={onsubmitHandler}>
    <Stack direction="Vertical" gap="LG">
      <HorizontalTable>
        <TR>
          <TH colSpan={1} align="right">카테고리</TH>
          <TD colSpan={2}>
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
          <TH align="right" colSpan={1}>진행 상태</TH>
          <TD colSpan={2}>
            <Select 
              value={searchInfo.submissionStatus}
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
        <TR>
          <TH colSpan={1} align="right">Feature 명</TH>
          <TD colSpan={5}>
            <TextField className="width-100" id="custFeatRuleName" onChange={onchangeInputHandler}/>
          </TD>
        </TR>
        <TR>
          {/* <TH align="right" colSpan={1}>사용 여부</TH>
          <TD colSpan={2}>
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
          </TD> */}
        </TR>
      </HorizontalTable>
      <Stack gap="SM" justifyContent="Center">
        <Button type="submit" priority="Primary" appearance="Contained" size="LG" >
        <span className="searchIcon"></span>
        검색
        </Button>
      </Stack>
    </Stack>
    </form>
    {/* 검색 영역 */}

    <Stack direction="Vertical" gap="LG" justifyContent="End" className="height-100">
      <Stack justifyContent="Between">
        <Label>총 <span className="total">{selfFeatureList.length}</span> 건</Label>
        <Select 
          appearance="Outline" 
          size="LG" 
          defaultValue={10} 
          className="select-page"
        >
          <SelectOption value={10}>10</SelectOption>
          <SelectOption value={30}>30</SelectOption>
          <SelectOption value={50}>50</SelectOption>
        </Select>
      </Stack>
      <VerticalTable
        columns={columns}
        rows={selfFeatureList}
        enableSort={true}
        clickable={false}
        //rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
        onClick={(rows: RowsInfo) => onClickPageMovHandler(selfFeatPgPpNm.DETL, rows)}
      />
      <Pagination size="MD" />
      <Stack className="pagination-layout">  
      <Stack justifyContent="End" gap="SM" className="width-100">
        {/* <Button priority="Normal" appearance="Outline" size="LG" onClick={deleteSelfFeature}>
        삭제
        </Button> */}
        <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.RULE_REG)}>
        <AddIcon />
        신규 등록
        </Button>
        {/* 관리자(1차)인 경우만 노출 */}
        {/* <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SQL_REG)}>
        <AddIcon />
        SQL 신규 등록
        </Button> */}
      </Stack>
      </Stack>
    </Stack>

    {/* 팝업 */}
    <CustFeatParentChildListPop 
      isOpen={isOpenFeatPrntChldPop} 
      onClose={(isOpen) => setIsOpenFeatPrntChldPop(isOpen)} 
    />

  </Stack>
  )
}
export default SelfFeature;