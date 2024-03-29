import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect'
import { useAppSelector } from "@/hooks/useRedux"
import { selectSessionInfo } from "@/reducers/authSlice"

import HorizontalTable from "@/components/table/HorizontalTable"
import {
    Stack,
    TR,
    TH,
    TD,
    DatePicker,
    Button,
    Select,
    SelectOption,
    TextField,
    useToast,
} from '@components/ui'

import { RowsInfo } from "@/models/components/Table"
import { 
    sfSubmissionListColumns as columns,
    sfSubmissionTypeOption,
    sfSubmissionStatusOption,
    initFeatureSubmissionSearchProps,
} from './data'
import { 
    FeatureSubmissionSearchProps,
    SfSubmission,
    SfSubmissionRequestInfo,
} from "@/models/selfFeature/FeatureSubmissionModel"
import {
    SelfFeatPgPpNm, SubFeatStatus, SubFeatStatusNm,
} from '@/models/selfFeature/FeatureCommon';

import { useSubmissionRequests } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries"
import { ValidType } from "@/models/common/Constants"
import { getDateFormat } from "@/utils/DateUtil"
import { PageModel, initPage } from "@/models/model/PageModel"
import { PagingUtil, setPageList } from "@/utils/self-feature/PagingUtil"
import DataGrid from "@/components/grid/DataGrid"

