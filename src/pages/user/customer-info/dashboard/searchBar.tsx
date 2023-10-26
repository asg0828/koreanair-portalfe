import { Button, Modal, Stack, TextField } from '@components/ui';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function SearchBar() {
  const [skypassNum, setSkypassNum] = useState('');
  const [oneId, setOneId] = useState('');
  const [passengerNm, setPassengerNm] = useState('');
  const [isOpen, setOpen] = useState(false);
  const skypassNumId = useRef<any>(null);
  const oneIdId = useRef<any>(null);
  const passengerNmId = useRef<any>(null);
  const dispatch = useDispatch();

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

  // function focusing() {
  //   // 검색 조건 미입력 시 focus
  //   if (skypassNum === '' && skypassNumId.current !== null) {
  //     skypassNumId.current.firstElementChild.focus();
  //   } else if (oneId === '' && oneIdId.current !== null) {
  //     oneIdId.current.firstElementChild.focus();
  //   } else if (passengerNm === '' && passengerNmId.current !== null) {
  //     passengerNmId.current.firstElementChild.focus();
  //   }
  // }
  // axios(url, {
  //   method: "get",
  //   headers: {},
  //   data: {},
  // });
  function validation() {
    // 검색 조건 미입력 시 modal
    if (skypassNum.trim() === '' || oneId.trim() === '' || passengerNm.trim() === '') {
      setOpen(true);
    }
  }

  function searchButton() {
    // 검색 조건 유효성검사
    validation();

    // 인풋값 받아와서 api날려주는 함수 작성 예정
    const formData = new FormData();

    formData.append('skypassNum', skypassNum);
    formData.append('oneId', oneId);
    formData.append('passengerNm', passengerNm);

    // dispatch(
    //   callCustomerDataAPI({
    //     form: formData,
    //   })
    // );
  }

  return (
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
  );
}
