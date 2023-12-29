import { useDomesticBoardingTop100List } from '@/hooks/queries/useReportQueries';
import { SortDirection } from '@/models/common/Design';
import DataGrid from '@components/grid/DataGrid';
import { Button, Stack, TD, TH, TR, useToast } from '@components/ui';
import { ValidType } from '@models/common/Constants';
import { ColumnsInfo } from '@models/components/Table';
import DashboardPopup from '@pages/user/structured-report/purchase-contributors/dashboardPopUp';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';

const columns: Array<ColumnsInfo> = [
  { headerName: 'Rank', field: 'Rank', colSpan: 1 },
  { headerName: 'One ID', field: 'oneId', colSpan: 1 },
  { headerName: '회원번호', field: 'memberNumber', colSpan: 1 },
  { headerName: '이름', field: 'name', colSpan: 1 },
  { headerName: 'VIP 회원 분류', field: 'vipYn', colSpan: 0.8 },
  { headerName: '보너스항공권 소진마일리지 (국제+국내)', field: 'totalMileageSpentForAwardTicket', colSpan: 1.0 },
  { headerName: '국제선 보너스항공권 소진마일리지', field: 'mileageSpentForIntl', colSpan: 1.3 },
  { headerName: '국내선 보너스항공권 소진마일리지', field: 'mileageSpentForDomestic', colSpan: 1 },
  { headerName: '국제선 탑승횟수', field: 'intlBoardingCount', colSpan: 1 },
  { headerName: '국내선 탑승횟수', field: 'domesticBoardingCount', colSpan: 1 },
  { headerName: '국제선 보너스항공권 탑승횟수', field: 'intlBoaridngCountByAwardTicket', colSpan: 1 },
  { headerName: '국내선 보너스항공권 탑승횟수', field: 'domesticBoardingCountByAwardTicket', colSpan: 1 },
];

const initSortedColumn = 'totalMileageSpentForAwardTicket';
const initSortedDirection = 'asc';

const List = () => {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [criteria, setCriteria] = useState('0 year');
  const [initRows, setInitRows] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [sortedColumn, setSortedColumn] = useState<string>(initSortedColumn);
  const [sortedDirection, setSortedDirection] = useState<SortDirection>(initSortedDirection);
  const { data: response, isError, refetch } = useDomesticBoardingTop100List(criteria);

  const toggleModal = () => {
    setShowPopup(!showPopup);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

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
        (typeof a[sortColumn] === 'string'
          ? a[sortColumn].localeCompare(b[sortColumn])
          : a[sortColumn] - b[sortColumn])
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

  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        enableSort={true}
        clickable={true}
        showPageSizeSelect={false}
        showPagination={false}
        onClick={toggleModal}
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
        <DashboardPopup closeModal={toggleModal} />
      </Modal>
    </>
  );
};
export default List;
