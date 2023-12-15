import { 
    MasterProfileInfo,
    MetaColumnIsResolutionInfoSearchProps,
    MetaInfoSearchProps,
    MstrProfDelProps,
    MstrProfSearchInfoProps,
    TbCoMetaTbInfo,
    TbCoMetaTblClmnInfo,
    TbRsMstrSgmtRule, 
    TbRsMstrSgmtRuleAttrClmn,
    TbRsMstrSgmtRuleAttrTbl,
    TbRsRslnRuleKeyPrty,
    TbRsRslnRuleRel, 
} from "@/models/selfFeature/FeatureAdmModel";

// Master Profile table header
export const mstrProfListColumns = [
    { headerName: 'Master Profile', field: 'mstrSgmtRuleNm', colSpan: 6 },
    { headerName: 'Resolution Rule', field: 'rslnRuleNm', colSpan: 6 },
    { headerName: 'Description', field: 'mstrSgmtRuleDesc', colSpan: 6 },
    { headerName: '등록일시', field: 'frstRegDttm', colSpan: 4 },
    { headerName: '등록자', field: 'frstRegUserId', colSpan: 3 },
    { headerName: '사용여부', field: 'mstrSgmtRuleUseYn', colSpan: 2 },
]

export const initTbCoMetaTbInfo: TbCoMetaTbInfo = {
	dataClaCd: '',
	dataSrcDvCd: '',
	dbNm: '',
	frstRegDttm: '',
	frstRegUserId: '',
	keepCylcCd: '',
	lastUpdDttm: '',
	lastUpdUserId: '',
	metaTblDesc: '',
	metaTblDvCd: '',
	metaTblId: '',
	metaTblLogiNm: '',
	metaTblPhysNm: '',
	metaTblUseYn: '',
	rtmTblYn: '',
	topicId: '',
}

export const initTbRsMstrSgmtRule: TbRsMstrSgmtRule = {
	rslnRuleId: '',
	rslnRuleNm: '',
	mstrSgmtRuleId: '',
	mstrSgmtRuleNm: '',
	mstrSgmtRuleDesc: '',
	mstrSgmtRuleRtmYn: '',
	mstrSgmtRuleUseYn: '',
	frstRegDttm: '',
	frstRegUserId: '',
	lastUpdDttm: '',
	lastUpdUserId: '',
	schdActvYn: '',
}
export const initTbRsMstrSgmtRuleAttrClmn: TbRsMstrSgmtRuleAttrClmn = {
	mstrSgmtRuleId: '',
	mstrSgmtRuleTblId: '',
	mstrSgmtRuleClmnId: '',
	mstrSgmtRuleTblNm: '',
	mstrSgmtRuleClmnNm: '',
	mstrSgmtRuleClmnDesc: '',
	clmnDtpCd: '',
	clmnSortOrd: 0,
	profilTagYn: '',
	clmnStacCrteYn: '',
	sgmtDvCd: '',
	baseTimeYn: '',
}
export const initTbRsMstrSgmtRuleAttrTbl: TbRsMstrSgmtRuleAttrTbl = {
	mstrSgmtRuleId: '',
	mstrSgmtRuleTblId: '',
	mstrSgmtRuleTblNm: '',
	sgmtDvCd: '',
	mstrJoinKeyClmnNm: '',
	attrJoinKeyClmnNm: '',
	mstrSgmtRuleDbNm: '',
	clmnAllChocYn: '',
	mstrJoinKeyClmnPrty: '',
	dataDiv: '',
	rtmTblYn: '',
}
export const initTbRsRslnRuleRel: TbRsRslnRuleRel = {
	rslnRuleId: '',
	mstrSgmtRuleId: '',
	rslnRuleRelUseYn: '',
	frstRegDttm: '',
	frstRegUserId: '',
	lastUpdDttm: '',
	lastUpdUserId: '',
}
export const initMasterProfileInfo: MasterProfileInfo = {
	tbRsMstrSgmtRule: initTbRsMstrSgmtRule,
	tbRsMstrSgmtRuleAttrTbl: [{...initTbRsMstrSgmtRuleAttrTbl}],
	tbRsMstrSgmtRuleAttrClmn: [],
	tbRsRslnRuleRel: [{...initTbRsRslnRuleRel}],
	//tbRsMstrSgmtRuleList: [{...initTbRsMstrSgmtRule}],
}
export const initMstrProfSearchInfoProps: MstrProfSearchInfoProps = {
    useYn: '',
    rtmYn: '',
}
export const initMetaInfoSearchProps: MetaInfoSearchProps = {
    type: '',
    rslnRuleId: '',
}
export const initMetaColumnIsResolutionInfoSearchProps: MetaColumnIsResolutionInfoSearchProps = {
	isResolution: '',
	joinKeyYn: '',
}
export const initMetaColumnIsResolutionInfoSearchJoinkeyProps: MetaColumnIsResolutionInfoSearchProps = {
	isResolution: '',
	joinKeyYn: 'Y',
}
export const initMstrProfDelProps: MstrProfDelProps = {
    mstrSgmtRuleIds: [],
}
export const initTbRsRslnRuleKeyPrty: TbRsRslnRuleKeyPrty = {
	rslnRuleId: '',
	rslnRuleKeyClmnNm: '',
	rslnRuleKeyPrty: 0,
}
export const initTbCoMetaTblClmnInfo: TbCoMetaTblClmnInfo = {
    rtmTblYn: '',
    metaTblId: '',
    metaTblLogiNm: '',
    metaTblClmnId: '',
    metaTblClmnPhysNm: '',
    metaTblClmnLogiNm: '',
    metaTblClmnDesc: '',
    dtpCd: '',
    dtpLenVal: '',
    pkYn: '',
    nullYn: '',
    defltVal: '',
    clmnUseYn: '',
    clmnSortOrd: 0,
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    chgDtpCd: '',
    dataFormat: '',
    baseTimeYn: '',
    maskingRuleCd: '',
    dataTypeCategory: '',
}