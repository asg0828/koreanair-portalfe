import {useNavigate, useRouteLoaderData} from "react-router-dom";
import {Button, Select, SelectOption, Stack, TD, TH, TR, useToast} from "@components/ui";
import {useAppSelector} from "@/hooks/useRedux";
import {selectSessionInfo} from "@reducers/authSlice";
import React, {useCallback, useEffect, useState} from "react";
import {FeatureModel, FeatureParams, FeatureSeparatesModel} from "@models/model/FeatureModel";
import {AnalysisIndexList, AnalysisResultData, CartData, Cnt, Column, ContributeData, FamilyMember, Ffp, HomepageData, PnrData, Preference, Profile, Skypass, VocData, Wallet,} from '@/models/model/CustomerInfoModel';
import {initPage, PageModel} from "@models/model/PageModel";
import {ColumnsInfo} from "@models/components/Table";
import {ValidType, View} from "@models/common/Constants";
import SearchForm from "@components/form/SearchForm";
import DataGrid from "@components/grid/DataGrid";
import {useFeatureList, useFeatureSeList} from "@/hooks/queries/useFeatureQueries";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import { dummyData } from "./testData";
import DashboardPopup from "./dashboardPopUp";
import Modal from "react-modal";

const initParams: FeatureParams = {
    featureSeGrp: '',
    featureSe: '',
    searchFeature: '',
    enrUserId: '',
    enrDeptCode: '',
    searchConditions: [],
};

const List = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const userId = useAppSelector(selectSessionInfo()).employeeNumber || '';
    const featureTypList = useRouteLoaderData('/biz-meta/feature') as Array<FeatureSeparatesModel>;
    const [selectedPeriod, setSelectedPeriod] = useState('1');
    const [dateRange, setDateRange] = useState('');

    const [showPopup, setShowPopup] = useState(false);

    const [params, setParams] = useState<FeatureParams>(initParams);
    const [page, setPage] = useState<PageModel>({
        ...initPage,
        totalCount: 110
    });

    const columns: Array<ColumnsInfo> = [
        {headerName: 'Rank', field: 'Rank', colSpan: 1.},
        {headerName: 'One ID', field: 'oneId', colSpan: 1.3},
        {headerName: '회원번호', field: 'memberNumber', colSpan: 1},
        {headerName: '이름', field: 'name', colSpan: 2},
        {headerName: 'VIP 회원 분류', field: 'vipYn', colSpan: 1},
        {headerName: '확약된 PNR수', field: 'confirmedPnrCount', colSpan: 1},
        {headerName: '국제선 탑승\n' + '예정일\n', field: 'scheduledIntlFlightDate', colSpan: 1},
        {headerName: '국제선 \n' +'최근 탑승일\n', field: 'lastIntlFlightDate', colSpan: 1},
    ];

    const [rows, setRows] = useState(dummyData.data.contents);
    const { data: response, isError, refetch } = useFeatureList(params, page);
    const { data: sResponse, isError: sIsError, refetch: sRefetch } = useFeatureSeList(params.featureSeGrp);

    const goToDetail = (index:any) => {
        setShowPopup(true);
    };
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
        if (name === 'featureSeGrp') {
            setSelectedPeriod(value);
        }
    };

    useEffect(() => {
        if (params.featureSeGrp) {
            sRefetch();
        }
    }, [params.featureSeGrp, sRefetch]);

    useDidMountEffect(() => {
        handleSearch();
    }, [page.page, page.pageSize, handleSearch]);

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
                        margin: 'auto' // 모달을 화면 중앙에 배치
                    }
                }}
            >
                <DashboardPopup />
            </Modal>
        </>
    );
};
export default List;