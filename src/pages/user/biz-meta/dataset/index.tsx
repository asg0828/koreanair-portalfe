import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useDatasetList } from '@/hooks/queries/useDatasetQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppSelector } from '@/hooks/useRedux';
import { ContextPath, GroupCodeType, ValidType, View } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { DatasetModel, DatasetParams } from '@/models/model/DatasetModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectContextPath } from '@/reducers/authSlice';
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
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const initParams: DatasetParams = {
  searchTable: '',
  dataSetConditions: ['mtsKoNm', 'mtsEnNm', 'mtsDef', 'srcTbNm'],
  srcDbCd: '',
};

const List = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const location = useLocation();
  const beforeParams: DatasetParams = location?.state?.params;
  const beforePage: PageModel = location?.state?.page;
  const codeList = useAppSelector(selectCodeList(GroupCodeType.DBMS));
  const [params, setParams] = useState<DatasetParams>(beforeParams || initParams);
  const [page, setPage] = useState<PageModel>(beforePage || initPage);
  const [rows, setRows] = useState<Array<DatasetModel>>([]);
  const { data: response, isError, refetch } = useDatasetList(params, page);

  const columns: Array<ColumnsInfo> = [
    { headerName: t('bizMeta:label.tableKoNm'), field: 'mtsKoNm', colSpan: 2.5, align: 'left' },
    { headerName: t('bizMeta:label.tableEnNm'), field: 'mtsEnNm', colSpan: 2.5, align: 'left' },
    { headerName: t('bizMeta:label.tableDef'), field: 'mtsDef', colSpan: 2.5, align: 'left' },
    { headerName: t('bizMeta:label.srcTbNm'), field: 'srcTbNm', colSpan: 2.5, align: 'left' },
  ];

  const goToReg = () => {
    navigate(View.REG, {
      state: {
        params: params,
        page: page,
      },
    });
  };

  const goToDetail = (row: DatasetModel) => {
    navigate(View.DETAIL, {
      state: {
        mtsId: row.mtsId,
        params: params,
        page: page,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initParams);
  };

  const handlePage = (nPage: PageModel) => {
    setPage(nPage);
  };

  const handleChangeParams = (name: string, value: any) => {
    setParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeDataSetConditions = (name: string, checked: any) => {
    setParams((prevState) => {
      let newDataSetConditions = [...prevState.dataSetConditions];

      if (checked) {
        newDataSetConditions.push(name);
      } else {
        newDataSetConditions = newDataSetConditions.filter((itemName) => itemName !== name);
      }

      return {
        ...prevState,
        dataSetConditions: newDataSetConditions,
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
        content: t('common.toast.error.list'),
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
            {t('bizMeta:label.searchTable')}
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
            {t('bizMeta:label.searchCondition')}
          </TH>
          <TD colSpan={5} align="left">
            <Checkbox
              label={`${t('bizMeta:label.tableKoNm')}`}
              onCheckedChange={(checked) => handleChangeDataSetConditions('mtsKoNm', checked)}
              checked={params.dataSetConditions.includes('mtsKoNm')}
            />
            <Checkbox
              label={`${t('bizMeta:label.tableEnNm')}`}
              onCheckedChange={(checked) => handleChangeDataSetConditions('mtsEnNm', checked)}
              checked={params.dataSetConditions.includes('mtsEnNm')}
            />
            <Checkbox
              label={`${t('bizMeta:label.tableDef')}`}
              onCheckedChange={(checked) => handleChangeDataSetConditions('mtsDef', checked)}
              checked={params.dataSetConditions.includes('mtsDef')}
            />
            <Checkbox
              label={`${t('bizMeta:label.srcTbNm')}`}
              onCheckedChange={(checked) => handleChangeDataSetConditions('srcTbNm', checked)}
              checked={params.dataSetConditions.includes('srcTbNm')}
            />
            <Stack gap="LG" className="width-100">
              <Typography variant="body1">{t('bizMeta:label.dbNm')}</Typography>
              <Select
                appearance="Outline"
                placeholder={t('common.placeholder.all')}
                className="select-basic"
                onChange={(e, value) => value && handleChangeParams('srcDbCd', value)}
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
      <div className="innerDataGridWidth100">
        <DataGrid
          columns={columns}
          rows={rows}
          clickable={true}
          page={page}
          onClick={goToDetail}
          onChange={handlePage}
          buttonChildren={
            contextPath === ContextPath.ADMIN && (
              <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
                <AddIcon />
                {t('common.button.reg')}
              </Button>
            )
          }
        />
      </div>
    </>
  );
};
export default List;
