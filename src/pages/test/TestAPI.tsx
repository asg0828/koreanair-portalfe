import { useState, useEffect } from 'react';
import { Stack, Loader, Button, TextField, Label, Typography, Select, SelectOption, useToast } from '@components/ui';
import useTestQuery from '@/api/services/queries/useTestQuery';
import { ServicePort } from '@models/common/Service';
import { Service } from '@models/common/Service';
import { Method, ParamObject } from '@/utils/ApiUtil';

const textareaStyle = {
  width: '500px',
  height: '200px',
  padding: '5px',
};

const labelStyle = {
  width: '100px',
};

const textStyle = {
  width: '300px',
};

const TestAPI = () => {
  const apiUrl = process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL) : {};
  const [url, setUrl] = useState<string>(apiUrl['KAL_BE'] + ':' + ServicePort.KAL_BE.toString());
  const [method, setMethod] = useState<Method>(Method.GET);
  const [service, setService] = useState<Service>(Service.KAL_BE);
  const [params, setParams] = useState<string>('');
  const [newParams, setNewParams] = useState<ParamObject>({});
  const { toast } = useToast();

  const {
    isFetching: isGETLoading,
    isLoading,
    refetch,
    data,
  } = useTestQuery({
    service: service,
    url: url,
    method: method,
    params: newParams,
  });

  useEffect(() => {
    if (Object.keys(newParams).length > 0) {
      refetch();
    }
  }, [newParams]);

  const getData = () => {
    const newParams: ParamObject = {};
    let isError = false;

    if (method === 'GET') {
      try {
        newParams.queryParams = params ? JSON.parse(params) : params;
      } catch {
        isError = true;
      }
    } else {
      try {
        newParams.bodyParams = params ? JSON.parse(params) : params;
      } catch {
        isError = true;
      }
    }

    if (isError) {
      toast({
        type: 'Error',
        content: 'JSON 포맷 변환 중 에러가 발생했습니다.',
      });

      return;
    } else {
      setNewParams(newParams);
    }
  };

  const changeUrl = (value: string) => {
    setUrl(value);
  };

  const changeParams = (value: any) => {
    setParams(value);
  };

  const changeMethod = (value: any) => {
    setMethod(value);
  };

  const changeService = (value: any) => {
    setService(value);
  };

  const handleKeydown = (e: any) => {
    if (e.keyCode === 9) {
      e.target.setRangeText('\t', e.target.selectionStart, e.target.selectionStart, 'end');
      e.preventDefault();
    }
  };

  return isGETLoading ? (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  ) : (
    <Stack direction="Vertical">
      <Stack direction="Vertical">
        <Label>API 테스트</Label>
        <Stack>
          <Label style={labelStyle}>URL</Label>
          <TextField style={textStyle} value={url} onChange={(e) => changeUrl(e.target.value)} />
        </Stack>
        <Stack>
          <Label style={labelStyle}>서비스</Label>
          <Select
            appearance="Outline"
            placeholder="전체"
            className="select-basic"
            value={service}
            onChange={(e, value) => changeService(value)}
          >
            <SelectOption value={Service.KAL_BE}>{Service.KAL_BE}</SelectOption>
            <SelectOption value={Service.APIGEE_AUTH}>{Service.APIGEE_AUTH}</SelectOption>
          </Select>
        </Stack>
        <Stack direction="Vertical">
          <Typography>요청</Typography>
          <Stack>
            <Label style={labelStyle}>메소드</Label>
            <Select
              appearance="Outline"
              placeholder="전체"
              className="select-basic"
              value={method}
              onChange={(e, value) => changeMethod(value)}
            >
              <SelectOption value={Method.GET}>{Method.GET}</SelectOption>
              <SelectOption value={Method.POST}>{Method.POST}</SelectOption>
            </Select>
          </Stack>
          <Stack>
            <Label style={labelStyle}>JSON params</Label>
            <textarea
              style={textareaStyle}
              value={params}
              onChange={(e) => changeParams(e.target.value)}
              onKeyDown={handleKeydown}
            />
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
