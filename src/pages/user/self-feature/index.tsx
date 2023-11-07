import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from "lodash";

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
} from '@components/ui';
import CustFeatParentChildListPop from "@/components/self-feature/popup/CustFeatParentChildListPop";
import ConfirmModal from "@/components/modal/ConfirmModal";
import AddIcon from '@mui/icons-material/Add'

import {  TbRsCustFeatRule } from '@/models/selfFeature/FeatureInfo'
import { RowsInfo } from "@/models/components/Table";
import { 
  featListColumns as columns,
  initTbRsCustFeatRule,
  protoTbRsCustFeatRuleList,
} from "./data";
import { Method, callApi } from "@/utils/ApiUtil";
import { StatusCode } from "@/models/common/CommonResponse"
import {
  selfFeatPgPpNm,
  initConfig,
  initApiRequest,
  initCommonResponse,
  ModalType,
  ModalTitCont,
  initQueryParams,
} from '@/models/selfFeature/FeatureCommon';

const category = [
  { value: '', text: '선택' },
  { value: 'PROPORTION', text: '비율' },
  { value: 'SUM', text: '합계' },
  { value: 'TOP_N', text: 'Top N' },
  { value: 'CASE', text: 'Case문 사용' },
  { value: 'COUNT', text: '건수' },
  { value: 'AVG', text: '평균' },
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

  const [ searchInfo, setSearchInfo ] = useState<Object>({
    mstrSgmtRuleId: '',
    custFeatRuleName: '',
    category: '',
    useYn: '',
    submissionStatus: '',
  })
  const [ selfFeatureList, setSelfFeatureList ] = useState<Array<TbRsCustFeatRule>>([])
  const [ delList, setDelList ] = useState<Array<TbRsCustFeatRule>>([])

  const [ isOpenFeatPrntChldPop, setIsOpenFeatPrntChldPop ] = useState<boolean>(false)
  const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
  const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
  const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
  const [ modalType, setModalType ] = useState<string>('')

  useEffect(() => {
    // 공통 코드 API CALL && 초기 LIST 조회 API CALL -> useQuery 사용하기
    retrieveCustFeatRules()
  }, [])

  const retrieveCustFeatRules = async () => {
    /*
    Method      :: GET
    Url         :: /api/v1/customerfeatures
    path param  :: 
    query param :: mstrSgmtRuleId=&custFeatRuleName=&useYn=&category=&submissionStatus=
    body param  :: 
    */
    let config = cloneDeep(initConfig)
    config.isLoarding = true
    let request = cloneDeep(initApiRequest)
    request.method = Method.GET
    request.url = "/api/v1/customerfeatures"
    request.params!.queryParams = Object.assign(cloneDeep(initQueryParams), searchInfo)
    console.log("[retrieveCustFeatRules] Request  :: ", request)

    let response = cloneDeep(initCommonResponse)
    //response = await callApi(request)
    console.log("[retrieveCustFeatRules] Response :: ", response)

    let list: Array<TbRsCustFeatRule> = []
    /*
    if (response.successOrNot === StatusCode.SUCCESS) {
      list = response.data
    }
    */
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
      prevState = protoTbRsCustFeatRuleList//list
      return cloneDeep(prevState)
    })
  }

  const deleteCustFeatRule =async () => {

    if (delList.length < 1) return

    let config = cloneDeep(initConfig)
    config.isLoarding = true
    let request = cloneDeep(initApiRequest)
    request.method = Method.DELETE
    request.url = "/api/v1/customerfeatures"
    let custFeatRuleIds: Array<string> = []
    delList.map((feature: TbRsCustFeatRule) => {
      custFeatRuleIds.push(feature.id)
    })
    request.params!.queryParams = Object.assign(cloneDeep(initQueryParams), {custFeatRuleIds: custFeatRuleIds.toString()})
    console.log("[deleteCustFeatRule] Request  :: ", request)

    let response = cloneDeep(initCommonResponse)
    response = await callApi(request)
    console.log("[deleteCustFeatRule] Response :: ", response)

  }
  
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
    retrieveCustFeatRules()
  }

  const getCheckList = (checkedList: Array<number>) => {
    setDelList(() => {
      let delList = checkedList.map((delItemIdx) => selfFeatureList[delItemIdx])
      return cloneDeep(delList)
    })
  }

  const deleteSelfFeature = () => {
    setConfirmModalTit(ModalTitCont.DELETE.title)
    if (delList.length < 1) {
      setModalType(ModalType.ALERT)
      setConfirmModalCont(ModalTitCont.DEL_VALID.context)
      setIsOpenConfirmModal(true)
      return
    }
    setModalType(ModalType.CONFIRM)
    setConfirmModalCont(ModalTitCont.DELETE.context)
    setIsOpenConfirmModal(true)
  }

  const onConfirm = () => {
    if (modalType === ModalType.CONFIRM) deleteCustFeatRule()
    setIsOpenConfirmModal(false)
  }

  const onCancel = () => {
    setIsOpenConfirmModal(false)
  }

  return (
  <Stack direction="Vertical" gap="LG" className="height-100">
    <Stack direction="Horizontal" gap="MD" justifyContent="End">
      <Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.PRNTCHLD)}>
      Feature 선후행 관계
      </Button>
    </Stack>
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
          <TD colSpan={5.01}>
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
        clickable={true}
        rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
        onClick={(rows: RowsInfo) => onClickPageMovHandler(selfFeatPgPpNm.DETL, rows)}
      />
      <Pagination size="MD" />
      <Stack className="pagination-layout">  
      <Stack justifyContent="End" gap="SM" className="width-100">
        <Button priority="Normal" appearance="Outline" size="LG" onClick={deleteSelfFeature}>
        삭제
        </Button>
        <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.RULE_REG)}>
        <AddIcon />
        Rule 등록
        </Button>
        <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SQL_REG)}>
        <AddIcon />
        SQL 등록
        </Button>
      </Stack>
      </Stack>
    </Stack>

    {/* 팝업 */}
    <CustFeatParentChildListPop 
      isOpen={isOpenFeatPrntChldPop} 
      onClose={(isOpen) => setIsOpenFeatPrntChldPop(isOpen)} 
    />
    {/* Confirm 모달 */}
    <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={(isOpen) => setIsOpenConfirmModal(isOpen)}
        title={confirmModalTit}
        content={confirmModalCont}
        onConfirm={onConfirm}
        onCancle={onCancel}
        btnType={modalType}
    />

  </Stack>
  )
}
export default SelfFeature;