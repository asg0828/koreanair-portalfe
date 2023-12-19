import NoResult from '@/components/emptyState/NoData';
import { AlignCode, CheckedState, SortDirection, SortDirectionCode } from '@/models/common/Design';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import '@components/table/VerticalTable.scss';
import { Checkbox, TBody, TD, TH, THead, TR, Table, Typography } from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';

export interface VerticalTableProps {
  className?: string;
  columns: Array<ColumnsInfo>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  isMultiSelected?: boolean;
  initialSortedColumn?: string;
  rowSelection?: (checkedIndexList: Array<number>, checkedList: Array<any>) => void;
  onClick?: Function;
  onSortChange?: Function;
  children?: ReactNode;
}

const VerticalTable: React.FC<VerticalTableProps> = ({
  className = '',
  columns = [],
  rows = [],
  showHeader = true,
  enableSort = false,
  clickable = false,
  initialSortedColumn = '',
  isMultiSelected = true,
  rowSelection,
  onClick,
  onSortChange,
                                                     }) => {
  const isCheckbox = typeof rowSelection === 'function';
  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
  const [checkedIndexList, setCheckedIndexList] = useState<Array<number>>([]);
  const [checkedList, setCheckedList] = useState<Array<RowsInfo>>([]);
  const [sortRows, setSortRows] = useState<Array<RowsInfo>>(Array.from(rows));
  const [sortedColumn, setSortedColumn] = useState('');
  const [sortedDirection, setSortedDirection] = useState('');

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

    newCheckedList = rows.filter((item, index) => newCheckedIndexList.some((index2) => index === index2));

    if (newCheckedIndexList.length === rows.length) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }

    setCheckedIndexList(newCheckedIndexList);
    setCheckedList(newCheckedList);

    return [newCheckedIndexList, newCheckedList];
  };

  const handleCheckedChange = (isAll: boolean, checked: CheckedState, index: number): void => {
    const resultList = changeChecked(isAll, checked, index);
    isCheckbox && rowSelection(resultList[0], resultList[1]);
  };

  const handleChangeSortDirection = (order: SortDirection, index: number) => {
    const field = columns[index].field;
    const oValue = order === SortDirectionCode.DESC ? 1 : -1;

    // 방향이 반대로 설정되는 버그 처리 위해 임시로 설정
    let direction;
    if (order === 'asc') {
      direction = 'desc';
    } else {
      direction = 'asc';
    }

    const sortedColumn = field;

    const sortRows = [...rows].sort((a, b) => {
      let valueA = a[field] || '';
      let valueB = b[field] || '';

      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB) * oValue;
      } else {
        return (valueA - valueB) * oValue;
      }
    });
    setSortRows(sortRows);
    setSortedDirection(direction);
    setSortedColumn(sortedColumn);
    onSortChange?.(sortedColumn, direction, sortRows);
  }

  const initialSort = () => {
    if (!initialSortedColumn || columns.length === 0) return;

    const columnIndex = columns.findIndex((column) => column.field === initialSortedColumn);
    if (columnIndex === -1) return;

    const sortDirection = SortDirectionCode.DESC;
    handleChangeSortDirection(sortDirection, columnIndex);
  };

  const handleClick = (row: RowsInfo, index: number, selected: boolean) => {
    onClick && onClick(row, index, selected);
  };

  useEffect(() => {
    initialSort();
  }, []);

  useEffect(() => {
    setSortRows(rows);
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
                <TH
                  className={`verticalTableTH ${sortedColumn && column.field === sortedColumn ? 'sortedColumn' : ''}`}
                  key={`header-${index}`}
                  required={column.require}
                  colSpan={column.colSpan ? column.colSpan : undefined}
                  enableSort={column.field.length > 0 && enableSort}
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
            {sortRows.map((row, rowIndex) => {
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
