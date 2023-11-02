import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { cloneDeep } from "lodash";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import HorizontalTable from '@components/table/HorizontalTable';
import DropList from '@/components/self-feature/DropList';
import CalcValid from '@/components/self-feature/CalcValid';
import {
    TR,
    TH,
    TD,
    Button,
    Stack,
    Typography,
  } from '@components/ui';

import { 
  FeatureInfo, 
  TbRsCustFeatRule, 
  TbRsCustFeatRuleCalc, 
  TbRsCustFeatRuleCase, 
  TbRsCustFeatRuleTrgt, 
  TbRsCustFeatRuleTrgtFilter, 
} from '@/models/selfFeature/FeatureInfo';
import { 
  initSelfFeatureInfo, 
  initTbRsCustFeatRule, 
  initTbRsCustFeatRuleCalc, 
  initTbRsCustFeatRuleCase, 
  initTbRsCustFeatRuleTrgt, 
  initTbRsCustFeatRuleTrgtFilter,
  selfFeatPgPpNm, 
  subFeatStatus 
} from './data';

const SelfFeatureDetail = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<string>>([])

    const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
    const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
    const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
    const [ custFeatRuleCalc, setCustFeatRuleCalc ] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
    const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([])

    useEffect(() => {
      // 초기 상세 정보 조회 API CALL
      initCustFeatRule()
      retrieveCustFeatRuleInfos()
    }, [])

    const initCustFeatRule = () => {
      setFeatureInfo((state: FeatureInfo) => {
        let rtn = cloneDeep(state)
        rtn = cloneDeep(initSelfFeatureInfo)
        return rtn
      })
    }

    useEffect(() => {
      setTargetList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtList))
      setTrgtFilterList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtFilterList))
      setCustFeatRuleCalc(cloneDeep(featureInfo.tbRsCustFeatRuleCalc))
      setCustFeatRuleCaseList(cloneDeep(featureInfo.tbRsCustFeatRuleCaseList))
    }, [featureInfo])

    useEffect(() => {
      // 계산식 validation을 위한 대상 list 추출
      let fList = []
      for (let i = 0; i < targetList.length; i++) {
        let t = i + 1
        fList.push(`T${t}`)
      }
      setFormulaTrgtList(fList)
    }, [targetList])

    const onClickPageMovHandler = (pageNm: string) => {
        if (pageNm === selfFeatPgPpNm.LIST) {
          navigate('..')
        } else if (pageNm === selfFeatPgPpNm.EDIT) {
          navigate(`../${pageNm}`, { state: featureInfo })
        } else if (pageNm === selfFeatPgPpNm.SUBINFO || pageNm === selfFeatPgPpNm.SUBMCFRM) {
          // 팝업 component open시 호출
          // retrieveSubmission1
          // api url :: (GET)/api/v1/submissions/{submissionId}
          console.log("승인 팝업 open!")
        } else {
          navigate(`../${pageNm}`)
        }
    }
    
    const retrieveCustFeatRuleInfos = () => {
      /*
        Method      :: GET
        Url         :: /api/v1/customerfeatures
        path param  :: {custFeatRuleId}
        query param :: 
        body param  :: 
      */
      setFeatureInfo((state: FeatureInfo) => {
        let rtn = cloneDeep(state)
        let tbRsCustFeatRule : TbRsCustFeatRule = Object.assign(cloneDeep(initTbRsCustFeatRule), cloneDeep(location.state))
        rtn.tbRsCustFeatRule = tbRsCustFeatRule

        let tbRsCustFeatRuleTrgtList = []
        let tbRsCustFeatRuleTrgt: TbRsCustFeatRuleTrgt = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgt), 
          {
            columnName:"속성컬럼논리명1",
            divisionCode:"ATTR",
            tableName:"featureAttrTable1",
            targetId:"featureAttrTable1_202392593229538",
          }
        )
        tbRsCustFeatRuleTrgtList.push(tbRsCustFeatRuleTrgt)
        tbRsCustFeatRuleTrgt = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgt), 
          {
            columnName:"컬럼 논리명2",
            divisionCode:"BEHV",
            tableName:"featureBehvTable1",
            targetId:"featureBehvTable1_2023925124157637"
          }
        )
        tbRsCustFeatRuleTrgtList.push(tbRsCustFeatRuleTrgt)
        rtn.tbRsCustFeatRuleTrgtList = tbRsCustFeatRuleTrgtList
        
        let tbRsCustFeatRuleTrgtFilterList = []
        let tbRsCustFeatRuleTrgtFilter: TbRsCustFeatRuleTrgtFilter = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgtFilter), 
          {
            columnName:"속성컬럼논리명1",
            tableName:"featureAttrTable1",
            targetId:"featureAttrTable1_202392593229538",
          }
        )
        tbRsCustFeatRuleTrgtFilterList.push(tbRsCustFeatRuleTrgtFilter)
        tbRsCustFeatRuleTrgtFilter = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgtFilter), 
          {
            columnName:"컬럼 논리명2",
            tableName:"featureBehvTable1",
            function:"NVL",
            targetId:"featureBehvTable1_2023925124157637",
          }
        )
        tbRsCustFeatRuleTrgtFilterList.push(tbRsCustFeatRuleTrgtFilter)
        rtn.tbRsCustFeatRuleTrgtFilterList = tbRsCustFeatRuleTrgtFilterList

        let tbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc = Object.assign(
          cloneDeep(initTbRsCustFeatRuleCalc),
          {
            formula: "T1",
          }
        )
        rtn.tbRsCustFeatRuleCalc = tbRsCustFeatRuleCalc

        let tbRsCustFeatRuleCaseList = []
        let tbRsCustFeatRuleCase: TbRsCustFeatRuleCase = Object.assign(
          cloneDeep(initTbRsCustFeatRuleCase), 
          {
            whenYn: "Y",
            targetFormula: "T1",
            operator: "",
          }
        )
        tbRsCustFeatRuleCaseList.push(tbRsCustFeatRuleCase)
        tbRsCustFeatRuleCase = Object.assign(
          cloneDeep(initTbRsCustFeatRuleCase), 
          {
            whenYn: "N",
          }
        )
        tbRsCustFeatRuleCaseList.push(tbRsCustFeatRuleCase)
        rtn.tbRsCustFeatRuleCaseList = tbRsCustFeatRuleCaseList

        return rtn
      })
    }

    const DetailBtnComponent = () => {
      /**
       * 등록 / 품의 저장 -> 목록,수정,승인요청 버튼
       * 승인요청/결제진행/승인완료/반려 -> 목록,승인 확인 버튼
       */
      if (location.state.submissionStatus === subFeatStatus.REG || location.state.submissionStatus === subFeatStatus.SUBREG) {
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.EDIT)}>
              수정
            </Button>
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBMCFRM)}>
              승인요청
            </Button>
          </Stack>
        )
      } else {
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBINFO)}>
              승인확인
            </Button>
          </Stack>
        )
      }
    }

    return (
      <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
      {/* 정보 영역 */}
        <Stack direction="Vertical" gap="MD">
            {/* 기본 정보 */}
            <Typography variant="h3">Feature 기본 정보</Typography>
              <HorizontalTable>
                <TR>
                  <TH colSpan={1} align="right">대구분</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `대구분`}
                  </TD>
                  <TH colSpan={1} align="right">중구분</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `중구분`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">Feature ID</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.id}
                  </TD>
                  <TH colSpan={1} align="right">Feature 타입</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `Self Feature`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">한글명</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `한글명`}
                  </TD>
                  <TH colSpan={1} align="right">영문명</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.name}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">Feature 정의</TH>
                  <TD colSpan={5.01} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.description}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">산출 단위</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `산출 단위`}
                  </TD>
                  <TH colSpan={1} align="right">카테고리</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.category}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">산출 로직</TH>
                  <TD colSpan={5.01} align='left'>
                    {featureInfo.tbRsCustFeatRule && `산출 로직`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">비고</TH>
                  <TD colSpan={5.01} align='left'>
                    {featureInfo.tbRsCustFeatRule && `비고`}
                  </TD>
                </TR>
              </HorizontalTable>
            {/* 기본 정보 */}

            {/* 대상 선택 */}
            <Typography variant="h3">대상 선택</Typography>
              {/* drag && drop 영역*/}
              <Stack 
                  direction="Horizontal"
                  gap="MD"
                  justifyContent="Between"
                  className='dropChild-100per'
              >
                <DndProvider backend={HTML5Backend}>
                  {/* drop 영역 */}
                  <DropList 
                    featStatus={selfFeatPgPpNm.DETL}
                    targetList={targetList} 
                    trgtFilterList={trgtFilterList} 
                    setTargetList={setTargetList} 
                    setTrgtFilterList={setTrgtFilterList} 
                  />
                  {/* drop 영역 */}

                  {/* drag 영역 */}
                  {/* drag 영역 */}
                </DndProvider>
              </Stack>
            {/* 대상 선택 */}

            {/* 계산식 */}
            {formulaTrgtList.length > 0 &&
              <CalcValid
                featStatus={selfFeatPgPpNm.DETL}
                formulaTrgtList={formulaTrgtList}
                custFeatRuleCalc={custFeatRuleCalc}
                custFeatRuleCaseList={custFeatRuleCaseList}
                setCustFeatRuleCalc={setCustFeatRuleCalc}
                setCustFeatRuleCaseList={setCustFeatRuleCaseList}
              />
            }
            {/* 계산식 */}
        </Stack>
      {/* 정보 영역 */}

      {/* 버튼 영역 */}
        <Stack direction="Vertical" gap="MD" justifyContent="End">
          {/* 
            등록 / 품의 저장 -> 목록,수정,승인요청 버튼
            승인요청/결제진행/승인완료/반려 -> 목록,승인 확인 버튼
          */}
          <DetailBtnComponent/>
        </Stack>
      {/* 버튼 영역 */}
      </Stack>
    )
  }
  export default SelfFeatureDetail;