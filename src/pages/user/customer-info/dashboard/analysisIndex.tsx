import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Stack, Accordion, AccordionItem, Typography } from '@components/ui';
import { analysisIndexList } from './data';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useQuery } from '@tanstack/react-query';
import { ParamObject } from '@utils/ApiUtil';
import React from 'react';

export const AnalysisIndex = React.memo((props: any) => {
  const uniqueId = useId();
  const analysisList = useSelector((state) => analysisIndexList);

  // useEffect(() => {
  //   // 공통 코드 API CALL && 초기 LIST 조회 API CALL
  //   retrieveanalysisIndex({});
  // }, []);

  // api 호출

  // const retrieveanalysisIndex = ({ queryParams, bodyParams }: ParamObject) => {
  //   return callApi({
  //     service: Service.KAL_BE,
  //     url: '',
  //     method: Method.GET,
  //     params: {
  //       queryParams,
  //       bodyParams,
  //     },
  //   });
  // };
  return (
    <div style={{ minHeight: 520, maxHeight: 520, overflowY: 'scroll' }}>
      <Stack direction="Vertical" wrap={true}>
        <h2>Anaylsis Index</h2>
        <Accordion align="Right" size="MD" type="multiple">
          {analysisList.map((analysis, index) => (
            <AccordionItem key={`${uniqueId}-analysis-${index}`} title={analysis.name} value={analysis.name}>
              <div
                style={{
                  background: '#f5f5f5',
                  padding: '1.5rem 1rem',
                }}
              >
                <Typography variant="body2">{analysis.content}</Typography>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </Stack>
    </div>
  );
});
