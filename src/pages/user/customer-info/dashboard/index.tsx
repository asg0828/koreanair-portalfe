import { Button, Modal, Stack, TextField } from '@components/ui';
import { analysisResultData, contributeData, homepageData, pnrData, pnrTickerColumn } from './data';
import { useState, useRef } from 'react';

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
import { PageInfo, initPage } from '@/models/components/Page';

import { DetailDataComp } from './detailDataComp';
import { useSelector } from 'react-redux';
import { htmlTagReg } from '@/utils/RegularExpression';

export default function List() {
  const [skypassNum, setSkypassNum] = useState('');
  const [oneId, setOneId] = useState('');
  const [passengerNm, setPassengerNm] = useState('');
  const [page, setPage] = useState<PageInfo>(initPage);
  // 이런식으로 받아올 컴포넌트별로 state필요
  const [profile, setProfile] = useState<Profile>();
  const [rows, setRows] = useState<Array<any>>([]);
  const [searchInfo, setSearchInfo] = useState<any>({
    skypassNum: '',
    oneId: '',
    passengerNm: '',
  });

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

  const onSearchChangeHandler = (e: any, target: string) => {
    let currVal = e.target.value; // trim하면 공백이 입력이 안 되는데 사이에 focus하면 또 가능
    if (target === 'skypass') {
      setSkypassNum(currVal);
    } else if (target === 'oneId') {
      setOneId(currVal);
    } else if (target === 'passengerNm') {
      setPassengerNm(currVal);
    }
  };

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

    return searchError;
  }

  // 검색 버튼
  function searchButton() {
    // 유효성 검사 실패 시 종료
    if (validation()) return;

    // api 호출
    retrieveCdp();

    // 5초에 한번씩 api 호출(React.memo로 prop 변동 없을 시 rerendering x)
    // setInterval(retrieveCdp, 5000);
  }

  const retrieveCdp = async () => {
    let config = cloneDeep(initConfig);
    config.isLoarding = true;
    let request = cloneDeep(initApiRequest);
    request.method = Method.GET;
    request.url = '';
    request.service = Service.KAL_BE;
    request.params = {
      bodyParams: {
        skypass: skypassNum.replace(htmlTagReg, ''),
        oneId: oneId.replace(htmlTagReg, ''),
        passengerNm: passengerNm.replace(htmlTagReg, ''),
        page: page.page + 1,
        pageSize: page.pageSize,
      },
    };
    let response = cloneDeep(initCommonResponse);
    response = await callApi(request);
    setRows(response.data.contents);
    setPage(response.data.page);
    console.log('[retrieve360] Response :: ', response);
    console.log('[retrieve360] request :: ', request);
  };

  return (
    <Stack direction="Vertical" gap="XL" justifyContent="Start" className={'width-100'} wrap={true}>
      {/* searchBar 영역 */}
      <Stack>
        <div className="componentWrapper" style={{ width: 495 }}>
          <TextField
            value={skypassNum}
            appearance="Outline"
            placeholder="Skypass Number"
            size="MD"
            textAlign="left"
            validation="Default"
            onChange={(e) => onSearchChangeHandler(e, 'skypass')}
            ref={skypassNumId}
            autoFocus
          />
        </div>
        <div className="componentWrapper" style={{ width: 495 }}>
          <TextField
            value={oneId}
            appearance="Outline"
            placeholder="One ID NO."
            size="MD"
            textAlign="left"
            validation="Default"
            onChange={(e) => onSearchChangeHandler(e, 'oneId')}
            ref={oneIdId}
          />
        </div>
        <div className="componentWrapper" style={{ width: 495 }}>
          <TextField
            value={passengerNm}
            appearance="Outline"
            placeholder="Passenger Name"
            size="MD"
            textAlign="left"
            validation="Default"
            onChange={(e) => onSearchChangeHandler(e, 'passengerNm')}
            ref={passengerNmId}
          />
        </div>
        <Button priority="Primary" appearance="Contained" size="MD" onClick={searchButton}>
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
