import { useState, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'

import MstrProfInfo from '@/components/self-feature-adm/MstrProfInfo'
import HorizontalTable from '@/components/table/HorizontalTable'
import {
    Button,
    Stack,
    TD,
    TH,
    TR,
    Typography,
    useToast,
} from '@components/ui'
import { RuleId, SelfFeatPgPpNm } from '@/models/selfFeature/FeatureCommon'

import {
    initMasterProfileInfo,
    initMetaInfoSearchProps,
    initTbRsRslnRuleKeyPrty,
} from './data'
import {
    MasterProfileInfo,
    MetaInfoSearchProps,
    MetaType,
    TbCoMetaTbInfo,
    TbRsMstrSgmtRuleAttrClmn,
    TbRsMstrSgmtRuleAttrTbl,
    TbRsRslnRuleKeyPrty
} from '@/models/selfFeature/FeatureAdmModel'

import {
    useMetaInfo,
    useMstrProfInfo,
    useResolutionKeyList
} from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries'
import { ValidType } from '@/models/common/Constants'
import { DivisionTypes } from '@/models/selfFeature/FeatureModel'

const MasterProfileManagementDetail = () => {

    const location = useLocation()
	const navigate = useNavigate()
    const { toast } = useToast()
    // 메타테이블 전체조회 테이블 선택 콤보박스 조회 API
    const [metaInfoSrchInfo, setMetaInfoSrchInfo] = useState<MetaInfoSearchProps>(cloneDeep(initMetaInfoSearchProps))
    const [attrMetaTbList, setAttrMetaTbList] = useState<Array<TbCoMetaTbInfo>>([])
    const [behvMetaTbList, setBehvMetaTbList] = useState<Array<TbCoMetaTbInfo>>([])
    const { data: metaInfoRes, isError: metaInfoErr, refetch: metaInfoRefetch } = useMetaInfo(metaInfoSrchInfo)
    // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 API
    const [rslnRuleId, setRslnRuleId] = useState<string>("")
    const [rslnRuleKeyPrtyList, setRslnRuleKeyPrtyList] = useState<Array<TbRsRslnRuleKeyPrty>>(cloneDeep([initTbRsRslnRuleKeyPrty]))
    const { data: rslnKeyListRes, isError: rslnKeyListErr, refetch: rslnKeyListRefetch } = useResolutionKeyList(rslnRuleId)
    // 상세 조회 API
    const [mstrSgmtRuleId, setMstrSgmtRuleId] = useState<string>("")
    const [masterProfileInfo, setMasterProfileInfo] = useState<MasterProfileInfo>(cloneDeep(initMasterProfileInfo))
    const { data: mstrProfInfoRes, isError: mstrProfInfoErr, refetch: mstrProfInfoRefetch } = useMstrProfInfo(mstrSgmtRuleId)
	// 페이지 이동 및 버튼 처리
	const onClickPageMovHandler = (pageNm: string) => {
		if (pageNm === SelfFeatPgPpNm.LIST) {
			navigate('..')
		} else if (pageNm === SelfFeatPgPpNm.EDIT) {
			navigate(
				`../${pageNm}`,
				{
					state: {
						masterProfileInfo: masterProfileInfo,
					}
				}
			)
		} else {
			navigate(`../${pageNm}`)
		}
	}
    // component mount
    useEffect(() => {
        setMetaInfoSrchInfo((prevState: MetaInfoSearchProps) => {
            let rtn = cloneDeep(prevState)
            rtn.type = MetaType.MSTR_SGMT
            rtn.rslnRuleId = RuleId.RESOLUTION
            return rtn
        })
        setRslnRuleId(RuleId.RESOLUTION)
        if (location.state && location.state.row.mstrSgmtRuleId)
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
                setAttrMetaTbList(metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.ATTR))
                setBehvMetaTbList(metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.BEHV))
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
                setRslnRuleKeyPrtyList(rslnKeyListRes.result)
            }
        }
    }, [rslnKeyListRes, rslnKeyListErr])

    return (
        <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
            {/* 기본 정보 */}
            <Typography variant="h4">Master Profile 정보</Typography>
            <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                    <TR>
                        <TH colSpan={1} align="right">
                            Master Profile
                        </TH>
                        <TD colSpan={2} align="left">
                            {masterProfileInfo.tbRsMstrSgmtRule.mstrSgmtRuleNm}
                        </TD>
                        <TH colSpan={1} align="right">
                            Description
                        </TH>
                        <TD colSpan={2} align="left">
                            {masterProfileInfo.tbRsMstrSgmtRule.mstrSgmtRuleDesc}
                        </TD>
                    </TR>
                </HorizontalTable>
            </Stack>
            {/* 기본 정보 */}
            {/* 속성 정보 */}
            <Stack
                direction="Vertical"
                className="width-100"
                gap="MD"
            >
                <Stack
                    direction="Vertical"
                    className="width-100"
                    gap="MD"
                    style={{
                        border: '1px solid rgb(218, 218, 218)',
                        borderRadius: '5px',
                        padding:"1rem"
                    }}
                >
                <Typography variant="h4">Fact 정보</Typography>
                {(masterProfileInfo && masterProfileInfo.tbRsMstrSgmtRuleAttrTbl.length > 0) &&
                    masterProfileInfo.tbRsMstrSgmtRuleAttrTbl.map((attrTblInfo: TbRsMstrSgmtRuleAttrTbl, index: number) => {
                        if (attrTblInfo.sgmtDvCd === DivisionTypes.ATTR) {
                            //저장된 메타테이블 컬럼 항목
                            let metaTblColList = masterProfileInfo.tbRsMstrSgmtRuleAttrClmn.filter((attrTblColInfo: TbRsMstrSgmtRuleAttrClmn) => attrTblColInfo.mstrSgmtRuleTblId === attrTblInfo.mstrSgmtRuleTblId)
                            return (
                                <MstrProfInfo 
                                    key={`attr-mstr-prof-detail-${index}`}
                                    editMode={false}
                                    rslnRuleKeyPrtyList={rslnRuleKeyPrtyList}   //선택된 resolution id에 해당되는 마스터 조인키 리스트
                                    metaTblInfo={attrTblInfo}                   //저장된 메타테이블 정보
                                    metaTblAllList={attrMetaTbList}             //모든 속성정보 메타테이블 정보(선택된 resolution id에 해당되는)
                                    metaTblColList={metaTblColList}             //저장된 메타테이블 컬럼 항목
                                />
                            )
                        }
                    })
                }
                </Stack>
            </Stack>
            {/* 속성 정보 */}
            {/* 행동 정보 */}
            <Stack
                direction="Vertical"
                className="width-100"
                gap="MD"
            >
                <Stack
                    direction="Vertical"
                    className="width-100"
                    gap="MD"
                    style={{
                        border: '1px solid rgb(218, 218, 218)',
                        borderRadius: '5px',
                        padding:"1rem"
                    }}
                >
                <Typography variant="h4">Base Fact 정보</Typography>
                {(masterProfileInfo && masterProfileInfo.tbRsMstrSgmtRuleAttrTbl.length > 0) &&
                    masterProfileInfo.tbRsMstrSgmtRuleAttrTbl.map((behvTblInfo: TbRsMstrSgmtRuleAttrTbl, index: number) => {
                        if (behvTblInfo.sgmtDvCd === DivisionTypes.BEHV) {
                            //저장된 메타테이블 컬럼 항목
                            let metaTblColList = masterProfileInfo.tbRsMstrSgmtRuleAttrClmn.filter((behvTblColInfo: TbRsMstrSgmtRuleAttrClmn) => behvTblColInfo.mstrSgmtRuleTblId === behvTblInfo.mstrSgmtRuleTblId)
                            return (
                                <MstrProfInfo 
                                    key={`behv-mstr-prof-detail-${index}`}
                                    editMode={false}
                                    rslnRuleKeyPrtyList={rslnRuleKeyPrtyList}   //선택된 resolution id에 해당되는 마스터 조인키 리스트
                                    metaTblInfo={behvTblInfo}                   //저장된 메타테이블 정보
                                    metaTblAllList={behvMetaTbList}             //모든 행동정보 메타테이블 정보(선택된 resolution id에 해당되는)
                                    metaTblColList={metaTblColList}             //저장된 메타테이블 컬럼 항목
                                />
                            )
                        }
                    })
                }
                </Stack>
            </Stack>
            {/* 행동 정보 */}
			{/* 버튼 영역 */}
			<Stack direction="Vertical" gap="MD" justifyContent="End">
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
						목록
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.EDIT)}>
						수정
					</Button>
				</Stack>
			</Stack>
			{/* 버튼 영역 */}
        </Stack>
    )
}

export default MasterProfileManagementDetail