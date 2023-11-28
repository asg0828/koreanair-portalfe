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

const ReadSqlPop = ({ 
    isOpen = false, 
    onClose,
    custFeatRuleId,
}: Props) => {

    const { toast } = useToast()
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)
    const [ readSql, setReadSql ] = useState<ReadSql>(cloneDeep(initReadSql))

    const { data: response, isError, refetch } = useReadSql(custFeatRuleId)

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
                //setReadSql()
                setReadSql((state: ReadSql) => { 
                    state.sql = response.result
                    return cloneDeep(state)
                })
            }
        }
    }, [response, isError, toast])

    return (
        <Modal open={isOpenPopUp} onClose={handleClose} size='LG'>
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

export default ReadSqlPop