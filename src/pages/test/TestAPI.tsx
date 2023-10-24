import { useState } from 'react';
import { Stack, Loader, Button, TextField, Label, Typography } from '@components/ui';
import useTestQuery from '@/api/services/queries/useTestQuery';

const textareaStyle = {
  width: '500px',
  height: '300px',
}

const labelStyle = {
  width: '100px',
}

const textStyle = {
  width: '300px',
}

const TestAPI = () => {
  const [url, setUrl] = useState<String>(process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL)['KAL_BE'] : '');
  const [jsonString, setJsonString] = useState('');

  const getData = () => {
    refetch();
  };

  const changeUrl = (value: String) => {
    setUrl(value);
  };

  const changeParams = (value: any) => {
    setJsonString(value);
  };

  const createParams = () => {
    let result = {};
    
    try {
      result =  JSON.parse(jsonString);
    } catch {
    }

    return result;
  }

  const handleKeydown = (e: any) => {
    if (e.keyCode === 9) {
      e.target.setRangeText(
        '\t',
        e.target.selectionStart,
        e.target.selectionStart,
        'end'
      )

      e.preventDefault();
    }
  }

  const {
    isFetching: isGetLoading,
    isLoading,
    refetch,
    data,
  } = useTestQuery(createParams(), { suspense: false });

  return isGetLoading ? (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  ) : (
    <Stack direction="Vertical">
      <Stack direction="Vertical">
        <Label>API 테스트</Label>
        <Stack>
          <Label>URL</Label>
          <TextField style={textStyle} value={url} onChange={(e) => changeUrl(e.target.value)} />
        </Stack>
        <Stack direction="Vertical">
          <Typography>요청</Typography>
          <Stack>
            <Label style={labelStyle}>JSON params</Label>
            <textarea style={textareaStyle} onChange={(e) => changeParams(e.target.value)} onKeyDown={handleKeydown} />
            <Button onClick={getData}>요청</Button>
          </Stack>
        </Stack>
        <Stack direction="Vertical">
          <Typography>결과</Typography>
          <Stack className="width-100">
            <Label style={labelStyle}>data</Label>
            <textarea style={textareaStyle} value={JSON.stringify(data, null, 2)} onKeyDown={handleKeydown} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TestAPI;