const SfSubmissionRequest = () => {

	const navigate = useNavigate()
    const location = useLocation()
	const { toast } = useToast()
    const sessionInfo = useAppSelector(selectSessionInfo())
	// 페이징(page: 페이지정보, rows: 페이지에 보여질 list)
	const [page, setPage] = useState<PageModel>(cloneDeep(initPage))
	const [rows, setRows] = useState<Array<SfSubmissionRequestInfo>>([])

    const [ requestDateFrom, setRequestDateFrom ] = useState<string>('')
    const [ requestDateTo, setRequestDateTo ] = useState<string>('')

    const [ search, setSearch ] = useState<FeatureSubmissionSearchProps>(initFeatureSubmissionSearchProps)
    const [ userEmail, setUserEmail ] = useState<string>("")
    const { data: subReqListRes, isError: subReqListErr, refetch: subReqListRefetch } = useSubmissionRequests(userEmail, search)
    const [ sfSubmissionList, setSfSubmissionList ] = useState<Array<SfSubmissionRequestInfo>>([])
    
	// component mount
    useEffect(() => {
        retrieveSubmissions()
    }, [])
    useEffect(() => {
        if (!location || !location.state) return
		setSearch((prevState) => {
			let rtn = cloneDeep(prevState)
			if (location.state && location.state.srchInfo) rtn = location.state.srchInfo
			return rtn
		})
    }, [location])
    // 결재 목록 API 호출
    useEffect(() => {
        if (userEmail && userEmail !== "") {
            subReqListRefetch()
        }
    }, [userEmail])
    const retrieveSubmissions = () => {
		if (!sessionInfo.userEmail) {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다',
			})
			return
		}
        setUserEmail(sessionInfo.userEmail)
    }
    // 결재 목록 API callback
	useEffect(() => {
		if (subReqListErr || subReqListRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (subReqListRes) {
                let rtn = subReqListRes.result.map((subReq: SfSubmission) => {
                    if (subReq.submission.requestDate) subReq.submission.requestDate = getDateFormat(subReq.submission.requestDate, "YYYY-MM-DD HH:mm:ss")
                    // 진행 상태 check
                    if (
                        !subReq.submission.status
                        || subReq.submission.status === ""
                        || subReq.submission.status === SubFeatStatus.SAVE
                    ) {
                        subReq.submission.statusNm = SubFeatStatusNm.SAVE
                    } else if (
                        subReq.submission.status === SubFeatStatus.REQ
                        || subReq.submission.status === SubFeatStatus.IN_APRV
                    ) {
                        subReq.submission.statusNm = SubFeatStatusNm.IN_APRV
                    } else if (subReq.submission.status === SubFeatStatus.APRV) {
                        subReq.submission.statusNm = SubFeatStatusNm.APRV
                    } else if (subReq.submission.status === SubFeatStatus.REJT) {
                        subReq.submission.statusNm = SubFeatStatusNm.REJT
                    } else if (subReq.submission.status === SubFeatStatus.CNCL) {
                        subReq.submission.statusNm = SubFeatStatusNm.CNCL
                    } else if (subReq.submission.status === SubFeatStatus.DLET) {
                        subReq.submission.statusNm = SubFeatStatusNm.DLET
                    }
                    return subReq.submission
                })
                setSfSubmissionList(rtn)
				PagingUtil(rtn, page)
			}
		}
	}, [subReqListRes, subReqListErr, subReqListRefetch, toast])
	// 페이지당 목록 수, 페이지 번호 바뀔 경우 page setting
	const handlePage = (page: PageModel) => {
		setPage(PagingUtil(sfSubmissionList, page))
	}
	// 변경된 page에 따른 list setting
	useEffect(() => {
		setPageList(page, sfSubmissionList, setRows)
	}, [page.page, page.pageSize, sfSubmissionList])
    // 검색 input 입력시
    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setSearch({...search, [id]: value,})
    }
    // 검색 select 선택시
    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: String
    ) => {
        let v = String(value)
        if (v === "null" || v === "undefined") return
        setSearch({...search, [`${id}`]: v,})
    }
    // 검색 버튼 클릭시
    const onClickSearch = () => {
        subReqListRefetch()
    }
	// 검색 조건 초기화
	const onClearSearchInfo = () => {
        setRequestDateFrom("")
        setRequestDateTo("")
		setSearch(cloneDeep(initFeatureSubmissionSearchProps))
	}
    // 페이지 이동
    const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {
        if (pageNm === SelfFeatPgPpNm.DETL) {
            navigate(
				`${pageNm}?custFeatRuleId=${rows?.referenceNo}`,
                { 
                    state: {
                        ...{
                            srchInfo: search
                        }
                    }
                }
            )
        } else {
            navigate(pageNm)
        }
    }

    return (
        <Stack direction="Vertical" gap="LG" className="height-100">
            {/* 검색 영역 */}
            <Stack direction="Vertical" gap="LG">
                <HorizontalTable>
                    <TR>
                        <TH align="center" colSpan={0.905}>요청 일자</TH>
                        <TD colSpan={2.5}>
                            <DatePicker
                                value={requestDateFrom}
                                appearance="Outline"
                                calendarViewMode="days"
                                mode="single"
                                shape="Square"
                                size="MD"
                                onThisDayClick={[
                                    () => {
                                        let today = getDateFormat(new Date().toString(), "YYYY-MM-DD")
                                        setRequestDateFrom(today)
                                        setSearch((prevState: FeatureSubmissionSearchProps) => {
                                            let rtn = cloneDeep(prevState)
                                            rtn.requestDateFrom = `${today}T00:00:00`//getDateFormat(today)//`${nextVal}T19:20:30+01:00`
                                            return rtn
                                        });
                                    },
                                    true
                                ]}
                                onValueChange={(nextVal) => {
                                    setRequestDateFrom(nextVal)
                                    setSearch((prevState: FeatureSubmissionSearchProps) => {
                                        let rtn = cloneDeep(prevState)
                                        rtn.requestDateFrom = `${nextVal}T00:00:00`//getDateFormat(nextVal)//`${nextVal}T19:20:30+01:00`
                                        if (nextVal !== "") rtn.requestDateFrom = `${nextVal}T00:00:00`//getDateFormat(nextVal)//`${nextVal}T19:20:30+01:00`
                                        else rtn.requestDateFrom = ""
                                        return rtn
                                    });
                                }}
                            />
                            ~
                            <DatePicker
                                value={requestDateTo}
                                appearance="Outline"
                                calendarViewMode="days"
                                mode="single"
                                shape="Square"
                                size="MD"
                                onThisDayClick={[
                                    () => {
                                        let today = getDateFormat(new Date().toString(), "YYYY-MM-DD")
                                        setRequestDateTo(today)
                                        setSearch((prevState: FeatureSubmissionSearchProps) => {
                                            let rtn = cloneDeep(prevState)
                                            rtn.requestDateTo = `${today}T23:59:59`//getDateFormat(today)//`${nextVal}T19:20:30+01:00`
                                            return rtn
                                        });
                                    },
                                    true
                                ]}
                                onValueChange={(nextVal) => {
                                    setRequestDateTo(nextVal)
                                    setSearch((prevState: FeatureSubmissionSearchProps) => {
                                        let rtn = cloneDeep(prevState)
                                        rtn.requestDateTo = `${nextVal}T23:59:59`//getDateFormat(nextVal)//`${nextVal}T19:20:30+01:00`
                                        if (nextVal !== "") rtn.requestDateTo = `${nextVal}T23:59:59`//getDateFormat(nextVal)//`${nextVal}T19:20:30+01:00`
                                        else rtn.requestDateTo = ""
                                        return rtn
                                    });
                                }}
                            />
                        </TD>
                        <TH align="center" colSpan={1}>유형</TH>
                        <TD colSpan={1.7}>
                            <Select 
                                value={search.type}
                                appearance="Outline" 
                                placeholder="전체" 
                                className="width-100" 
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "type")
                                }}
                            >

                                {sfSubmissionTypeOption.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                        <TH align="center" colSpan={1}>상태</TH>
                        <TD colSpan={1}>
                            <Select 
                                value={search.submissionStatus}
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
                                {sfSubmissionStatusOption.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="center">Feature 명</TH>
                        <TD colSpan={8}>
                            <TextField 
                                value={search.title}
                                className="width-100" 
                                id="title" 
                                onChange={onchangeInputHandler}
                            />
                        </TD>
                    </TR>
                </HorizontalTable>
                <Stack gap="SM" justifyContent="Center">
                    <Button priority="Primary" appearance="Contained" size="LG" onClick={onClickSearch}>
                    <span className="searchIcon"></span>
                    검색
                    </Button>
                    <Button type="reset" size="LG" onClick={onClearSearchInfo}>
                        초기화
                    </Button>
                </Stack>
            </Stack>
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
					</>
				}
			/>
			{/* 목록 영역 */}
        </Stack>
    )
}

export default SfSubmissionRequest