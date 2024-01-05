import { useDomesticBoardingTop100List } from '@/hooks/queries/useReportQueries';
import { SortDirection } from '@/models/common/Design';
import SearchForm from '@components/form/SearchForm';
import DataGrid from '@components/grid/DataGrid';
import { Button, Stack, TD, TH, TR, useToast } from '@components/ui';
import { ValidType } from '@models/common/Constants';
import { ColumnsInfo } from '@models/components/Table';
import DashboardPopup from '@pages/user/structured-report/purchase-contributors/dashboardPopUp';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';

const columns: Array<ColumnsInfo> = [
  { headerName: 'Rank', field: 'rank', colSpan: 1 },
  { headerName: 'One ID', field: 'mergeTargetOneidNo', colSpan: 1 },
  { headerName: '회원번호', field: 'skypassMemberNumber', colSpan: 1 },
  { headerName: '이름', field: 'userNm', colSpan: 1 },
  { headerName: 'VIP 회원 분류', field: 'skypassVipTypeName', colSpan: 1.2 },
  { headerName: 'Upgrade 소진 마일리지', field: 'upgradeRdmMile', colSpan: 1.1 },
  { headerName: '마일리지 FR Upgrade횟수', field: 'frMileUpgradeCnt', colSpan: 1 },
  { headerName: '마일리지 PR Upgrade횟수', field: 'prMileUpgradeCnt', colSpan: 1 },
  { headerName: '국제선 탑승횟수', field: 'intBoardCnt', colSpan: 1.1 },
  { headerName: '국제선 FR 탑승횟수', field: 'intFrClsBoardCnt', colSpan: 1 },
  { headerName: '국제선 PR 탑승횟수', field: 'intPrClsBoardCnt', colSpan: 1 },
];

const initSortedColumn = 'upgradeRdmMile';
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
