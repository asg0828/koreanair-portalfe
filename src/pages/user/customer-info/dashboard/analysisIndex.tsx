import { useId } from 'react';
import { useSelector } from 'react-redux';
import { Stack, Accordion, AccordionItem, Typography } from '@components/ui';
import { analysisIndexList } from './data';

export default function AnalysisIndex() {
  const uniqueId = useId();
  const analysisList = useSelector((state) => analysisIndexList);

  return (
    <div style={{ maxHeight: 500, overflowY: 'scroll' }}>
      <Stack direction="Vertical" wrap={true}>
        <h1>Anaylsis Index</h1>
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
}
