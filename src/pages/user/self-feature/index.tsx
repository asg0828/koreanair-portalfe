import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep, isEmpty } from "lodash";

import { RowsInfo } from "@/models/components/Table";
import HorizontalTable from '@components/table/HorizontalTable';
import {
	TR,
	TH,
	TD,
	Button,
	Stack,
	TextField,
	Select,
	SelectOption,
	useToast,
} from '@components/ui';
import CustFeatParentChildListModal from "@/components/self-feature/modal/CustFeatParentChildListModal";
import { AddIcon } from '@/assets/icons';
import DataGrid from "@/components/grid/DataGrid";

import { FeatListSrchProps, TbRsCustFeatRule } from '@/models/selfFeature/FeatureModel'
import {
	featListColumns as columns,
	initFeatListSrchProps,
	submissionStatus,
} from "./data";
import {
	SelfFeatPgPpNm, SubFeatStatus, SubFeatStatusNm,
} from '@/models/selfFeature/FeatureCommon';
import { useCustFeatRules } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries";
import { ValidType } from "@/models/common/Constants";
import { PageModel, initPage } from "@/models/model/PageModel";
import { PagingUtil, setPageList } from "@/utils/self-feature/PagingUtil";
import { useDeptAllList } from "@/hooks/queries/useDeptQueries";
import { selectSessionInfo } from "@/reducers/authSlice";
import { useAppSelector } from "@/hooks/useRedux";

