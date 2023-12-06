import { useState, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { useLocation } from 'react-router-dom'

import AttrMstrProfInfo from '@/components/self-feature-adm/AttrMstrProfInfo'
import BehvMstrProfInfo from '@/components/self-feature-adm/BehvMstrProfInfo'
import {
    Stack, useToast,
} from '@components/ui'
import { RuleId } from '@/models/selfFeature/FeatureCommon'

import { 
    initMasterProfileInfo,
    initMetaColumnIsResolutionInfoSearchProps, 
    initMetaInfoSearchProps,
    initTbCoMetaTbInfo,
    initTbRsRslnRuleKeyPrty,
} from './data'
import { 
    MasterProfileInfo,
    MetaColumnIsResolutionInfoSearchProps, 
    MetaInfoSearchProps,
     MetaType, 
     TbCoMetaTbInfo, 
     TbRsRslnRuleKeyPrty 
} from '@/models/selfFeature/FeatureAdmModel'

import { 
    useMetaColumnIsResolutionInfo, 
    useMetaInfo, 
    useMstrProfInfo, 
    useResolutionKeyList 
} from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries'
import { ValidType } from '@/models/common/Constants'
import { DivisionTypes } from '@/models/selfFeature/FeatureModel'
import { retreiveMetaColumnIsResolutionInfo } from '@/api/self-feature/SelfFeatureAdminAPI'

const MasterProfileManagementDetail = () => {

    const location = useLocation()
    const { toast } = useToast()
    // 메타테이블 전체조회 테이블 선택 콤보박스 조회 API
    const [metaInfoSrchInfo, setMetaInfoSrchInfo] = useState<MetaInfoSearchProps>(cloneDeep(initMetaInfoSearchProps))
    const [attrMetaTbInfo, setAttrMetaTbInfo] = useState<Array<TbCoMetaTbInfo>>(cloneDeep([initTbCoMetaTbInfo]))
    const [behvMetaTbInfo, setBehvMetaTbInfo] = useState<Array<TbCoMetaTbInfo>>(cloneDeep([initTbCoMetaTbInfo]))
    const {data: metaInfoRes, isError: metaInfoErr, refetch: metaInfoRefetch} = useMetaInfo(metaInfoSrchInfo)
    // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 API
    const [rslnRuleId, setRslnRuleId] = useState<string>("")
    const [rslnRuleKeyPrty, setRslnRuleKeyPrty] = useState<Array<TbRsRslnRuleKeyPrty>>(cloneDeep([initTbRsRslnRuleKeyPrty]))
    const {data: rslnKeyListRes, isError: rslnKeyListErr, refetch: rslnKeyListRefetch} = useResolutionKeyList(rslnRuleId)
    // 상세 조회 API
    const [mstrSgmtRuleId, setMstrSgmtRuleId] = useState<string>("")
    const [masterProfileInfo, setMasterProfileInfo] = useState<MasterProfileInfo>(cloneDeep(initMasterProfileInfo))
    const {data: mstrProfInfoRes, isError: mstrProfInfoErr, refetch: mstrProfInfoRefetch} = useMstrProfInfo(mstrSgmtRuleId)
    /* 
        ==================================================
        ====    각 속성, 행동 정보 component에서 수행   ====
        ==================================================
    */
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API
    const [metaTblId, setMetaTblId] = useState<string>("")
    const [metaTblSrchInfo, setMetaTblSrchInfo] = useState<MetaColumnIsResolutionInfoSearchProps>(cloneDeep(initMetaColumnIsResolutionInfoSearchProps))
    const {data: metaColIsRslnInfoRes, isError: metaColIsRslnInfoErr, refetch: metaColIsRslnInfoRefetch} = useMetaColumnIsResolutionInfo(metaTblId, metaTblSrchInfo)
    /* 
        ==================================================
        ====    각 속성, 행동 정보 component에서 수행   ====
        ==================================================
    */
    useEffect(() => {
        console.log("After set rslnRuleKeyPrty :: ", rslnRuleKeyPrty)
    }, [rslnRuleKeyPrty])
    useEffect(() => {
        console.log("After set masterProfileInfo :: ", masterProfileInfo)
    }, [masterProfileInfo])
    useEffect(() => {
        console.log("After set attrMetaTbInfo :: ", attrMetaTbInfo)
        attrMetaTbInfo.map((info: TbCoMetaTbInfo) => {
            if (info.metaTblId && info.metaTblId !== "") {
                let response = retreiveMetaColumnIsResolutionInfo(info.metaTblId, metaTblSrchInfo)
                
                response.then((response) => {
                    console.log(response)
                }).catch ((err) => {
                    console.log(err)
                })
            }
            return info
        })
    }, [attrMetaTbInfo])
    useEffect(() => {
        console.log("After set behvMetaTbInfo :: ", behvMetaTbInfo)
        behvMetaTbInfo.map((info: TbCoMetaTbInfo) => {
            if (info.metaTblId && info.metaTblId !== "") {
                let response = retreiveMetaColumnIsResolutionInfo(info.metaTblId, metaTblSrchInfo)
                
                response.then((response) => {
                    console.log(response)
                }).catch ((err) => {
                    console.log(err)
                })
            }
            return info
        })
    }, [behvMetaTbInfo])
    // component mount
    useEffect(() => {
        setMetaInfoSrchInfo((prevState: MetaInfoSearchProps) => {
            let rtn = cloneDeep(prevState)
            rtn.type = MetaType.MSTR_SGMT
            rtn.rslnRuleId = RuleId.RESOLUTION
            return rtn
        })
        setRslnRuleId(RuleId.RESOLUTION)
        if (location.state.row.mstrSgmtRuleId) 
            setMstrSgmtRuleId(location.state.row.mstrSgmtRuleId)
    }, [])
    // 상세 조회 API 호출
    useEffect(() => {
        if (!mstrSgmtRuleId || mstrSgmtRuleId === "") return
        mstrProfInfoRefetch()
    }, [mstrSgmtRuleId])
    // 상세 조회 call back
    useEffect(() => {
        if (mstrProfInfoErr || mstrProfInfoRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (mstrProfInfoRes) {
                setMasterProfileInfo(mstrProfInfoRes.result)
            }
        }
    }, [mstrProfInfoRes, mstrProfInfoErr])
    // 메타테이블 전체조회 테이블 선택 콤보박스 조회 API 호출
    useEffect(() => {
        if (!metaInfoSrchInfo || metaInfoSrchInfo.type === "" || metaInfoSrchInfo.rslnRuleId === "") return
        metaInfoRefetch()
    }, [metaInfoSrchInfo])
    // 메타테이블 전체조회 테이블 선택 콤보박스 조회 call back
    useEffect(() => {
        if (metaInfoErr || metaInfoRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (metaInfoRes) {
                setAttrMetaTbInfo(metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.ATTR))
                setBehvMetaTbInfo(metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.BEHV))
            }
        }
    }, [metaInfoRes, metaInfoErr])
    // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 API 호출
    useEffect(() => {
        if (!rslnRuleId || rslnRuleId === "") return
        rslnKeyListRefetch()
    }, [rslnRuleId])
    // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 call back
    useEffect(() => {
        if (rslnKeyListErr || rslnKeyListRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (rslnKeyListRes) {
                setRslnRuleKeyPrty(rslnKeyListRes.result)
            }
        }
    }, [rslnKeyListRes, rslnKeyListErr])

    /* 
        ==================================================
        ====    각 속성, 행동 정보 component에서 수행   ====
        ==================================================
    */
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API 호출
    useEffect(() => {
        if (!metaTblId) return
        metaColIsRslnInfoRefetch()
        // 메타테이블 컬럼 정보 조회 후 해당 테이블 속성 joinkey 호출을 위한 변수 setting
        setMetaTblSrchInfo((prevState: MetaColumnIsResolutionInfoSearchProps) => {
            let rtn = cloneDeep(prevState)
            rtn.joinKeyYn = "Y"
            return rtn
        })
    }, [metaTblId])
    // 선택된 메타테이블의 속성 joinkey 조회 API 호출
    useEffect(() => {
        if (!metaTblSrchInfo.joinKeyYn || metaTblSrchInfo.joinKeyYn !== "Y") return
        metaColIsRslnInfoRefetch()
    }, [metaTblSrchInfo.joinKeyYn])
    // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 call back
    useEffect(() => {
        if (metaColIsRslnInfoErr || metaColIsRslnInfoRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (metaColIsRslnInfoRes) {
                console.log("선택된 메타테이블 id 값으로 메타컬럼테이블조회 :: ", metaColIsRslnInfoRes.result)
                if (metaTblSrchInfo.joinKeyYn === "Y") setMetaTblSrchInfo(cloneDeep(initMetaColumnIsResolutionInfoSearchProps))
            }
        }
    }, [metaColIsRslnInfoRes, metaColIsRslnInfoErr])
    /* 
        ==================================================
        ====    각 속성, 행동 정보 component에서 수행   ====
        ==================================================
    */

    return (
        <Stack>
            <AttrMstrProfInfo />
            <BehvMstrProfInfo />
        </Stack>
    )
}

export default MasterProfileManagementDetail