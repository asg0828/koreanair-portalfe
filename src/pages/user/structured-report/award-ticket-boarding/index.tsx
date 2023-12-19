import {useNavigate, useRouteLoaderData} from "react-router-dom";
import {Button, Select, SelectOption, Stack, TD, TH, TR, useToast} from "@components/ui";
import {useAppSelector} from "@/hooks/useRedux";
import {selectSessionInfo} from "@reducers/authSlice";
import React, {useCallback, useEffect, useState} from "react";
import {initPage, PageModel} from "@models/model/PageModel";
import {ColumnsInfo} from "@models/components/Table";
import {ValidType, View} from "@models/common/Constants";
import SearchForm from "@components/form/SearchForm";
import DataGrid from "@components/grid/DataGrid";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import {ReportParams} from "@models/model/ReportModel";
import {useDomesticBoardingTop100List} from "@/hooks/queries/useReportQueries";
import DashboardPopup from "@pages/user/structured-report/purchase-contributors/dashboardPopUp";
import Modal from "react-modal";

const initParams: ReportParams = {
    sortedColumn:'',
    sortedDirection:'',
    rank:0,
    oneId: '',
    skypassNm:0,
    userNm:'',
    vipType:''
};

const List = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const userId = useAppSelector(selectSessionInfo()).userId || '';
    const [selectedPeriod, setSelectedPeriod] = useState('0 year');
    const [dateRange, setDateRange] = useState('');

    const [params, setParams] = useState<ReportParams>(initParams);

    const [showPopup, setShowPopup] = useState(false);

    const [page, setPage] = useState<PageModel>({
        ...initPage,
        totalCount: 100
    });

    const createPeriodButton = (period:any, text:string, handlePeriodSelect:any) => {
        const isSelected = period === selectedPeriod;

        const buttonStyle = isSelected ? // 클릭할때 버튼 스타일
            { backgroundColor: '#a2d2eb', color: '#000000', height: '50px' } :
            { backgroundColor: '#5f9dcf', color: '#FFFFFF', height: '50px' };

        return (
            <Button
                priority="Primary"
                appearance="Contained"
                size="LG"
                style={buttonStyle}
                onClick={() => handlePeriodSelect(period)}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', marginBottom: '-5px' }}>{text}</span>
                    <span style={{ fontSize: 'smaller' }}>({calculateDateRange(period)})</span>
                </div>
            </Button>
        );
    };

    const periods = [
        { period: '0 year', text: '올해' },
        { period: '1 year', text: '최근 1년' },
        { period: '2 year', text: '최근 2년' },
        { period: '3 year', text: '최근 3년' },
        { period: '4 year', text: '최근 4년' },
    ];

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

    const [criteria, setCriteria] = useState('0 year');
    const [rows, setRows] = useState<any>([]);
    const { data: response, isError, refetch } = useDomesticBoardingTop100List(criteria);

    const toggleModal = () => {
        setShowPopup(!showPopup);
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
                startDate = new Date(endDate.getFullYear() , 0, 2);
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

    const handlePeriodSelect = (period: string) => {
        setCriteria(period);
        setSelectedPeriod(period);
        setDateRange(calculateDateRange(period));
    };

    const handlePage = (page: PageModel) => {
        setPage(page);
    };


    const handleSearch = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleClear = () => {
        setParams(initParams);
    };

    useEffect(() => {
        setDateRange(calculateDateRange(selectedPeriod)); // 선택된 기간에 따라 날짜 범위 계산
    }, [selectedPeriod]);

    useDidMountEffect(() => {
        handleSearch();
    }, [page.page, page.pageSize, handleSearch]);

    useEffect(() => {
        if (isError || response?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (response?.data) {
                setRows(response.data.contents);
            }
        }
    }, [response, isError, toast]);

    return (
        <>
            <SearchForm onSearch={handleSearch} onClear={handleClear} showClearButton={false} showSearchButton={false}>
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
                enableSort={true}
                clickable={true}
                showPageSizeSelect={false}
                showPagination={false}
                page={page}
                initialSortedColumn="boardingCount"
                onClick={toggleModal}
                onChange={handlePage}
            />
            <Modal
                isOpen={showPopup}
                onRequestClose={toggleModal}
                style={{
                    content: {
                        width: '1200px',
                        height:'800px',
                        margin: 'auto'
                    }
                }}
            >
                <DashboardPopup closeModal={toggleModal}/>
            </Modal>
        </>
    );
};
export default List;