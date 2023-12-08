import { MstrProfMetaTblColumnListProps, TbCoMetaTblClmnInfo, TbRsMstrSgmtRuleAttrClmn } from "@/models/selfFeature/FeatureAdmModel"
import { useState, useEffect } from "react"
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect'

import {
    Checkbox,
    Label,
    Select,
    SelectOption,
    Stack, TextField, Typography,
} from '@components/ui'
import { DivisionTypes } from "@/models/selfFeature/FeatureModel"
import {
    AddIcon,
    KeyboardArrowDownOutlinedIcon,
    KeyboardArrowUpOutlinedIcon,
    RemoveIcon,
} from "@/assets/icons"
import { initTbCoMetaTblClmnInfo, initTbRsMstrSgmtRuleAttrClmn } from "@/pages/admin/self-feature-meta-management/master-profile-management/data"
import ConfirmModal from "../modal/ConfirmModal"
import { ModalType } from "@/models/selfFeature/FeatureCommon"

const MstrProfMetaTblColumnList = ({
    editMode,
    divisionType,                   // 속성, 행동정보 구분
    metaTblInfo,                    // 저장된 메타테이블 정보
    metaTblClmnList,                // 저장된 메타테이블 컬럼 정보(화면 노출용)
    metaTblClmnAllList,             // 저장된 메타테이블 전체 컬럼 항목(등록 및 수정시 필요)
    setMstrSgmtRuleAttrClmnList,
}: MstrProfMetaTblColumnListProps) => {

    // 항목 리스트 show / hide 처리
    const [isColListShow, setIsColListShow] = useState<Boolean>(false)
    // 보여줄 항목 list(등록 및 수정시 컬럼 추가할 경우 필요)
    const [tmpMetaTblClmnList, setTmpMetaTblClmnList] = useState<Array<TbCoMetaTblClmnInfo>>([])
    // 모달, 버튼 클릭 종류
    const [btnClickType, setBtnClickType] = useState<string>('')
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')

    // component mount
    useEffect(() => {

    }, [metaTblInfo])
    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
        }
        setIsOpenConfirmModal(false)
    }
    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }

    // 저장된 데이터중 항목 전체선택인 경우
    useEffect(() => {
        if (!metaTblInfo || !metaTblInfo.clmnAllChocYn) return

        // if (metaTblInfo.clmnAllChocYn === "Y") setIsColListShow(false)
        // else setIsColListShow(true)

    }, [metaTblInfo?.clmnAllChocYn])

    // 등록 및 수정시 컬럼 추가할 경우 필요
    useEffect(() => {
        if (!metaTblClmnList || metaTblClmnList.length < 1) return
        setTmpMetaTblClmnList(cloneDeep(metaTblClmnList))
    }, [metaTblClmnList])

    // 테이블 정보가 바뀌면 컬럼 항목 reset
    useEffect(() => {
        setTmpMetaTblClmnList([])
    }, [metaTblClmnAllList])

    // 새로운 항목 추가 버튼 클릭
    const onClickAddColInfo = () => {
        if (metaTblInfo && metaTblInfo.mstrSgmtRuleTblId === "") {
            setModalType(ModalType.ALERT)
            setConfirmModalTit("Master Profile 등록")
            setConfirmModalCont("테이블을 선택 해주세요.")
            setIsOpenConfirmModal(true)
            return
        }
        if (metaTblClmnAllList.length < tmpMetaTblClmnList.length + 1) {
            setModalType(ModalType.ALERT)
            setConfirmModalTit("Master Profile 등록")
            setConfirmModalCont("더이상 컬럼을 추가할 수 없습니다.")
            setIsOpenConfirmModal(true)
            return
        }
        setIsColListShow(true)
        // 화면용 list
        setTmpMetaTblClmnList((prevState: Array<TbCoMetaTblClmnInfo>) => {
            let rtn = cloneDeep(prevState)
            let addItem = cloneDeep(initTbCoMetaTblClmnInfo)
            addItem.metaTblId = metaTblInfo!.mstrSgmtRuleTblId
            rtn.push(addItem)
            return rtn
        })
        // formData list
        setMstrSgmtRuleAttrClmnList && setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
            let rtn = cloneDeep(prevState)
            let addItem = cloneDeep(initTbRsMstrSgmtRuleAttrClmn)
			Object.keys(addItem).map((colKey) => {
                metaTblInfo && Object.keys(metaTblInfo).map((tblKey) => {
                    if (colKey === tblKey) {
                        addItem[colKey] = metaTblInfo[tblKey]
                    }
                    return tblKey
                })
                return colKey
			})
            rtn.push(addItem)
            return rtn
        })
    }

    // 항목 삭제 버튼 클릭
    const onClickRemoveColInfo = (delIdx: number) => {

        if (delIdx === 0 && tmpMetaTblClmnList.length === 1) setIsColListShow(false)
        else setIsColListShow(true)

        setTmpMetaTblClmnList((prevState: Array<TbCoMetaTblClmnInfo>) => {
            let rtn = cloneDeep(prevState)
            rtn = rtn.filter((delInfo: TbCoMetaTblClmnInfo, index: number) => index !== delIdx)
            return rtn
        })
    }

    return (
        <Stack
            direction="Vertical"
            justifyContent="Start"
            gap="LG"
            style={{
                paddingLeft: "11%",
            }}
        >
            {/* 상세 */}
            {!editMode &&
                <>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        style={{
                            position: "relative"
                        }}
                    >
                        <Typography
                            style={{
                                width: "10%",
                                fontWeight: "700",
                            }}
                            variant="body2"
                        >
                            컬럼 정보
                        </Typography>
                        {/* <Checkbox
                            checked={metaTblInfo?.clmnAllChocYn === 'Y'}
                            disabled
                        />
                        <Label style={{
                            fontSize: "0.75rem",
                            color: "rgb(85, 85, 85)",
                            lineHeight: "1.5",
                            fontWeight: "400",
                            textAlign: "start",
                            marginLeft: "0.5%",
                        }}>
                            항목 전체선택
                        </Label> */}
                        {isColListShow &&
                            <KeyboardArrowUpOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                        {!isColListShow &&
                            <KeyboardArrowDownOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                    </Stack>
                    {(isColListShow && metaTblClmnList.length > 0) &&
                        metaTblClmnList.map((clmnInfo: TbCoMetaTblClmnInfo, index: number) => {
                            return (
                                <Stack
                                    key={index}
                                    direction="Horizontal"
                                    style={{
                                        border: '1px solid rgb(218, 218, 218)',
                                        borderRadius: '5px',
                                        background: 'white',
                                        color: (divisionType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        padding: "1rem"
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        style={{
                                            width: "40%",
                                            color: (divisionType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        }}
                                    >
                                        {`${clmnInfo.metaTblClmnLogiNm} [${clmnInfo.metaTblClmnPhysNm}]`}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        style={{
                                            color: (divisionType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                        }}
                                    >
                                        {clmnInfo.metaTblClmnLogiNm}
                                    </Typography>
                                </Stack>
                            )
                        })
                    }
                </>
            }
            {/* 상세 */}
            {/* 등록 및 수정 */}
            {editMode &&
                <>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        style={{
                            position: "relative"
                        }}
                    >
                        <Typography
                            style={{
                                width: "10%",
                                fontWeight: "700",
                            }}
                            variant="body2"
                        >
                            컬럼 추가
                        </Typography>
                        <AddIcon
                            style={{
                                position: "absolute",
                                left: "6%",
                            }}
                            onClick={onClickAddColInfo}
                        />
                        <Checkbox
                            onClick={() => { console.log("체크박스체크") }}
                        />
                        <Label style={{
                            fontSize: "0.75rem",
                            color: "rgb(85, 85, 85)",
                            lineHeight: "1.5",
                            fontWeight: "400",
                            textAlign: "start",
                            marginLeft: "0.5%",
                        }}>
                            컬럼 전체선택
                        </Label>
                        {isColListShow &&
                            <KeyboardArrowUpOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                        {!isColListShow &&
                            <KeyboardArrowDownOutlinedIcon
                                style={{
                                    position: "absolute",
                                    right: "0px"
                                }}
                                onClick={() => setIsColListShow(!isColListShow)}
                            />
                        }
                    </Stack>
                    {(isColListShow && tmpMetaTblClmnList.length > 0) &&
                        tmpMetaTblClmnList.map((clmnInfo: TbCoMetaTblClmnInfo, index: number) => {
                            return (
                                <Stack
                                    key={index}
                                    direction="Horizontal"
                                    gap="LG"
                                >
                                    <RemoveIcon
                                        onClick={() => { onClickRemoveColInfo(index) }}
                                    />
                                    <Stack
                                        className="width-100"
                                        key={index}
                                        direction="Horizontal"
                                        gap="LG"
                                        style={{
                                            border: '1px solid rgb(218, 218, 218)',
                                            borderRadius: '5px',
                                            background: 'white',
                                            color: (divisionType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                            padding: "1rem"
                                        }}
                                    >
                                        <Select
                                            style={{
                                                width: "40%",
                                                color: (divisionType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                            }}
                                            value={clmnInfo.metaTblClmnPhysNm}
                                            appearance="Outline"
                                            placeholder="선택"
                                            className="width-100"
                                            onChange={(
                                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                                value: SelectValue<{}, false>
                                            ) => {
                                                //onchangeSelectHandler(e, value, "featureSeGrp")
                                            }}
                                        >
                                            {metaTblClmnAllList.map((item, index) => (
                                                <SelectOption key={index} value={item.metaTblClmnPhysNm}>{`${item.metaTblClmnLogiNm} [${item.metaTblClmnPhysNm}]`}</SelectOption>
                                            ))}
                                        </Select>
                                        <TextField 
                                            style={{
                                                width: "40%",
                                                color: (divisionType === DivisionTypes.ATTR) ? '#00b21e' : '#00256c',
                                            }}
                                        />
                                        {/* {`${clmnInfo.metaTblClmnLogiNm} [${clmnInfo.metaTblClmnPhysNm}]`} */}
                                        {/* {clmnInfo.metaTblClmnLogiNm} */}
                                    </Stack>
                                </Stack>
                            )
                        })
                    }
                </>
            }
            {/* 등록 및 수정 */}
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
        </Stack>
    )
}

export default MstrProfMetaTblColumnList