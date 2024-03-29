import { Button, Modal, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { customerMetaInfoColumn, initTbCoMetaTblInfo } from './data';
import DataGridMeta from '@/components/grid/DataGridMeta';
import { useMetaTableDetail, useTableColumns } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { useLocation, useSearchParams } from 'react-router-dom';
import { TbCoMetaTbInfo } from '@/models/selfFeature/FeatureAdmModel';

const CustomerMetaManagementDetail = () => {
  const [queryParam] = useSearchParams()
  const [tbCoMetaTbInfo, setTbCoMetaTbInfo] = useState<TbCoMetaTbInfo>(initTbCoMetaTblInfo);
  const [searchInfo, setSearchInfo] = useState<any>({
    metaTblId: '',
    metaTblLogiNm: '',
    rtmTblYn: '',
  });
  const [rows, setRows] = useState<any>([]);
  const [metaTblId, setMetaTblId] = useState<string>(queryParam.get("metaTblId") || "")
  // 메타 테이블 컬럼 상세 조회(초기화면 용)
  const { data: response, isError, refetch: dtlRefetch } = useMetaTableDetail(metaTblId);
  
  const { toast } = useToast();
  const [isRefetch, setIsRefetch] = useState<number>(0);
  const [isOpen, setOpen] = useState(false);

  const research = () => {
    // confirm(alert x)
    setOpen(true);
  };
  // useEffect(() => {
  //   if (!location || !location.state) return;
  //   dtlRefetch();
  // }, [location]);

  useEffect(() => {
    if (metaTblId === "") {
      return
    }
    dtlRefetch();
  }, [metaTblId])
  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setTbCoMetaTbInfo({ ...searchInfo, [id]: value });
    setTbCoMetaTbInfo({ ...tbCoMetaTbInfo, [`${id}`]: value });
  }

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setTbCoMetaTbInfo({ ...tbCoMetaTbInfo, [`${id}`]: value });
  };

  useEffect(() => {
    //dtlRefetch();
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.result) {
        setRows(JSON.parse(JSON.stringify(response?.result.tbCoMetaTblClmnInfoList)));
        let tTemp = JSON.parse(JSON.stringify(response?.result.tbCoMetaTbInfo))
        setTbCoMetaTbInfo(tTemp);
        setSearchInfo({
          metaTblId: tTemp.metaTblId || '',
          metaTblLogiNm: tTemp.metaTblLogiNm || '',
          rtmTblYn: tTemp.rtmTblYn || '',
        })
      }
    }
  }, [response, isError, isRefetch, toast]);

  return (
    <Stack direction="Vertical">
      <SearchForm showSearchButton={false} showClearButton={false}>
        <HorizontalTable>
          <TR>
            <TH colSpan={0.11} align="right">
              데이터베이스명
            </TH>
            <TD colSpan={0.22}>
              <TextField
                disabled
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.dbNm}
                id="dbNm"
              />
            </TD>
            <TH colSpan={0.11} align="right">
              테이블 물리명
            </TH>
            <TD colSpan={0.22}>
              <TextField
                disabled
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.metaTblPhysNm}
                id="metaTblPhysNm"
              />
            </TD>
            <TH colSpan={0.11} align="right">
              테이블 논리명
            </TH>
            <TD colSpan={0.23}>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.metaTblLogiNm}
                id="metaTblLogiNm"
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={tbCoMetaTbInfo.rtmTblYn === 'Y' ? 0.199 : 0.123} align="right">
              테이블설명
            </TH>
            <TD>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.metaTblDesc}
                id="metaTblDesc"
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={0.11} align="right">
              메타테이블구분
            </TH>
            <TD colSpan={0.22}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={tbCoMetaTbInfo.metaTblDvCd}
                onChange={(e, value) => {
                  value && onchangeSelectHandler(e, value, 'metaTblDvCd');
                }}
              >
                <SelectOption value={'ATTR'}>속성</SelectOption>
                <SelectOption value={'BEHV'}>행동</SelectOption>
              </Select>
            </TD>
            <TH colSpan={0.11} align="right">
              사용여부
            </TH>
            <TD colSpan={0.22}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={tbCoMetaTbInfo.metaTblUseYn}
                onChange={(e, value) => {
                  value && onchangeSelectHandler(e, value, 'metaTblUseYn');
                }}
              >
                <SelectOption value={'Y'}>사용</SelectOption>
                <SelectOption value={'N'}>미사용</SelectOption>
              </Select>
            </TD>
            <TH colSpan={0.11} align="right">
              실시간여부
            </TH>
            <TD colSpan={0.23}>
              <Select
                style={{ width: '100%' }}
                id="rtmTblYn"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={tbCoMetaTbInfo.rtmTblYn}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'rtmTblYn');
                }}
              >
                <SelectOption value={'N'}>NO</SelectOption>
              </Select>
            </TD>
          </TR>
        </HorizontalTable>
      </SearchForm>

      <DataGridMeta
        props={searchInfo}
        list={tbCoMetaTbInfo}
        columns={customerMetaInfoColumn}
        rows={rows}
      ></DataGridMeta>

    </Stack>
  );
};

export default CustomerMetaManagementDetail;
