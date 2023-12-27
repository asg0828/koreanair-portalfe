import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useQnaList } from '@/hooks/queries/useQnaQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { GroupCodeType, ValidType, View } from '@/models/common/Constants';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { PageModel, initPage } from '@/models/model/PageModel';
import { QnaModel, QnaParams } from '@/models/model/QnaModel';
import { getCode } from '@/reducers/codeSlice';
import { getDateString } from '@/utils/DateUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const initQnaParams: QnaParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const beforeParams: QnaParams = location?.state?.params;
  const beforePage: PageModel = location?.state?.page;
  const [params, setParams] = useState(beforeParams || initQnaParams);
  const [page, setPage] = useState<PageModel>(beforePage || initPage);
  const [rows, setRows] = useState<Array<QnaModel>>([]);
  const { data: response, isError, refetch } = useQnaList(params, page);

  const columns: Array<ColumnsInfo> = [
    { headerName: 'No', field: 'rownum', colSpan: 0.5 },
    { headerName: t('board:label.clCodeNm'), field: 'clCodeNm', colSpan: 1 },
    { headerName: t('board:label.sj'), field: 'sj', colSpan: 3, align: 'left' },
    { headerName: t('board:label.qnaStatNm'), field: 'qnaStatNm', colSpan: 1.5 },
    { headerName: t('board:label.rgstNm'), field: 'rgstNm', colSpan: 2 },
    { headerName: t('board:label.rgstDt'), field: 'rgstDt', colSpan: 1 },
    { headerName: t('board:label.viewCnt'), field: 'viewCnt', colSpan: 1 },
  ];

  const searchInfoList = [
    { key: 'sj', value: t('board:label.sj') },
    { key: 'cn', value: t('board:label.cn') },
  ];

  const goToReg = () => {
    navigate(View.REG, {
      state: {
        params: params,
        page: page,
      },
    });
  };

  const goToDetail = (row: RowsInfo) => {
    navigate(View.DETAIL, {
      state: {
        qnaId: row.qnaId,
        params: params,
        page: page,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initQnaParams);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangeParams = (name: string, value: any) => {
    setParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePage = (nPage: PageModel) => {
    setPage(nPage);
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
        response.data.contents.forEach((item: QnaModel) => {
          item.rgstNm = `${item.rgstDeptNm || ''} ${item.rgstNm || ''}`;
          item.rgstDt = getDateString(item.rgstDt, '-');
          item.useYn = item.useYn === 'Y' ? t('common.message.yes') : t('common.message.no');
          item.clCodeNm = getCode(GroupCodeType.QNA_TYPE, item.clCode)?.codeNm || '';
          item.qnaStatNm = getCode(GroupCodeType.QNA_STAT, item.qnaStat)?.codeNm || '';
        });
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
            {t('common.button.search')}
          </TH>
          <TD colSpan={5} align="left">
            <Stack gap="SM" className="width-100">
              <Select
                appearance="Outline"
                placeholder={t('common.placeholder.all')}
                className="select-basic"
                onChange={(e, value) => value && handleChangeParams('searchConditions', value || 'all')}
                value={params.searchConditions}
              >
                {searchInfoList.map((searchInfo) => (
                  <SelectOption value={searchInfo.key}>{searchInfo.value}</SelectOption>
                ))}
              </Select>
              <TextField
                className="width-100"
                onKeyDown={handleKeyDown}
                onChange={(e) => handleChangeParams('searchTable', e.target.value)}
                value={params.searchTable}
              />
            </Stack>
          </TD>
        </TR>
      </SearchForm>

      <DataGrid
        columns={columns}
        rows={rows}
        clickable={true}
        page={page}
        onClick={goToDetail}
        onChange={handlePage}
        buttonChildren={
          <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
            <AddIcon />
            {t('common.button.reg')}
          </Button>
        }
      />
    </>
  );
};
export default List;
