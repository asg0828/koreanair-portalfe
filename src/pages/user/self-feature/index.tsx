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
} from '@components/ui';
import CustFeatParentChildListPop from "@/components/self-feature/popup/CustFeatParentChildListPop";
import ConfirmModal from "@/components/modal/ConfirmModal";
import AddIcon from '@mui/icons-material/Add'

import {  TbRsCustFeatRule } from '@/models/selfFeature/FeatureInfo'
import { 
  category,
  featListColumns as columns,
  submissionStatus,
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
  subFeatStatus,
} from '@/models/selfFeature/FeatureCommon';

export interface searchProps {
  mstrSgmtRuleId: string
  custFeatRuleName: string
  category: string
  useYn: string
  submissionStatus: string
}

const SelfFeature = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const [ searchInfo, setSearchInfo ] = useState<searchProps>({
    mstrSgmtRuleId: 'MS_0006',
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
    if (location.state) {
      if (location.state.submissionStatus === "reg") {
        setSearchInfo((state: searchProps) => {
          state.submissionStatus = subFeatStatus.SAVE
          return cloneDeep(state)
        })
      } else {
        setSearchInfo((state: searchProps) => {
          state.submissionStatus = location.state.submissionStatus
          return cloneDeep(state)
        })
      }
    }
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
    response = await callApi(request)
    console.log("[retrieveCustFeatRules] Response header       :: ", response.header)
    console.log("[retrieveCustFeatRules] Response statusCode   :: ", response.statusCode)
    console.log("[retrieveCustFeatRules] Response status       :: ", response.status)
    console.log("[retrieveCustFeatRules] Response successOrNot :: ", response.successOrNot)
    console.log("[retrieveCustFeatRules] Response result       :: ", response.result)

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
    //response = await callApi(request)
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
  /*
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
  */
  const onConfirm = () => {
    if (modalType === ModalType.CONFIRM) deleteCustFeatRule()
    setIsOpenConfirmModal(false)
  }

  const onCancel = () => {
    setIsOpenConfirmModal(false)
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