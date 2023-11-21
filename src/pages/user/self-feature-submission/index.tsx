import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect'

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
} from '@components/ui'

import { RowsInfo } from "@/models/components/Table"
import { 
    sfSubmissionListColumns as columns,
    sfSubmissionTypeOption,
    sfSubmissionStatusOption,
    initSfSubmissionRequestInfo,
} from './data'
import { 
    SfSubmissionRequestInfo,
} from "@/models/selfFeature/FeatureSubmissionInfo"
import { Method, callApi } from "@/utils/ApiUtil"
import {
    initApiRequest, 
    initCommonResponse, 
    initConfig, 
    initQueryParams,
    selfFeatPgPpNm,
} from '@/models/selfFeature/FeatureCommon';

export interface SearchProps {
    type?: string | ''
    status?: string | ''
    referenceNo?: string | ''
    submissionNo?: string | ''
    requester?: string | ''
    title?: string | ''
    titleLike?: string | ''
    requestDateFrom?: string | ''
    requestDateTo?: string | ''
    approvalCompletionDateFrom?: string | ''
    approvalCompletionDateTo?: string | ''
}

const SfSubmissionRequest = () => {

    const navigate = useNavigate()

    const [ requestDateFrom, setRequestDateFrom ] = useState<string>('2023-01-01')
    const [ requestDateTo, setRequestDateTo ] = useState<string>('')

    const [ search, setSearch ] = useState<SearchProps>({
        type: "CustomerFeature",
        status: "",
        title: "",
        requestDateFrom: "",
        requestDateTo: "",
    })

    const [ sfSubmissionList, setSfSubmissionList ] = useState<Array<SfSubmissionRequestInfo>>(cloneDeep([initSfSubmissionRequestInfo]))

    useEffect(() => {
        retrieveSubmissions()
    }, [])

    const retrieveSubmissions = async () => {
        /*
            Method      :: GET
            Url         :: /api/v1/users/{email}/submissions
            path param  :: {email}
            query param :: type=&status=&referenceNo=&submissionNo=&requester=&title=&titleLike=&requestDateFrom=&requestDateTo=&approvalCompletionDateFrom=&approvalCompletionDateTo=
            body param  :: 
        */
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.GET
        request.url = `/api/v1/submissions`
        request.params!.queryParams = Object.assign(cloneDeep(initQueryParams), search)
        console.log("[retrieveSubmissions] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        response = await callApi(request)
        console.log("[retrieveSubmissions] Response :: ", response)

        setSfSubmissionList((state: Array<SfSubmissionRequestInfo>) => {
            let rtn = cloneDeep(state)
            let t = []
            for (let i = 0; i < 5; i++) {
                let a = cloneDeep(initSfSubmissionRequestInfo)
                a.type = "Rule-Design"
                a.referenceNo = "custFeatRuleId"
                a.title = `결재요청목록${i+1}`
                a.status = "결재진행중"
                a.requesterName = "요청자"
                let rd = new Date("2023-11-03T02:28:59.114Z")
                a.requestDate = `${rd.getFullYear()}-${(rd.getMonth())}-${rd.getDate()+1} ${rd.getHours()}:${rd.getMinutes()}:${rd.getSeconds()}`
                t.push(a)
            }
            rtn = t
            return rtn
        })
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setSearch({...search, [id]: value,})
    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: String
    ) => {
        setSearch({...search, [`${id}`]: String(value),})
    }

    const onClickSearch = () => {
        retrieveSubmissions()
    }
    
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
                                    setSearch((prevState: SearchProps) => {
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
                                    setSearch((prevState: SearchProps) => {
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