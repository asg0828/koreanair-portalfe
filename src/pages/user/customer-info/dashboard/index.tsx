import { Button, Modal, Stack, TextField, useToast } from '@components/ui';
import { analysisResultData, contributeData, homepageData, pnrData, pnrTickerColumn } from './data';
import { useState, useRef, useCallback } from 'react';
import { AnalysisIndex } from './analysisIndex';
import Contact from './contact';
import PnrTicketNumber from './pnrTickectNumber';
import ProfileComp from './profile';
import { TableDataComp } from './tableDataComp';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';
import { Profile } from '@/models/customer-info/CustomerInfo';
import { PageModel, initPage } from '@/models/model/PageModel';
import { DetailDataComp } from './detailDataComp';
import { useSelector } from 'react-redux';
import { htmlTagReg } from '@/utils/RegularExpression';
import { useCustomerInfo } from '@/hooks/queries/useCustomerInfoQueires';

export default function List() {
  const [page, setPage] = useState<PageModel>(initPage);
  // 이런식으로 받아올 컴포넌트별로 state필요
  const [profile, setProfile] = useState<Profile>();
  const [rows, setRows] = useState<Array<any>>([]);
  const [searchInfo, setSearchInfo] = useState<any>({
    skypassNum: '',
    oneId: '',
    passengerNm: '',
  });
  const { skypassNum, oneId, passengerNm } = searchInfo;
  const { refetch, data: response, isError } = useCustomerInfo(searchInfo);
  const { toast } = useToast();

  // refetch
  const handleSearch = useCallback(() => {
    // 유효성 검사 실패 시 종료
    if (validation()) return;
    refetch();
    // setInterval(    refetch(), 5000);
  }, [refetch]);

  // 홈페이지 데이터(삭제 예정)
  const hmpData = useSelector((state) => homepageData);
  // contribute 데이터(삭제 예정)
  const ctrbuteData = useSelector((state) => contributeData);
  // analysisResult 데이터(삭제 예정)
  const analResultData = useSelector((state) => analysisResultData);

  const [isOpen, setOpen] = useState(false);
  const skypassNumId = useRef<any>(null);
  const oneIdId = useRef<any>(null);
  const passengerNmId = useRef<any>(null);

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  };

  function validation() {
    // 유효성검사 성공 여부 flag => 실패 시 api 요청 x
    let searchError = false;
    // 검색 조건 미입력 시 modal open
    if (
      skypassNum.replace(htmlTagReg, '').trim() === '' ||
      oneId.replace(htmlTagReg, '').trim() === '' ||
      passengerNm.replace(htmlTagReg, '').trim() === ''
    ) {
      setOpen(true);
      searchError = true;
    }
    console.log(searchError);
    return searchError;
  }

  return (
    <Stack direction="Vertical" gap="XL" justifyContent="Start" className={'width-100'} wrap={true}>
      {/* searchBar 영역 */}
      <Stack>
        <div className="componentWrapper" style={{ width: 495 }}>
          <TextField
            id="skypassNum"
            value={skypassNum}
            appearance="Outline"
            placeholder="Skypass Number"
            size="MD"
            textAlign="left"
            validation="Default"
            onChange={onchangeInputHandler}
            ref={skypassNumId}
            autoFocus
          />
        </div>
        <div className="componentWrapper" style={{ width: 495 }}>
          <TextField
            value={oneId}
            id="oneId"
            appearance="Outline"
            placeholder="One ID NO."
            size="MD"
            textAlign="left"
            validation="Default"
            onChange={onchangeInputHandler}
            ref={oneIdId}
          />
        </div>
        <div className="componentWrapper" style={{ width: 495 }}>
          <TextField
            value={passengerNm}
            id="passengerNm"
            appearance="Outline"
            placeholder="Passenger Name"
            size="MD"
            textAlign="left"
            validation="Default"
            onChange={onchangeInputHandler}
            ref={passengerNmId}
          />
        </div>
        <Button priority="Primary" appearance="Contained" size="MD" onClick={handleSearch}>
          검색
        </Button>
        <Modal open={isOpen} onClose={() => setOpen(false)}>
          <Modal.Header>오류</Modal.Header>
          <Modal.Body>검색 조건을 모두 입력해주세요</Modal.Body>
          <Modal.Footer>
            <Button
              priority="Primary"
              appearance="Contained"
              onClick={() => {
                setOpen(false);
              }}
            >
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </Stack>
      {/* searchBar 영역 */}

      <Stack direction="Horizontal" gap="XL" justifyContent="Start" className={'width-100'} wrap={true}>
        <Stack direction="Horizontal">
          <ProfileComp />
          <div style={{ marginLeft: '13px' }}>
            <Stack direction="Vertical">
              <Stack direction="Horizontal">
                <DetailDataComp init={hmpData} compName={'homepage'}></DetailDataComp>
                <DetailDataComp init={ctrbuteData} compName={'contribution'}></DetailDataComp>
              </Stack>
              <PnrTicketNumber></PnrTicketNumber>
              <Stack>
                <TableDataComp column={pnrTickerColumn} row={pnrData} flag={'voc'}></TableDataComp>
                <TableDataComp column={pnrTickerColumn} row={pnrData} flag={'cart'}></TableDataComp>
              </Stack>
            </Stack>
          </div>
        </Stack>
        <Stack direction="Vertical">
          <DetailDataComp init={analResultData} compName={'analysisResult'}></DetailDataComp>
          <AnalysisIndex />
        </Stack>
      </Stack>
      <div style={{ marginBottom: 20 }}>
        <Contact></Contact>
      </div>
    </Stack>
  );
}
