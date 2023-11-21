import { useCallback, useEffect, useState } from 'react'
import { SelectValue } from '@mui/base/useSelect'
import { cloneDeep } from 'lodash'

import SearchForm from '@/components/form/SearchForm'
import HorizontalTable from '@/components/table/HorizontalTable'
import {
    Button,
    Select,
    SelectOption,
    Stack, 
    TD, 
    TH, 
    TR,
    TextField,
    useToast,
} from '@components/ui'
import { 
    useColAndCmmtList,
    useMetaTableList, 
} from '@/hooks/queries/useSelfFeatureAdmQueries'
import { ValidType } from '@/models/common/Constants'
import { useYn } from '@/pages/user/self-feature/data'

export interface CmSrchInfo {
    [key: string]: string
    item: string
    searchWord: string
    metaTblUseYn: string
}

const CustomerMetaManagement = () => {

    const { toast } = useToast();
    const [ searchInfo, setSearchInfo ] = useState<CmSrchInfo>({
        item: '',
        searchWord: '',
        metaTblUseYn: '',
    })
    const { 
        data: metaTableRes, 
        isError: metaTableErr, 
        refetch: metaTableRefetch 
    } = useMetaTableList(searchInfo)
    const { 
        data: colCmmtRes,   
        isError: colCmmtErr,   
        refetch: colCmmtRefetch 
    } = useColAndCmmtList()

    useEffect(() => {
        colCmmtRefetch()
    }, [])

    const handleSearch = useCallback(() => {
        metaTableRefetch()
    }, [metaTableRefetch])


    useEffect(() => {
        if (colCmmtErr || colCmmtRes?.successOrNot === 'N') {
            toast({
            type: ValidType.ERROR,
            content: '조회 중 에러가 발생했습니다.',
            })
        } else {
            if (colCmmtRes) {
                console.log(colCmmtRes.result)
            }
        }
    }, [colCmmtRes, colCmmtErr, toast])

    useEffect(() => {
        if (metaTableErr || metaTableRes?.successOrNot === 'N') {
            toast({
            type: ValidType.ERROR,
            content: '조회 중 에러가 발생했습니다.',
            })
        } else {
            if (metaTableRes) {
                console.log(metaTableRes.result)
            }
        }
    }, [metaTableRes, metaTableErr, toast])

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setSearchInfo({...searchInfo, [id]: value,})
    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: String
    ) => {
        setSearchInfo({...searchInfo, [`${id}`]: String(value),})
    }

    return (
        <>
            <SearchForm 
                onSearch={handleSearch} 
                //onClear={onClear}
            >
                <HorizontalTable>
                    <TR>
                        <TH colSpan={1} align="right">
                        사용여부
                        </TH>
                        <TD colSpan={3}>
                            <Select 
                                appearance="Outline" 
                                placeholder="선택" 
                                className="width-100" 
                                onChange={(
                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "metaTblUseYn")
                                }}
                            >
                                {useYn.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                        <TH colSpan={1} align="right">
                        검색어 기준
                        </TH>
                        <TD colSpan={3}>
                            <Select
                                appearance="Outline"
                                placeholder="전체"
                                className="width-100"
                                //value={searchInfo.oneidChgRsnCd}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, 'item');
                                }}
                            >
                            <SelectOption value="선택">
                            </SelectOption>
                            {/* {reason.map((item, index) => (
                            <SelectOption key={index} value={item.value}>
                            {item.text}
                            </SelectOption>
                            ))} */}
                            </Select>
                        </TD>
                        <TD colSpan={4}>
                        <TextField
                            className="width-100"
                            onChange={onchangeInputHandler}
                            value={searchInfo.searchWord}
                            placeholder="검색어를 입력하세요."
                            id="searchWord"
                        />
                        </TD>
                    </TR>
                </HorizontalTable>
            </SearchForm>

            <Stack gap="SM" justifyContent="End">
                <Button priority="Normal" appearance="Outline" size="LG">
                삭제
                </Button>
                <Button priority="Primary" appearance="Contained" size="LG">
                신규등록
                </Button>
            </Stack>
        </>
    )
}

export default CustomerMetaManagement