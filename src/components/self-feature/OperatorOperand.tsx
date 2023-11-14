import { SelectValue } from '@mui/base/useSelect'

import { 
    Select, 
    SelectOption,
    TextField, 
    Typography, 
} from '@/components/ui'

import { OperatorOperandProps } from "@/models/selfFeature/FeatureInfo"
import {
    operatorOptionNum,
    operatorOptionStr,
    operatorOptionTim,
    delimiterOptionNum,
    delimiterOptionStrTim,
} from '@/pages/user/self-feature/data'

const OperatorOperand = ({
    isPossibleEdit,
    trgtFormulaInput,
    item,
    dataType,
    delimiterSelected,
    onchangeInputHandler,
    onchangeSelectHandler,
}: OperatorOperandProps) => {

    return (
        <>
        {(isPossibleEdit) &&
        <Select 
            value={item?.operator}
            shape="Square"
            size="MD"
            status="default"
            style={{
            width: '11.25rem'
            }}
            appearance="Outline" 
            placeholder="연산자 선택" 
            onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
            ) => {
                onchangeSelectHandler(e, value, "operator")
            }}
        >
        {dataType === "number" &&
            operatorOptionNum.map((item, index) => (
                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
            ))
        }
        {dataType === "string" &&
            operatorOptionStr.map((item, index) => (
                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
            ))
        }
        {dataType === "timestamp" &&
            operatorOptionTim.map((item, index) => (
                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
            ))
        }
        {(dataType !== "number" && dataType !== "string" && dataType !== "timestamp") &&
            <SelectOption value="">연산자 선택</SelectOption>
        }
        </Select>
        }
        {(!isPossibleEdit) &&
            <Typography variant='h5'>{item?.operator}</Typography>
        }
        {(delimiterSelected && isPossibleEdit) &&
        <Select 
            appearance="Outline"
            value={item?.delimiter}
            shape="Square"
            size="MD"
            status="default"
            style={{
            width: '11.25rem'
            }}
            onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
            ) => {
                // 구분자 선택
                onchangeSelectHandler(e, value, "delimiter")
            }}
        >
        {dataType === "number" &&
            delimiterOptionNum.map((item, index) => (
                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
            ))
        }
        {(dataType === "string" || dataType === "timestamp") &&
            delimiterOptionStrTim.map((item, index) => (
                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
            ))
        }
        {(dataType !== "number" && dataType !== "string" && dataType !== "timestamp") &&
            <SelectOption value="">구분자 선택</SelectOption>
        }
        </Select>
        }
        {(delimiterSelected && !isPossibleEdit) &&
            <Typography variant='h5'>{item?.delimiter}</Typography>
        }
        {isPossibleEdit &&
        <TextField 
            placeholder="피연산자 입력"
            value={item?.operand1}
            id='operand1'
            onChange={onchangeInputHandler} 
        />
        }
        {!isPossibleEdit &&
            <Typography variant='h5'>{item?.operand1}</Typography>
        }
        </>
    )

}

export default OperatorOperand