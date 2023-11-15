import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useFeatureList, useFeatureSeList } from '@/hooks/queries/useFeatureQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { ValidType, View } from '@/models/common/Constants';
import { FeatureModel, FeatureParams, FeatureSeparatesModel } from '@/models/model/FeatureModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { Button, Checkbox, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

const columns = [
  // <Button appearance="Unfilled" iconOnly priority="Normal" className="btn-fav on">
  //   <FavoriteIcon />
  // </Button>
  { headerName: '대구분', field: 'featureSeGrpNm', colSpan: 1 },
  { headerName: '중구분', field: 'featureSeNm', colSpan: 1 },
  { headerName: 'Feature 한글명', field: 'featureKoNm', colSpan: 1 },
  { headerName: 'Feature 영문명', field: 'featureEnNm', colSpan: 1 },
  { headerName: '정의', field: 'featureDef', colSpan: 2 },
  { headerName: 'Feature 신청자', field: 'enrUserNm', colSpan: 1 },
  { headerName: '신청부서', field: 'enrDeptNm', colSpan: 1 },
];

const initParams: FeatureParams = {
  featureSeGrp: '',
  featureSe: '',
  searchFeature: '',
  searchConditions: [],
  enrUserId: '',
  enrDeptCode: '',
};

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const featureTypList = useRouteLoaderData('/biz-meta/feature') as Array<FeatureSeparatesModel>;
  const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([]);
  const [params, setParams] = useState<FeatureParams>(initParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { data: response, isError, refetch } = useFeatureList(params, page);
  const { data: sResponse, isError: sIsError, refetch: sRefetch } = useFeatureSeList(params.featureSeGrp);

  const goToReg = () => {
    navigate(View.REG);
  };

  const goToDetail = (row: FeatureModel, index: number) => {
    navigate(View.DETAIL, {
      state: {
        featureId: row.featureId,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initParams);
    setFeatureSeList([]);
  };

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  const handleChangeParams = (name: string, value: any) => {
    setParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeSearchConditions = (name: string, checked: any) => {
    setParams((prevState) => {
      let newSearchConditions = [...prevState.searchConditions];

      if (checked) {
        newSearchConditions.push(name);
      } else {
        newSearchConditions = newSearchConditions.filter((itemName) => itemName !== name);
      }

      return {
        ...prevState,
        searchConditions: newSearchConditions,
      };
    });
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
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (sIsError || sResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (sResponse?.data) {
        setFeatureSeList(sResponse.data);
      }
    }
  }, [sResponse, sIsError, toast]);

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={handleClear}>
        <TR>
          <TH colSpan={1} align="right">
            대구분
          </TH>
          <TD colSpan={2}>
            <Select
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => handleChangeParams('featureSeGrp', value)}
              value={params.featureSeGrp}
            >
              {featureTypList.map((item) => (
                <SelectOption value={item.seId}>{item.seNm}</SelectOption>
              ))}
            </Select>
          </TD>
          <TH colSpan={1} align="right">
            중구분
          </TH>
          <TD colSpan={2}>
            <Select
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => handleChangeParams('featureSe', value)}
              value={params.featureSe}
            >
              {featureSeList.map((item) => (
                <SelectOption value={item.seId}>{item.seNm}</SelectOption>
              ))}
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            검색 Feature
          </TH>
          <TD colSpan={5.01} align="left">
            <TextField
              className="width-100"
              size="MD"
              onChange={(e) => handleChangeParams('searchFeature', e.target.value)}
              value={params.searchFeature}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            검색 조건
          </TH>
          <TD colSpan={5.01} align="left">
            <Checkbox
              label="Feature 한글명"
              onCheckedChange={(checked) => handleChangeSearchConditions('featureKoNm', checked)}
              checked={params.searchConditions.includes('featureKoNm')}
            />
            <Checkbox
              label="Feature 영문명"
              onCheckedChange={(checked) => handleChangeSearchConditions('featureEnNm', checked)}
              checked={params.searchConditions.includes('featureEnNm')}
            />
            <Checkbox
              label="정의"
              onCheckedChange={(checked) => handleChangeSearchConditions('featureDef', checked)}
              checked={params.searchConditions.includes('featureDef')}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            Feature 신청자
          </TH>
          <TD colSpan={2}>
            <Stack gap="SM" className="width-100">
              <TextField
                className="width-100"
                size="MD"
                onChange={(e) => handleChangeParams('enrUserId', e.target.value)}
                value={params.enrUserId}
              />
              <Button appearance="Contained" priority="Normal" shape="Square" size="MD">
                <span className="searchIcon"></span>
              </Button>
            </Stack>
          </TD>
          <TH colSpan={1} align="right">
            신청부서
          </TH>
          <TD colSpan={2}>
            <Stack gap="SM" className="width-100">
              <TextField
                className="width-100"
                size="MD"
                onChange={(e) => handleChangeParams('enrDeptCode', e.target.value)}
                value={params.enrDeptCode}
              />
              <Button appearance="Contained" priority="Normal" shape="Square" size="MD">
                <span className="searchIcon"></span>
              </Button>
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
        onClick={goToDetail}
        onChange={handlePage}
        rowSelection={() => {}}
        buttonChildren={
          <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
            <AddIcon />
            등록
          </Button>
        }
      />
    </>
  );
};
export default List;
