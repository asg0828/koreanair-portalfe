import NoResult from '@/components/emptyState/NoData';
import { AlignCode, CheckedState, SortDirection, SortDirectionCode } from '@/models/common/Design';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import '@components/table/VerticalTable.scss';
import { Checkbox, Radio, TBody, TD, TH, THead, TR, Table, TextField, Typography } from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';

export interface VerticalTableProps {
  columns: Array<ColumnsInfo>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  rowSelection?: Function;
  onClick?: Function;
  children?: ReactNode;
}

const VerticalTableMeta: React.FC<VerticalTableProps> = ({
  columns = [],
  rows = [],
  showHeader = true,
  enableSort = false,
  clickable = false,
  rowSelection,
  onClick,
}) => {
  const isCheckbox = typeof rowSelection === 'function';
  const [checkedList, setCheckedList] = useState<Array<number>>([]);
  const [sortRows, setSortRows] = useState<Array<RowsInfo>>(Array.from(rows));

  const handleCheckedChange = (checked: CheckedState, row: RowsInfo, index: number): void => {
    let newCheckedList: Array<number> = [];

    if (checked) {
      newCheckedList = [...checkedList, index];
    } else {
      newCheckedList = checkedList.filter((i) => i !== index);
    }

    setCheckedList(newCheckedList);
    isCheckbox && rowSelection(newCheckedList, row, index, checked);
  };

  const handleChangeSortDirection = (order: SortDirection, index: number) => {
    const oValue = order === SortDirectionCode.ASC ? 1 : order === SortDirectionCode.DESC ? -1 : 0;

    const sortRows = rows.sort((a, b) => {
      if (a[index] === b[index]) {
        return 0;
      } else if (a[index] < b[index]) {
        return oValue;
      } else {
        return -oValue;
      }
    });

    setSortRows(sortRows);
  };

  const handleClick = (row: RowsInfo, index: number) => {
    onClick && onClick(row, index);
  };

  useEffect(() => {
    setSortRows(rows);
  }, [rows]);

  const timeStampChg = (e: any) => {
    console.log(e);
  };

  return (
    <Table variant="vertical" size="normal" align="center" className="verticalTable">
      {showHeader && columns?.length > 0 && (
        <THead>
          <TR>
            {columns.map((column, index) => (
              <TH
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
      {sortRows?.length > 0 ? (
        <TBody clickable={clickable}>
          {sortRows.map((row, rowIndex) => (
            <TR key={`row-${rowIndex}`}>
              {Object.keys(columns).map((column, columnIndex) => {
                // 체크박스
                if (columns[columnIndex].field.includes('Yn') && columns[columnIndex].field !== 'baseTimeYn') {
                  console.log(columns[columnIndex].field);
                  console.log(row[columns[columnIndex].field]);

                  return (
                    <TD>
                      <Checkbox
                        key={`column-${columnIndex}`}
                        defaultChecked={row[columns[columnIndex].field] === 'Y'}
                      />
                    </TD>
                  );
                }
                // 라디오 버튼
                else if (columns[columnIndex].field === 'baseTimeYn') {
                  return (
                    <TD>
                      <Radio
                        key={`column-${columnIndex}`}
                        name="metaCustomerRadio"
                        onClick={timeStampChg}
                        defaultChecked={row[columns[columnIndex].field] === 'Y'}
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
                          return <TextField value={row[columns[columnIndex].field]} />;
                        }
                      })()}
                    </TD>
                  );
                } else if (columns[columnIndex].field === 'no') {
                  return <TD>{rowIndex}</TD>;
                }

                // 그냥row
                else {
                  return (
                    <TD
                      key={`column-${columnIndex}`}
                      // colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                      // align={columns[columnIndex].align ? columns[columnIndex].align : AlignCode.CENTER}
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
                          return <Typography>{row[columns[columnIndex].field]} </Typography>;
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
  );
};
export default VerticalTableMeta;
