import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { ValidType } from '@/models/common/Constants';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { PagingUtil, setPageList } from '@/utils/self-feature/PagingUtil';
import { useColAndCmmtList, useMetaTableList } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import {
	CustMetaSrchItem,
	CustMetaTableData,
	CustMetaListSrchInfo,
} from '@/models/selfFeature/FeatureAdmModel';
import {
	initCustMetaSrchItem,
	initCustMetaListSrchInfo,
	metaTableColumn
} from './data';
import { useYn } from '@/models/selfFeature/FeatureCommon'

const CustomerMetaManagement = () => {
	const [ page, setPage ] = useState<PageModel>(initPage)
	const [ rows, setRows ] = useState<Array<CustMetaTableData>>([])
	const { toast } = useToast()
	const [ searchInfo, setSearchInfo ] = useState<CustMetaListSrchInfo>(cloneDeep(initCustMetaListSrchInfo))
	const { data: metaTableRes, isError: metaTableErr, refetch: metaTableRefetch } = useMetaTableList(searchInfo)
	const { data: colCmmtRes, isError: colCmmtErr, refetch: colCmmtRefetch } = useColAndCmmtList()
	const [ oriList, setOriList] = useState<Array<CustMetaTableData>>([])
	const [ srchItemListOption, setSrchItemListOption] = useState<Array<CustMetaSrchItem>>([])

	// 검색 버튼 클릭시 목록 refetch
	const handleSearch = () => {
		metaTableRefetch()
	}
	// 페이지당 목록 수, 페이지 번호 바뀔 경우
	const handlePage = (page: PageModel) => {
		setPage(PagingUtil(oriList, page))
	}

	// 목록 조회시 리스트 값 설정
	useEffect(() => {
		if (metaTableErr || metaTableRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (metaTableRes) {
				setOriList(metaTableRes.result)
				PagingUtil(metaTableRes.result, page)
			}
		}
	}, [metaTableRes, metaTableErr, toast])

	useEffect(() => {
		setPageList(page, oriList, setRows)
	}, [page.page, page.pageSize, oriList])

	// 검색어 기준 select option 공통코드 사용 설정
	useEffect(() => {
		if (colCmmtErr || colCmmtRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (colCmmtRes) {
				setSrchItemListOption(() => {
					return cloneDeep([...[initCustMetaSrchItem], ...colCmmtRes.result])
				})
			}
		}
	}, [colCmmtRes, colCmmtErr, toast])
	// 검색어 기준 변경시 검색어 입력값 초기화
	useEffect(() => {
		setSearchInfo((prevState: CustMetaListSrchInfo) => {
			let rtn = cloneDeep(prevState)
			rtn.searchWord = ""
			return rtn
		})
	}, [searchInfo.item])

	const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setSearchInfo({ ...searchInfo, [id]: value })
	}

	const onchangeSelectHandler = (
		e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
		value: SelectValue<{}, false>,
		id?: String
	) => {
		setSearchInfo({ ...searchInfo, [`${id}`]: String(value) })
	}

	const onClear = () => {
		setSearchInfo(cloneDeep(initCustMetaListSrchInfo))
	}

	const getCheckList = (checkedList: Array<number>) => {
        //checkedList = checkedList.sort((a: number, b: number) => a - b)
		console.log(checkedList)
    }

	return (
		<>
			<SearchForm
				onSearch={handleSearch}
				onClear={onClear}
			>
				<HorizontalTable>
					<TR>
						<TH colSpan={1} align="right">
							사용여부
						</TH>
						<TD colSpan={3}>
							<Select
								appearance="Outline"
								placeholder="선택"
								className="width-100"
								value={searchInfo.metaTblUseYn}
								onChange={(
									e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
									value: SelectValue<{}, false>
								) => {
									onchangeSelectHandler(e, value, 'metaTblUseYn');
								}}
							>
								{useYn.map((item, index) => (
									<SelectOption key={index} value={item.value}>
										{item.text}
									</SelectOption>
								))}
							</Select>
						</TD>
						<TH colSpan={1} align="right">
							검색어 기준
						</TH>
						<TD colSpan={3}>
							<Select
								appearance="Outline"
								placeholder="전체"
								className="width-100"
								value={searchInfo.item}
								onChange={(
									e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
									value: SelectValue<{}, false>
								) => {
									onchangeSelectHandler(e, value, 'item');
								}}
							>
								{srchItemListOption.map((item, index) => (
									<SelectOption key={index} value={item.columnName}>
										{item.columnComment}
									</SelectOption>
								))}
							</Select>
						</TD>
						<TD colSpan={4}>
							<TextField
								className="width-100"
								onChange={onchangeInputHandler}
								value={searchInfo.searchWord}
								placeholder="검색어를 입력하세요."
								id="searchWord"
							/>
						</TD>
					</TR>
				</HorizontalTable>
			</SearchForm>

			<DataGrid
				columns={metaTableColumn}
				rows={rows}
				enableSort={true}
				clickable={true}
				page={page}
				onChange={handlePage}
				rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
				buttonChildren={
					<>
					<Button priority="Normal" appearance="Outline" size="LG">
						삭제
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG">
						신규등록
					</Button>
					</>
				}
			/>
		</>
	);
};

export default CustomerMetaManagement;
