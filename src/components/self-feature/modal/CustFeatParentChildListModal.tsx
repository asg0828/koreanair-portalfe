import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react'

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
    TextField, 
    useToast
} from '@components/ui';

import { FeatPrntCild } from '@/models/selfFeature/FeatureModel';
import { 
    initFeatPrntCild, 
    featPrntClidListColumns as columns 
} from '@/pages/user/self-feature/data';
import { RuleId } from '@/models/selfFeature/FeatureCommon';
import { useCustFeatParentChildList } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { ValidType } from '@/models/common/Constants';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
}

export interface SearchProps {
    [key: string]: string
    mstrSgmtRuleId: string
    custFeatRuleName: string
}

const CustFeatParentChildListModal = ({ isOpen = false, onClose }: Props) => {

    const { toast } = useToast()

    const [ isOpenParentChildListModal, setIsOpenParentChildListModal ] = useState<boolean>(false)
    const [ srchInfo, setSrchInfo ] = useState<SearchProps>({
        mstrSgmtRuleId: RuleId.MASTERPROF,
        custFeatRuleName: '',
    })
    
    //const { data: response, isError, refetch } = useCustFeatParentChildList(srchInfo.custFeatRuleName);
    const [ custFeatParentChildList, setCustFeatParentChildList ] = useState<Array<FeatPrntCild>>([])

    useEffect(() => {
        setIsOpenParentChildListModal(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            //refetch()
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenParentChildListModal: boolean) => {
            if (onClose) {
                onClose(isOpenParentChildListModal)
            } else {
                setIsOpenParentChildListModal(isOpenParentChildListModal)
            }
        },
        [onClose]
    )

    const handleConfirm = () => {
        handleClose(false)
    }
    /*
    useEffect(() => {
        if (isError || response?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (response) {
                console.log(response)
                //setCustFeatParentChildList()
            }
        }
    }, [response, isError, toast])
    */
    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setSrchInfo({...srchInfo, [id]: value,})
    }

    const onClickSrchHandler = () => {
        //refetch()
    }

    return (
        <Modal open={isOpenParentChildListModal} onClose={handleClose} size='LG'>
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

export default CustFeatParentChildListModal