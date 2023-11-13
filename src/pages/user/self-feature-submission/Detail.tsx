import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cloneDeep } from 'lodash'

import VerticalTable from "@/components/table/VerticalTable";
import HorizontalTable from '@components/table/HorizontalTable';
import CalcValid from '@/components/self-feature/CalcValid';
import DropList from "@/components/self-feature/DropList";
import { 
    Stack,
    TR,
    TH,
    TD,
    Typography,
    TextField,
    Button,
} from '@components/ui'

import { 
    SfSubmissionApproval,
    SfSubmissionRequestInfo,
} from "@/models/selfFeature/FeatureSubmissionInfo";
import { 
    initSfSubmissionRequestInfo,
    sfSubmissionApprovalListColumns as columns,
    initSfSubmissionApproval
} from "./data";
import { 
    FeatureInfo, 
    TbRsCustFeatRuleCalc, 
    TbRsCustFeatRuleCase, 
    TbRsCustFeatRuleTrgt, 
    TbRsCustFeatRuleTrgtFilter,
} from "@/models/selfFeature/FeatureInfo";
import { 
    initSelfFeatureInfo, 
    initTbRsCustFeatRuleCalc, 
} from "../self-feature/data";
import { 
    initApiRequest, 
    initCommonResponse, 
    initConfig, 
    selfFeatPgPpNm ,
} from "@/models/selfFeature/FeatureCommon";
import { Method } from "@/utils/ApiUtil";
import { RowsInfo } from "@/models/components/Table";

const SfSubmissionRequestDetail = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const [ regType, setRegType ] = useState<string>('')

    // 승인 정보
    const [ sfSubmissionRequestData, setSfSubmissionRequestData ] = useState<SfSubmissionRequestInfo>(cloneDeep(initSfSubmissionRequestInfo))
    const [ sfSubmissionApprovalList, setSfSubmissionApprovalList ] = useState<Array<SfSubmissionApproval>>(cloneDeep([initSfSubmissionApproval]))

    // feature 정보
    const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<string>>([])
    const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
    const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
    const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
    const [ custFeatRuleCalc, setCustFeatRuleCalc ] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
    const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([])

    useEffect(() => {
        retrieveCustFeatRuleInfos()
    }, [])

    useEffect(() => {
      // 계산식 validation을 위한 대상 list 추출
      let fList = []
      for (let i = 0; i < targetList.length; i++) {
        let t = i + 1
        fList.push(`T${t}`)
      }
      setFormulaTrgtList(fList)
    }, [targetList])

    const retrieveCustFeatRuleInfos = async () => {
        
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.GET
        let custFeatRuleId = `\${${location.state.referenceNo}}`
        request.url = `/api/v1/customerfeatures/${custFeatRuleId}`
        console.log("[retrieveSubmissions] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        //response = await callApi(request)
        console.log("[retrieveSubmissions] Response :: ", response)

        // custFeat Type에 따라 Rule / SQL 설정
        if (response.data.tbRsCustFeatRule && response.data.tbRsCustFeatRule.sqlDirectInputYn === "Y")
            setRegType(selfFeatPgPpNm.SQL_REG)
        else
            setRegType(selfFeatPgPpNm.RULE_REG)

        setFeatureInfo(response.data)
    }

    const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {
        
        if (pageNm === selfFeatPgPpNm.LIST) {
            navigate('..')
        } else if (pageNm === selfFeatPgPpNm.SUB_APRV) {
            console.log("승인처리")
        } else if (pageNm === selfFeatPgPpNm.SUB_REJT) {
            console.log("반려처리")
        }
    }

    return (
        <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
            {/* 정보 영역 */}
            <Typography variant="h2">승인 요청서 정보</Typography>
            <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                    <TR>
                        <TH colSpan={1} align="right">
                        승인 번호
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.submissionNo}
                        </TD>
                        <TH colSpan={1} align="right">
                        요청자
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.requesterName}
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        승인 유형
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.type}
                        </TD>
                        <TH colSpan={1} align="right">
                        승인 상태
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.status}
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        요청 일시
                        </TH>
                        <TD colSpan={5.01}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.requestDate}
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        승인 제목
                        </TH>
                        <TD colSpan={5.01}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.title}
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        승인 내용
                        </TH>
                        <TD colSpan={5.01}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.content}
                        </TD>
                    </TR>
                </HorizontalTable>

                <Stack justifyContent="Between" className="width-100">
                    <Typography variant="h4">결재선</Typography>
                </Stack>
                <VerticalTable
                    columns={columns}
                    rows={sfSubmissionApprovalList}
                    enableSort={false}
                />
            </Stack>
            <Typography variant="h2">요청 상세</Typography>
            <Stack direction="Vertical" gap="MD">
            {/* 기본 정보 */}
            <Typography variant="h4">Feature 기본 정보</Typography>
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
            {(regType && (regType === selfFeatPgPpNm.RULE_REG) && targetList.length > 0) &&
            <>
            <Typography variant="h4">대상 선택</Typography>
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
                </DndProvider>
            </Stack>
            </>
            }
            {/* 대상 선택 */}
            {/* SQL 입력 */}
            {(regType && (regType === selfFeatPgPpNm.SQL_REG)) &&
            <>
                <Typography variant="h4">Feature 생성 Query</Typography>
                <Stack 
                    direction="Horizontal"
                    gap="MD"
                    justifyContent="Between"
                    style={{
                    height: '400px',
                    }}
                >
                <TextField className="width-100 height-100" multiline readOnly defaultValue="SQL 입력 영역" />
                </Stack>
            </>
            }
            {/* SQL 입력 */}

            {/* 계산식 */}
            {(regType && (regType === selfFeatPgPpNm.RULE_REG) && (formulaTrgtList.length > 0)) &&
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
            <Stack justifyContent="End" gap="SM" className="width-100">
                <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
                목록
                </Button>
                <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_APRV)}>
                승인
                </Button>
                <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_REJT)}>
                반려
                </Button>
            </Stack>
            {/* 버튼 영역 */}
        </Stack>
    )
}

export default SfSubmissionRequestDetail