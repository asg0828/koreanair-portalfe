import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react'
import { cloneDeep } from 'lodash'

import HorizontalTable from '@components/table/HorizontalTable';
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
    TextField 
} from '@components/ui';

import { FeatPrntCild } from '@/models/selfFeature/FeatureInfo';
import { 
    initFeatPrntCild, 
    featPrntClidListColumns as columns 
} from '@/pages/user/self-feature/data';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
}

const CustFeatParentChildListPop = ({ isOpen = false, onClose }: Props) => {
    
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)
    const [ srchInfo, setSrchInfo ] = useState<Object>({
        custFeatRuleName: ''
    })
    const [ custFeatParentChildList, setCustFeatParentChildList ] = useState<Array<FeatPrntCild>>([])

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            retrieveCustFeatParentChildList()
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
    
    const retrieveCustFeatParentChildList = () => {
        /*
            Method      :: GET
            Url         :: /api/v1/customerfeatures/parent-child
            query param :: mstrSgmtRuleId=&custFeatRuleName=
        */
        setCustFeatParentChildList([{...initFeatPrntCild}])
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setSrchInfo({...srchInfo, [id]: value,})
    }

    const onClickSrchHandler = () => {
        retrieveCustFeatParentChildList()
    }

    return (
        <Modal open={isOpenPopUp} onClose={handleClose} size='LG'>
            <Modal.Header>Feature 선후행 관계</Modal.Header>
            <Modal.Body>
                
                {/* 검색 영역 */}
                <HorizontalTable className='width-100'>
                    <TR>
                        <TH colSpan={1} align="right">Feature 명</TH>
                        <TD colSpan={4}>
                            <TextField className="width-100" id="custFeatRuleName" onChange={onchangeInputHandler}/>
                        </TD>
                    </TR>
                </HorizontalTable>
                <Stack gap="SM" justifyContent="Center" className='width-100'>
                    <Button 
                        type="button" 
                        priority="Primary" 
                        appearance="Contained" 
                        size="LG" 
                        onClick={onClickSrchHandler}
                    >
                        <span className="searchIcon"></span>
                        검색
                    </Button>
                </Stack>
                {/* 검색 영역 */}
                <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100 width-100">
                    <Stack justifyContent="Between">
                        <Label>총 <span className="total">{custFeatParentChildList.length}</span> 건</Label>
                        <Select appearance="Outline" size="LG" defaultValue={10} className="select-page">
                            <SelectOption value={10}>10</SelectOption>
                            <SelectOption value={30}>30</SelectOption>
                            <SelectOption value={50}>50</SelectOption>
                        </Select>
                    </Stack>

                    <VerticalTable
                        columns={columns}
                        rows={custFeatParentChildList}
                        enableSort={false}
                        clickable={false}
                    />
                    <Stack className="pagination-layout">
                        <Pagination size="LG" className="pagination" />
                    </Stack>
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button priority="Normal" appearance="Outline" size='LG' onClick={handleConfirm}>
                닫기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CustFeatParentChildListPop