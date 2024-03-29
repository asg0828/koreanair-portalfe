import {
    useState,
    useEffect,
    useCallback
} from 'react'
import { cloneDeep } from 'lodash'

import {
    Modal,
    Button,
    useToast,
    Stack,
    TR,
    TH,
    TD,
    TextField,
    Loader,
} from '@components/ui';
import '@/assets/styles/SelfFeature.scss'

import { FeatSampleData } from '@/models/selfFeature/FeatureModel';
import {
    querySampleDataListColumns as columns,
} from '@/pages/user/self-feature/data';
import { useSampleData } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { ValidType } from '@/models/common/Constants';
import { PageModel, initPage } from '@/models/model/PageModel';
import { PagingUtil, setPageList } from '@/utils/self-feature/PagingUtil';
import DataGrid from '@/components/grid/DataGrid';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useTranslation } from 'react-i18next';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    rslnRuleId: string
    custFeatRuleId: string
}

const QuerySampleDataModal = ({
    isOpen = false,
    onClose,
    rslnRuleId,
    custFeatRuleId,
}: Props) => {

    const { toast } = useToast()
    const { t } = useTranslation()

    const [isOpenQuerySampleDataModal, setIsOpenQuerySampleDataModal] = useState<boolean>(false)

    // 페이징(page: 페이지정보, rows: 페이지에 보여질 list)
    const [page, setPage] = useState<PageModel>(cloneDeep(initPage))
    const [rows, setRows] = useState<Array<FeatSampleData>>([])
    const [querySampleDataList, setQuerySampleDatadList] = useState<Array<FeatSampleData>>([])
    const [rslnId, setRslnId] = useState<string>("")

    const { data: sampleDataRes, isError: sampleDataErr, refetch: sampleDataRefetch, isFetching: sampleDataFetching } = useSampleData(rslnId, custFeatRuleId)

    useEffect(() => {
        setIsOpenQuerySampleDataModal(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            sampleDataRefetch()
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenQuerySampleDataModal: boolean) => {
            if (onClose) {
                onClose(isOpenQuerySampleDataModal)
            } else {
                setIsOpenQuerySampleDataModal(isOpenQuerySampleDataModal)
            }
        },
        [onClose]
    )

    const handleConfirm = () => {
        handleClose(false)
    }

    useEffect(() => {
        if (sampleDataErr || sampleDataRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (sampleDataRes) {
                let rtn = cloneDeep(sampleDataRes.result)
                rtn = rtn.map((sampleData: FeatSampleData) => {
                    // batchExecuteLog.execTme  = getDateDiff(batchExecuteLog.startTme, batchExecuteLog.endTme, DateUnitType.MILLISECOND)
                    // batchExecuteLog.startTme = getDateFormat(batchExecuteLog.startTme, "YYYY-MM-DD HH:mm:ss")
                    // batchExecuteLog.endTme   = getDateFormat(batchExecuteLog.endTme, "YYYY-MM-DD HH:mm:ss")
                    return sampleData
                })
                setQuerySampleDatadList(rtn)
				PagingUtil(rtn, page)
            }
        }
    }, [sampleDataRes, sampleDataErr, toast])
    // 페이지당 목록 수, 페이지 번호 바뀔 경우 page setting
    const handlePage = (page: PageModel) => {
        setPage(PagingUtil(querySampleDataList, page))
    }
    // 변경된 page에 따른 list setting
    useEffect(() => {
        setPageList(page, querySampleDataList, setRows)
    }, [page.page, page.pageSize, querySampleDataList])

	// 검색 버튼 클릭시
	const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		sampleDataRefetch()
	}
	// 검색 조건 초기화
	const onClearSearchInfo = () => {
        setRslnId("")
	}
    return (
        <Modal open={isOpenQuerySampleDataModal} onClose={handleClose} size='LG'>
            <Modal.Header>샘플 확인</Modal.Header>
            <Modal.Body>
                {/* 검색 영역 */}
                <form style={{width: "100%"}} onSubmit={onsubmitHandler}>
                    <Stack direction="Vertical" gap="LG">
                        <HorizontalTable>
                            <TR>
                                <TH colSpan={1} align="right">One ID</TH>
                                <TD colSpan={3}>
                                    <TextField
                                        value={rslnId}
                                        className="width-100"
                                        onChange={(e) => {
                                            const { id, value } = e.target
                                            setRslnId(value)
                                        }}
                                    />
                                </TD>
                            </TR>
                        </HorizontalTable>
                        <Stack gap="SM" justifyContent="Center">
                            <Button type="submit" priority="Primary" appearance="Contained" size="LG" >
                                <span className="searchIcon"></span>
                                검색
                            </Button>
                            <Button type="reset" size="LG" onClick={onClearSearchInfo}>
                                초기화
                            </Button>
                        </Stack>
                    </Stack>
                </form>
                {/* 검색 영역 */}
                {/* 목록 영역 */}
                {sampleDataFetching 
                    ?
                    <Loader 
                        style={{
                            width: "100%", 
                            height: "100%",
                        }} 
                        type="Bubble" 
                        title={t('common.message.proceeding')} 
                        description={"데이터를 불러오고 있습니다."}
                    /> 
                    :
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        showPagination={false}
                        showPageSizeSelect={false}
                        page={page}
                        onChange={handlePage}
                        buttonChildren={
                            <>
                                <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                                    닫기
                                </Button>
                            </>
                        }
                    />
                }
                {/* 목록 영역 */}
            </Modal.Body>
        </Modal>
    )
}

export default QuerySampleDataModal