const SelfFeature = () => {

	const navigate = useNavigate()
	const { toast } = useToast()
	const sessionInfo = useAppSelector(selectSessionInfo())
	// 페이징(page: 페이지정보, rows: 페이지에 보여질 list)
	const [page, setPage] = useState<PageModel>(cloneDeep(initPage))
	const [rows, setRows] = useState<Array<TbRsCustFeatRule>>([])
	// 부서 조회
	const { data: deptAllListRes, isError: deptAllListErr } = useDeptAllList()
	const [deptOption, setDeptOption] = useState<Array<any>>([])
	//Feature명칭(한글), Feature명(영문명), 진행상태, 부서
	const [searchInfo, setSearchInfo] = useState<FeatListSrchProps>(cloneDeep(initFeatListSrchProps))
	const { data: featureListRes, isError: featureListErr, refetch: featureListRefetch } = useCustFeatRules(searchInfo)
	const [selfFeatureList, setSelfFeatureList] = useState<Array<TbRsCustFeatRule>>([])
	// 선후행 관계 팝업
	const [isOpenFeatPrntChldModal, setIsOpenFeatPrntChldModal] = useState<boolean>(false)
	useEffect(() => {
		//console.log(sessionInfo)
	}, [sessionInfo])
	// 부서 목록 setting
	useEffect(() => {
		if (deptAllListErr || deptAllListRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '부서 목록 조회 중 에러가 발생했습니다.',
			});
		} else {
			if (deptAllListRes?.data) {
				setDeptOption(() => {
					return [...[{ deptCode: "", deptNm: "선택" }], ...deptAllListRes.data.contents]
				})
			}
		}
	}, [deptAllListRes, deptAllListErr, toast])
	// customer feature 목록 API callback
	useEffect(() => {
		if (featureListErr || featureListRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			});
		} else {
			if (featureListRes) {
				let rtn = cloneDeep(featureListRes.result)
				rtn = rtn.filter((sf: TbRsCustFeatRule) => sf.submissionStatus !== SubFeatStatus.DLET)
				rtn = rtn.map((sf: TbRsCustFeatRule) => {
					let t = cloneDeep(sf)
					// 진행 상태 check
					if (
						!t.submissionStatus
						|| t.submissionStatus === ""
						|| t.submissionStatus === SubFeatStatus.SAVE
					) {
						t.submissionStatusNm = SubFeatStatusNm.SAVE
					} else if (
						t.submissionStatus === SubFeatStatus.REQ
						|| t.submissionStatus === SubFeatStatus.IN_APRV
					) {
						t.submissionStatusNm = SubFeatStatusNm.IN_APRV
					} else if (t.submissionStatus === SubFeatStatus.APRV) {
						t.submissionStatusNm = SubFeatStatusNm.APRV
					} else if (t.submissionStatus === SubFeatStatus.REJT) {
						t.submissionStatusNm = SubFeatStatusNm.REJT
					} else if (t.submissionStatus === SubFeatStatus.CNCL) {
						t.submissionStatusNm = SubFeatStatusNm.CNCL
					} else if (t.submissionStatus === SubFeatStatus.DLET) {
						t.submissionStatusNm = SubFeatStatusNm.DLET
					}
					// 부서명 setting
					let deptItem = deptOption.find((deptItem) => deptItem.deptCode === t.userTeamNm)
					if (!isEmpty(deptItem)) t.deptNm = deptItem.deptNm
					return t
				})
				setSelfFeatureList(rtn)
				PagingUtil(rtn, page)
			}
		}
	}, [featureListRes, featureListErr, featureListRefetch, toast])
	// 페이지당 목록 수, 페이지 번호 바뀔 경우 page setting
	const handlePage = (page: PageModel) => {
		setPage(PagingUtil(selfFeatureList, page))
	}
	// 변경된 page에 따른 list setting
	useEffect(() => {
		setPageList(page, selfFeatureList, setRows)
	}, [page.page, page.pageSize, selfFeatureList])
	// 페이지 이동
	const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {
		if (pageNm === SelfFeatPgPpNm.DETL) {
			navigate(pageNm, { state: rows })
		} else if (pageNm === SelfFeatPgPpNm.PRNTCHLD) {
			setIsOpenFeatPrntChldModal((prevState) => !prevState)
		} else if (pageNm === SelfFeatPgPpNm.RULE_REG || pageNm === SelfFeatPgPpNm.SQL_REG) {
			navigate(SelfFeatPgPpNm.REG, { state: { regType: pageNm } })
		} else {
			navigate(pageNm)
		}
	}
	// 검색 조건 input 입력시
	const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setSearchInfo({ ...searchInfo, [id]: value, })
	}
	// 검색 조건 select 선택시
	const onchangeSelectHandler = (
		e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
		value: SelectValue<{}, false>,
		id?: String
	) => {
		let v = String(value)
		if (v === "null" || v === "undefined") return
		setSearchInfo({ ...searchInfo, [`${id}`]: v, })
	}
	// 검색 버튼 클릭시
	const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		featureListRefetch()
	}

	return (
		<Stack direction="Vertical" gap="LG" className="height-100">
			{/* 관리자(1차)인 경우만 노출 */}
			{/* 
				<Stack direction="Horizontal" gap="MD" justifyContent="End">
					<Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.PRNTCHLD)}>
					Feature 연결 관계
					</Button>
				</Stack> 
			*/}
			{/* 검색 영역 */}
			<form onSubmit={onsubmitHandler}>
				<Stack direction="Vertical" gap="LG">
					<HorizontalTable>
						<TR>
							<TH colSpan={1} align="right">Feature 명(한글)</TH>
							<TD colSpan={3}>
								<TextField className="width-100" id="custFeatRuleName" onChange={onchangeInputHandler} />
							</TD>
							<TH colSpan={1} align="right">Feature 명(영문)</TH>
							<TD colSpan={3}>
								<TextField className="width-100" id="custFeatRuleNameEng" onChange={onchangeInputHandler} />
							</TD>
						</TR>
						<TR>
							<TH align="right" colSpan={1}>진행 상태</TH>
							<TD colSpan={3}>
								<Select
									value={searchInfo.submissionStatus}
									appearance="Outline"
									placeholder="전체"
									className="width-100"
									onChange={(
										e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
										value: SelectValue<{}, false>
									) => {
										onchangeSelectHandler(e, value, "submissionStatus")
									}}
								>
									{submissionStatus.map((item, index) => (
										<SelectOption key={index} value={item.value}>{item.text}</SelectOption>
									))}
								</Select>
							</TD>
							<TH colSpan={1} align="right">부서</TH>
							<TD colSpan={3}>
								<Select
									appearance="Outline"
									placeholder="선택"
									className="width-100"
									onChange={(
										e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
										value: SelectValue<{}, false>
									) => {
										onchangeSelectHandler(e, value, "team")
									}}
								>
									{deptOption.map((item, index) => (
										<SelectOption key={index} value={item.deptCode}>{item.deptNm}</SelectOption>
									))}
								</Select>
							</TD>
						</TR>
						<TR>
							{/* 
								<TH align="right" colSpan={1}>사용 여부</TH>
								<TD colSpan={2}>
									<Select 
									appearance="Outline" 
									placeholder="선택" 
									className="width-100" 
									onChange={(
									e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
									value: SelectValue<{}, false>
									) => {
									onchangeSelectHandler(e, value, "useYn")
									}}
									>
									{useYn.map((item, index) => (
									<SelectOption key={index} value={item.value}>{item.text}</SelectOption>
									))}
									</Select>
								</TD>
							*/}
						</TR>
					</HorizontalTable>
					<Stack gap="SM" justifyContent="Center">
						<Button type="submit" priority="Primary" appearance="Contained" size="LG" >
							<span className="searchIcon"></span>
							검색
						</Button>
					</Stack>
				</Stack>
			</form>
			{/* 검색 영역 */}
			{/* 목록 영역 */}
			<DataGrid
				columns={columns}
				rows={rows}
				//enableSort={true}
				clickable={true}
				page={page}
				onChange={handlePage}
				onClick={(rows: RowsInfo) => onClickPageMovHandler(SelfFeatPgPpNm.DETL, rows)}
				//rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
				buttonChildren={
					<>
						<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.RULE_REG)}>
							<AddIcon />
							신규 등록
						</Button>
						{/* 관리자(1차)인 경우만 노출 */}
						{/* <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.SQL_REG)}>
						<AddIcon />
						SQL 신규 등록
						</Button> */}
					</>
				}
			/>
			{/* 목록 영역 */}
			{/* 팝업 */}
			<CustFeatParentChildListModal
				isOpen={isOpenFeatPrntChldModal}
				onClose={(isOpen) => setIsOpenFeatPrntChldModal(isOpen)}
			/>

		</Stack>
	)
}
export default SelfFeature;