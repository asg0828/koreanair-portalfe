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
    // const [params, setParams] = useState<ReportParams>(initParams);
    const [page, setPage] = useState<PageModel>(initPage);
    const columns: Array<ColumnsInfo> = [
        { headerName: 'Rank', field: 'featureSeGrpNm', colSpan: 1 },
        { headerName: 'One ID', field: 'featureSeNm', colSpan: 1 },
        { headerName: '회원번호', field: 'featureKoNm', colSpan: 1 },
        { headerName: '이름', field: 'featureEnNm', colSpan: 1 },
        { headerName: 'VIP 회원 분류', field: 'featureDef', colSpan: 2 },
        { headerName: '구매금액', field: 'enrUserNm', colSpan: 1 },
        { headerName: '구매횟수', field: 'enrDeptNm', colSpan: 1 },
        { headerName: '국내선 구매금액', field: 'enrDeptNm', colSpan: 1 },
        { headerName: '국제선 구매금액', field: 'enrDeptNm', colSpan: 1 },
        { headerName: 'FR 구매횟수', field: 'enrDeptNm', colSpan: 1 },
        { headerName: 'PR   구매횟수', field: 'enrDeptNm', colSpan: 1 },
    ];
    const [rows, setRows] = useState<Array<FeatureModel>>([]); // Feature -> 정형보고서 데이터로 수정
    const { data: response, isError, refetch } = useFeatureList(params, page);
    const { data: sResponse, isError: sIsError, refetch: sRefetch } = useFeatureSeList(params.featureSeGrp);

    const calculateDateRange = (period: string) => {
        const endDate = new Date();
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

    useEffect(() => {
        if (params.featureSeGrp) {
            sRefetch();
        }
    }, [params.featureSeGrp, sRefetch]);

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
                // setRows(response.data.contents);
            }
        }
    }, [response, isError, toast]);

    return (
        <>
            <SearchForm onSearch={handleSearch} onClear={handleClear} showClearButton={false} showSearchButton={false}>
                <TR>
                    <TH colSpan={1} align="left">
                        조회기준
                    </TH>
                    <TD colSpan={2} align="left">
                        <Select
                            appearance="Outline"
                            placeholder="1년"
                            className="width-25"
                            onChange={(e, value) => value && handleChangeParams('featureSeGrp', value)}
                            value={params.featureSeGrp}
                        >
                            {category.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                            ))}
                        </Select>
                        {dateRange}
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
                onClick={goToDetail}
                onChange={handlePage}
            />
        </>
    );
};
export default List;