import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import QuerySampleDataModal from "@/components/self-feature/modal/QuerySampleDataModal";
import BatchExecuteLogsModal from "@/components/self-feature/modal/BatchExecuteLogsModal";
import ReadSqlModal from "@/components/self-feature/modal/ReadSqlModal";
import ConfirmModal from '../modal/ConfirmModal';

import {
    Button,
    Stack,
    useToast,
} from '@components/ui'
import {
    ModalTitCont,
    ModalType,
} from '@/models/selfFeature/FeatureCommon';
import { useRunScheduleByManually } from '@/hooks/mutations/self-feature/useSelfFeatureUserMutations';
import { ValidType } from '@/models/common/Constants';

export interface Props {
    [key: string]: string | number
    custFeatRuleId: string
    batManualExecTestCnt: number
}

const FeatQueryRsltButton = ({
    custFeatRuleId,
    batManualExecTestCnt,
}: Props) => {

    const { toast } = useToast()
    // 팝업
    const [isOpenQuerySampleDataModal, setIsOpenQuerySampleDataModal] = useState<boolean>(false)
    const [isOpenBatchExecuteLogsModal, setIsOpenBatchExecuteLogsModal] = useState<boolean>(false)
    const [isOpenReadSqlModal, setIsOpenReadSqlModal] = useState<boolean>(false)
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
            if (batManualExecTestCnt > 5) {
                toast({
                    type: ValidType.ERROR,
                    content: '수동 가능한 횟수는 5회 입니다.',
                })
                return
            }
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
            setIsOpenQuerySampleDataModal((prevState) => !prevState)
        } else if (type === 3) {
            setIsOpenBatchExecuteLogsModal((prevState) => !prevState)
        } else if (type === 4) {
            setIsOpenReadSqlModal((prevState) => !prevState)
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
            <QuerySampleDataModal
                isOpen={isOpenQuerySampleDataModal}
                onClose={(isOpen) => setIsOpenQuerySampleDataModal(isOpen)}
                custFeatRuleId={custFeatRuleId}
            />
            <BatchExecuteLogsModal
                isOpen={isOpenBatchExecuteLogsModal}
                onClose={(isOpen) => setIsOpenBatchExecuteLogsModal(isOpen)}
                custFeatRuleId={custFeatRuleId}
            />
            <ReadSqlModal
                isOpen={isOpenReadSqlModal}
                onClose={(isOpen) => setIsOpenReadSqlModal(isOpen)}
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