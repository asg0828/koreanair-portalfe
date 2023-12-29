import { useState, ReactNode, useEffect } from 'react';
import { RowsInfo } from '@/models/components/Table';
import { CheckedState, SortDirection, SortDirectionCode, AlignCode } from '@/models/common/Design';
import { Typography, Checkbox, Table, THead, TBody, TR, TH, TD, Stack } from '@components/ui';
import NoResult from '@/components/emptyState/NoData';
import '@components/table/VerticalTable.scss';
import { ColumnChild } from '@/models/model/CustomerInfoModel';

export interface VerticalTableChildProps {
  columns: Array<ColumnChild>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  rowSelection?: Function;
  onClick?: Function;
  children?: ReactNode;
  index?: number;
  totals?: any;
}

export interface ChildColumnProps {
  columns: Array<ColumnChild>;
}

export interface ChildRowProps {
  columns: ColumnChild[];
  row: RowsInfo;
  index: number;
  totals: any;
}

const VerticalTableChildNode: React.FC<VerticalTableChildProps> = ({
  columns = [],
  rows = [],
  totals = {},
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
  const ChildColumnGird = ({ columns }: ChildColumnProps) => {
    return (
      <>
        {columns.map((column: ColumnChild, index) =>
          !column.childName ? (
            <TH
              className="verticalTableTH"
              colSpan={column.colSpan ? column.colSpan : undefined}
              style={{
                borderRight: '1px solid #DADADA',
                maxWidth: '80%',
                height: '100%',
              }}
              enableSort={enableSort}
              onChangeSortDirection={(order = SortDirectionCode.ASC) => handleChangeSortDirection(order, index)}
            >
              {column.headerName}
            </TH>
          ) : (
            <Stack direction="Vertical">
              <TH
                colSpan={column.colSpan ? column.colSpan : undefined}
                style={{
                  borderBottom: '1px solid #DADADA',
                  height: '100%',
                }}
              >
                {column.headerName}
              </TH>
              <Stack direction="Horizontal">
                <ChildColumnGird columns={column.childName} />
              </Stack>
            </Stack>
          )
        )}
      </>
    );
  };

  const ChildRowGird = ({ columns, row, index, totals }: ChildRowProps) => {
    return (
      <>
        {columns.map((column: ColumnChild, index2) =>
          !column.childName ? (
            <TD
              className="verticalTableTD"
              key={`child-column-${index}-${index2}`}
              colSpan={column.colSpan ? column.colSpan : undefined}
              align={column.align ? column.align : AlignCode.CENTER}
              onClick={() => handleClick(row, index)}
            >
              <Typography variant="body2">{row[column.field]}</Typography>
            </TD>
          ) : (
            <ChildRowGird columns={column.childName} row={row} index={index} totals={totals} />
          )
        )}
      </>
    );
  };

  const TotalRow = () => {
    const totalRow = Object.values(totals);

    return (
      <>
        {totalRow.map((key: any) => {
          return <TH>{key}</TH>;
        })}
      </>
    );
  };
  return (
    <Table variant="vertical" size="normal" align="center" className="verticalTable">
      <div className="verticalTableDiv">
        {showHeader && columns?.length > 0 && (
          <THead>
            <TR>
              {isCheckbox && (
                <TH>
                  <Checkbox checked={checkedAll} onCheckedChange={handleCheckedChangeAll} />
                </TH>
              )}
              <ChildColumnGird columns={columns} />
            </TR>
          </THead>
        )}
        {rows?.length > 0 ? (
          <TBody clickable={clickable}>
            {rows.map((row, index) => (
              <TR key={`row-${index}`} selected={checkedList.includes(index)}>
                {isCheckbox && (
                  <TD>
                    <Checkbox
                      checked={checkedList.includes(index)}
                      onCheckedChange={(checked) => handleCheckedChange(checked, row, index)}
                    />
                  </TD>
                )}
                <ChildRowGird columns={columns} row={row} index={index} totals={totals} />
              </TR>
            ))}
            {rows?.length > 0 && Object.values(totals).length > 15 && (
              <THead>
                <TR>
                  <TH colSpan={Object.values(totals).length > 20 ? 2.01 : 1}>total</TH>

                  <TotalRow />
                </TR>
              </THead>
            )}
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
export default VerticalTableChildNode;
