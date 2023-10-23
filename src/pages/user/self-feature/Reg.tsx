import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cloneDeep } from 'lodash';

import DragList from '@/components/self-feature/DragList';
import DropList from '@/components/self-feature/DropList';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, Typography } from '@components/ui'

import { 
  FeatureInfo,
  TbRsCustFeatRuleCalc,
  TbRsCustFeatRule,
  TbRsCustFeatRuleTrgt,
  TbRsCustFeatRuleTrgtFilter,
  TbRsCustFeatRuleCase,
  MstrSgmtTableandColMetaInfo,
} from '@/models/selfFeature/FeatureInfo';
import {
  initSelfFeatureInfo,
  initMstrSgmtTableandColMetaInfo,
  initBehavior,
  initTbCoMetaTblClmnInfo,
  initAttribute
} from './data'


const SelfFeatureReg = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(initSelfFeatureInfo)
  const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
  const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])

  const [ mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo ] = useState<MstrSgmtTableandColMetaInfo>(initMstrSgmtTableandColMetaInfo)

  useEffect(() => {
    // 초기 setting API Call
    getTableandColumnMetaInfoByMstrSgmtRuleId()
  }, [])
  
  useEffect(() => {
    console.log("[Reg Component] targetList update!! ", targetList)
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleTrgtList = targetList
      return rtn
    })
  }, [targetList])

  useEffect(() => {
    console.log("[Reg Component] trgtFilterList update!! ", trgtFilterList)
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleTrgtFilterList = trgtFilterList
      return rtn
    })
  }, [trgtFilterList])
  
  const getTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    console.log(`속성/Feature/행동 데이터 API CALL!`)
    setMstrSgmtTableandColMetaInfo((state: MstrSgmtTableandColMetaInfo) => {
      let temp = cloneDeep(state)
      let attributes = []
      let behaviors  = []
      if (temp) {
        temp.rslnRuleId = 'featureTest'

        for (let i = 0; i < 4; i++) {

          let behabvior = cloneDeep(initBehavior)

          behabvior.metaTblId = `featureBehvTable${i+1}`
          behabvior.metaTblLogiNm = `픽처테이블${i+1}`
          behabvior.tbCoMetaTbInfo.dbNm = `selfFeature${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblDesc = `메타테이블설명${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblDvCd = `ATTR/BEHV${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblPhysNm = `행동물리명${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblLogiNm = `행동논리명${i+1}`

          let tbCoMetaTblClmnInfoList = []
          for (let j = 0; j < 4; j++) {

            let tbCoMetaTblClmnInfo = cloneDeep(initTbCoMetaTblClmnInfo)

            tbCoMetaTblClmnInfo.metaTblId = `featureBehvTable${i+1}`
            tbCoMetaTblClmnInfo.metaTblClmnId = `featureBehvTable${i+1}Clmn${i+1}`
            tbCoMetaTblClmnInfo.metaTblClmnPhysNm = `컬럼 물리명${j+1}`
            tbCoMetaTblClmnInfo.metaTblClmnLogiNm = `컬럼 논리명${j+1}`
            tbCoMetaTblClmnInfoList.push(tbCoMetaTblClmnInfo)
          }

          behabvior.tbCoMetaTblClmnInfoList = tbCoMetaTblClmnInfoList
          behaviors.push(behabvior)
        }

        for (let i = 0; i < 4; i++) {

          let attribute = cloneDeep(initAttribute)

          attribute.metaTblId = `featureAttrTable${i+1}`
          attribute.metaTblClmnId = `featureAttrTable${i+1}Clmn${i+1}`
          attribute.metaTblClmnPhysNm = `속성컬럼물리명${i+1}`
          attribute.metaTblClmnLogiNm = `속성컬럼논리명${i+1}`
          
          attributes.push(attribute)

        }

        temp.attributes = attributes
        temp.behaviors  = behaviors
      }
      return cloneDeep(temp)
    })
  }

  const onClickPageMovHandler = (pageNm: string) => {
      if (pageNm === "list")
        navigate('..')
      else
        navigate(`../${pageNm}`)
  }
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("createCustFeatRule API CALL!")
    console.log("Self Feature insert data :: ", featureInfo)
  }

  return (
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
    {/* 정보 영역 */}
      <form onSubmit={onsubmitHandler}>
      <Stack direction="Vertical" gap="MD">
          {/* 기본 정보 */}
          <Typography variant="h2">1. Feature 기본 정보</Typography>
            <HorizontalTable>
              <TR>
                <TH colSpan={1} align="center">대구분</TH>
                <TD colSpan={3}>
                  {location.state && `대구분`}
                </TD>
                <TH colSpan={1} align="center">중구분</TH>
                <TD colSpan={3}>
                  {location.state && `중구분`}
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="center">Feature ID</TH>
                <TD colSpan={3}>
                  {location.state && location.state.id}
                </TD>
                <TH colSpan={1} align="center">Feature 타입</TH>
                <TD colSpan={3}>
                  {location.state && `Self Feature`}
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="center">한글명</TH>
                <TD colSpan={3}>
                  {location.state && `한글명`}
                </TD>
                <TH colSpan={1} align="center">영문명</TH>
                <TD colSpan={3}>
                  {location.state && location.state.name}
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="center">Feature 정의</TH>
                <TD colSpan={7}>
                  {location.state && location.state.description}
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="center">산출 단위</TH>
                <TD colSpan={3}>
                  {location.state && `산출 단위`}
                </TD>
                <TH colSpan={1} align="center">카테고리</TH>
                <TD colSpan={3}>
                  {location.state && location.state.category}
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="center">산출 로직</TH>
                <TD colSpan={7}>
                  {location.state && `산출 로직`}
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="center">비고</TH>
                <TD colSpan={7}>
                  {location.state && `비고`}
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
                  height: '400px',
                }}
            >
              <DndProvider backend={HTML5Backend}>
                {/* drop 영역 */}
                <DropList 
                  targetList={targetList} 
                  trgtFilterList={trgtFilterList} 
                  setTargetList={setTargetList} 
                  setTrgtFilterList={setTrgtFilterList} 
                />
                {/* drop 영역 */}

                {/* drag 영역 */}
                {mstrSgmtTableandColMetaInfo && 
                  <DragList 
                    attributes={mstrSgmtTableandColMetaInfo.attributes} 
                    behaviors={mstrSgmtTableandColMetaInfo.behaviors} 
                  />}
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
        <Stack justifyContent="End" gap="SM" className="width-100">
          <Button type="submit" priority="Primary" appearance="Contained" size="LG">
            저장
          </Button>
          <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('list')}>
            취소
          </Button>
        </Stack> 
      </Stack>
    {/* 버튼 영역 */}
    </form>
    </Stack>
  )

}

export default SelfFeatureReg;