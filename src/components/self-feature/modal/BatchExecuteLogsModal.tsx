import {
    useState,
    useEffect,
    useCallback
} from 'react'

import {
    Modal,
    Button,
    useToast,
} from '@components/ui';
import '@/assets/styles/SelfFeature.scss'

import { BatchExecuteLog } from '@/models/selfFeature/FeatureModel';
import {
    batchExecuteLogListColumns as columns,
} from '@/pages/user/self-feature/data';
import { useBatchExecuteLogs } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { ValidType } from '@/models/common/Constants';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { PagingUtil, setPageList } from '@/utils/self-feature/PagingUtil';
import { cloneDeep } from 'lodash';
import { DateUnitType, getDateDiff, getDateFormat } from '@/utils/DateUtil';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    custFeatRuleId: string
}

const BatchExecuteLogsModal = ({
    isOpen = false,
    onClose,
    custFeatRuleId,
}: Props) => {

    const { toast } = useToast()
    const [isOpenBatchExecuteLogsModal, setIsOpenBatchExecuteLogsModal] = useState<boolean>(false)

    // 페이징(page: 페이지정보, rows: 페이지에 보여질 list)
    const [page, setPage] = useState<PageModel>(cloneDeep(initPage))
    const [rows, setRows] = useState<Array<BatchExecuteLog>>([])
    const [batchExecuteLogList, setBatchExecuteLogList] = useState<Array<BatchExecuteLog>>([])

    const { data: batchExecuteLogsRes, isError: batchExecuteLogsErr, refetch: batchExecuteLogsRefetch } = useBatchExecuteLogs(custFeatRuleId)

    useEffect(() => {
        setIsOpenBatchExecuteLogsModal(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            batchExecuteLogsRefetch()
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenBatchExecuteLogsModal: boolean) => {
            if (onClose) {
                onClose(isOpenBatchExecuteLogsModal)
            } else {
                setIsOpenBatchExecuteLogsModal(isOpenBatchExecuteLogsModal)
            }
        },
        [onClose]
    )
    const handleConfirm = () => {
        handleClose(false)
    }
    // 조회 callback
    useEffect(() => {
        if (batchExecuteLogsErr || batchExecuteLogsRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (batchExecuteLogsRes) {
                let rtn = cloneDeep(batchExecuteLogsRes.result)
                rtn = rtn.map((batchExecuteLog: BatchExecuteLog) => {
                    batchExecuteLog.execTme  = getDateDiff(batchExecuteLog.startTme, batchExecuteLog.endTme, DateUnitType.MILLISECOND)
                    batchExecuteLog.startTme = getDateFormat(batchExecuteLog.startTme, "YYYY-MM-DD HH:mm:ss")
                    batchExecuteLog.endTme   = getDateFormat(batchExecuteLog.endTme, "YYYY-MM-DD HH:mm:ss")
                    return batchExecuteLog
                })
                setBatchExecuteLogList(rtn)
				PagingUtil(rtn, page)
            }
        }
    }, [batchExecuteLogsRes, batchExecuteLogsErr, toast])
    // 페이지당 목록 수, 페이지 번호 바뀔 경우 page setting
    const handlePage = (page: PageModel) => {
        setPage(PagingUtil(batchExecuteLogList, page))
    }
    // 변경된 page에 따른 list setting
    useEffect(() => {
        setPageList(page, batchExecuteLogList, setRows)
    }, [page.page, page.pageSize, batchExecuteLogList])

    return (
        <Modal open={isOpenBatchExecuteLogsModal} onClose={handleClose} size='LG'>
            <Modal.Header>실행 내역</Modal.Header>
            <Modal.Body>
                {/* 목록 영역 */}
                <DataGrid
                    columns={columns}
                    rows={rows}
                    //enableSort={true}
                    //clickable={true}
                    page={page}
                    onChange={handlePage}
                    //onClick={(rows: RowsInfo) => onClickPageMovHandler(selfFeatPgPpNm.DETL, rows)}
                    //rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
                    buttonChildren={
                        <>
                            <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                                닫기
                            </Button>
                        </>
                    }
                />
                {/* 목록 영역 */}
            </Modal.Body>
        </Modal>
    )
}

export default BatchExecuteLogsModal