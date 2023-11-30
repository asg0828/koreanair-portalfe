import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from "lodash";

import { RowsInfo } from "@/models/components/Table";
import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@components/table/HorizontalTable';
import {
	Pagination,
	TR,
	TH,
	TD,
	Button,
	Stack,
	TextField,
	Select,
	SelectOption,
	Label,
	useToast,
} from '@components/ui';
import CustFeatParentChildListPop from "@/components/self-feature/popup/CustFeatParentChildListPop";
import { AddIcon } from '@/assets/icons';
import DataGrid from "@/components/grid/DataGrid";

import { FeatListSrchProps, TbRsCustFeatRule } from '@/models/selfFeature/FeatureModel'
import {
	teamNm,
	featListColumns as columns,
	initFeatListSrchProps,
	submissionStatus,
} from "./data";
import {
	selfFeatPgPpNm, subFeatStatus, subFeatStatusNm,
} from '@/models/selfFeature/FeatureCommon';
import { useCustFeatRules } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries";
import { ValidType } from "@/models/common/Constants";
import { PageModel, initPage } from "@/models/model/PageModel";
import { PagingUtil, setPageList } from "@/utils/self-feature/PagingUtil";

const SelfFeature = () => {

	const navigate = useNavigate()
	const { toast } = useToast()
	// 페이징(page: 페이지정보, rows: 페이지에 보여질 list)
	const [page, setPage] = useState<PageModel>(cloneDeep(initPage))
	const [rows, setRows] = useState<Array<TbRsCustFeatRule>>([])
	//Feature명칭(한글), Feature명(영문명), 진행상태, 부서
	const [searchInfo, setSearchInfo] = useState<FeatListSrchProps>(cloneDeep(initFeatListSrchProps))
	const { data: featureListRes, isError: featureListErr, refetch: featureListRefetch } = useCustFeatRules(searchInfo)
	const [selfFeatureList, setSelfFeatureList] = useState<Array<TbRsCustFeatRule>>([])
	// 선후행 관계 팝업
	const [isOpenFeatPrntChldPop, setIsOpenFeatPrntChldPop] = useState<boolean>(false)
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
				rtn = rtn.filter((sf: TbRsCustFeatRule) => sf.submissionStatus !== subFeatStatus.DLET)
				rtn = rtn.map((sf: TbRsCustFeatRule) => {
					let t = cloneDeep(sf)
					// 진행 상태 check
					if (
						!t.submissionStatus
						|| t.submissionStatus === ""
						|| t.submissionStatus === subFeatStatus.SAVE
					) {
						t.submissionStatusNm = subFeatStatusNm.SAVE
					} else if (
						t.submissionStatus === subFeatStatus.REQ
						|| t.submissionStatus === subFeatStatus.IN_APRV
					) {
						t.submissionStatusNm = subFeatStatusNm.IN_APRV
					} else if (t.submissionStatus === subFeatStatus.APRV) {
						t.submissionStatusNm = subFeatStatusNm.APRV
					} else if (t.submissionStatus === subFeatStatus.REJT) {
						t.submissionStatusNm = subFeatStatusNm.REJT
					} else if (t.submissionStatus === subFeatStatus.CNCL) {
						t.submissionStatusNm = subFeatStatusNm.CNCL
					} else if (t.submissionStatus === subFeatStatus.DLET) {
						t.submissionStatusNm = subFeatStatusNm.DLET
					}
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
		if (pageNm === selfFeatPgPpNm.DETL) {
			navigate(pageNm, { state: rows })
		} else if (pageNm === selfFeatPgPpNm.PRNTCHLD) {
			setIsOpenFeatPrntChldPop((prevState) => !prevState)
		} else if (pageNm === selfFeatPgPpNm.RULE_REG || pageNm === selfFeatPgPpNm.SQL_REG) {
			navigate(selfFeatPgPpNm.REG, { state: { regType: pageNm } })
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
		setSearchInfo({ ...searchInfo, [`${id}`]: String(value), })
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
					<Button priority="Normal" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.PRNTCHLD)}>
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
								<TextField className="width-100" id="custFeatRuleEnName" onChange={onchangeInputHandler} />
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
										onchangeSelectHandler(e, value, "teamCd")
									}}
								>
									{teamNm.map((item, index) => (
										<SelectOption key={index} value={item.value}>{item.text}</SelectOption>
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
				onClick={(rows: RowsInfo) => onClickPageMovHandler(selfFeatPgPpNm.DETL, rows)}
				//rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
				buttonChildren={
					<>
						<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.RULE_REG)}>
							<AddIcon />
							신규 등록
						</Button>
						{/* 관리자(1차)인 경우만 노출 */}
						{/* <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SQL_REG)}>
						<AddIcon />
						SQL 신규 등록
						</Button> */}
					</>
				}
			/>
			{/* 목록 영역 */}
			{/* 팝업 */}
			<CustFeatParentChildListPop
				isOpen={isOpenFeatPrntChldPop}
				onClose={(isOpen) => setIsOpenFeatPrntChldPop(isOpen)}
			/>

		</Stack>
	)
}
export default SelfFeature;