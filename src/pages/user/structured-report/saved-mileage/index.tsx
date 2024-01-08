import { useTotalMileageTop100List } from '@/hooks/queries/useReportQueries';
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
  const [page, setPage] = useState<PageModel>(initPage);
  const [sortedColumn, setSortedColumn] = useState<string>(initSortedColumn);
  const [sortedDirection, setSortedDirection] = useState<SortDirection>(initSortedDirection);
  const { data: response, isError, refetch } = useTotalMileageTop100List(criteria);

  const newColumn: ColumnsInfo = {
    headerName: '총 적립 마일리지(항공 이외)',
    field: 'nonFlightMileage',
    colSpan: 1,
  };

  const updatedRows = rows.map((row : any) => {
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

  const createPeriodButton = (period: any, text: string, periodSelect: any) => {
    const isSelected = period === criteria;

    const buttonStyle = isSelected
      ? { backgroundColor: '#a2d2eb', color: '#000000', height: '50px' }
      : { backgroundColor: '#80badf', color: '#FFFFFF', height: '50px' };

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
        columns={updatedColumns}
        rows={updatedRows}
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
