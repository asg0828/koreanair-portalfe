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
import { dummyData } from "./testData";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import DashboardPopup from "./dashboardPopUp";
import Modal from 'react-modal';
import {ReportParams} from "@models/model/ReportModel";
import {usePurchaseContributionList} from "@/hooks/queries/useReportQueries";

const initParams: ReportParams = {
    oneId: '',
    memberNumber:0,
    name:'',
    vipYn:'',
    purchaseAmount:0,
    purchaseCount:0,
    purchaseContribution:0,
    domesticPurchaseAmount:0,
    internationalAmount:0,
    FrCount:0,
    PrCount:0
};

const List = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const userId = useAppSelector(selectSessionInfo()).userId || '';
    const [selectedPeriod, setSelectedPeriod] = useState('1');
    const [dateRange, setDateRange] = useState('');
    const [params, setParams] = useState<ReportParams>(initParams);

    const [showPopup, setShowPopup] = useState(false);

    const [page, setPage] = useState<PageModel>({
        ...initPage,
        totalCount: 100
    });

    const createPeriodButton = (period:any, text:string, handlePeriodSelect:any) => (
        <Button priority="Primary" appearance="Contained" size="LG" style ={{height:'50px'}} onClick={() => handlePeriodSelect(period)}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' ,marginBottom: '-5px' }}>{text}</span>
                <span style={{ fontSize: 'smaller' }}>({calculateDateRange(period)})</span>
            </div>
        </Button>
    );

    const periods = [
        { period: '0 year', text: '올해' },
        { period: '1 year', text: '최근 1년' },
        { period: '2 year', text: '최근 2년' },
        { period: '3 year', text: '최근 3년' },
        { period: '4 year', text: '최근 4년' },
    ];

    const columns: Array<ColumnsInfo> = [
        {headerName: 'Rank', field: 'rank', colSpan: 0.7},
        {headerName: 'One ID', field: 'oneId', colSpan: 1.3},
        {headerName: '회원번호', field: 'skypassNm', colSpan: 1},
        {headerName: '이름', field: 'userNm', colSpan: 2},
        {headerName: 'VIP 회원 분류', field: 'vipType', colSpan: 1},
        {headerName: '구매금액', field: 'purchaseAmount', colSpan: 1},
        {headerName: '구매횟수', field: 'purchaseCount', colSpan: 1},
        {headerName: '국내선 구매금액', field: 'domesticPurchaseAmount', colSpan: 1},
        {headerName: '국제선 구매금액', field: 'intlPurchaseAmount', colSpan: 1},
        {headerName: 'FR 구매횟수', field: 'frCount', colSpan: 1},
        {headerName: 'PR 구매횟수', field: 'prCount', colSpan: 1}
    ];

    const [criteria, setCriteria] = useState('0 year');
    const [rows, setRows] = useState<any>([]);
    const { data: response, isError, refetch } = usePurchaseContributionList(criteria);


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
            case '1':
                startDate = new Date(endDate.getFullYear() , 0, 2);
                break;
            case '2':
                startDate = new Date(endDate.getFullYear() - 1, 0, 2);
                break;
            case '3':
                startDate = new Date(endDate.getFullYear() - 2, 0, 2);
                break;
            case '4':
                startDate = new Date(endDate.getFullYear() - 3, 0, 2);
                break;
            case '5':
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
                enableSort={true}
                clickable={true}
                page={page}
                initialSortedColumn="purchaseAmount"
                showPageSizeSelect={false}
                showPagination={false}
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