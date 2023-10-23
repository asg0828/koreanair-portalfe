import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import HorizontalTable from '@components/table/HorizontalTable';
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
import { FeatureInfo, TbRsCustFeatRule, TbRsCustFeatRuleTrgt, TbRsCustFeatRuleTrgtFilter } from '@/models/selfFeature/FeatureInfo';
import { cloneDeep } from "lodash";
import DropList from '@/components/self-feature/DropList';
import DragList from '@/components/self-feature/DragList';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { initSelfFeatureInfo } from './data';

const SelfFeatureDetail = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(initSelfFeatureInfo)
    const [ featureStatus, setFeatureStatus ] = useState<string>("")
    
    const [ dragList, setDragList ] = useState<Array<any>>([
      { divisionCode: 'ATTR', content: '속성데이터' },
      { divisionCode: 'FEAT', content: '픽쳐데이터' },
      { divisionCode: 'BEHV', content: '행동데이터', colList: [{ content: '행동칼럼데이터', colNm: '행동 컬럼 데이터' }] },
    ])

    const onClickPageMovHandler = (pageNm: string) => {
        if (pageNm === "list")
          navigate('..')
        else
          navigate(`../${pageNm}`)
    }
    const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
    }
    
    const getTargetList = (list: Array<TbRsCustFeatRuleTrgt>) => {
      console.log(list)
      setFeatureInfo((state: FeatureInfo) => {
        let temp = cloneDeep(state)
        temp.tbRsCustFeatRuleTrgtList = list
        return temp
      })
    }

    const getTrgtFilterList = (list: Array<TbRsCustFeatRuleTrgtFilter>) => {
      console.log(list)
      setFeatureInfo((state: FeatureInfo) => {
        let temp = cloneDeep(state)
        temp.tbRsCustFeatRuleTrgtFilterList = list
        return temp
      })
    }
    
    const retrieveFeatureInfo = () => {
      setFeatureInfo((prevState: FeatureInfo) => {
        let featRule: TbRsCustFeatRule = {...{
          id: location.state.id? location.state.id : '',
          name: location.state.name? location.state.name : '',
          description: location.state.description? location.state.description : '',
          rslnRuleId: location.state.rslnRuleId? location.state.rslnRuleId : '',
          mstrSgmtRuleId: location.state.mstrSgmtRuleId? location.state.mstrSgmtRuleId : '',
          mstrSgmtRuleNm: location.state.mstrSgmtRuleNm? location.state.mstrSgmtRuleNm : '',
          useYn: location.state.useYn? location.state.useYn : '',
          batManualExecTestCnt: location.state.batManualExecTestCnt? location.state.batManualExecTestCnt : 0,
          frstRegDttm: location.state.frstRegDttm? location.state.frstRegDttm : '',
          frstRegUserId: location.state.frstRegUserId? location.state.frstRegUserId : '',
          lastUpdDttm: location.state.lastUpdDttm? location.state.lastUpdDttm : '',
          lastUpdUserId: location.state.lastUpdUserId? location.state.lastUpdUserId : '',
          category: location.state.category? location.state.category : '',
          dataType: location.state.dataType? location.state.dataType : '',
          frstRegUserNm: location.state.frstRegUserNm? location.state.frstRegUserNm : '',
          lastUpdUserNm: location.state.lastUpdUserNm? location.state.lastUpdUserNm : '',
          submissionStatus: location.state.submissionStatus? location.state.submissionStatus : '',
          metaTblId: location.state.metaTblId? location.state.metaTblId : '',
          lastUpdLginId: location.state.lastUpdLginId? location.state.lastUpdLginId : ''
        }}
        prevState && (prevState.tbRsCustFeatRule = featRule)
        return cloneDeep(prevState)
      })
    }

    return (
      <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
      {/* 정보 영역 */}
        <Stack direction="Vertical" gap="MD">
          <form onSubmit={onsubmitHandler}>
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
                    height: '220px',
                  }}
              >
                <DndProvider backend={HTML5Backend}>
                  {/* drop 영역 */}
                  <DropList getTargetList={getTargetList} getTrgtFilterList={getTrgtFilterList} />
                  {/* drop 영역 */}

                  {/* drag 영역 */}
                  <DragList dragList={dragList} />
                  {/* drag 영역 */}
                </DndProvider>
              </Stack>
            {/* 대상 선택 */}

            {/* 계산식 */}
            <Typography variant="h2">3. 계산식</Typography>
            {/* 계산식 */}
          </form>
        </Stack>
      {/* 정보 영역 */}

      {/* 버튼 영역 */}
        <Stack direction="Vertical" gap="MD" justifyContent="End">
          {/* 컴포넌트 분리해서 사용하기 - 조건이 많음 */}
            {featureStatus && featureStatus === "reg"
              ? 
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('edit')}>
                  저장
                </Button>
                <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('list')}>
                  취소
                </Button>
              </Stack> 
              : <Stack justifyContent="End" gap="SM" className="width-100">
                  <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('edit')}>
                    수정
                  </Button>
                  <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('list')}>
                    목록
                  </Button>
                </Stack>
            }
        </Stack>
      {/* 버튼 영역 */}
      </Stack>
    )
  }
  export default SelfFeatureDetail;