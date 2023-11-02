import { useState } from 'react'
import { cloneDeep } from 'lodash'

import QuerySampleDataPop from "@/components/self-feature/QuerySampleDataPop";
import BatchExecuteLogsPop from "@/components/self-feature/BatchExecuteLogsPop";
import ReadSqlPop from "@/components/self-feature/ReadSqlPop";
import ConfirmModal from '../modal/ConfirmModal';

import {
    Button,
    Stack,
} from '@components/ui'
import { ModalType, initApiRequest, initCommonResponse, initConfig } from '@/pages/user/self-feature/data';
import { Method, callApi } from '@/utils/ApiUtil';

const FeatQueryRsltButton = () => {

    const [ isOpenQuerySampleDataPop, setIsOpenQuerySampleDataPop ] = useState<boolean>(false)
    const [ isOpenBatchExecuteLogsPop, setIsOpenBatchExecuteLogsPop ] = useState<boolean>(false)
    const [ isOpenReadSqlPop, setIsOpenReadSqlPop ] = useState<boolean>(false)

    const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
    const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
    const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
    const [ modalType, setModalType ] = useState<string>('')

    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) runScheduleByManually()
        setIsOpenConfirmModal(false)
    }
    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }

    const runScheduleByManually = async () => {
        /*
            Method      :: POST
            Url         :: /api/v1/airflow/runSchedule
            path param  :: {id}
            query param :: 
            body param  :: 
        */
        let id = ''
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.POST
        request.url = `/api/v1/airflow/runSchedule/${id}`
        console.log("[runScheduleByManually] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        response = await callApi(request)
        console.log("[runScheduleByManually] Response :: ", response)
    }

    const onClickFeatQueryRsltHandler = (type: number) => {
        if (type === 1) {
            setModalType(ModalType.CONFIRM)
            setConfirmModalTit("Feature 수동 실행")
            setConfirmModalCont("Feature 수동 실행을 진행 하시겠습니까?")
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

            />
            <BatchExecuteLogsPop 
                isOpen={isOpenBatchExecuteLogsPop} 
                onClose={(isOpen) => setIsOpenBatchExecuteLogsPop(isOpen)}
            />
            <ReadSqlPop 
                isOpen={isOpenReadSqlPop} 
                onClose={(isOpen) => setIsOpenReadSqlPop(isOpen)}
            />

            {/* Confirm 모달 */}
            <ConfirmModal
                isOpen={isOpenConfirmModal}
                onClose={(isOpen) => setIsOpenConfirmModal(isOpen)}
                title={confirmModalTit}
                content={confirmModalCont}
                onConfirm={onConfirm}
                onCancle={onCancel}
            />
        </>
    )
}

export default FeatQueryRsltButton