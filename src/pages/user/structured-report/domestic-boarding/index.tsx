import {useNavigate, useRouteLoaderData} from "react-router-dom";
import {Button, Select, SelectOption, Stack, TD, TH, TR, useToast} from "@components/ui";
import {useAppSelector} from "@/hooks/useRedux";
import {selectSessionInfo} from "@reducers/authSlice";
import React, {useCallback, useEffect, useState} from "react";
import {FeatureModel, FeatureParams, FeatureSeparatesModel} from "@models/model/FeatureModel";
import {initPage, PageModel} from "@models/model/PageModel";
import {ColumnsInfo} from "@models/components/Table";
import {ValidType, View} from "@models/common/Constants";
import SearchForm from "@components/form/SearchForm";
import DataGrid from "@components/grid/DataGrid";
import {useFeatureList, useFeatureSeList} from "@/hooks/queries/useFeatureQueries";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import {ReportParams} from "@models/model/ReportModel";
import {category} from "./data";
import { dummyData } from "./testData";

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
    const userId = useAppSelector(selectSessionInfo()).userId || '';
    const featureTypList = useRouteLoaderData('/biz-meta/feature') as Array<FeatureSeparatesModel>;
    const [selectedPeriod, setSelectedPeriod] = useState('1');
    const [dateRange, setDateRange] = useState('');

    const [params, setParams] = useState<FeatureParams>(initParams);
    const [page, setPage] = useState<PageModel>({
        ...initPage,
        totalCount: 100
    });

    const createPeriodButton = (period:any, text:string, handlePeriodSelect:any) => (
        <Button priority="Primary" appearance="Contained" size="LG" style ={{color: '#FFFFFF',backgroundColor:'#5F9DCF',height:'50px'}} onClick={() => handlePeriodSelect(period)}>
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
        { headerName: 'Rank', field: 'Rank', colSpan: 1. },
        { headerName: 'One ID', field: 'oneId', colSpan: 1.3 },
        { headerName: '회원번호', field: 'memberNumber', colSpan: 1 },
        { headerName: '이름', field: 'name', colSpan: 2 },
        { headerName: 'VIP 회원 분류', field: 'vipYn', colSpan: 1 },
        { headerName: '국내선\n' + '수익금액\n', field: 'income', colSpan: 1 },
        { headerName: '국내선\n' + '탑승횟수\n', field: 'boardingCount', colSpan: 1 },
        { headerName: '국내선\n' + '구매금액', field: 'purchaseAmount', colSpan: 1 },
        { headerName: '국내선 보너스\n' +'항공권 탑승횟수', field: 'bonusBoardingCount', colSpan: 1 },
        { headerName: '국내선 PR 탑승횟수', field: 'PrCount', colSpan: 1 },
        { headerName: '국내선 평균 탑승주기', field: 'avgBoardingCycle', colSpan: 1 },
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

    const goToDetail = (row: FeatureModel, index: number) => {
        navigate(View.DETAIL, {
            state: {
                featureId: row.featureId,
            },
        });
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

    const handleChangeParams = (name: string, value: any) => {
        setParams((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (name === 'featureSeGrp') {
            setSelectedPeriod(value);
        }
    };

    const handlePeriodSelect = (period: string) => {
        setSelectedPeriod(period);
        setDateRange(calculateDateRange(period));
    };

    useEffect(() => {
        if (params.featureSeGrp) {
            sRefetch();
        }
    }, [params.featureSeGrp, sRefetch]);

    useDidMountEffect(() => {
        handleSearch();
    }, [page.page, page.pageSize, handleSearch]);

    // useEffect(() => {
    //     if (isError || response?.successOrNot === 'N') {
    //         toast({
    //             type: ValidType.ERROR,
    //             content: '조회 중 에러가 발생했습니다.',
    //         });
    //     } else {
    //         if (response?.data) {
    //             setRows(response.data.contents);
    //         }
    //     }
    // }, [response, isError, toast]);

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
                // onClick={goToDetail}
                onChange={handlePage}
            />
        </>
    );
};
export default List;