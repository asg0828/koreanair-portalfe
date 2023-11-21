import { Button, Stack, TD, TH, TR, TextField, useToast } from '@ke-design/components';
import { useCallback, useEffect, useState } from 'react';
import HorizontalTable from '@/components/table/HorizontalTable';
import { mobMasterColumn, mobMasterData, mobileColumn, mobileData } from '../data';
import { MobMasterData, MobileData, mobileMasterSearch, mobileSearch } from '@/models/oneId/OneIdInfo';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { useMobileMasterNumber, useMobileNumber } from '@/hooks/queries/useOneIdQueries';

//남은 작업: api 요청 후 반환 받은 데이터 인터페이스에 넣고 뿌려주기(2개)
export default function MobileNumber() {
  const { toast } = useToast();
  const [isChanged, setIsChanged] = useState(false);
  const [page, setPage] = useState<PageModel>(initPage);
  const [row, setRows] = useState<Array<MobileData>>([]);
  const [rowMaster, setRowMaster] = useState<Array<MobMasterData>>([]);
  const [searchInfo1, setSearchInfo] = useState<mobileSearch>({
    agtEstimatedMblfonNoInfo: '',
    agtEstMblfonNoInfoHshVlu: '',
  });
  const [searchInfo2, setSearchInfo2] = useState<mobileMasterSearch>({
    mobilePhoneNumberInfo: '',
  });

  const { refetch: refetch1, data: response1, isError: isError1 } = useMobileNumber(searchInfo1, page);
  const { refetch: refetch2, data: response2, isError: isError2 } = useMobileMasterNumber(searchInfo2, page);

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo1, [id]: value });
  }

  /* 검색 버튼 */
  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch1();
  };
  const handleSearch = useCallback(() => {
    refetch1();
    refetch2();
  }, [refetch1, refetch2]);

  const handlePage = (page: PageModel) => {
    setPage(page);
    setIsChanged(true);
  };
  /* 초기화 버튼 */
  function onClear() {
    setSearchInfo({ ...searchInfo1, agtEstimatedMblfonNoInfo: '', agtEstMblfonNoInfoHshVlu: '' });
  }

  // 행 클릭시 조회
  function searchMaster() {
    console.log('??');
    // 받아온 데이터를 넣기
  }
  useEffect(() => {
    isChanged && handleSearch();

    return () => {
      setIsChanged(false);
    };
  }, [isChanged, handleSearch]);

  useEffect(() => {
    if (isError1 || response1?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response1?.data) {
        // response.data.contents.forEach(() => {});
        setRows(response1.data.contents);
        setPage(response1.data.page);
      }
    }
  }, [response1, isError1, toast]);

  useEffect(() => {
    if (isError2 || response2?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response2?.data) {
        // response.data.contents.forEach(() => {});
        setRows(response2.data.contents);
        setPage(response2.data.page);
      }
    }
  }, [response2, isError2, toast]);

  return (
    <Stack direction="Vertical">
      <form onSubmit={onsubmitHandler}>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              OneId 번호
            </TH>
            <TD colSpan={2}>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                placeholder="검색어를 입력하세요."
                value={searchInfo1.agtEstimatedMblfonNoInfo}
                id="agtEstimatedMblfonNoInfo"
              />
            </TD>
            <TH colSpan={1} align="right">
              PNR 번호
            </TH>
            <TD colSpan={2}>
              <TextField
                className="width-100"
                placeholder="검색어를 입력하세요."
                id="agtEstMblfonNoInfoHshVlu"
                value={searchInfo1.agtEstMblfonNoInfoHshVlu}
                onChange={onSearchChangeHandler}
              />
            </TD>
          </TR>
        </HorizontalTable>
        <br></br>
        <Stack gap="SM" justifyContent="Center">
          <Button type="submit" priority="Primary" appearance="Contained" size="LG">
            <span className="searchIcon"></span>
            검색
          </Button>
          <Button onClick={onClear} type="reset" size="LG">
            초기화
          </Button>
        </Stack>
      </form>

      <DataGrid
        columns={mobileColumn}
        rows={mobileData}
        enableSort={true}
        clickable={true}
        onClick={searchMaster}
        page={page}
        onChange={handlePage}
      />
      <DataGrid
        columns={mobMasterColumn}
        //rows = {row}
        rows={mobMasterData}
        enableSort={true}
        clickable={true}
        page={page}
        onChange={handlePage}
      />
    </Stack>
  );
}
