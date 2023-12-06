import NoResult from '@/components/emptyState/NoData';
import { useUpdateMetaTable } from '@/hooks/mutations/self-feature/useSelfFeatureAdmMutations';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType, View } from '@/models/common/Constants';
import { AlignCode, CheckedState, SortDirection, SortDirectionCode } from '@/models/common/Design';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { openModal } from '@/reducers/modalSlice';
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
} from '@components/ui';
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
}

const VerticalTblColumn: React.FC<VerticalTableProps> = ({
  columns = [],
  rows = [],
  showHeader = true,
  enableSort = false,
  clickable = false,
  rowSelection,
  onChange,
  onClick,
}) => {
  const isCheckbox = typeof rowSelection === 'function';
  const [checkedList, setCheckedList] = useState<Array<number>>([]);
  const [tbCoMetaTblClmnInfoList, setTbCoMetaTblClmnInfoList] = useState<Array<RowsInfo>>(Array.from(rows));

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 수정중 페이지 이탈 모달
  const [isOpen, setOpen] = useState(false);

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
    setTbCoMetaTblClmnInfoList(tbCoMetaTblClmnInfoList);
  };

  const handleClick = (row: RowsInfo, index: number) => {
    onClick && onClick(row, index);
  };

  useEffect(() => {
    setTbCoMetaTblClmnInfoList(rows);
  }, [rows]);

  // 수집기준시간 변경 함수
  const timeStampChg = (rowIndex: number) => {
    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows = tbCoMetaTblClmnInfoList.map((row, index) => {
        if (index === rowIndex) {
        }
        return {
          ...row,
          baseTimeYn: index === rowIndex ? 'Y' : 'N',
          chgDtpCd: index === rowIndex ? 'timestamp' : '',
          dataFormat: index === rowIndex ? 'yyyy-MM-dd HH:mm:ss' : '',
          changeYn: index === rowIndex ? 'Y' : 'N', // checked, unchecked disalbed로
        };
      });
      return updatedRows;
    });
  };

  // 체크박스 선택 값 변경 함수
  const ynChg = (rowIndex: number, field: string) => {
    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows: RowsInfo[] = tbCoMetaTblClmnInfoList.map((row, index) => {
        if (field === 'pkYn' && index === rowIndex) {
          return {
            ...row,
            pkYn: tbCoMetaTblClmnInfoList[rowIndex].pkYn === 'Y' ? 'N' : 'Y',
          };
        } else if (field === 'clmnUseYn' && index === rowIndex) {
          return {
            ...row,
            clmnUseYn: tbCoMetaTblClmnInfoList[rowIndex].clmnUseYn === 'Y' ? 'N' : 'Y',
          };
        }
        return row;
      });
      return updatedRows;
    });
  };

  /* 데이터 타입 변경 여부 체크박스 */
  const changeYnHandler = () => {
    // 체크 여부에 따라서
  };

  /* input state관리 */
  function onChangeHandler(e: any, rowIndex: number) {
    const { id, value } = e.target;

    setTbCoMetaTblClmnInfoList((tbCoMetaTblClmnInfoList) => {
      const updatedRows = tbCoMetaTblClmnInfoList.map((row, index) => {
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

  // // 수정 버튼
  // const editCustomerDetailInfo = (data: any) => {
  //   dispatch(
  //     openModal({
  //       type: ModalType.CONFIRM,
  //       title: '저장',
  //       content: '수정하시겠습니까?',
  //       onConfirm: mutate,
  //     })
  //   );
  // };

  // 목록 버튼
  const goToList = () => {
    if (rows !== tbCoMetaTblClmnInfoList) {
      setOpen(true);
    } else {
      navigate('..');
    }
  };

  return (
    <>
      <Table
        style={{ overflowY: 'scroll', height: '500px' }}
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
                      <TD colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}>
                        <Radio
                          key={`column-${columnIndex}`}
                          name="metaCustomerRadio"
                          onChange={(e) => timeStampChg(rowIndex)}
                          defaultChecked={row[columns[columnIndex].field] === 'Y'}
                        />
                      </TD>
                    );
                  }

                  // 체크박스
                  else if (columns[columnIndex].field === 'changeYn') {
                    return (
                      <TD colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}>
                        <Checkbox
                          // checked={row.changeYn === 'Y'}
                          disabled={row.baseTimeYn === 'Y'}
                          key={`checkbox-${columnIndex}`}
                          onClick={changeYnHandler}
                        />
                      </TD>
                    );
                  }

                  // 체크박스
                  else if (columns[columnIndex].field.includes('Yn')) {
                    return (
                      <TD colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}>
                        <Checkbox
                          key={`column-${columnIndex}`}
                          defaultChecked={columns[columnIndex].field === 'clmnUseYn'}
                          onClick={(e) => ynChg(rowIndex, columns[columnIndex].field)}
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
                            return (
                              <TextField
                                id={columns[columnIndex].field}
                                onChange={(e) => onChangeHandler(e, rowIndex)}
                                value={row[columns[columnIndex].field]}
                              />
                            );
                          }
                        })()}
                      </TD>
                    );
                  } else if (columns[columnIndex].field === 'no') {
                    return (
                      <TD colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}>
                        {rowIndex + 1}
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
                              return <Select></Select>;
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
                            return <Typography variant="h5">{row[columns[columnIndex].field]} </Typography>;
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
          // onClick={editCustomerDetailInfo}
          style={{ width: 50 }}
          type="submit"
          priority="Primary"
          appearance="Contained"
          size="LG"
        >
          수정
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
