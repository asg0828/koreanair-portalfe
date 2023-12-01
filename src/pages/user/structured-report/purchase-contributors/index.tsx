import {useNavigate, useRouteLoaderData} from "react-router-dom";
import {Button, Select, SelectOption, Stack, TD, TH, TR, useToast} from "@components/ui";
import {useAppSelector} from "@/hooks/useRedux";
import {selectSessionInfo} from "@reducers/authSlice";
import React, {useCallback, useEffect, useState} from "react";
import {initPage, PageModel} from "@models/model/PageModel";
import {ColumnsInfo} from "@models/components/Table";
import {View} from "@models/common/Constants";
import SearchForm from "@components/form/SearchForm";
import DataGrid from "@components/grid/DataGrid";
import { dummyData } from "./testData";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import {useFeatureList, useFeatureSeList} from "@/hooks/queries/useFeatureQueries";
import {FeatureParams} from "@models/model/FeatureModel";

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
    const [params, setParams] = useState<FeatureParams>(initParams);

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
        { period: '1', text: '올해' },
        { period: '2', text: '최근 1년' },
        { period: '3', text: '최근 2년' },
        { period: '4', text: '최근 3년' },
        { period: '5', text: '최근 4년' },
    ];

    const columns: Array<ColumnsInfo> = [
        {headerName: 'Rank', field: 'Rank', colSpan: 0.7},
        {headerName: 'One ID', field: 'oneId', colSpan: 1.3},
        {headerName: '회원번호', field: 'memberNumber', colSpan: 1},
        {headerName: '이름', field: 'name', colSpan: 2},
        {headerName: 'VIP 회원 분류', field: 'vipYn', colSpan: 1},
        {headerName: '구매금액', field: 'purchaseAmount', colSpan: 1},
        {headerName: '구매횟수', field: 'purchaseCount', colSpan: 1},
        {headerName: '국내선 구매금액', field: 'domesticAmount', colSpan: 1},
        {headerName: '국제선 구매금액', field: 'internationalAmount', colSpan: 1},
        {headerName: 'FR 구매횟수', field: 'FrCount', colSpan: 1},
        {headerName: 'PR 구매횟수', field: 'PrCount', colSpan: 1}
    ];

    const [rows, setRows] = useState(dummyData.data.contents);
    const { data: response, isError, refetch } = useFeatureList(params, page);
    const { data: sResponse, isError: sIsError, refetch: sRefetch } = useFeatureSeList(params.featureSeGrp);

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
        setSelectedPeriod(period);
        setDateRange(calculateDateRange(period));
    };

    const handlePage = (page: PageModel) => {
        setPage(page);
    };

    const handleSearch = useCallback(() => {
        refetch();
    }, [refetch]);

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
                showPageSizeSelect={false}
                showPagination={false}
                page={page}
                // onClick={goToDetail}
                onChange={handlePage}
            />
        </>
    );
};
export default List;