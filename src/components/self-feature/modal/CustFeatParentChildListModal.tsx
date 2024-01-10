import {
    useState,
    useEffect,
    useCallback
} from 'react'
import { cloneDeep } from 'lodash'

import HorizontalTable from '@components/table/HorizontalTable'
import {
    Modal,
    Button,
    Stack,
    TR,
    TH,
    TD,
    TextField,
    useToast,
    Loader
} from '@components/ui'

import { FeatPrntCild } from '@/models/selfFeature/FeatureModel'
import {
    featPrntClidListColumns as columns
} from '@/pages/user/self-feature/data'
import { useCustFeatParentChildList } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries'
import { ValidType } from '@/models/common/Constants'
import { PageModel, initPage } from '@/models/model/PageModel'
import DataGrid from '@/components/grid/DataGrid'
import { PagingUtil, setPageList } from '@/utils/self-feature/PagingUtil'
import { useTranslation } from 'react-i18next'
import { ModalType, SubFeatStatus, SubFeatStatusNm } from '@/models/selfFeature/FeatureCommon'
import ConfirmModal from '@/components/modal/ConfirmModal'

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    mstrSgmtRuleId: string
}
const CustFeatParentChildListModal = ({
    isOpen = false,
    onClose,
    mstrSgmtRuleId,
}: Props) => {

    const { toast } = useToast()
    const { t } = useTranslation()

    const [isOpenParentChildListModal, setIsOpenParentChildListModal] = useState<boolean>(false)

    // 페이징(page: 페이지정보, rows: 페이지에 보여질 list)
    const [page, setPage] = useState<PageModel>(cloneDeep(initPage))
    const [rows, setRows] = useState<Array<FeatPrntCild>>([])
    // 검색 조건
    const [custFeatRuleName, setCustFeatRuleName] = useState<string>("")
    // 목록
    const [custFeatParentChildList, setCustFeatParentChildList] = useState<Array<FeatPrntCild>>([])
    const { data: parentChildRes, isError: parentChildErr, refetch: parentChildRefetch, isFetching: parentChildFetching } = useCustFeatParentChildList(mstrSgmtRuleId, custFeatRuleName)
	// 모달, 버튼 클릭 종류
	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
	const [confirmModalTit, setConfirmModalTit] = useState<string>('')
	const [confirmModalCont, setConfirmModalCont] = useState<string>('')
	const [modalType, setModalType] = useState<string>('')

    useEffect(() => {
        setIsOpenParentChildListModal(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            //parentChildRefetch()
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenParentChildListModal: boolean) => {
            if (onClose) {
                // 검색 초기화
                setCustFeatParentChildList([])
                PagingUtil([], cloneDeep(initPage))
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

	// modal 확인/취소 이벤트
	const onConfirm = () => {
		if (modalType === ModalType.CONFIRM) {
		}
		setIsOpenConfirmModal(false)
	};
	const onCancel = () => {
		setIsOpenConfirmModal(false)
	}

    useEffect(() => {
        if (parentChildErr || parentChildRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            })
        } else {
            if (parentChildRes) {
                parentChildRes.result.map((t: FeatPrntCild) => {
                    if (
                        !t.submissionStatus
                        || t.submissionStatus === ""
                        || t.submissionStatus === SubFeatStatus.SAVE
                    ) {
                        t.submissionStatusNm = SubFeatStatusNm.SAVE
                    } else if (
                        t.submissionStatus === SubFeatStatus.REQ
                        || t.submissionStatus === SubFeatStatus.IN_APRV
                    ) {
                        t.submissionStatusNm = SubFeatStatusNm.IN_APRV
                    } else if (t.submissionStatus === SubFeatStatus.APRV) {
                        t.submissionStatusNm = SubFeatStatusNm.APRV
                    } else if (t.submissionStatus === SubFeatStatus.REJT) {
                        t.submissionStatusNm = SubFeatStatusNm.REJT
                    } else if (t.submissionStatus === SubFeatStatus.CNCL) {
                        t.submissionStatusNm = SubFeatStatusNm.CNCL
                    } else if (t.submissionStatus === SubFeatStatus.DLET) {
                        t.submissionStatusNm = SubFeatStatusNm.DLET
                    }
                    return t
                })
                setCustFeatParentChildList(parentChildRes.result)
                PagingUtil(parentChildRes.result, page)
            }
        }
    }, [parentChildRes, parentChildErr])

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setCustFeatRuleName(value)
    }
    // 페이지당 목록 수, 페이지 번호 바뀔 경우 page setting
    const handlePage = (page: PageModel) => {
        setPage(PagingUtil(custFeatParentChildList, page))
    }
    // 변경된 page에 따른 list setting
    useEffect(() => {
        setPageList(page, custFeatParentChildList, setRows)
    }, [page.page, page.pageSize, custFeatParentChildList])
    // 검색 버튼 클릭시
    const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (custFeatRuleName === "") {
			setModalType(ModalType.ALERT)
			setConfirmModalTit('Feature 연결 관계')
			setConfirmModalCont('Feature 명을 입력 해주세요.')
			setIsOpenConfirmModal(true)
            return
        }
        parentChildRefetch()
    }
    // 검색 조건 초기화
    const onClearSearchInfo = () => {
        setCustFeatRuleName("")
    }

    return (
        <Modal open={isOpenParentChildListModal} onClose={handleClose} size='LG'>
            <Modal.Header>Feature 연결 관계</Modal.Header>
            <Modal.Body>
                {/* 검색 영역 */}
                <form style={{ width: "100%" }} onSubmit={onsubmitHandler}>
                    <Stack direction="Vertical" gap="LG">
                        <HorizontalTable>
                            <TR>
                                <TH colSpan={1} align="right">Feature 명</TH>
                                <TD colSpan={3}>
                                    <TextField
                                        value={custFeatRuleName}
                                        className="width-100"
                                        onChange={onchangeInputHandler}
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
                {parentChildFetching
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

            {/* Confirm 모달 */}
            <ConfirmModal
                isOpen={isOpenConfirmModal}
                onClose={(isOpen) => setIsOpenConfirmModal(isOpen)}
                title={confirmModalTit}
                content={confirmModalCont}
                onConfirm={onConfirm}
                onCancle={onCancel}
                btnType={modalType}
            />
        </Modal>
    )
}

export default CustFeatParentChildListModal