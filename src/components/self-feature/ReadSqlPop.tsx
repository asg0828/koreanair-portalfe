import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react'
import { cloneDeep } from 'lodash'

import VerticalTable from '../table/VerticalTable';
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
} from '@components/ui';

import { ReadSql } from '@/models/selfFeature/FeatureInfo';
import { 
    initApiRequest,
    initCommonResponse,
    initConfig,
    initReadSql, 
} from '@/pages/user/self-feature/data';
import { Method, callApi } from '@/utils/ApiUtil';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
}

const ReadSqlPop = ({ isOpen = false, onClose }: Props) => {
    
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)
    const [ readSql, setReadSql ] = useState<ReadSql>()

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            retrieveReadSql()
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
    
    const retrieveReadSql = async () => {
        /*
            Method      :: GET
            Url         :: /api/v1/customerfeatures/read-sql
            path param  :: {custFeatRuleId}
            query param :: 
        */
        let custFeatRuleId = ''
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.GET
        request.url = `/api/v1/customerfeatures/read-sql/${custFeatRuleId}`
        console.log("[retrieveReadSql] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        response = await callApi(request)
        console.log("[retrieveReadSql] Response :: ", response)

        setReadSql(cloneDeep(initReadSql))
    }

    return (
        <Modal open={isOpenPopUp} onClose={handleClose} size='LG'>
            <Modal.Header>쿼리 확인</Modal.Header>
            <Modal.Body>
                <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
                    {readSql?.sql}
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