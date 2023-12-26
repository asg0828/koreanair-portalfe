import NoResult from '@/components/emptyState/NoData';
import { AlignCode, CheckedState, SortDirection } from '@/models/common/Design';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import '@components/table/VerticalTable.scss';
import { Checkbox, Sort, TBody, TD, TH, THead, TR, Table, Typography } from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';

export interface VerticalTableProps {
  className?: string;
  columns: Array<ColumnsInfo>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  isMultiSelected?: boolean;
  rowSelection?: (checkedIndexList: Array<number>, checkedList: Array<any>) => void;
  onClick?: Function;
  onSortChange?: Function;
  children?: ReactNode;
  sortedColumn?: string;
  sortedDirection?: SortDirection;
}

const VerticalTable: React.FC<VerticalTableProps> = ({
  className = '',
  columns = [],
  rows = [],
  showHeader = true,
  enableSort = false,
  clickable = false,
  isMultiSelected = true,
  rowSelection,
  onClick,
  onSortChange,
  sortedColumn,
  sortedDirection,
}) => {
  const isCheckbox = typeof rowSelection === 'function';
  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
  const [checkedIndexList, setCheckedIndexList] = useState<Array<number>>([]);

  function formatNumber(value: number) {
    return new Intl.NumberFormat('ko-KR').format(value);
  }

  const changeChecked = (isAll: boolean, checked: CheckedState, index: number): Array<any> => {
    checked = checked ? true : false;
    let newCheckedIndexList: Array<number> = [];
    let newCheckedList: Array<RowsInfo> = [];

    if (isAll) {
      if (checked) {
        if (isMultiSelected || rows.length <= 1) {
          newCheckedIndexList = new Array(rows.length).fill(null).map((v, i) => i);
        }
      }
    } else {
      if (checked) {
        if (isMultiSelected) {
          newCheckedIndexList = [...checkedIndexList, index];
        } else {
          newCheckedIndexList = [index];
        }
      } else {
        newCheckedIndexList = checkedIndexList.filter((i) => i !== index);
      }
    }

    newCheckedList = rows.filter((item, fIndex) => newCheckedIndexList.some((sIndex) => fIndex === sIndex));

    if (newCheckedIndexList.length === rows.length) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }

    setCheckedIndexList(newCheckedIndexList);

    return [newCheckedIndexList, newCheckedList];
  };

  const handleCheckedChange = (isAll: boolean, checked: CheckedState, index: number): void => {
    const resultList = changeChecked(isAll, checked, index);
    isCheckbox && rowSelection(resultList[0], resultList[1]);
  };

  const handleClick = (row: RowsInfo, index: number, selected: boolean) => {
    onClick && onClick(row, index, selected);
  };

  const handleChangeSortDirection = (order: SortDirection, index: number) => {
    onSortChange && onSortChange(order, index);
  };

  useEffect(() => {
    setIsCheckedAll(false);
    setCheckedIndexList([]);
  }, [rows]);

  return (
    <Table variant="vertical" size="normal" align="center" className={`verticalTable ${className}`}>
      <div className="verticalTableDiv">
        {showHeader && columns?.length > 0 && (
          <THead>
            <TR>
              {isCheckbox && (
                <TH colSpan={0.5}>
                  <Checkbox
                    checked={isCheckedAll}
                    onCheckedChange={(checked) => handleCheckedChange(true, checked, -1)}
                  />
                </TH>
              )}
              {columns.map((column, index) => (
                <>
                  <TH
                    className={`verticalTableTH ${sortedColumn && column.field === sortedColumn ? 'sortedColumn' : ''}`}
                    key={`header-${index}`}
                    required={column.require}
                    colSpan={column.colSpan ? column.colSpan : undefined}
                  >
                    {column.headerName}
                    {column.field.length > 0 && enableSort && (
                      <Sort
                        key={`${column.field}-${sortedDirection}`}
                        defaultDirection={sortedColumn === column.field ? sortedDirection : undefined}
                        onChangeSortDirection={(order) => handleChangeSortDirection(order, index)}
                      />
                    )}
                  </TH>
                </>
              ))}
            </TR>
          </THead>
        )}
        {rows?.length > 0 ? (
          <TBody clickable={clickable}>
            {rows.map((row, rowIndex) => {
              const selected = checkedIndexList.includes(rowIndex);

              return (
                <TR key={`row-${rowIndex}`} selected={clickable && selected}>
                  {isCheckbox && (
                    <TD colSpan={0.5}>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => handleCheckedChange(false, checked, rowIndex)}
                      />
                    </TD>
                  )}

                  {Object.keys(columns).map((column, columnIndex) => (
                    <TD
                      key={`column-${columnIndex}`}
                      colSpan={columns[columnIndex].colSpan ? columns[columnIndex].colSpan : undefined}
                      align={columns[columnIndex].align ? columns[columnIndex].align : AlignCode.CENTER}
                      className="verticalTableTD"
                      onClick={() => {
                        const resultList = changeChecked(false, !selected, rowIndex);
                        handleClick(row, rowIndex, !selected);
                        isCheckbox && rowSelection(resultList[0], resultList[1]);
                      }}
                    >
                      {(() => {
                        if (columns[columnIndex].render) {
                          return columns[columnIndex].render?.(
                            rowIndex,
                            columns[columnIndex].field,
                            columns[columnIndex].maxLength
                          );
                        } else {
                          const columnData = columns[columnIndex];
                          const data = row[columnData.field];
                          if (typeof data === 'number' && columnData.field !== 'memberNumber') {
                            return <Typography variant="body2">{formatNumber(data)}</Typography>;
                          }
                          return <Typography variant="body2">{data}</Typography>;
                        }
                      })()}
                    </TD>
                  ))}
                </TR>
              );
            })}
          </TBody>
        ) : (
          <TBody className="no-data-wrap">
            <NoResult />
          </TBody>
        )}
      </div>
    </Table>
  );
};
export default VerticalTable;
