import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { Checkbox, Radio, Select, SelectOption, TD, TR, TextField, Typography, useToast } from '@ke-design/components';
import { Component, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';
import { CommonCode, CommonCodeInfo } from '@/models/selfFeature/FeatureCommon';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';
import React from 'react';

export interface VerticalTableProps {
  columns: Array<ColumnsInfo>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  rowSelection?: Function;
  onClick?: Function;
  children?: ReactNode;
  onChange?: Function;
  props?: any;
  list: Array<RowsInfo>;
}
const CstmrMetaColumnList: React.FC<VerticalTableProps> = ({ columns = [], rows = [], onClick, list }) => {
  const { toast } = useToast();
  const [timeFormat, setTimeFormat] = useState<Array<CommonCodeInfo>>([]);
  const [tbCoMetaTblClmnInfoList, setTbCoMetaTblClmnInfoList] = useState<Array<RowsInfo>>(Array.from(list));
  const { data: responseTime, isError: isErrorTime, refetch: refetchTime } = useCommCodes(CommonCode.FORMAT);
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

  const listChange = useCallback(() => setTbCoMetaTblClmnInfoList(list), list);

  useEffect(() => {
    listChange();
  }, [list]);

  // 수집기준시간 변경 함수
  const timeStampChg = (rowIndex: number) => {
    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows = cloneDeep(tbCoMetaTblClmnInfoList).map((row, index) => {
        // 선택한 라디오 버튼이 속한 행이면 변경
        if (index === rowIndex) {
          return {
            ...row,
            baseTimeYn: 'Y',
            chgDtpCd: 'timestamp',
            dataFormat: 'yyyy-MM-dd HH:mm:ss',
            changeYn: 'Y',
          };
        }
        // 선택한 라디오 버튼이 아니면서 변경되지 않은 행들은 유지
        if (row.baseTimeYn !== 'Y' && row.changeYn === 'Y') {
          return row;
        }
        if (row.baseTimeYn === 'Y') {
          return { ...row, baseTimeYn: 'N', changeYn: 'N', chgDtpCd: '', dataFormat: '' };
        }
        // 그 외의 행들은 변경하지 않음
        return {
          ...row,
          changeYn: 'N',
        };
      });

      return updatedRows;
    });
  };

  /* 데이터 타입 변경 여부 체크박스 */
  const changeYnHandler = (rowIndex: number, field: string) => {
    // 체크 여부에 따라서
    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows: RowsInfo[] = cloneDeep(tbCoMetaTblClmnInfoList).map((row, index) => {
        if (field === 'changeYn' && index === rowIndex && row.changeYn === 'Y') {
          return {
            ...row,
            changeYn: 'N',
            dataFormat: null,
            chgDtpCd: null,
          };
        } else if (field === 'changeYn' && index === rowIndex) {
          return {
            ...row,
            changeYn: 'Y',
          };
        } else {
          return row;
        }
      });
      return updatedRows;
    });
  };

  /* input state관리 */
  function onChangeHandler(e: any, rowIndex: number) {
    const { id, value } = e.target;

    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows = cloneDeep(tbCoMetaTblClmnInfoList).map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [id]: value,
          };
        }
        return row;
      });

      return updatedRows;
    });
  }

  // select state 관리
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String,
    rowIndex?: number
  ) => {
    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows = cloneDeep(tbCoMetaTblClmnInfoList).map((row, index) => {
        if (index === rowIndex) {
          if ((value === 'double' || 'int') && id === 'chgDtpCd') {
            return {
              ...row,
              [`${id}`]: String(value),
              dataFormat: null,
            };
          } else {
            return {
              ...row,
              [`${id}`]: String(value),
            };
          }
        }
        return row;
      });

      return updatedRows;
    });
  };

  // 체크박스 선택 값 변경 함수
  const ynChg = (rowIndex: number, field: string) => {
    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows: RowsInfo[] = cloneDeep(tbCoMetaTblClmnInfoList).map((row, index) => {
        if (field === 'pkYn' && index === rowIndex) {
          return {
            ...row,
            pkYn: row.pkYn === 'Y' ? 'N' : 'Y',
          };
        } else if (field === 'clmnUseYn' && index === rowIndex) {
          return {
            ...row,
            clmnUseYn: row.clmnUseYn === ('N' || undefined) ? 'Y' : 'N',
          };
        }
        return row;
      });
      return updatedRows;
    });
  };

  const handleClick = (row: RowsInfo, index: number) => {
    onClick && onClick(row, index);
  };
  return (
    <>
      {tbCoMetaTblClmnInfoList.map((row: any, rowIndex: number) => {
        return (
          <TR key={`row-${rowIndex}`}>
            {/* Key 여부 */}
            <TD colSpan={columns[0].colSpan} key={`td-pkYn-${rowIndex}`}>
              <Checkbox onClick={() => ynChg(rowIndex, 'pkYn')} checked={row.pkYn === 'Y'} value={row.pkYn}></Checkbox>
            </TD>

            {/* 사용 여부 */}
            <TD colSpan={columns[1].colSpan} key={`td-clmnUseYn-${rowIndex}`}>
              <Checkbox
                onClick={() => ynChg(rowIndex, 'clmnUseYn')}
                checked={row.clmnUseYn === 'Y'}
                value={row.clmnUseYn}
              ></Checkbox>
            </TD>

            {/* 수집 기준 시간 */}
            <TD colSpan={columns[2].colSpan} key={`td-baseTimeYn-${rowIndex}`}>
              <Radio
                name="metaCustomerRadio"
                onChange={(e) => timeStampChg(rowIndex)}
                checked={row.baseTimeYn === 'Y'}
                value={row.baseTimeYn}
              />
            </TD>

            {/* 컬럼명 */}
            <TD className="verticalTableTD" colSpan={columns[3].colSpan} key={`td-columnName-${rowIndex}`}>
              <Typography variant="h5">{row.columnName}</Typography>
            </TD>

            {/* 컬럼 논리명 */}
            <TD
              onClick={() => handleClick(row, rowIndex)}
              colSpan={columns[4].colSpan}
              key={`td-metaTblClmnLogiNm-${rowIndex}`}
            >
              <TextField
                id="metaTblClmnLogiNm"
                onChange={(e) => onChangeHandler(e, rowIndex)}
                value={row.metaTblClmnLogiNm}
              />
            </TD>

            {/* 컬럼 설명 */}
            <TD
              onClick={() => handleClick(row, rowIndex)}
              colSpan={columns[5].colSpan}
              key={`td-metaTblClmnDesc-${rowIndex}`}
            >
              <TextField
                id="metaTblClmnDesc"
                onChange={(e) => onChangeHandler(e, rowIndex)}
                value={row.metaTblClmnDesc}
              />
            </TD>

            {/* 데이터 타입 */}
            <TD className="verticalTableTD" colSpan={columns[6].colSpan} key={`td-dataType-${rowIndex}`}>
              <Typography variant="h5">{row.dataType}</Typography>
            </TD>

            {/* 변경 여부 */}
            <TD colSpan={columns[7].colSpan} key={`td-changeYn-${rowIndex}`}>
              <Checkbox
                checked={row.changeYn === 'Y'}
                disabled={row.baseTimeYn === 'Y'}
                value={row.changeYn}
                onClick={() => changeYnHandler(rowIndex, 'changeYn')}
              />
            </TD>

            {/* 변경 데이터 타입 */}
            <TD colSpan={columns[8].colSpan} key={`td-chgDtpCd-${rowIndex}`}>
              {/* 변경여부가 Y이면서 수집기준시간이 Y가 아닌 경우 Select*/}
              {row.changeYn === 'Y' && row.baseTimeYn !== 'Y' ? (
                <Select
                  appearance="Outline"
                  placeholder="전체"
                  style={{ maxWidth: '80px' }}
                  className="width-100"
                  onChange={(e, value) => value && onchangeSelectHandler(e, value, 'chgDtpCd', rowIndex)}
                >
                  <SelectOption value={'timestamp'}>timestamp</SelectOption>
                  <SelectOption value={'int'}>int</SelectOption>
                  <SelectOption value={'double'}>double</SelectOption>
                </Select>
              ) : (
                <Typography variant="h5">{row.chgDtpCd} </Typography>
              )}
            </TD>

            {/* 변경 데이터 형식 */}
            <TD colSpan={columns[9].colSpan} key={`td-timestamp-${rowIndex}`}>
              {row.changeYn === 'Y' && row.chgDtpCd === 'timestamp' && row.baseTimeYn !== 'Y' ? (
                <Select
                  id="dataFormat"
                  appearance="Outline"
                  placeholder="전체"
                  className="width-100"
                  onChange={(e, value) => value && onchangeSelectHandler(e, value, 'dataFormat', rowIndex)}
                >
                  {timeFormat?.map((row, index) => (
                    <SelectOption value={row.cdvCntn}>{row.cdvNm}</SelectOption>
                  ))}
                </Select>
              ) : (
                <Typography variant="h5"></Typography>
              )}
            </TD>
          </TR>
        );
      })}
    </>
  );
};
export default React.memo(CstmrMetaColumnList);
