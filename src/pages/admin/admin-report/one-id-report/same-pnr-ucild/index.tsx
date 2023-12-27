import { useCallback, useEffect, useState } from 'react';
import { oneIdSameColumn, oneIdSameData } from '../../one-id-main/data';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useSamePnr } from '@/hooks/queries/useOneIdQueries';
import { useToast } from '@ke-design/components';
import { OneIdSameData } from '@/models/oneId/OneIdInfo';

export default function SamePnrUcild() {
  const { toast } = useToast();
  const [page, setPage] = useState<PageModel>(initPage);
  const [isChanged, setIsChanged] = useState(false);
  const { refetch, data: response, isError } = useSamePnr(page);
  const [row, setRows] = useState<Array<OneIdSameData>>([]);

  const handlePage = (page: PageModel) => {
    setPage(page);
    setIsChanged(true);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    isChanged && handleSearch();

    return () => {
      setIsChanged(false);
    };
  }, [isChanged, handleSearch]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        setRows(response.data.contents);
        setPage(response.data.pagination);
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
