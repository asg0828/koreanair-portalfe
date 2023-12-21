import React, { useEffect, useCallback, ReactNode } from 'react';
import CstmrMetaColumnRow from './CstmrMetaRowLists';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';

export interface VerticalTableProps {
  columns: Array<ColumnsInfo>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  rowSelection?: Function;
  onClick?: (row: RowsInfo, index: number) => void; // onClick 콜백 함수 정의
  onChange?: (updatedList: RowsInfo[]) => void; // onChange 콜백 함수 정의
  children?: ReactNode;
  props?: any;
  list: Array<RowsInfo>;
}
const CstmrMetaColumnLists: React.FC<VerticalTableProps> = ({ list, rows, columns }) => {
  // 수집기준시간 변경 함수

  // const timeStampChg = (rowIndex: any) => {
  //   onChange((prevList: any[]) =>
  //     prevList.map((row: { baseTimeYn: string; changeYn: string }, index: any) => {
  //       if (index === rowIndex) {
  //         return {
  //           ...row,
  //           baseTimeYn: 'Y',
  //           chgDtpCd: 'timestamp',
  //           dataFormat: 'yyyy-MM-dd HH:mm:ss',
  //           changeYn: 'Y',
  //         };
  //       }
  //       if (row.baseTimeYn !== 'Y' && row.changeYn === 'Y') {
  //         return row;
  //       }
  //       if (row.baseTimeYn === 'Y') {
  //         return { ...row, baseTimeYn: 'N', changeYn: 'N', chgDtpCd: '', dataFormat: '' };
  //       }
  //       return {
  //         ...row,
  //         changeYn: 'N',
  //       };
  //     })
  //   );
  // };

  // // 데이터 타입 변경 여부 체크박스 핸들러
  // const changeYnHandler = (rowIndex: number, field: string) => {
  //   onChange((prevList: any[]) =>
  //     prevList.map((row, index) => {
  //       if (field === 'changeYn' && index === rowIndex && row.changeYn === 'Y') {
  //         return {
  //           ...row,
  //           changeYn: 'N',
  //           dataFormat: null,
  //           chgDtpCd: null,
  //         };
  //       } else if (field === 'changeYn' && index === rowIndex) {
  //         return {
  //           ...row,
  //           changeYn: 'Y',
  //         };
  //       } else {
  //         return row;
  //       }
  //     })
  //   );
  // };

  // // input state 관리
  // const onChangeHandler = (e: { target: { id: any; value: any } }, rowIndex: any) => {
  //   const { id, value } = e.target;
  //   onChange((prevList: any[]) =>
  //     prevList.map((row, index) => {
  //       if (index === rowIndex) {
  //         return {
  //           ...row,
  //           [id]: value,
  //         };
  //       }
  //       return row;
  //     })
  //   );
  // };

  // // select state 관리
  // const onchangeSelectHandler = (e: any, value: string, id: string, rowIndex: any) => {
  //   onChange((prevList: any[]) =>
  //     prevList.map((row, index) => {
  //       if (index === rowIndex) {
  //         if ((value === 'double' || 'int') && id === 'chgDtpCd') {
  //           return {
  //             ...row,
  //             [`${id}`]: String(value),
  //             dataFormat: null,
  //           };
  //         } else {
  //           return {
  //             ...row,
  //             [`${id}`]: String(value),
  //           };
  //         }
  //       }
  //       return row;
  //     })
  //   );
  // };

  // // 체크박스 선택 값 변경 함수
  // const ynChg = (rowIndex: number, field: string) => {
  //   onChange((prevList: any[]) =>
  //     prevList.map((row, index) => {
  //       if (field === 'pkYn' && index === rowIndex) {
  //         return {
  //           ...row,
  //           pkYn: row.pkYn === 'Y' ? 'N' : 'Y',
  //         };
  //       } else if (field === 'clmnUseYn' && index === rowIndex) {
  //         return {
  //           ...row,
  //           clmnUseYn: row.clmnUseYn === ('N' || undefined) ? 'Y' : 'N',
  //         };
  //       }
  //       return row;
  //     })
  //   );
  // };

  // const handleClick = (row: any, index: any) => {
  //   onClick && onClick(row, index);
  // };

  return (
    <>
      {/* {list.map((row: any, rowIndex: any) => (
        <CstmrMetaColumnRow
          key={`row-${rowIndex}`}
          // row={row}
          // rowIndex={rowIndex}
          // onChange={onChangeHandler}
          // onClick={handleClick}
          // timeStamapChg={timeStampChg}
        />
      ))} */}
    </>
  );
};

export default CstmrMetaColumnLists;
