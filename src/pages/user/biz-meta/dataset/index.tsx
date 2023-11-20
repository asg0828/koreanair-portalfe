import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useDatasetList } from '@/hooks/queries/useDatasetQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ValidType, View } from '@/models/common/Constants';
import { DatasetModel, DatasetParams } from '@/models/model/DatasetModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectCodeList } from '@/reducers/codeSlice';
import {
  Button,
  Checkbox,
  Select,
  SelectOption,
  Stack,
  TD,
  TH,
  TR,
  TextField,
  Typography,
  useToast,
} from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
  { headerName: '물리명', field: 'mtsEnNm', colSpan: 1 },
  { headerName: '논리명', field: 'mtsKoNm', colSpan: 1 },
  { headerName: '정의명', field: 'mtsDef', colSpan: 1 },
  { headerName: '원천테이블명', field: 'srcTbNm', colSpan: 1 },
  { headerName: 'DB명', field: 'srcDbCd', colSpan: 2 },
];

const initParams: DatasetParams = {
  searchTable: '',
  dataSetConditions: [],
  srcDbCd: '',
};

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const codeList = useAppSelector(selectCodeList(GroupCodeType.DBMS));
  const [params, setParams] = useState<DatasetParams>(initParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<DatasetModel>>([]);
  const { data: response, isError, refetch } = useDatasetList(params, page);

  const goToReg = () => {
    navigate(View.REG);
  };

  const goToDetail = (row: DatasetModel, index: number) => {
    navigate(View.DETAIL, {
      state: {
        mtsId: row.mtsId,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initParams);
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
      let newSearchConditions = [...prevState.dataSetConditions];

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

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={handleClear}>
        <TR>
          <TH colSpan={1} align="right">
            검색 테이블
          </TH>
          <TD colSpan={5} align="left">
            <TextField
              className="width-100"
              size="MD"
              onChange={(e) => handleChangeParams('searchTable', e.target.value)}
              value={params.searchTable}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            검색 조건
          </TH>
          <TD colSpan={5} align="left">
            <Checkbox
              label="테이블 한글명"
              onCheckedChange={(checked) => handleChangeSearchConditions('mtsKoNm', checked)}
              checked={params.dataSetConditions.includes('mtsKoNm')}
            />
            <Checkbox
              label="테이블 영문명"
              onCheckedChange={(checked) => handleChangeSearchConditions('mtsEnNm', checked)}
              checked={params.dataSetConditions.includes('mtsEnNm')}
            />
            <Checkbox
              label="테이블정의"
              onCheckedChange={(checked) => handleChangeSearchConditions('mtsDef', checked)}
              checked={params.dataSetConditions.includes('mtsDef')}
            />
            <Checkbox
              label="원천테이블명"
              onCheckedChange={(checked) => handleChangeSearchConditions('srcTbNm', checked)}
              checked={params.dataSetConditions.includes('srcTbNm')}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right"></TH>
          <TD colSpan={5} align="left">
            <Stack gap="LG" className="width-100">
              <Typography variant="body1">DB명</Typography>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="select-basic"
                onChange={(e, value) => handleChangeParams('srcDbCd', value)}
                value={params.srcDbCd}
              >
                {codeList.map((codeItem: any) => (
                  <SelectOption value={codeItem.codeId}>{codeItem.codeNm}</SelectOption>
                ))}
              </Select>
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
