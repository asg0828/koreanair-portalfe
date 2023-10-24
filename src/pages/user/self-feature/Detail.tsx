import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { cloneDeep } from "lodash";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import HorizontalTable from '@components/table/HorizontalTable';
import DropList from '@/components/self-feature/DropList';
import {
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
    Typography,
    Page,
  } from '@components/ui';

import { 
  FeatureInfo, 
  TbRsCustFeatRule, 
  TbRsCustFeatRuleTrgt, 
  TbRsCustFeatRuleTrgtFilter, 
  selfFeatPgPpNm, 
  subFeatStatus 
} from '@/models/selfFeature/FeatureInfo';
import { initSelfFeatureInfo, initTbRsCustFeatRule, initTbRsCustFeatRuleTrgt, initTbRsCustFeatRuleTrgtFilter } from './data';

const SelfFeatureDetail = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
    const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
    const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])

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
    }, [featureInfo])

    const onClickPageMovHandler = (pageNm: string) => {
        if (pageNm === selfFeatPgPpNm.LIST) {
          navigate('..')
        } else if (pageNm === selfFeatPgPpNm.SUBINFO) {
          console.log("승인확인 버튼")
        } else if (pageNm === selfFeatPgPpNm.SUBMCFRM) {
          console.log("승인요청 버튼")
        } else if (pageNm === selfFeatPgPpNm.EDIT) {
          navigate(`../${pageNm}`, { state: featureInfo })
        } else {
          navigate(`../${pageNm}`)
        }
    }
    
    const retrieveCustFeatRuleInfos = () => {
      // apiUrl :: /api/v1/customerfeatures/{custFeatRuleId(location.state.id)}
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
            targetId:"featureBehvTable1_2023925124157637",
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
            targetId:"featureBehvTable1_2023925124157637",
          }
        )
        tbRsCustFeatRuleTrgtFilterList.push(tbRsCustFeatRuleTrgtFilter)
        rtn.tbRsCustFeatRuleTrgtFilterList = tbRsCustFeatRuleTrgtFilterList

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
            <Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.EDIT)}>
              수정
            </Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBMCFRM)}>
              승인요청
            </Button>
          </Stack>
        )
      } else {
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
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
            <Typography variant="h2">1. Feature 기본 정보</Typography>
              <HorizontalTable>
                <TR>
                  <TH colSpan={1} align="center">대구분</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && `대구분`}
                  </TD>
                  <TH colSpan={1} align="center">중구분</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && `중구분`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="center">Feature ID</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.id}
                  </TD>
                  <TH colSpan={1} align="center">Feature 타입</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && `Self Feature`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="center">한글명</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && `한글명`}
                  </TD>
                  <TH colSpan={1} align="center">영문명</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.name}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="center">Feature 정의</TH>
                  <TD colSpan={7}>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.description}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="center">산출 단위</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && `산출 단위`}
                  </TD>
                  <TH colSpan={1} align="center">카테고리</TH>
                  <TD colSpan={3}>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.category}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="center">산출 로직</TH>
                  <TD colSpan={7}>
                    {featureInfo.tbRsCustFeatRule && `산출 로직`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="center">비고</TH>
                  <TD colSpan={7}>
                    {featureInfo.tbRsCustFeatRule && `비고`}
                  </TD>
                </TR>
              </HorizontalTable>
            {/* 기본 정보 */}

            {/* 대상 선택 */}
            <Typography variant="h2">2. 대상 선택</Typography>
              {/* drag && drop 영역*/}
              <Stack 
                  direction="Horizontal"
                  gap="MD"
                  justifyContent="Between"
                  style={{
                    height: '220px',
                  }}
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
            <Typography variant="h2">3. 계산식</Typography>
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