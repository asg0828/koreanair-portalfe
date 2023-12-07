import {useNavigate, useRouteLoaderData} from "react-router-dom";
import {Button, Select, SelectOption, Stack, TD, TH, TR, useToast} from "@components/ui";
import {useAppSelector} from "@/hooks/useRedux";
import {selectSessionInfo} from "@reducers/authSlice";
import React, {useCallback, useEffect, useState} from "react";
import {initPage, PageModel} from "@models/model/PageModel";
import {ColumnsInfo} from "@models/components/Table";
import DataGrid from "@components/grid/DataGrid";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import { dummyData } from "./testData";
import DashboardPopup from "./dashboardPopUp";
import Modal from 'react-modal';
import {useVipList} from "@/hooks/queries/useReportQueries";
import {ReportParams} from "@models/model/ReportModel";
import {ValidType} from "@models/common/Constants";

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

    const [showPopup, setShowPopup] = useState(false);

    const [params, setParams] = useState<ReportParams>(initParams);
    const [page, setPage] = useState<PageModel>({
        ...initPage,
        totalCount: 100
    });

    const columns: Array<ColumnsInfo> = [
        {headerName: 'Rank', field: 'rank', colSpan: 1.},
        {headerName: 'One ID', field: 'oneId', colSpan: 1.3},
        {headerName: '회원번호', field: 'skypassNm', colSpan: 1},
        {headerName: '이름', field: 'userNm', colSpan: 1},
        {headerName: 'VIP 회원 분류', field: 'vipType', colSpan: 0.7},
        {headerName: '확약된 PNR수', field: 'confirmedPnrCount', colSpan: 0.7},
        {headerName: '국제선 탑승 예정일', field: 'scheduledIntlFlightDate', colSpan: 0.7},
        {headerName: '국제선 최근 탑승일', field: 'lastIntlFlightDate', colSpan: 0.7},
    ];

    const [rows, setRows] = useState<any>([]);
    const { data: response, isError, refetch } = useVipList(params);

    const toggleModal = () => {
        setShowPopup(!showPopup);
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


    const handleChangeParams = (name: string, value: any) => {
        setParams((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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
            <DataGrid
                columns={columns}
                rows={rows}
                enableSort={true}
                clickable={true}
                showPageSizeSelect={false}
                showPagination={false}
                initialSortedColumn="scheduledIntlFlightDate"
                page={page}
                onClick={toggleModal}
                onChange={handlePage}
            />
            <Modal
                isOpen={showPopup}
                onRequestClose={toggleModal}
                style={{
                    content: {
                        width: '1200px',
                        height: '800px',
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