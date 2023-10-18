import { useState } from 'react';
import { VerticalTableProps, RowsInfo } from '@/models/components/Table';
import { CheckedState, SortDirection, SortDirectionCode, AlignCode } from '@/models/common/Design';
import { Typography, Checkbox, Table, THead, TBody, TR, TH, TD } from '@components/ui';
import '@components/table/VerticalTable.scss';

const VerticalTable: React.FC<VerticalTableProps> = ({
  className = '',
  columns = [],
  rows = [],
  showHeader = true,
  enableSort = false,
  clickable = false,
  rowSelection,
  onClick,
}) => {
  const isCheckbox = typeof rowSelection === 'function';
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<Array<number>>([]);
  const [sortRows, setSortRows] = useState<Array<RowsInfo>>(Array.from(rows));

  const handleCheckedChangeAll = (checked: boolean): void => {
    let newCheckedList: Array<number> = []; 

    if (checked) {
      newCheckedList = new Array(rows.length).fill(null).map((v, i) => i);
    }

    setCheckedList(newCheckedList);
    setCheckedAll(checked);
    isCheckbox && rowSelection(newCheckedList);
  };

  const handleCheckedChange = (checked: CheckedState, row: RowsInfo, index: number): void => {
    let newCheckedList: Array<number> = []; 

    if (checked) {
      newCheckedList = [...checkedList, index];
    } else {
      newCheckedList = checkedList.filter((i) => i !== index);
    }

    if (newCheckedList.length === rows.length) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
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

  return (
    <Table variant="vertical" size="normal" align="center" className={`verticalTable ${className}`}>
      {showHeader && columns?.length > 0 && (
        <THead>
          <TR>
            {isCheckbox && (
              <TH>
                <Checkbox checked={checkedAll} onCheckedChange={handleCheckedChangeAll} />
              </TH>
            )}
            {columns.map((column, index) => (
              <TH
                colSpan={column.colSpan ? column.colSpan : 1}
                key={`header-${index}`}
                enableSort={enableSort}
                onChangeSortDirection={(order = SortDirectionCode.ASC) => handleChangeSortDirection(order, index)}
              >
                {column.headerName}
              </TH>
            ))}
          </TR>
        </THead>
      )}
      {rows?.length > 0 && (
        <TBody clickable={clickable}>
          {rows.map((row, index) => (
            <TR
              key={`row-${index}`}
              selected={checkedList.includes(index)}
            >
              {isCheckbox && (
                <TD>
                  <Checkbox
                    checked={checkedList.includes(index)}
                    onCheckedChange={(checked) => handleCheckedChange(checked, row, index)}
                  />
                </TD>
              )}

              {Object.keys(columns).map((column, index) => (
                <TD
                  key={`column-${index}`}
                  colSpan={columns[index].colSpan ? columns[index].colSpan : 1}
                  align={columns[index].align ? columns[index].align : AlignCode.CENTER}
                  onClick={() => handleClick(row, index)}
                >
                  <Typography variant="body2">{row[columns[index].field]}</Typography>
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      )}
    </Table>
  );
};
export default VerticalTable;
