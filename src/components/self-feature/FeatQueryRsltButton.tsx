import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import QuerySampleDataPop from "@/components/self-feature/popup/QuerySampleDataPop";
import BatchExecuteLogsPop from "@/components/self-feature/popup/BatchExecuteLogsPop";
import ReadSqlPop from "@/components/self-feature/popup/ReadSqlPop";
import ConfirmModal from '../modal/ConfirmModal';

import {
    Button,
    Stack,
    useToast,
} from '@components/ui'
import {
    ModalTitCont,
    ModalType,
    initApiRequest,
    initCommonResponse,
    initConfig
} from '@/models/selfFeature/FeatureCommon';
import { Method, callApi } from '@/utils/ApiUtil';
import { useRunScheduleByManually } from '@/hooks/mutations/self-feature/useSelfFeatureUserMutations';
import { ValidType } from '@/models/common/Constants';

export interface Props {
    [key: string]: string
    custFeatRuleId: string
}

const FeatQueryRsltButton = ({
    custFeatRuleId,
}: Props) => {

    const { toast } = useToast()
    // 팝업
    const [isOpenQuerySampleDataPop, setIsOpenQuerySampleDataPop] = useState<boolean>(false)
    const [isOpenBatchExecuteLogsPop, setIsOpenBatchExecuteLogsPop] = useState<boolean>(false)
    const [isOpenReadSqlPop, setIsOpenReadSqlPop] = useState<boolean>(false)
    // 모달
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')
    // 수동실행 API
    const { data: runScheduleByManuallyRes, isSuccess: runScheduleByManuallySucc, isError: runScheduleByManuallyErr, mutate: runScheduleByManuallyMutate } = useRunScheduleByManually(custFeatRuleId)
    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) runScheduleByManually()
        setIsOpenConfirmModal(false)
    }
    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }
    // 수동실행 API 호출
    const runScheduleByManually = () => {
        if (custFeatRuleId && custFeatRuleId !== "") {
            runScheduleByManuallyMutate()
        } else {
            toast({
                type: ValidType.ERROR,
                content: '수동 실행 중 에러가 발생했습니다.',
            })
        }
    }
    // 수동실행 API callback
    useEffect(() => {
        if (runScheduleByManuallyErr || runScheduleByManuallyRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '수동 실행 중 에러가 발생했습니다.',
            })
        } else if (runScheduleByManuallySucc) {
            toast({
                type: ValidType.CONFIRM,
                content: '수동 실행이 완료되었습니다.',
            })
        }
    }, [runScheduleByManuallyRes, runScheduleByManuallySucc, runScheduleByManuallyErr, toast])
    // 버튼 이벤트
    const onClickFeatQueryRsltHandler = (type: number) => {
        if (type === 1) {
            setModalType(ModalType.CONFIRM)
            setConfirmModalTit(ModalTitCont.BETCH.title)
            setConfirmModalCont(ModalTitCont.BETCH.context)
            setIsOpenConfirmModal(true)
        } else if (type === 2) {
            setIsOpenQuerySampleDataPop((prevState) => !prevState)
        } else if (type === 3) {
            setIsOpenBatchExecuteLogsPop((prevState) => !prevState)
        } else if (type === 4) {
            setIsOpenReadSqlPop((prevState) => !prevState)
        }
    }

    return (
        <>
            {/* 버튼 */}
            <Stack direction="Horizontal" gap="MD" justifyContent="End">
                <Button size="LG" onClick={() => onClickFeatQueryRsltHandler(1)}>
                    수동 실행
                </Button>
                <Button size="LG" onClick={() => onClickFeatQueryRsltHandler(2)}>
                    샘플 확인
                </Button>
                <Button size="LG" onClick={() => onClickFeatQueryRsltHandler(3)}>
                    실행 내역
                </Button>
                <Button size="LG" onClick={() => onClickFeatQueryRsltHandler(4)}>
                    쿼리 확인
                </Button>
            </Stack>
            {/* 버튼 */}

            {/* 팝업 component */}
            <QuerySampleDataPop
                isOpen={isOpenQuerySampleDataPop}
                onClose={(isOpen) => setIsOpenQuerySampleDataPop(isOpen)}
                custFeatRuleId={custFeatRuleId}
            />
            <BatchExecuteLogsPop
                isOpen={isOpenBatchExecuteLogsPop}
                onClose={(isOpen) => setIsOpenBatchExecuteLogsPop(isOpen)}
                custFeatRuleId={custFeatRuleId}
            />
            <ReadSqlPop
                isOpen={isOpenReadSqlPop}
                onClose={(isOpen) => setIsOpenReadSqlPop(isOpen)}
                custFeatRuleId={custFeatRuleId}
            />

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
        </>
    )
}

export default FeatQueryRsltButton