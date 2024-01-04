import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useNoticeList } from '@/hooks/queries/useNoticeQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ValidType, View } from '@/models/common/Constants';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { NoticeModel, NoticeParams } from '@/models/model/NoticeModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectContextPath } from '@/reducers/authSlice';
import { getDateString } from '@/utils/DateUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, Tag, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const initNoticeParams: NoticeParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const contextPath = useAppSelector(selectContextPath());
  const location = useLocation();
  const beforeParams: NoticeParams = location?.state?.params;
  const beforePage: PageModel = location?.state?.page;
  const [params, setParams] = useState(beforeParams || initNoticeParams);
  const [page, setPage] = useState<PageModel>(beforePage || initPage);
  const [rows, setRows] = useState<Array<NoticeModel>>([]);
  const { data: response, isError, refetch } = useNoticeList(params, page);

  const columns: Array<ColumnsInfo> = [
    { headerName: 'No', field: 'rownum', colSpan: 0.5 },
    {
      headerName: t('board:label.sj'),
      field: 'sj',
      colSpan: 7.5,
      align: 'left',
      render: (rowIndex: number) => {
        if (rows[rowIndex].importantYn === 'Y') {
          return (
            <Stack gap="MD">
              <Tag size="MD" shape="Round" variety="02" type="Strong" className="tag_point">
                {t('common.label.important')}
              </Tag>
              {rows[rowIndex].sj}
            </Stack>
          );
        }

        return rows[rowIndex].sj;
      },
    },
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
    navigate(`${View.DETAIL}?noticeId=${row.noticeId}`, {
      state: {
        params: params,
        page: page,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initNoticeParams);
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
        response.data.contents.forEach((item: NoticeModel) => {
          item.rgstDt = getDateString(item.rgstDt, '-');
          item.rgstNm = `${item.rgstDeptNm || ''} ${item.rgstNm || ''}`;
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
                <SelectOption value="all">{t('common.label.all')}</SelectOption>
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
          contextPath === ContextPath.ADMIN && (
            <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
              <AddIcon />
              {t('common.button.reg')}
            </Button>
          )
        }
      />
    </>
  );
};
export default List;
