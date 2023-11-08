import { Button, Modal, Stack, TextField } from '@components/ui';
import { pnrData, pnrTickerColumn } from './data';
import { useState, useRef } from 'react';
import AnalysisResult from './analysisResult';
import { AnalysisIndex } from './analysisIndex';
import Contact from './contact';
import PnrTicketNumber from './pnrTickectNumber';
import ProfileComp from './profile';
import Contribution from './contribution';
import Homepage from './homepage';
import { TableDataComp } from './tableDataComp';
import { Method, callApi } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { initApiRequest, initCommonResponse, initConfig } from '@/models/selfFeature/FeatureCommon';
import { cloneDeep } from 'lodash';
import { Profile } from '@/models/customer-info/CustomerInfo';

export default function List() {
  const [skypassNum, setSkypassNum] = useState('');
  const [oneId, setOneId] = useState('');
  const [passengerNm, setPassengerNm] = useState('');

  // 이런식으로 받아올 컴포넌트별로 state필요
  const [profile, setProfile] = useState<Profile>();
  const [searchInfo, setSearchInfo] = useState<any>({
    skypassNum: '',
    oneId: '',
    passengerNm: '',
  });

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
    if (skypassNum.trim() === '' || oneId.trim() === '' || passengerNm.trim() === '') {
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
    retrieveanalysisIndex();

    // 5초에 한번씩 api 호출(React.memo로 prop 변동 없을 시 rerendering x)
    // setInterval(retrieveanalysisIndex, 5000);
  }

  const retrieveanalysisIndex = async () => {
    let config = cloneDeep(initConfig);
    config.isLoarding = true;
    let request = cloneDeep(initApiRequest);
    request.method = Method.GET;
    request.url = '';
    request.service = Service.KAL_BE;
    request.params = {
      bodyParams: { skypass: skypassNum, oneId: oneId, passengerNm: passengerNm },
    };
    let response = cloneDeep(initCommonResponse);
    response = await callApi(request);
    console.log('[retrieve360] Response :: ', response);

    // setReadSql(cloneDeep(initReadSql))
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
                <Contribution skypassNum={skypassNum} oneId={oneId} passengerNm={passengerNm}></Contribution>
                <Homepage></Homepage>
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
          <AnalysisResult />
          <AnalysisIndex />
        </Stack>
      </Stack>
      <div style={{ marginBottom: 20 }}>
        <Contact></Contact>
      </div>
    </Stack>
  );
}
