import { useVipList } from '@/hooks/queries/useReportQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { SortDirection } from '@/models/common/Design';
import DataGrid from '@components/grid/DataGrid';
import { useToast } from '@components/ui';
import { ValidType } from '@models/common/Constants';
import { ColumnsInfo } from '@models/components/Table';
import { PageModel, initPage } from '@models/model/PageModel';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import DashboardPopup from './dashboardPopUp';

const columns: Array<ColumnsInfo> = [
  { headerName: 'Rank', field: 'rank', colSpan: 0.5 },
  { headerName: 'One ID', field: 'mergeTargetOneidNo', colSpan: 1 },
  { headerName: '회원번호', field: 'skypassMemberNumber', colSpan: 1 },
  { headerName: '이름', field: 'userNm', colSpan: 0.7 },
  { headerName: 'VIP 회원 분류', field: 'skypassVipTypeName', colSpan: 0.7 },
  { headerName: '확약된 PNR수', field: 'confirmPnrCnt', colSpan: 0.7 },
  { headerName: '국제선 탑승 예정일', field: 'scheduledIntlFlightDate', colSpan: 0.7 },
  { headerName: '국제선 최근 탑승일', field: 'intLastBoardDatev', colSpan: 0.7 },
];

const List = () => {
  const { toast } = useToast();
  const [sortedColumn, setSortedColumn] = useState<string>('scheduledIntlFlightDate');
  const [sortedDirection, setSortedDirection] = useState<SortDirection>('asc');
  const [showPopup, setShowPopup] = useState(false);
  const [page, setPage] = useState<PageModel>({
    ...initPage,
    page: 0,
    pageSize: 50,
  });

  const [rows, setRows] = useState<any>([]);
  const { data: response, isError, refetch } = useVipList(page, sortedColumn, sortedDirection);

  const handleSortChange = (order: SortDirection, index: number) => {
    if (order) {
      setSortedColumn(columns[index].field);
      setSortedDirection(order);
    } else {
      setSortedColumn('');
      setSortedDirection(undefined);
    }
  };

  const toggleModal = () => {
    setShowPopup(!showPopup);
  };

  const handlePage = (pageInfo: PageModel) => {
    setPage(pageInfo);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  useDidMountEffect(() => {
    handleSearch();
  }, [page.page, page.pageSize, sortedColumn, sortedDirection, handleSearch]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        if (sortedColumn === 'scheduledIntlFlightDate' && sortedDirection) {
          const oValue = sortedDirection === 'asc' ? 1 : -1;
          setRows(
            response.data.contents.sort(
              (a: any, b: any) =>
                oValue * (a.scheduledIntlFlightDate - b.scheduledIntlFlightDate) ||
                oValue * (b.intLastBoardDatev - a.intLastBoardDatev)
            )
          );
        } else {
          setRows(response.data.contents);
        }
        setPage(response.data.page);
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
        showPageSizeSelect={true}
        showPagination={true}
        page={page}
        onClick={toggleModal}
        onChange={handlePage}
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
        <DashboardPopup closeModal={toggleModal} />
      </Modal>
    </>
  );
};
export default List;
