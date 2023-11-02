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

import { FeatSampleData } from '@/models/selfFeature/FeatureInfo';
import { 
    initFeatSampleData, 
    querySampleDataListColumns as columns, 
    initConfig,
    initApiRequest,
    initCommonResponse,
    initQueryParams
} from '@/pages/user/self-feature/data';
import { Method, callApi } from '@/utils/ApiUtil';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
}

const QuerySampleDataPop = ({ isOpen = false, onClose }: Props) => {
    
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)
    const [ querySampleDataList, setQuerySampleDatadList ] = useState<Array<FeatSampleData>>([])

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            retrieveSampleData()
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
    
    const retrieveSampleData = async () => {
        /*
            Method      :: GET
            Url         :: /api/v1/customerfeatures/sample
            path param  :: {custFeatRuleId}
            query param :: rslnId=
        */
        let custFeatRuleId = ''
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.GET
        request.url = `/api/v1/customerfeatures/sample/${custFeatRuleId}`
        request.params!.queryParams = Object.assign(cloneDeep(initQueryParams), {rslnId: 'OneId'})
        console.log("[retrieveSampleData] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        response = await callApi(request)
        console.log("[retrieveSampleData] Response :: ", response)
        //setQuerySampleDatadList([{...initFeatSampleData}])
    }

    return (
        <Modal open={isOpenPopUp} onClose={handleClose} size='LG'>
            <Modal.Header>실행 내역</Modal.Header>
            <Modal.Body>
                <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
                    <Label>총 {querySampleDataList.length} 건</Label>
                    <VerticalTable
                        columns={columns}
                        rows={querySampleDataList}
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

export default QuerySampleDataPop