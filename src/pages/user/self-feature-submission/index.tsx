import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect'
import { useAppSelector } from "@/hooks/useRedux"
import { selectSessionInfo } from "@/reducers/authSlice"

import VerticalTable from "@/components/table/VerticalTable"
import HorizontalTable from "@/components/table/HorizontalTable"
import {
    Stack,
    TR,
    TH,
    TD,
    DatePicker,
    Button,
    Select,
    Pagination,
    SelectOption,
    TextField,
    Label,
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
    selfFeatPgPpNm, subFeatStatus, subFeatStatusNm,
} from '@/models/selfFeature/FeatureCommon';

import { useSubmissionRequests } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries"
import { ValidType } from "@/models/common/Constants"

const SfSubmissionRequest = () => {

	const navigate = useNavigate()
	const { toast } = useToast()
    const sessionInfo = useAppSelector(selectSessionInfo())

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
    // 결재 목록 API 호출
    const retrieveSubmissions = () => {
		if (!sessionInfo.email) {
			console.log("no session info email")
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다',
			})
			return
		}
		setUserEmail(sessionInfo.email)
    }
    // 결재 목록 API refetch
    useEffect(() => {
        if (userEmail && userEmail !== "") {
            subReqListRefetch()
        }
    }, [userEmail])
    // 결재 목록 API callback
	useEffect(() => {
		if (subReqListErr || subReqListRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (subReqListRes) {
                setSfSubmissionList((state: Array<SfSubmissionRequestInfo>) => {
                    let rtn = cloneDeep(state)
                    rtn = subReqListRes.result.map((subReq: SfSubmission) => {
                        let rd = new Date(subReq.submission.requestDate)
                        subReq.submission.requestDate = `${rd.getFullYear()}-${(rd.getMonth())}-${rd.getDate()+1} ${rd.getHours()}:${rd.getMinutes()}:${rd.getSeconds()}`
						// 진행 상태 check
						if (
							!subReq.submission.status
							|| subReq.submission.status === ""
							|| subReq.submission.status === subFeatStatus.SAVE
						) {
							subReq.submission.statusNm = subFeatStatusNm.SAVE
						} else if (
							subReq.submission.status === subFeatStatus.REQ
							|| subReq.submission.status === subFeatStatus.IN_APRV
						) {
							subReq.submission.statusNm = subFeatStatusNm.IN_APRV
						} else if (subReq.submission.status === subFeatStatus.APRV) {
							subReq.submission.statusNm = subFeatStatusNm.APRV
						} else if (subReq.submission.status === subFeatStatus.REJT) {
							subReq.submission.statusNm = subFeatStatusNm.REJT
						} else if (subReq.submission.status === subFeatStatus.CNCL) {
							subReq.submission.statusNm = subFeatStatusNm.CNCL
						} else if (subReq.submission.status === subFeatStatus.DLET) {
							subReq.submission.statusNm = subFeatStatusNm.DLET
						}
                        return subReq.submission
                    })
                    return rtn
                })
			}
		}
	}, [subReqListRes, subReqListErr, subReqListRefetch, toast])
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
        setSearch({...search, [`${id}`]: String(value),})
    }
    // 검색 버튼 클릭시
    const onClickSearch = () => {
        retrieveSubmissions()
    }
    // 페이지 이동
    const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {
        if (pageNm === selfFeatPgPpNm.DETL) {
            navigate(pageNm, { state: rows })
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
                                onValueChange={(nextVal) => {
                                    setRequestDateFrom(nextVal)
                                    setSearch((prevState: FeatureSubmissionSearchProps) => {
                                        let rtn = cloneDeep(prevState)
                                        rtn.requestDateFrom = `${nextVal}T19:20:30+01:00`
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
                                onValueChange={(nextVal) => {
                                    setRequestDateTo(nextVal)
                                    setSearch((prevState: FeatureSubmissionSearchProps) => {
                                        let rtn = cloneDeep(prevState)
                                        rtn.requestDateTo = `${nextVal}T19:20:30+01:00`
                                        return rtn
                                    });
                                }}
                            />
                        </TD>
                        <TH align="center" colSpan={1}>유형</TH>
                        <TD colSpan={1.7}>
                            <Select 
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
                                appearance="Outline" 
                                placeholder="전체" 
                                className="width-100" 
                                onChange={(
                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "status")
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
                            <TextField className="width-100" id="title" onChange={onchangeInputHandler}/>
                        </TD>
                    </TR>
                </HorizontalTable>
                <Stack gap="SM" justifyContent="Center">
                    <Button priority="Primary" appearance="Contained" size="LG" onClick={onClickSearch}>
                    <span className="searchIcon"></span>
                    검색
                    </Button>
                </Stack>
            </Stack>
            {/* 검색 영역 */}

            <Stack direction="Vertical" gap="LG" justifyContent="End" className="height-100">
                <Stack justifyContent="Between">
                    <Label>총 <span className="total">{sfSubmissionList.length}</span> 건</Label>
                    <Select 
                        appearance="Outline" 
                        size="LG" 
                        defaultValue={10} 
                        className="select-page"
                    >
                        <SelectOption value={10}>10</SelectOption>
                        <SelectOption value={30}>30</SelectOption>
                        <SelectOption value={50}>50</SelectOption>
                    </Select>
                </Stack>
                {/* 목록 영역 */}
                <Stack className="pagination-layout">
                    <VerticalTable
                        columns={columns}
                        rows={sfSubmissionList}
                        enableSort={true}
                        clickable={true}
                        //rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
                        onClick={(rows: RowsInfo) => onClickPageMovHandler(selfFeatPgPpNm.DETL, rows)}
                    />
                </Stack>
                <Pagination size="MD" />
                {/* 목록 영역 */}
            </Stack>
        </Stack>
    )
}

export default SfSubmissionRequest