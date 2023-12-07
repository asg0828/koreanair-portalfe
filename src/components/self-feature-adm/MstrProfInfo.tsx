import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect'

import {
    Select,
    SelectOption,
    Stack,
    TextField,
    Typography,
    useToast,
} from '@/components/ui'

import {
    AttrBehvMstrProfInfoProps,
    MetaColumnIsResolutionInfoSearchProps,
    TbCoMetaTbInfo,
    TbCoMetaTblClmnInfo,
    TbRsMstrSgmtRuleAttrClmn,
} from '@/models/selfFeature/FeatureAdmModel'
import {
    initMetaColumnIsResolutionInfoSearchJoinkeyProps,
    initMetaColumnIsResolutionInfoSearchProps,
} from '@/pages/admin/self-feature-meta-management/master-profile-management/data'
import { useMetaColumnIsResolutionInfo, useMetaColumnIsResolutionJoinkeyInfo } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries'
import { ValidType } from '@/models/common/Constants'
import MstrProfMetaTblColumnList from './MstrProfMetaTblColumnList'
import { DivisionTypes } from '@/models/selfFeature/FeatureModel'

const MstrProfInfo = ({
    editMode,
    rslnRuleKeyPrtyList,    //선택된 resolution id에 해당되는 마스터 조인키 리스트
    metaTblInfo,            //저장된 메타테이블 정보
    metaTblAllList,         //모든 속성/행동정보 메타테이블 정보(선택된 resolution id에 해당되는)
    metaTblColList,         //저장된 메타테이블 컬럼 항목
}: AttrBehvMstrProfInfoProps) => {

    const { toast } = useToast()
    // 정보타입
    const [divisionType, setDivisionType] = useState<string>("")
    // 각 메타 테이블 및 컬럼 정보(화면 노출을 위해 필요)
    const [metaTableInfo, setMetaTableInfo] = useState<TbCoMetaTbInfo>()
    const [metaTblClmnList, setMetaTblClmnList] = useState<Array<TbCoMetaTblClmnInfo>>([])
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API
    const [metaTblId, setMetaTblId] = useState<string>("")
    const [metaTblSrchInfo, setMetaTblSrchInfo] = useState<MetaColumnIsResolutionInfoSearchProps>(cloneDeep(initMetaColumnIsResolutionInfoSearchProps))
    // 선택한 테이블에 해당되는 컬럼 리스트
    const [metaTblClmnAllList, setMetaTblClmnAllList] = useState<Array<TbCoMetaTblClmnInfo>>([])
    const { data: metaColIsRslnInfoRes, isError: metaColIsRslnInfoErr, refetch: metaColIsRslnInfoRefetch } = useMetaColumnIsResolutionInfo(metaTblId, metaTblSrchInfo)
    // 각 테이블 속성 key 정보(화면노출을 위한 info state)
    const [metaTblClmnJoinkeyInfo, setMetaTblClmnJoinkeyInfo] = useState<TbCoMetaTblClmnInfo>()
    const [metaTblClmnJoinkeyList, setMetaTblClmnJoinkeyList] = useState<Array<TbCoMetaTblClmnInfo>>()
    // 속성 조인키 조회 API
    const [metaTblSrchJoinkeyInfo, setMetaTblSrchJoinkeyInfo] = useState<MetaColumnIsResolutionInfoSearchProps>(cloneDeep(initMetaColumnIsResolutionInfoSearchJoinkeyProps))
    const { data: metaColIsRslnInfoJoinkeyRes, isError: metaColIsRslnInfoJoinkeyErr, refetch: metaColIsRslnInfoJoinkeyRefetch } = useMetaColumnIsResolutionJoinkeyInfo(metaTblId, metaTblSrchJoinkeyInfo)

    /* 
        선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API
        호출을 위한 param setting
    */
    useEffect(() => {
        if (!metaTblInfo || metaTblInfo.mstrSgmtRuleTblId === "") return
        setMetaTblId(metaTblInfo.mstrSgmtRuleTblId)
        setDivisionType(metaTblInfo.sgmtDvCd)
    }, [metaTblInfo])
    // 선택된 메타테이블의 논리명 및 등록 수정시 테이블 select를 위한 metaTblAllList
    useEffect(() => {
        if (!metaTblAllList) return
        let temp = metaTblAllList.find((info: TbCoMetaTbInfo) => info.metaTblPhysNm === metaTblInfo.mstrSgmtRuleTblNm)
        if (!temp) return
        setMetaTableInfo(temp)
    }, [metaTblAllList])

    useEffect(() => {
        // 마스터 join key
    }, [rslnRuleKeyPrtyList])
    // 화면 노출을 위한 저장된 컬럼 setting
    useEffect(() => {
        // 선택한 테이블에 해당되는 컬럼 리스트
        if (metaTblColList.length < 1 || metaTblClmnAllList.length < 1) return
        let colList: Array<TbCoMetaTblClmnInfo> = []
        colList = metaTblClmnAllList.filter((colInfo: TbCoMetaTblClmnInfo) => {
            return metaTblColList.some((saveColInfo: TbRsMstrSgmtRuleAttrClmn) => saveColInfo.mstrSgmtRuleClmnId === colInfo.metaTblClmnId)
        })
        setMetaTblClmnList(colList)
    }, [metaTblColList, metaTblClmnAllList])
    // 선택한 테이블의 속성 Joinkey 화면 노출을 위한 setting
    useEffect(() => {
        if (!metaTblClmnJoinkeyList) return
        setMetaTblClmnJoinkeyInfo(metaTblClmnJoinkeyList.find((metaTblClmnJoinkey: TbCoMetaTblClmnInfo) => metaTblClmnJoinkey.metaTblClmnPhysNm === metaTblInfo.attrJoinKeyClmnNm))
    }, [metaTblClmnJoinkeyList])
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API 호출
    useEffect(() => {
        if (!metaTblId) return
        metaColIsRslnInfoRefetch()
        metaColIsRslnInfoJoinkeyRefetch()
    }, [metaTblId])
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 call back
    useEffect(() => {
        if (metaColIsRslnInfoErr || metaColIsRslnInfoRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (metaColIsRslnInfoRes) {
                setMetaTblClmnAllList(metaColIsRslnInfoRes.result)
            }
        }
    }, [metaColIsRslnInfoRes, metaColIsRslnInfoErr])
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 call back
    useEffect(() => {
        if (metaColIsRslnInfoJoinkeyErr || metaColIsRslnInfoJoinkeyRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (metaColIsRslnInfoJoinkeyRes) {
                setMetaTblClmnJoinkeyList(metaColIsRslnInfoJoinkeyRes.result)
            }
        }
    }, [metaColIsRslnInfoJoinkeyRes, metaColIsRslnInfoJoinkeyErr])

    return (
        <Stack
            direction="Vertical"
            className="width-100"
            gap="MD"
            style={{
                border: '1px solid rgb(218, 218, 218)',
                borderRadius: '5px',
                background: (divisionType === DivisionTypes.ATTR) ? '#eff9f0' : '#e6f9ff',
                color: (divisionType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                padding: "1rem"
            }}
        >
            {/* 상세 */}
            {!editMode &&
                <>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        gap="LG"
                    >
                        <Typography style={{ width: "10%" }} variant='h6'>속성 테이블</Typography>
                        <Typography style={{ width: "20%" }} variant='body1'>{metaTableInfo?.metaTblLogiNm}</Typography>
                    </Stack>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        gap="LG"
                    >
                        <Typography style={{ width: "10%" }} variant='h6'>마스터 Join key</Typography>
                        <Typography style={{ width: "20%" }} variant='body1'>{metaTblInfo.mstrJoinKeyClmnNm}</Typography>
                        <Typography style={{ width: "10%" }} variant='h6'>속성 Join key</Typography>
                        <Typography variant='body1'>{metaTblClmnJoinkeyInfo && `${metaTblClmnJoinkeyInfo.metaTblClmnLogiNm} [${metaTblClmnJoinkeyInfo.metaTblClmnPhysNm}]`}</Typography>
                    </Stack>
                </>
            }
            {/* 상세 */}
            {/* 등록 및 수정 */}
            {editMode &&
                <>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        gap="LG"
                    >
                        <Typography style={{ width: "10%" }} variant='h6'>속성 테이블</Typography>
                        <Select
                            style={{ width: "20%" }}
                            value={metaTableInfo?.metaTblId}
                            appearance="Outline"
                            placeholder="선택"
                            className="width-100"
                            onChange={(
                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                value: SelectValue<{}, false>
                            ) => {
                                //onchangeSelectHandler(e, value, "featureSeGrp")
                            }}
                        >
                            {metaTblAllList.map((item, index) => (
                                <SelectOption key={index} value={item.metaTblId}>{item.metaTblLogiNm}</SelectOption>
                            ))}
                        </Select>
                    </Stack>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        gap="LG"
                    >
                        <Typography style={{ width: "10%" }} variant='h6'>마스터 Join key</Typography>
                        <Select
                            style={{ width: "20%" }}
                            value={metaTblInfo.mstrJoinKeyClmnNm}
                            appearance="Outline"
                            placeholder="선택"
                            className="width-100"
                            onChange={(
                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                value: SelectValue<{}, false>
                            ) => {
                                //onchangeSelectHandler(e, value, "featureSeGrp")
                            }}
                        >
                            {rslnRuleKeyPrtyList.map((item, index) => (
                                <SelectOption key={index} value={item.rslnRuleKeyClmnNm}>{item.rslnRuleKeyClmnNm}</SelectOption>
                            ))}
                        </Select>
                        <Typography variant='h6'>속성 Join key</Typography>
                        <Select
                            style={{ width: "50%" }}
                            value={metaTblInfo.attrJoinKeyClmnNm}
                            appearance="Outline"
                            placeholder="선택"
                            className="width-100"
                            onChange={(
                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                value: SelectValue<{}, false>
                            ) => {
                                //onchangeSelectHandler(e, value, "featureSeGrp")
                            }}
                        >
                            {metaTblClmnAllList.map((item, index) => (
                                <SelectOption key={index} value={item.metaTblClmnPhysNm}>{`${item.metaTblClmnLogiNm} [${item.metaTblClmnPhysNm}]`}</SelectOption>
                            ))}
                        </Select>
                    </Stack>
                </>
            }
            {/* 등록 및 수정 */}
            {/* 항목 리스트 */}
            <MstrProfMetaTblColumnList
                editMode={editMode}
                divisionType={divisionType}             // 속성, 행동정보 구분
                metaTblInfo={metaTblInfo}               // 저장된 메타테이블 정보
                metaTblClmnList={metaTblClmnList}       // 저장된 메타테이블 컬럼정보
                metaTblClmnAllList={metaTblClmnAllList} // 저장된 메타테이블 전체 컬럼 항목
            />
            {/* 항목 리스트 */}
        </Stack>
    )
}

export default MstrProfInfo