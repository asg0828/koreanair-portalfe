import { 
    MasterProfileInfo,
    MetaColumnIsResolutionInfoSearchProps,
    MetaInfoSearchProps,
    MetaType,
    MstrProfDelProps,
    MstrProfSearchInfoProps,
    TbRsMstrSgmtRule, 
    TbRsMstrSgmtRuleAttrClmn,
    TbRsMstrSgmtRuleAttrTbl,
    TbRsRslnRuleRel, 
} from "@/models/selfFeature/FeatureAdmModel";
import { RuleId } from "@/models/selfFeature/FeatureCommon";

// Master Profile table header
export const mstrProfListColumns = [
    { headerName: 'Master Profile', field: 'mstrSgmtRuleNm', colSpan: 6 },
    { headerName: 'Resolution Rule', field: 'rslnRuleNm', colSpan: 6 },
    { headerName: 'Description', field: 'mstrSgmtRuleDesc', colSpan: 6 },
    { headerName: '등록일시', field: 'frstRegDttm', colSpan: 4 },
    { headerName: '등록자', field: 'frstRegUserId', colSpan: 3 },
    { headerName: '사용여부', field: 'mstrSgmtRuleUseYn', colSpan: 2 },
]

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
	tbRsMstrSgmtRuleAttrClmn: [{...initTbRsMstrSgmtRuleAttrClmn}],
	tbRsRslnRuleRel: [{...initTbRsRslnRuleRel}],
	tbRsMstrSgmtRuleList: [{...initTbRsMstrSgmtRule}],
}
export const initMstrProfSearchInfoProps: MstrProfSearchInfoProps = {
    useYn: 'Y',
    rtmYn: '',
}
export const initMetaInfoSearchProps: MetaInfoSearchProps = {
    type: MetaType.MSTR_SGMT,
    rslnRuleId: RuleId.RESOLUTION,
}
export const initMetaColumnIsResolutionInfoSearchProps: MetaColumnIsResolutionInfoSearchProps = {
	isResolution: '',
	joinKeyYn: '',
}
export const initMstrProfDelProps: MstrProfDelProps = {
    mstrSgmtRuleIds: [""],
}