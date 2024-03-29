import { useCallback, useEffect, useState } from 'react';
import { oneIdSameColumn } from '../../one-id-main/data';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useSamePnr } from '@/hooks/queries/useOneIdQueries';
import { useToast } from '@ke-design/components';
import { OneIdSameData } from '@/models/oneId/OneIdInfo';
import useDidMountEffect from '@/hooks/useDidMountEffect';

export default function SamePnrUcild() {
  const { toast } = useToast();
  const [page, setPage] = useState<PageModel>(initPage);
  const { refetch, data: response, isError } = useSamePnr(page);
  const [row, setRows] = useState<Array<OneIdSameData>>([]);
  const handlePage = (nPage: PageModel) => {
    setPage(nPage);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [page]);

  useDidMountEffect(() => {
    handleSearch();
  }, [page.page, page.pageSize, handleSearch]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
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
      <DataGrid
        columns={oneIdSameColumn}
        rows={row}
        enableSort={false}
        clickable={true}
        page={page}
        onChange={handlePage}
      />
    </>
  );
}
