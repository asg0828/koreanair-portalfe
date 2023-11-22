import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react'
import { cloneDeep } from 'lodash'

import VerticalTable from '../../table/VerticalTable';
import { 
    Modal, 
    Button, 
    Stack, 
    TR, 
    TH, 
    TD, 
    Pagination, 
    SelectOption, 
    Select, 
    Label,
    useToast, 
} from '@components/ui';

import { BatchExecuteLog } from '@/models/selfFeature/FeatureModel';
import { 
    batchExecuteLogListColumns as columns, 
} from '@/pages/user/self-feature/data';
import { useBatchExecuteLogs } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { ValidType } from '@/models/common/Constants';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    custFeatRuleId: string
}

const BatchExecuteLogsPop = ({ 
    isOpen = false, 
    onClose,
    custFeatRuleId, 
}: Props) => {

    const { toast } = useToast()

    const { data: response, isError, refetch } = useBatchExecuteLogs(custFeatRuleId)

    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)
    const [ batchExecuteLogList, setBatchExecuteLogList ] = useState<Array<BatchExecuteLog>>([])

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            refetch()
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenPopUp: boolean) => {
            if (onClose) {
                onClose(isOpenPopUp)
            } else {
                setIsOpenPopUp(isOpenPopUp)
            }
        },
        [onClose]
    )

    const handleConfirm = () => {
        handleClose(false)
    }
    useEffect(() => {
        if (isError || response?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (response) {
                console.log(response)
                //setBatchExecuteLogList()
            }
        }
    }, [response, isError, toast])

    return (
        <Modal open={isOpenPopUp} onClose={handleClose} size='LG'>
            <Modal.Header>실행 내역</Modal.Header>
            <Modal.Body>
                <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
                    <Label>총 {batchExecuteLogList.length} 건</Label>
                    <VerticalTable
                        columns={columns}
                        rows={batchExecuteLogList}
                        enableSort={false}
                        clickable={false}
                    />
                    <Stack className="pagination-layout">
                        <Select appearance="Outline" size="LG" defaultValue={10} className="select-page">
                            <SelectOption value={10}>10</SelectOption>
                            <SelectOption value={30}>30</SelectOption>
                            <SelectOption value={50}>50</SelectOption>
                        </Select>
            
                        <Pagination size="LG" className="pagination" />
                    </Stack>
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                닫기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BatchExecuteLogsPop