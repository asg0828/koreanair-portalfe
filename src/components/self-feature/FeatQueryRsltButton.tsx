import { useState } from 'react'

import QuerySampleDataPop from "@/components/self-feature/QuerySampleDataPop";
import BatchExecuteLogsPop from "@/components/self-feature/BatchExecuteLogsPop";
import ReadSqlPop from "@/components/self-feature/ReadSqlPop";

import {
    Button,
    Stack,
} from '@components/ui'

const FeatQueryRsltButton = () => {

    const [ isOpenQuerySampleDataPop, setIsOpenQuerySampleDataPop ] = useState<boolean>(false)
    const [ isOpenBatchExecuteLogsPop, setIsOpenBatchExecuteLogsPop ] = useState<boolean>(false)
    const [ isOpenReadSqlPop, setIsOpenReadSqlPop ] = useState<boolean>(false)

    const onClickFeatQueryRsltHandler = (type: number) => {
        if (type === 1) {
            /*
                API Name    :: runScheduleByManually
                Method      :: POST
                Url         :: /api/v1/airflow/runSchedule
                path param  :: {id}
                query param :: 
                body param  :: 
            */
            console.log("수동 실행")
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
        </>
    )
}

export default FeatQueryRsltButton