import { useEffect, useState } from 'react'

import QuerySampleDataModal from "@/components/self-feature/modal/QuerySampleDataModal";
import BatchExecuteLogsModal from "@/components/self-feature/modal/BatchExecuteLogsModal";
import ReadSqlModal from "@/components/self-feature/modal/ReadSqlModal";

import {
    Button, Loader,
} from '@components/ui'
import ConfirmModal from '../modal/ConfirmModal';
import { ModalType } from '@/models/selfFeature/FeatureCommon';
import { useRunStateValid } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';

export interface Props {
    [key: string]: string | number | undefined
    rslnRuleId: string
    runScheduleCnt: number
    custFeatRuleId: string
}

const FeatQueryRsltButton = ({
    rslnRuleId,
    runScheduleCnt,
    custFeatRuleId,
}: Props) => {

    // 수동실행 validation check 조회
    const [isValidCheck, setIsValidCheck] = useState<Boolean>(false)
	const { 
        data: runStateValidRes, 
        isError: runStateValidErr, 
        isLoading: runStateValidLoading, 
        refetch: runStateValidRefetch, 
        isRefetching: runStateValidRefetching,
        isFetchedAfterMount: runStateValidFetchedAfterMount,
        isFetching: runStateValidFetching,
        isFetched: runStateValidFetched,
    } = useRunStateValid(custFeatRuleId)
    const [btnType, setBtnType] = useState<string>("")
    // 팝업
    const [isOpenQuerySampleDataModal, setIsOpenQuerySampleDataModal] = useState<boolean>(false)
    const [isOpenBatchExecuteLogsModal, setIsOpenBatchExecuteLogsModal] = useState<boolean>(false)
    const [isOpenReadSqlModal, setIsOpenReadSqlModal] = useState<boolean>(false)
    // 모달
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')

    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
        }
        setIsOpenConfirmModal(false)
    }
    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }
    // 실행 내역 로딩바 노출을 위한 fetching
    useEffect(() => {
        let title: string = ""
        if (btnType === "sample") title = "샘플확인"
        else if (btnType === "log") title = "실행내역"

        if (runStateValidFetching) {
        } else {
            if (isValidCheck) {
                if (runStateValidRes?.status === 202) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit(title)
                    setConfirmModalCont(runStateValidRes?.message ? runStateValidRes?.message : '수동실행을 진행 해주세요.')
                    setIsOpenConfirmModal(() => true)
                }
                if (runStateValidRes?.status === 200) {
                    if (btnType === "sample") setIsOpenQuerySampleDataModal((prevState) => !prevState)
                    else if (btnType === "log") setIsOpenBatchExecuteLogsModal((prevState) => !prevState)
                }
            }
            setIsValidCheck(false)
        }
    }, [runStateValidFetching, isValidCheck])
    // 수동실행 validation check 조회 API Call back
	useEffect(() => {
        let title: string = ""
        if (btnType === "sample") title = "샘플확인"
        else if (btnType === "log") title = "실행내역"

		if (runStateValidErr || runStateValidRes?.successOrNot === 'N') {
            setModalType(ModalType.ALERT)
            setConfirmModalTit(title)
            setConfirmModalCont(runStateValidRes?.message ? runStateValidRes?.message : '수동실행을 진행 해주세요.')
            setIsOpenConfirmModal(true)
		} else {
			if (runStateValidRes) {
            }
		}
	}, [runStateValidRes, runStateValidErr])

    // 버튼 이벤트
    const onClickFeatQueryRsltHandler = (type: number) => {
        if (type === 1) {
            if (runScheduleCnt > 0) {
                // 수동실행 API 결과에 따라 모달 show 판단
                setBtnType("sample")
                setIsValidCheck(true)
                runStateValidRefetch()
            } else {
                setModalType(ModalType.ALERT)
                setConfirmModalTit("샘플확인")
                setConfirmModalCont("수동실행을 최소 1번 이상 수행 해주세요.")
                setIsOpenConfirmModal(true)
            }
        } else if (type === 2) {
            if (runScheduleCnt > 0) {
                // 수동실행 API 결과에 따라 모달 show 판단
                setBtnType("log")
                setIsValidCheck(true)
                runStateValidRefetch()
            } else {
                setModalType(ModalType.ALERT)
                setConfirmModalTit("실행내역")
                setConfirmModalCont("수동실행을 최소 1번 이상 수행 해주세요.")
                setIsOpenConfirmModal(true)
            }
        } else if (type === 3) {
            setIsOpenReadSqlModal((prevState) => !prevState)
        }
    }

    return (
        <>
            {/* 버튼 */}
            <Button 
                disabled={runStateValidFetching && btnType === "sample"}
                style={{width: "7%"}} 
                size="LG" 
                onClick={() => onClickFeatQueryRsltHandler(1)}
            >
                {(runStateValidFetching && btnType === "sample") 
                    ? 
                    <Loader 
                        style={{
                            backgroundColor: "rgb(235, 235, 235)", 
                            color: "rgb(185, 185, 185)", 
                            borderColor: "rgb(218, 218, 218)", 
                            width: "100%", 
                            height: "100%",
                        }} 
                        type="Bubble" 
                    /> 
                    : 
                    <div style={{width: "100%", height: "100%"}}>샘플 확인</div>
                }
            </Button>
            <Button 
                disabled={runStateValidFetching && btnType === "log"}
                style={{width: "7%"}} 
                size="LG"
                onClick={() => onClickFeatQueryRsltHandler(2)}
            >
                {(runStateValidFetching && btnType === "log") 
                    ? 
                    <Loader 
                        style={{
                            backgroundColor: "rgb(235, 235, 235)", 
                            color: "rgb(185, 185, 185)", 
                            borderColor: "rgb(218, 218, 218)", 
                            width: "100%", 
                            height: "100%",
                        }} 
                        type="Bubble" 
                    /> 
                    : 
                    <div style={{width: "100%", height: "100%"}}>실행 내역</div>
                }
            </Button>
            <Button style={{width: "7%"}} size="LG" onClick={() => onClickFeatQueryRsltHandler(3)}>
                쿼리 확인
            </Button>
            {/* 버튼 */}

            {/* 팝업 component */}
            <QuerySampleDataModal
                isOpen={isOpenQuerySampleDataModal}
                onClose={(isOpen) => setIsOpenQuerySampleDataModal(isOpen)}
                rslnRuleId={rslnRuleId}
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
            {/* Confirm 모달 */}
        </>
    )
}

export default FeatQueryRsltButton