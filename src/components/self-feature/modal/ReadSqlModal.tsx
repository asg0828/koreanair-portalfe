import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react'
import { cloneDeep } from 'lodash'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'

import { 
    Modal, 
    Button, 
    Stack, 
    useToast, 
} from '@components/ui';

import { ReadSql } from '@/models/selfFeature/FeatureModel';
import { 
    initReadSql, 
} from '@/pages/user/self-feature/data';
import { useReadSql } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { ValidType } from '@/models/common/Constants';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    custFeatRuleId: string
}

const ReadSqlModal = ({ 
    isOpen = false, 
    onClose,
    custFeatRuleId,
}: Props) => {

    const { toast } = useToast()
    const [ isOpenReadSqlModal, setIsOpenReadSqlModal ] = useState<boolean>(false)
    const [ readSql, setReadSql ] = useState<ReadSql>(cloneDeep(initReadSql))

    const { data: readSqlRes, isError: readSqlErr, refetch: readSqlRefetch } = useReadSql(custFeatRuleId)

    useEffect(() => {
        setIsOpenReadSqlModal(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            // 쿼리확인 조회 API 호출
            readSqlRefetch()
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenReadSqlModal: boolean) => {
            if (onClose) {
                onClose(isOpenReadSqlModal)
            } else {
                setIsOpenReadSqlModal(isOpenReadSqlModal)
            }
        },
        [onClose]
    )
    const handleConfirm = () => {
        handleClose(false)
    }
    // 쿼리확인 조회 API callback
    useEffect(() => {
        if (readSqlErr || readSqlRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (readSqlRes) {
                setReadSql((state: ReadSql) => { 
                    state.sql = readSqlRes.result
                    return cloneDeep(state)
                })
            }
        }
    }, [readSqlRes, readSqlErr, toast])

    return (
        <Modal open={isOpenReadSqlModal} onClose={handleClose} size='LG'>
            <Modal.Header>쿼리 확인</Modal.Header>
            <Modal.Body>
                <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
                    <CodeMirror
                        readOnly
                        value={readSql?.sql}
                        height="400px"
                        width='750px'
                        extensions={[sql()]}
                    />
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

export default ReadSqlModal