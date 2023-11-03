import { useCallback, useEffect, useState } from 'react';

import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable';
import { 
    Button, 
    Select, 
    SelectOption, 
    Stack, 
    TD, 
    TH, 
    TR, 
    TextField, 
    Typography,
    Modal 
} from '@components/ui'

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    isOpenSubmissionApprovePop: string
    setIsOpenSubmissionApprovePop: React.Dispatch<React.SetStateAction<string>>
}

const SubmissionApprovePop = ({
    isOpen = false,
    onClose,
    isOpenSubmissionApprovePop,
    setIsOpenSubmissionApprovePop,
}: Props) => {

    useEffect(() => {
        // 팝업 오픈시
        if (isOpen) {
            
        }
    }, [isOpen])
    
    const closePopup6 = () => {
        setIsOpenSubmissionApprovePop('rightPopup openFalse');
    }

    return (
        <>
        {/* 결재자 추가 */}
        <div className={isOpenSubmissionApprovePop}>
            <div className="popupTop">
                결재자 추가
                <Button
                    onClick={closePopup6}
                    shape="Square"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="true"
                    aria-controls="radix-:r18:"
                    data-state="open"
                    className="sc-hZDyAQ hrrooe"
                >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" 
                        fill="currentColor"
                    />
                </svg>
                </Button>
            </div>
            <Modal.Body style={{maxHeight:"60vh"}}>
                <Stack direction="Vertical" gap="SM">
                    <HorizontalTable className="width-100">
                        <TR>
                            <TH colSpan={1} align="right">
                            이름
                            </TH>
                            <TD colSpan={2}>
                                <TextField className="width-100" />
                            </TD>
                        </TR>
                        <TR>
                            <TH colSpan={1} align="right">
                            이메일
                            </TH>
                            <TD colSpan={2}>
                                <TextField className="width-100" />
                            </TD>
                        </TR>
                    </HorizontalTable>
                    <Stack justifyContent="End">
                        <Button type="submit" priority="Primary" appearance="Contained" size="MD">
                        <span className="searchIcon"></span>
                        조회
                        </Button>
                    </Stack>
                    <Stack justifyContent="End">
                        <Select 
                            appearance="Outline" 
                            size="MD" 
                            defaultValue={1}
                        >
                        <SelectOption value={1}>전체</SelectOption>
                        </Select>
                    </Stack>

                    <VerticalTable
                        columns={[]}
                        rows={[]}
                        enableSort={false}
                        clickable={true}
                        rowSelection={() => {}}
                    />

                </Stack>
            </Modal.Body>
        </div>
        {/* 결재자 추가 */}
        </>
    )
}

export default SubmissionApprovePop