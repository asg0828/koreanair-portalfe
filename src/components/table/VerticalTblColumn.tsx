import NoResult from '@/components/emptyState/NoData';
import { useCreateMetaTableInfo, useUpdateMetaTable } from '@/hooks/mutations/self-feature/useSelfFeatureAdmMutations';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType, View } from '@/models/common/Constants';
import { AlignCode, CheckedState, SortDirection, SortDirectionCode } from '@/models/common/Design';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { openModal } from '@/reducers/modalSlice';
import { cloneDeep } from 'lodash'
import '@components/table/VerticalTable.scss';
import {
  Button,
  Modal,
  Checkbox,
  Radio,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  TextField,
  Typography,
  Stack,
  Select,
  SelectOption,
  useToast,
} from '@components/ui';
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectValue } from '@mui/base/useSelect';
import { htmlSpeReg, htmlTagReg } from '@/utils/RegularExpression';
import { useTimeColumn } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';
import { CommonCode, CommonCodeInfo } from '@/models/selfFeature/FeatureCommon';

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
  list: RowsInfo;
}
// customerMeta 등록용 grid
const VerticalTblColumn: React.FC<VerticalTableProps> = ({
  columns = [],
  rows = [],
  showHeader = true,
  enableSort = false,
  clickable = false,
  rowSelection,
  onChange,
  onClick,
  props,
  list,
}) => {
  const { toast } = useToast();
  const { dbNm, metaTblLogiNm } = props;
  const tbCoMetaTbInfo = list;
  const isCheckbox = typeof rowSelection === 'function';
  const [checkedList, setCheckedList] = useState<Array<number>>([]);

  // post용 tbCoMetaTblClmnInfoList 객체
  const [tbCoMetaTblClmnInfoListPost, setTbCoMetaTblClmnInfoListPost] = useState<Array<any>>([
    {
      baseTimeYn: 'N',
      clmnUseYn: 'Y',
      dtpCd: '',
      metaTblClmnLogiNm: '',
      metaTblClmnPhysNm: '',
      pkYn: '',
      metaTblClmnDesc: '',
    },
  ]);
  const [tbCoMetaTblClmnInfoList, setTbCoMetaTblClmnInfoList] = useState<Array<RowsInfo>>(Array.from(rows));
  const {
    data: response,
    isSuccess: isSuccess,
    isError: isError,

    mutate,
  } = useCreateMetaTableInfo(props, tbCoMetaTblClmnInfoListPost);
  const { data: responseTime, isError: isErrorTime, refetch: refetchTime } = useCommCodes(CommonCode.FORMAT);
  const [timeFormat, setTimeFormat] = useState<Array<CommonCodeInfo>>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  // 수정중 페이지 이탈 모달
  const [isOpen, setOpen] = useState(false);
  const [isOpenValidation, setOpenValidation] = useState(false);
  const handleChangeSortDirection = (order: SortDirection, index: number) => {
    const oValue = order === SortDirectionCode.ASC ? 1 : order === SortDirectionCode.DESC ? -1 : 0;

    const tbCoMetaTblClmnInfoList = rows.sort((a, b) => {
      if (a[index] === b[index]) {
        return 0;
      } else if (a[index] < b[index]) {
        return oValue;
      } else {
        return -oValue;
      }
    });
    setTbCoMetaTblClmnInfoList(() => cloneDeep(tbCoMetaTblClmnInfoList));
  };

  const handleClick = (row: RowsInfo, index: number) => {
    onClick && onClick(row, index);
  };

  useEffect(() => {
    setTbCoMetaTblClmnInfoList(() => {
      const updatedRows: RowsInfo[] = cloneDeep(rows).map((row, index) => {
        return {
          ...row,
          clmnUseYn: 'Y',
          metaTblClmnLogiNm: row.remarks ? row.remarks : '',
          metaTblClmnDesc: '',
          chgDtpCd: '',
          dataFormat: '',
        };
      });

      return updatedRows;
    });
  }, [rows]);

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

  // 체크박스 선택 값 변경 함수
  const ynChg = (rowIndex: number, field: string) => {
    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows: RowsInfo[] = cloneDeep(tbCoMetaTblClmnInfoList).map((row, index) => {
        if (field === 'pkYn' && index === rowIndex) {
          return {
            ...row,
            pkYn: tbCoMetaTblClmnInfoList[rowIndex].pkYn === 'Y' ? 'N' : 'Y',
          };
        } else if (field === 'clmnUseYn' && index === rowIndex) {
          return {
            ...row,
            clmnUseYn: tbCoMetaTblClmnInfoList[rowIndex].clmnUseYn === ('N' || undefined) ? 'Y' : 'N',
          };
        }
        return row;
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
  // 저장 버튼
  const regCustomerDetailInfo = () => {
    const validationTool = (check: string) => {
      if (check.replace(htmlTagReg, '').replace(htmlSpeReg, '').trim() === '') return true;
      else return false;
    };

    // 유효성 검사
    const validation = () => {
      let checkValidation = '';
      let searchError = false;

      if (validationTool(props.dbNm)) checkValidation = '데이터베이스명을 입력해주세요';
      else if (validationTool(props.metaTblPhysNm)) checkValidation = '테이블 물리명을 입력해주세요';
      else if (validationTool(props.metaTblLogiNm)) checkValidation = '테이블 논리명을 입력해주세요';
      else if (validationTool(props.metaTblDesc)) checkValidation = '테이블설명을 입력해주세요';
      else if (validationTool(props.metaTblDvCd)) checkValidation = '메타테이블구분을 입력해주세요';
      else if (validationTool(props.metaTblUseYn)) checkValidation = '사용여부을 입력해주세요';
      else if (validationTool(props.rtmTblYn)) checkValidation = '실시간여부을 입력해주세요';
      else if (!tbCoMetaTblClmnInfoList.find((e) => e.clmnUseYn === 'Y'))
        checkValidation = '사용여부가 1개이상 체크되어야 합니다.';
      else if (!tbCoMetaTblClmnInfoList.filter((e) => e.clmnUseYn === 'Y').find((e) => e.pkYn === 'Y'))
        checkValidation = '사용여부가 Y인 것중 Key 여부를 하나 선택해주세요';
      else if (!tbCoMetaTblClmnInfoList.filter((e) => e.clmnUseYn === 'Y').find((e) => e.baseTimeYn === 'Y'))
        checkValidation = '사용여부가 Y인 것중 수집 기준 시간 여부를 하나 선택해주세요';
      else if (tbCoMetaTblClmnInfoList.filter((e) => e.clmnUseYn === 'Y').find((e) => e.metaTblClmnLogiNm === '')) {
        checkValidation = '사용여부가 Y인 경우 논리명을 입력해주세요';
      } else if (
        tbCoMetaTblClmnInfoList.filter((e) => e.changeYn === 'Y').find((e) => e.chgDtpCd === ('' || 'null' || null))
      )
        checkValidation = '변경 데이터 타입을 입력해주세요.';
      else if (
        tbCoMetaTblClmnInfoList
          .filter((e) => e.changeYn === 'Y')
          .filter((e) => e.chgDtpCd === 'timestamp')
          .find((e) => e.dataFormat === ('' || null || 'null'))
      )
        checkValidation = '변경 데이터 형식을 입력해주세요.';
      if (checkValidation !== '') {
        toast({
          type: 'Error',
          content: checkValidation,
        });
        searchError = true;
      }

      return searchError;
    };

    if (validation()) return;

    setTbCoMetaTblClmnInfoListPost(() => {
      const updatedRows = tbCoMetaTblClmnInfoList.map((row) => {
        const { isNullable, remarks, dataType, ...rest } = row;
        return {
          baseTimeYn: rest.baseTimeYn === undefined ? 'N' : rest.baseTimeYn,
          clmnUseYn: rest.clmnUseYn ? rest.clmnUseYn : 'Y',
          dtpCd: dataType,
          metaTblClmnLogiNm: rest.metaTblClmnLogiNm,
          metaTblClmnPhysNm: rest.columnName,
          pkYn: rest.pkYn === undefined ? 'N' : rest.pkYn,
          metaTblClmnDesc: rest.metaTblClmnDesc,
          chgDtpCd: rest.chgDtpCd,
          dataFormat: rest.dataFormat,
        };
      });
      return updatedRows;
    });
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '저장',
        content: '저장하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  // 목록 버튼
  const goToList = () => {
    if (tbCoMetaTblClmnInfoList.length !== 0) {
      setOpen(true);
    } else {
      navigate('..');
    }
  };

  // 등록 useEffect
  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      console.log(response?.message);
      toast({
        type: 'Error',
        content: response?.message,
      });
    } else {
      if (isSuccess) {
        navigate('..');
        toast({
          type: 'Confirm',
          content: '등록이 완료되었습니다.',
        });
      }
    }
  }, [response, isError, toast]);

  return (
    <>
      <Table
        style={{ overflowY: 'auto', height: '500px' }}
        variant="vertical"
        size="normal"
        align="center"
        className="verticalTable"
      >
        {showHeader && columns?.length > 0 && (
          <THead>
            <TR>
              {columns.map((column, index) => (
                <TH
                  className="verticalTableTH"
                  key={`header-${index}`}
                  required={column.require}
                  colSpan={column.colSpan ? column.colSpan : undefined}
                  // enableSort={column.field.length > 0 && enableSort}
                  onChangeSortDirection={(order = SortDirectionCode.ASC) => handleChangeSortDirection(order, index)}
                >
                  {column.headerName}
                </TH>
              ))}
            </TR>
          </THead>
        )}
        {tbCoMetaTblClmnInfoList?.length > 0 ? (
          <TBody clickable={clickable}>
            {tbCoMetaTblClmnInfoList.map((row, rowIndex) => (
              <TR key={`row-${rowIndex}`}>
                {Object.keys(columns).map((column, columnIndex) => {
                  // 라디오 버튼
                  if (columns[columnIndex].field === 'baseTimeYn') {
                    return (
                      <TD
                        key={`${column}-${columnIndex}`}
                        colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                      >
                        <Radio
                          key={`column-${columnIndex}`}
                          name="metaCustomerRadio"
                          onChange={(e) => timeStampChg(rowIndex)}
                          // defaultChecked={row[columns[columnIndex].field] === 'Y'}
                          // defaultValue={'N'}
                          checked={row.baseTimeYn === 'Y'}
                          value={row.baseTimeYn}
                        />
                      </TD>
                    );
                  }

                  // 체크박스
                  else if (columns[columnIndex].field === 'changeYn') {
                    return (
                      <TD
                        key={`td-changeYn-${rowIndex}`}
                        colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                      >
                        <Checkbox
                          checked={row.changeYn === 'Y'}
                          disabled={row.baseTimeYn === 'Y'}
                          key={`checkbox-${columnIndex}`}
                          onClick={(e) => changeYnHandler(rowIndex, columns[columnIndex].field)}
                          value={row.changeYn}
                        />
                      </TD>
                    );
                  }

                  // 체크박스
                  else if (columns[columnIndex].field === 'clmnUseYn') {
                    return (
                      <TD
                        key={`td-clmnUseYn-${rowIndex}`}
                        colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                      >
                        <Checkbox
                          onClick={(e) => ynChg(rowIndex, columns[columnIndex].field)}
                          key={`column-${columnIndex}`}
                          checked={row.clmnUseYn === 'Y'}
                          // defaultValue={columns[columnIndex].field === 'clmnUseYn' ? 'Y' : 'N'}
                          value={row.clmnUseYn}
                        />
                      </TD>
                    );
                  }
                  // 체크박스
                  else if (columns[columnIndex].field === 'pkYn') {
                    return (
                      <TD
                        key={`td-pkYn-${rowIndex}`}
                        colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                      >
                        <Checkbox
                          checked={row.pkYn === 'Y'}
                          onClick={(e) => ynChg(rowIndex, columns[columnIndex].field)}
                          key={`column-${columnIndex}`}
                          value={row.pkYn}
                        />
                      </TD>
                    );
                  }
                  // 텍스트필드
                  else if (
                    columns[columnIndex].field === 'metaTblClmnLogiNm' ||
                    columns[columnIndex].field === 'metaTblClmnDesc'
                  ) {
                    return (
                      <TD
                        className="verticalTableTD"
                        key={`column-${columnIndex}-${rowIndex}`}
                        colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                        align={columns[columnIndex].align ? columns[columnIndex].align : AlignCode.CENTER}
                        onClick={() => handleClick(row, rowIndex)}
                      >
                        {(() => {
                          if (columns[columnIndex].render) {
                            return columns[columnIndex].render?.(
                              rowIndex,
                              columns[columnIndex].field,
                              columns[columnIndex].maxLength
                            );
                          } else {
                            return (
                              <TextField
                                key={`row-logiNm-${rowIndex}`}
                                id={`${columns[columnIndex].field}`}
                                onChange={(e) => onChangeHandler(e, rowIndex)}
                                value={
                                  columns[columnIndex].field === 'metaTblClmnLogiNm'
                                    ? row.metaTblClmnLogiNm
                                    : row.metaTblClmnDesc
                                }
                              />
                            );
                          }
                        })()}
                      </TD>
                    );
                  } else if (columns[columnIndex].field === 'chgDtpCd') {
                    return (
                      <TD
                        className="verticalTableTD"
                        key={`column-${columnIndex}`}
                        colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                        align={columns[columnIndex].align ? columns[columnIndex].align : AlignCode.CENTER}
                        onClick={() => handleClick(row, rowIndex)}
                      >
                        {(() => {
                          if (columns[columnIndex].render) {
                            return columns[columnIndex].render?.(
                              rowIndex,
                              columns[columnIndex].field,
                              columns[columnIndex].maxLength
                            );
                          } else {
                            if (row.changeYn === 'Y' && row.baseTimeYn === 'Y') {
                              return <Typography variant="h5">{row[columns[columnIndex].field]} </Typography>;
                            } else if (row.changeYn === 'Y') {
                              return (
                                <Select
                                  id="chgDtpCd"
                                  appearance="Outline"
                                  placeholder="전체"
                                  className="width-100"
                                  onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                  ) => onchangeSelectHandler(e, value, 'chgDtpCd', rowIndex)}
                                  value={row.chgDtpCd}
                                >
                                  <SelectOption value={'timestamp'}>timestamp</SelectOption>
                                  <SelectOption value={'int'}>int</SelectOption>
                                  <SelectOption value={'double'}>double</SelectOption>
                                </Select>
                              );
                            }
                          }
                        })()}
                      </TD>
                    );
                  }

                  // 그냥row
                  else {
                    return (
                      <TD
                        className="verticalTableTD"
                        key={`column-${columnIndex}`}
                        colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                        align={columns[columnIndex].align ? columns[columnIndex].align : AlignCode.CENTER}
                        onClick={() => handleClick(row, rowIndex)}
                      >
                        {(() => {
                          if (columns[columnIndex].render) {
                            return columns[columnIndex].render?.(
                              rowIndex,
                              columns[columnIndex].field,
                              columns[columnIndex].maxLength
                            );
                          } else {
                            if (columns[columnIndex].field === 'metaTblClmnPhysNm') {
                              return <Typography variant="h5">{row.columnName} </Typography>;
                            } else if (columns[columnIndex].field === 'dtpCd') {
                              return <Typography variant="h5">{row.dataType} </Typography>;
                              // 변경 데이터 형식
                            } else if (columns[columnIndex].field === 'dataFormat') {
                              if (row.changeYn === 'Y' && row.chgDtpCd === 'timestamp' && row.baseTimeYn !== 'Y') {
                                return (
                                  <Select
                                    id="dataFormat"
                                    appearance="Outline"
                                    placeholder="전체"
                                    className="width-100"
                                    onChange={(
                                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                      value: SelectValue<{}, false>
                                    ) => onchangeSelectHandler(e, value, 'dataFormat', rowIndex)}
                                    value={row.dataFormat}
                                  >
                                    {timeFormat?.map((row, index) => (
                                      <SelectOption key={`column-${columnIndex}-${index}`} value={row.cdvCntn}>
                                        {row.cdvNm}
                                      </SelectOption>
                                    ))}
                                  </Select>
                                );
                              } else {
                                return <Typography variant="h5">{row[columns[columnIndex].field]} </Typography>;
                              }
                            }
                          }
                        })()}
                      </TD>
                    );
                  }
                })}
              </TR>
            ))}
          </TBody>
        ) : (
          <TBody className="no-data-wrap">
            <NoResult />
          </TBody>
        )}
      </Table>
      <Stack gap="SM" justifyContent="End">
        <Button
          onClick={regCustomerDetailInfo}
          style={{ width: 50 }}
          type="submit"
          priority="Primary"
          appearance="Contained"
          size="LG"
        >
          저장
        </Button>
        <Button onClick={goToList} style={{ width: 50 }} type="submit" priority="Normal" appearance="Outline" size="LG">
          목록
        </Button>
      </Stack>

      <Modal open={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>오류</Modal.Header>
        <Modal.Body>작성중인 Data가 있습니다. 작성을 취소하고 이동하시겠습니까? </Modal.Body>
        <Modal.Footer>
          <Button
            priority="Primary"
            appearance="Contained"
            onClick={() => {
              navigate('..');
            }}
          >
            확인
          </Button>
          <Button
            priority="Normal"
            appearance="Outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VerticalTblColumn;
