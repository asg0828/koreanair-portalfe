import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import {
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
    rslnRuleKeyPrtyList,
    metaTblInfo,
    metaTblColList,
    metaTblAllList,
}: AttrBehvMstrProfInfoProps) => {

    const { toast } = useToast()
    // 정보타입
    const [infoType, setInfoType] = useState<string>("")
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API
    const [metaTblId, setMetaTblId] = useState<string>("")
    const [metaTblSrchInfo, setMetaTblSrchInfo] = useState<MetaColumnIsResolutionInfoSearchProps>(cloneDeep(initMetaColumnIsResolutionInfoSearchProps))
    // 선택한 테이블에 해당되는 컬럼 리스트
    const [metaTblClmnList, setMetaTblClmnList] = useState<Array<TbCoMetaTblClmnInfo>>([])
    const { data: metaColIsRslnInfoRes, isError: metaColIsRslnInfoErr, refetch: metaColIsRslnInfoRefetch } = useMetaColumnIsResolutionInfo(metaTblId, metaTblSrchInfo)
    // 각 메타 테이블 정보
    const [metaTableInfo, setMetaTableInfo] = useState<TbCoMetaTbInfo>()
    // 각 테이블 속성 key 정보
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
        setInfoType(metaTblInfo.sgmtDvCd)
    }, [metaTblInfo])
    // 선택된 메타테이블의 논리명 및 등록 수정시 테이블 select를 위한 metaTblAllList
    useEffect(() => {
        if (!metaTblAllList) return
        let temp = metaTblAllList.find((info: TbCoMetaTbInfo) => info.metaTblPhysNm === metaTblInfo.mstrSgmtRuleTblNm)
        if (!temp) return
        setMetaTableInfo(temp)
    }, [metaTblAllList])

    useEffect(() => {
        //console.log(rslnRuleKeyPrtyList)
        // 마스터 조인키를 위해
    }, [rslnRuleKeyPrtyList])
    useEffect(() => {
        // 선택한 테이블에 해당되는 컬럼 리스트
    }, [metaTblClmnList])

    // 선택한 테이블의 속성 Joinkey 논리명을 위해
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
                setMetaTblClmnList(metaColIsRslnInfoRes.result)
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
                background: (infoType === DivisionTypes.ATTR) ? '#eff9f0' : '#e6f9ff',
                color: (infoType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
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
                        <TextField
                            style={{ width: "20%" }}
                            defaultValue={metaTableInfo?.metaTblLogiNm}
                        />
                    </Stack>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        gap="LG"
                    >
                        <Typography style={{ width: "10%" }} variant='h6'>마스터 Join key</Typography>
                        <TextField
                            style={{ width: "20%" }}
                            defaultValue={metaTblInfo.mstrJoinKeyClmnNm}
                        />
                        <Typography variant='h6'>속성 Join key</Typography>
                        <TextField
                            defaultValue={metaTblClmnJoinkeyInfo && `${metaTblClmnJoinkeyInfo.metaTblClmnLogiNm} [${metaTblClmnJoinkeyInfo.metaTblClmnPhysNm}]`}
                        />
                    </Stack>
                </>
            }
            {/* 등록 및 수정 */}
            <MstrProfMetaTblColumnList
                editMode={editMode}
                infoType={infoType}
                metaTblInfo={metaTblInfo}
                metaTblClmnList={metaTblClmnList}
            />
        </Stack>
    )
}

export default MstrProfInfo