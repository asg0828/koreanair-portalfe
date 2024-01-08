import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { Checkbox, Radio, Select, SelectOption, TD, TR, TextField, Typography, useToast } from '@ke-design/components';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { CommonCode, CommonCodeInfo } from '@/models/selfFeature/FeatureCommon';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';
import React from 'react';
import { AlignCode } from '@/models/common/Design';

export interface VerticalTableProps {
  columns: Array<ColumnsInfo>;
  rows: RowsInfo;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  rowSelection?: Function;
  onClick?: Function;
  children?: ReactNode;
  onChange?: Function;
  props?: any;
  rowIndex: number;
  flag: string;
  submitFlag: boolean;
  getFlag: (flag: string) => void;
  getData: (row: RowsInfo) => void;
}
const CstmrMetaColumnListEdit: React.FC<VerticalTableProps> = ({
  columns = [],
  rows = [],
  onClick,
  rowIndex,
  flag,
  submitFlag,
  getFlag,
  getData,
}) => {
  const { toast } = useToast();
  const [timeFormat, setTimeFormat] = useState<Array<CommonCodeInfo>>([]);
  const [chgDataType, setChgDataType] = useState<Array<CommonCodeInfo>>([]);
  const [chgDataTypeList, setChgDataTypeList] = useState<Array<any>>([]);
  const [tbCoMetaTblClmnInfo, setTbCoMetaTblClmnInfo] = useState<RowsInfo>(rows);
  const { data: responseTime, isError: isErrorTime, refetch: refetchTime } = useCommCodes(CommonCode.FORMAT);
  const {
    data: responseDataType,
    isError: isErrorDataType,
    refetch: refetchDataType,
  } = useCommCodes(CommonCode.DATA_TYPE_CONV_CD);
  const backgroundClassName = tbCoMetaTblClmnInfo

  // 데이터 타입 세팅
  useEffect(() => {
    if (isErrorDataType || responseDataType?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (responseDataType?.result) {
        setChgDataType(responseDataType.result);
      }
    }
  }, [responseDataType, isErrorDataType, toast]);

  // timeFormat 세팅
  useEffect(() => {
    if (isErrorTime || responseTime?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (responseTime?.result) {
        setTimeFormat(responseTime.result);
      }
    }
  }, [responseTime, isErrorTime, toast]);

  useEffect(() => {
    if (!submitFlag) return;
    if(tbCoMetaTblClmnInfo.editStatus !== 'deleted'){
      getData(tbCoMetaTblClmnInfo);
    }
  }, [submitFlag]);

  const listChange = useCallback(() => setTbCoMetaTblClmnInfo(rows), [rows]);

  // 변경 가능 데이터 타입 리스트 세팅(selectOption)
  useEffect(() => {
    setChgDataTypeList(chgDataType.filter((e) => e.attr1 === tbCoMetaTblClmnInfo.dtpCd).map((type) => type.attr2));
  }, [chgDataType, tbCoMetaTblClmnInfo]);

  useEffect(() => {
    listChange();
  }, [listChange]);

  // 수집기준시간 변경 함수
  const timeStampChg = (rowIndex: number) => {
    //부모에게 flag 전달(tbCoMetaTblClmnInfo.metaTblClmnPhysNm)
    getFlag(tbCoMetaTblClmnInfo.metaTblClmnPhysNm);
  };

  /* 데이터 타입 변경 여부 체크박스 */
  const changeYnHandler = useCallback(
    (rowIndex: number, field: string) => {
      // 체크 여부에 따라서
      setTbCoMetaTblClmnInfo((tbCoMetaTblClmnInfo) => {
        if ((tbCoMetaTblClmnInfo.changeYn === 'Y' || !tbCoMetaTblClmnInfo.changeYn) && tbCoMetaTblClmnInfo.chgDtpCd !== '') {
          return {
            ...tbCoMetaTblClmnInfo,
            changeYn: 'N',
            dataFormat: null,
            chgDtpCd: '',
          };
        } else if(tbCoMetaTblClmnInfo.changeYn === 'Y' && tbCoMetaTblClmnInfo.chgDtpCd === '') {
          return {
            ...tbCoMetaTblClmnInfo,
            changeYn: 'N',
            dataFormat: null,
            chgDtpCd: '',
          };
        } else {
          return {
            ...tbCoMetaTblClmnInfo,
            changeYn: 'Y',
          };
        } 
      });
    },
    [setTbCoMetaTblClmnInfo]
  );

  const onChangeHandler = useCallback(
    (e: any, id: string) => {
      const { value } = e.target;

      setTbCoMetaTblClmnInfo((tbCoMetaTblClmnInfo) => {
        return {
          ...tbCoMetaTblClmnInfo,
          [id]: value,
        };
      });
    },
    [setTbCoMetaTblClmnInfo]
  );

  // select state 관리
  const onchangeSelectHandler = useCallback(
    (
      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
      value: SelectValue<{}, false>,
      id?: String,
      rowIndex?: number
    ) => {
      setTbCoMetaTblClmnInfo((tbCoMetaTblClmnInfo) => {
        if ((value === 'double' || 'int') && id === 'chgDtpCd') {
          return {
            ...tbCoMetaTblClmnInfo,
            [`${id}`]: String(value),
            dataFormat: null,
          };
        } else {
          return {
            ...tbCoMetaTblClmnInfo,
            [`${id}`]: String(value),
          };
        }
      });
    },
    [setTbCoMetaTblClmnInfo]
  );

  // 체크박스 선택 값 변경 함수
  const ynChg = useCallback(
    (rowIndex: number, field: string) => {
      setTbCoMetaTblClmnInfo((tbCoMetaTblClmnInfo) => {
        if (field === 'pkYn') {
          return {
            ...tbCoMetaTblClmnInfo,
            pkYn: tbCoMetaTblClmnInfo.pkYn === 'Y' ? 'N' : 'Y',
          };
        } else if (field === 'clmnUseYn') {
          return {
            ...tbCoMetaTblClmnInfo,
            clmnUseYn: tbCoMetaTblClmnInfo.clmnUseYn === ('N' || undefined) ? 'Y' : 'N',
          };
        }
      });
    },
    [setTbCoMetaTblClmnInfo]
  );

  const handleClick = useCallback(
    (row: RowsInfo, index: number) => {
      onClick && onClick(row, index);
    },
    [setTbCoMetaTblClmnInfo]
  );
  useEffect(() => {
    if (flag === '') return;
    if (flag !== tbCoMetaTblClmnInfo.metaTblClmnPhysNm) {
      setTbCoMetaTblClmnInfo((tbCoMetaTblClmnInfo) => {
        // 선택한 라디오 버튼이 속한 행이면 변경
        if (tbCoMetaTblClmnInfo.baseTimeYn && tbCoMetaTblClmnInfo.baseTimeYn === 'Y')
          return {
            ...tbCoMetaTblClmnInfo,
            baseTimeYn: 'N',
            chgDtpCd: '',
            dataFormat: '',
            changeYn: 'N',
          };
        // 선택한 라디오 버튼이 아니면서 변경되지 않은 행들은 유지
        if (tbCoMetaTblClmnInfo.baseTimeYn !== 'Y' && tbCoMetaTblClmnInfo.changeYn === 'Y') {
          return tbCoMetaTblClmnInfo;
        }
        if (tbCoMetaTblClmnInfo.baseTimeYn === 'Y') {
          return { ...tbCoMetaTblClmnInfo, baseTimeYn: 'N', changeYn: 'N', chgDtpCd: '', dataFormat: '' };
        }
        // 그 외의 행들은 변경하지 않음
        return {
          ...tbCoMetaTblClmnInfo,
          changeYn: 'N',
        };
      });
    } else {
      setTbCoMetaTblClmnInfo((tbCoMetaTblClmnInfo) => {
        // 선택한 라디오 버튼이 속한 행이면 변경
        //if (tbCoMetaTblClmnInfo.baseTimeYn && tbCoMetaTblClmnInfo.baseTimeYn === 'Y')
        return {
          ...tbCoMetaTblClmnInfo,
          baseTimeYn: 'Y',
          chgDtpCd: 'timestamp',
          dataFormat: 'yyyy-MM-dd HH:mm:ss',
          changeYn: 'Y',
        };
      });
    }
  }, [flag]);
  return (
    <>
      <TR key={`row-${rowIndex}`} className={`trBackground-${tbCoMetaTblClmnInfo.editStatus}`}>

        {/* 번호 */}
        <TD
          key={`td-index-${rowIndex}`}
          colSpan={columns[0].colSpan}
          align={AlignCode.CENTER}
          onClick={() => handleClick(tbCoMetaTblClmnInfo, rowIndex)}
        >
          {rowIndex + 1}
        </TD>

        {/* Key 여부 */}
        <TD colSpan={columns[1].colSpan} key={`td-pkYn-${rowIndex}`}>
          <Checkbox
            key={`checkbox-pkYn-${rowIndex}`}
            onClick={() => ynChg(rowIndex, 'pkYn')}
            checked={tbCoMetaTblClmnInfo.pkYn === 'Y'}
            value={tbCoMetaTblClmnInfo.pkYn}
          ></Checkbox>
        </TD>

        {/* 사용 여부 */}
        <TD colSpan={columns[2].colSpan} key={`td-clmnUseYn-${rowIndex}`}>
          <Checkbox
            key={`checkbox-clmnUseYn-${rowIndex}`}
            onClick={() => ynChg(rowIndex, 'clmnUseYn')}
            checked={tbCoMetaTblClmnInfo.clmnUseYn === 'Y'}
            value={tbCoMetaTblClmnInfo.clmnUseYn}
          ></Checkbox>
        </TD>

        {/* 수집 기준 시간 */}
        <TD colSpan={columns[3].colSpan} key={`td-baseTimeYn-${rowIndex}`}>
          <Radio
            name="metaCustomerRadio"
            onChange={(e) => timeStampChg(rowIndex)}
            checked={flag === tbCoMetaTblClmnInfo.metaTblClmnPhysNm || tbCoMetaTblClmnInfo.baseTimeYn === 'Y'}
            value={tbCoMetaTblClmnInfo.metaTblClmnPhysNm}
            key={`radio-baseTimeYn-${rowIndex}`}
          />
        </TD>

        {/* 컬럼명 */}
        <TD className="verticalTableTD" colSpan={columns[4].colSpan} key={`td-metaTblClmnPhysNm-${rowIndex}`}>
          <Typography variant="h5">{tbCoMetaTblClmnInfo.metaTblClmnPhysNm}</Typography>
        </TD>

        {/* 컬럼 논리명 */}
        <TD
          onClick={() => handleClick(tbCoMetaTblClmnInfo, rowIndex)}
          colSpan={columns[5].colSpan}
          key={`td-metaTblClmnLogiNm-${rowIndex}`}
        >
          <TextField
            key={`textField-metaTblLogiNm-${rowIndex}`}
            onChange={(e) => onChangeHandler(e, 'metaTblClmnLogiNm')}
            value={tbCoMetaTblClmnInfo.metaTblClmnLogiNm}
          />
        </TD>

        {/* 컬럼 설명 */}
        <TD
          onClick={() => handleClick(tbCoMetaTblClmnInfo, rowIndex)}
          colSpan={columns[6].colSpan}
          key={`td-metaTblClmnDesc-${rowIndex}`}
        >
          <TextField
            key={`textField-metaTblClmnDesc-${rowIndex}`}
            onChange={(e) => onChangeHandler(e, 'metaTblClmnDesc')}
            value={tbCoMetaTblClmnInfo.metaTblClmnDesc}
          />
        </TD>

        {/* 데이터 타입 */}
        <TD className="verticalTableTD" colSpan={columns[7].colSpan} key={`td-dtpCd-${rowIndex}`}>
          <Typography variant="h5">{tbCoMetaTblClmnInfo.dtpCd}</Typography>
        </TD>

        {/* 변경 여부 */}
        <TD className="verticalTableTD" colSpan={columns[8].colSpan} key={`td-changeYn-${rowIndex}`}>
          <Checkbox
            key={`checkbox-changeYn-${rowIndex}`}
            checked={
              tbCoMetaTblClmnInfo.changeYn === 'Y' ||
              tbCoMetaTblClmnInfo.baseTimeYn === 'Y' ||
              (tbCoMetaTblClmnInfo.chgDtpCd !== null && 
              tbCoMetaTblClmnInfo.chgDtpCd !== '')
            }
            disabled={tbCoMetaTblClmnInfo.baseTimeYn === 'Y'}
            value={tbCoMetaTblClmnInfo.changeYn}
            onClick={() => changeYnHandler(rowIndex, 'changeYn')}
          />
        </TD>

        {/* 변경 데이터 타입 */}
        <TD className="verticalTableTD" colSpan={columns[9].colSpan} key={`td-chgDtpCd-${rowIndex}`}>
          {/* 변경여부가 Y이면서 수집기준시간이 Y가 아닌 경우 Select*/}
          {tbCoMetaTblClmnInfo.changeYn === 'Y' && tbCoMetaTblClmnInfo.baseTimeYn !== 'Y' ? (
            <Select
              key={`select-chgDtpCd-${rowIndex}`}
              appearance="Outline"
              placeholder="전체"
              style={{ minWidth: '80px' }}
              onChange={(e, value) => value && onchangeSelectHandler(e, value, 'chgDtpCd', rowIndex)}
            >
              {chgDataTypeList?.map((item) => (
                <SelectOption value={item}>{item}</SelectOption>
              ))}
            </Select>
          ) : (
            <Typography variant="h5">{tbCoMetaTblClmnInfo.chgDtpCd} </Typography>
          )}
        </TD>

        {/* 변경 데이터 형식 */}
        <TD className="verticalTableTD" colSpan={columns[10].colSpan} key={`td-dataFormat-${rowIndex}`}>
          {tbCoMetaTblClmnInfo.changeYn === 'Y' &&
          tbCoMetaTblClmnInfo.chgDtpCd === 'timestamp' &&
          tbCoMetaTblClmnInfo.baseTimeYn !== 'Y' ? (
            <Select
              key={`select-timestamp-${rowIndex}`}
              id="dataFormat"
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => value && onchangeSelectHandler(e, value, 'dataFormat')}
            >
              {timeFormat?.map((row, index) => (
                <SelectOption value={row.cdvCntn}>{row.cdvNm}</SelectOption>
              ))}
            </Select>
          ) : (
            <Typography variant="h5">{tbCoMetaTblClmnInfo.dataFormat}</Typography>
          )}
        </TD>
          
        {/* 원천 변경 상태 */}
        <TD>
          {tbCoMetaTblClmnInfo.editStatus === 'none' && (
            <Typography variant="h5">변경없음</Typography>
          ) 
        }
          {tbCoMetaTblClmnInfo.editStatus === 'edited' && (
            <Typography variant="h5">변경</Typography>
            )
        }
          {tbCoMetaTblClmnInfo.editStatus === 'added' && (
            <Typography variant="h5">추가</Typography>
            )
        }
           {tbCoMetaTblClmnInfo.editStatus === 'deleted' && (
            <Typography variant="h5">삭제</Typography>
            )
        } 
        </TD>
      </TR>
    </>
  );
};
export default React.memo(CstmrMetaColumnListEdit);
