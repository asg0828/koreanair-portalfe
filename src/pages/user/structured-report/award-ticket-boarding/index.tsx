import { useBonusTicketTop100List } from '@/hooks/queries/useReportQueries';
import { SortDirection } from '@/models/common/Design';
import DataGrid from '@components/grid/DataGrid';
import { useToast } from '@components/ui';
import { ValidType } from '@models/common/Constants';
import { ColumnsInfo } from '@models/components/Table';
import { PageModel } from '@models/model/PageModel';
import DashboardPopup from '@pages/user/structured-report/dashboardPopUp';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

const initPage: PageModel = { page: 1, pageSize: 100, totalCount: 100, totalPage: 1 };

const columns: Array<ColumnsInfo> = [
  { headerName: 'Rank', field: 'rank', colSpan: 1 },
  { headerName: 'One ID', field: 'mergeSourceOneidNo', colSpan: 1 },
  { headerName: '회원번호', field: 'skypassMemberNumber', colSpan: 1 },
  { headerName: '이름', field: 'userNm', colSpan: 1 },
  { headerName: 'VIP 회원 분류', field: 'skypassVipTypeName', colSpan: 0.8 },
  { headerName: '보너스항공권 소진마일리지 (국제+국내)', field: 'bonusTktRdmMile', colSpan: 1.0 },
  { headerName: '국제선 보너스항공권 소진마일리지', field: 'intBonusTktRdmMile', colSpan: 1.3 },
  { headerName: '국내선 보너스항공권 소진마일리지', field: 'domBonusTktRdmMile', colSpan: 1 },
  { headerName: '국제선 탑승횟수', field: 'intBoardCnt', colSpan: 1 },
  { headerName: '국내선 탑승횟수', field: 'domBoardCnt', colSpan: 1 },
  { headerName: '국제선 보너스항공권 탑승횟수', field: 'intBonusTktBoardCnt', colSpan: 1 },
  { headerName: '국내선 보너스항공권 탑승횟수', field: 'domBonusTktBoardCnt', colSpan: 1 },
];

const initSortedColumn = 'bonusTktRdmMile';
const initSortedDirection = 'desc';

const List = () => {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [initRows, setInitRows] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = useState<PageModel>(initPage);
  const [sortedColumn, setSortedColumn] = useState<string>(initSortedColumn);
  const [sortedDirection, setSortedDirection] = useState<SortDirection>(initSortedDirection);
  const { data: response, isError, refetch } = useBonusTicketTop100List();

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

  const sortRows = (row: Array<any>, sortColumn: string, sortDirection: SortDirection) => {
    const aValue = sortDirection === 'asc' ? 1 : -1;
    return row.sort(
      (a: any, b: any) =>
        aValue *
        (typeof a[sortColumn] === 'string' ? a[sortColumn].localeCompare(b[sortColumn]) : a[sortColumn] - b[sortColumn])
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
  const [oneIdNo, setOneIdNo] = useState<any>('')
  const getClickRow = (rowData: any) => {
    setOneIdNo(rowData.mergeSourceOneidNo)
  };
  
  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        page={page}
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
        isMultiSelected={false}
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
        <DashboardPopup oneIdNo={oneIdNo} />
      </Modal>
    </>
  );
};
export default List;
