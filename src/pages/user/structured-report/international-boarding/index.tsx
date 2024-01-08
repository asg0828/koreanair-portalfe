import { useIntlBoardingTop100List } from '@/hooks/queries/useReportQueries';
import { SortDirection } from '@/models/common/Design';
import SearchForm from '@components/form/SearchForm';
import DataGrid from '@components/grid/DataGrid';
import { Button, Stack, TD, TH, TR, useToast } from '@components/ui';
import { ValidType } from '@models/common/Constants';
import { ColumnsInfo } from '@models/components/Table';
import DashboardPopup from '@pages/user/structured-report/purchase-contributors/dashboardPopUp';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import {PageModel} from "@models/model/PageModel";

const initPage: PageModel = { page: 1, pageSize: 100, totalCount:100,totalPage: 1};

const periods = [
  { period: '0 year', text: '올해' },
  { period: '1 year', text: '최근 1년' },
  { period: '2 year', text: '최근 2년' },
  { period: '3 year', text: '최근 3년' },
  { period: '4 year', text: '최근 4년' },
];

const columns: Array<ColumnsInfo> = [
  { headerName: 'Rank', field: 'rank', colSpan: 0.7 },
  { headerName: 'One ID', field: 'mergeTargetOneidNo', colSpan: 1.3 },
  { headerName: '회원번호', field: 'skypassMemberNumber', colSpan: 1 },
  { headerName: '이름', field: 'userNm', colSpan: 2 },
  { headerName: 'VIP 회원 분류', field: 'skypassVipTypeName', colSpan: 0.7 },
  { headerName: '국제선 수입금액', field: 'intTktNoFscNettKrwAmt', colSpan: 1 },
  { headerName: '국제선 탑승횟수', field: 'intBoardCnt', colSpan: 1 },
  { headerName: '국제선 보너스 항공권 탑승 횟수', field: 'intBonusTktBoardCnt', colSpan: 1 },
  { headerName: '국제선 FR탑승횟수 + PR 탑승횟수', field: 'frClsBuyCnt', colSpan: 1 },
  { headerName: '국제선 평균 탑승 주기', field: 'intAvgBoardCycle', colSpan: 1 },
  { headerName: '국제선 최다 탑승 O&D', field: 'intMstBordOndApoRteCd1', colSpan: 1 },
];

const initSortedColumn = 'intBoardCnt';
const initSortedDirection = 'desc';

const List = () => {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [criteria, setCriteria] = useState('0 year');
  const [initRows, setInitRows] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [page, setPage] = useState<PageModel>(initPage);
  const [sortedColumn, setSortedColumn] = useState<string>(initSortedColumn);
  const [sortedDirection, setSortedDirection] = useState<SortDirection>(initSortedDirection);
  const { data: response, isError, refetch } = useIntlBoardingTop100List(criteria);

  const createPeriodButton = (period: any, text: string, periodSelect: any) => {
    const isSelected = period === criteria;

    const buttonStyle = isSelected
      ? { backgroundColor: '#a2d2eb', color: '#000000', height: '50px' }
      : { backgroundColor: '#407dba', color: '#FFFFFF', height: '50px' };

    return (
      <Button
        priority="Primary"
        appearance="Contained"
        size="LG"
        style={buttonStyle}
        onClick={() => periodSelect(period)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', marginBottom: '-5px' }}>{text}</span>
          <span style={{ fontSize: 'smaller' }}>({calculateDateRange(period)})</span>
        </div>
      </Button>
    );
  };

  const calculateDateRange = (period: string) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    let startDate = new Date();

    if (period === '선택') {
      return '';
    }

    switch (period) {
      case '선택':
        return '';
      case '0 year':
        startDate = new Date(endDate.getFullYear(), 0, 2);
        break;
      case '1 year':
        startDate = new Date(endDate.getFullYear() - 1, 0, 2);
        break;
      case '2 year':
        startDate = new Date(endDate.getFullYear() - 2, 0, 2);
        break;
      case '3 year':
        startDate = new Date(endDate.getFullYear() - 3, 0, 2);
        break;
      case '4 year':
        startDate = new Date(endDate.getFullYear() - 4, 0, 2);
        break;
      default:
    }

    return `${startDate.toISOString().split('T')[0]} ~ ${endDate.toISOString().split('T')[0]}`;
  };

  const toggleModal = () => {
    setShowPopup(!showPopup);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePeriodSelect = (period: string) => {
    setCriteria(period);
    setSortedColumn(initSortedColumn);
    setSortedDirection(initSortedDirection);
    setRows([]);
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
      <SearchForm onSearch={handleSearch} showClearButton={false} showSearchButton={false}>
        <TR>
          <TH colSpan={1} align="center">
            조회기준
          </TH>
          <TD colSpan={5} align="left">
            <Stack direction="Horizontal" gap="SM">
              {periods.map(({ period, text }) => createPeriodButton(period, text, handlePeriodSelect))}
            </Stack>
          </TD>
        </TR>
      </SearchForm>

      <DataGrid
        columns={columns}
        rows={rows}
        page={page}
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
