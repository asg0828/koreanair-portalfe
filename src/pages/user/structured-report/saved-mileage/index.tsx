import { useTotalMileageTop100List } from '@/hooks/queries/useReportQueries';
import { SortDirection } from '@/models/common/Design';
import DataGrid from '@components/grid/DataGrid';
import { useToast } from '@components/ui';
import { ValidType } from '@models/common/Constants';
import { ColumnsInfo } from '@models/components/Table';
import DashboardPopup from '@pages/user/structured-report/dashboardPopUp';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

const columns: Array<ColumnsInfo> = [
  { headerName: 'Rank', field: 'rank', colSpan: 1 },
  { headerName: 'One ID', field: 'mergeSourceOneidNo', colSpan: 1 },
  { headerName: '회원번호', field: 'skypassMemberNumber', colSpan: 1 },
  { headerName: '이름', field: 'userNm', colSpan: 1 },
  { headerName: 'VIP 회원 분류', field: 'skypassVipTypeName', colSpan: 1 },
  { headerName: '총 적립 마일리지', field: 'ttlAcrlMile', colSpan: 1 },
  { headerName: '총 적립 마일리지(항공 탑승)', field: 'fltBoardTtlAcrlMile', colSpan: 1 },
  { headerName: '잔여 마일리지', field: 'remainMile', colSpan: 1 },
  { headerName: '잔여 마일리지(가족합산)', field: 'fmlyPoolingRmnMile', colSpan: 1 },
  { headerName: '마일리지 제휴카드(PLCC) 보유여부', field: 'skypassPartnerPlccHoldYn', colSpan: 1.2 },
];

const initSortedColumn = 'ttlAcrlMile';
const initSortedDirection = 'desc';

const List = () => {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [criteria, setCriteria] = useState('0 year');
  const [initRows, setInitRows] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [sortedColumn, setSortedColumn] = useState<string>(initSortedColumn);
  const [sortedDirection, setSortedDirection] = useState<SortDirection>(initSortedDirection);
  const { data: response, isError, refetch } = useTotalMileageTop100List(criteria);

  const newColumn: ColumnsInfo = {
    headerName: '총 적립 마일리지(항공 이외)',
    field: 'nonFlightMileage',
    colSpan: 1,
  };

  const updatedRows = rows.map((row: any) => {
    const ttlAcrlMile = row.ttlAcrlMile || 0;
    const fltBoardTtlAcrlMile = row.fltBoardTtlAcrlMile || 0;

    return {
      ...row,
      nonFlightMileage: ttlAcrlMile - fltBoardTtlAcrlMile,
    };
  });

  const columnIndexToInsert = columns.findIndex((column) => column.field === 'fltBoardTtlAcrlMile') + 1;
  const updatedColumns = [
    ...columns.slice(0, columnIndexToInsert),
    newColumn, // 새로운 열
    ...columns.slice(columnIndexToInsert),
  ];

  const toggleModal = () => {
    setShowPopup(!showPopup);
  };

  const handleSortChange = (order: SortDirection, index: number) => {
    if (order) {
      const newSortedColumn = columns[index].field;
      setSortedColumn(newSortedColumn);
      setSortedDirection(order);
      setRows([...sortRows(rows, newSortedColumn, order)]);
    } else {
      setSortedColumn('');
      setSortedDirection(undefined);
      setRows(JSON.parse(JSON.stringify(initRows)));
    }
  };

  const sortRows = (rows: Array<any>, sortedColumn: string, sortedDirection: SortDirection) => {
    const aValue = sortedDirection === 'asc' ? 1 : -1;
    return rows.sort(
      (a: any, b: any) =>
        aValue *
        (typeof a[sortedColumn] === 'string'
          ? a[sortedColumn].localeCompare(b[sortedColumn])
          : a[sortedColumn] - b[sortedColumn])
    );
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        setInitRows(JSON.parse(JSON.stringify(response.data.contents)));
        setRows([...sortRows(response.data.contents, sortedColumn, sortedDirection)]);
      }
    }
  }, [response, isError, toast]);

  // 행 클릭 조회 함수
  const [skypassNumber, setSkypassNumber] = useState<any>('');
  const getClickRow = (rowData: any) => {
    setSkypassNumber(rowData.skypassMemberNumber);
  };

  return (
    <>
      <DataGrid
        columns={updatedColumns}
        rows={updatedRows}
        enableSort={true}
        clickable={true}
        showPageSizeSelect={false}
        showPagination={false}
        onClick={(rowData : any) => {
          toggleModal(); 
          getClickRow(rowData);
        }}
        onSortChange={handleSortChange}
        sortedColumn={sortedColumn}
        sortedDirection={sortedDirection}
      />
      <Modal
        isOpen={showPopup}
        onRequestClose={toggleModal}
        style={{
          content: {
            width: '1200px',
            height: '800px',
            margin: 'auto',
          },
        }}
      >
        <DashboardPopup skypassMemberNumber={skypassNumber} closeModal={toggleModal} />
      </Modal>
    </>
  );
};
export default List;
