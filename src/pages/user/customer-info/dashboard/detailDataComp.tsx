import { Stack, Typography } from '@components/ui';

export default function DetailData(props: any) {
  const data = props.init;
  const flag = props.compName;
  return (
    <div style={{ minWidth: '400px', minHeight: '170px' }}>
      <Stack direction="Vertical" wrap={true}>
        <div
          style={{
            background: '#f5f5f5',
            padding: '1.5rem 1rem',
            minHeight: '175px',
          }}
        >
          {flag === 'homepage' && <h2>Homepage</h2>}
          {flag === 'contribution' && <h2>Contribution</h2>}
          {flag === 'analysisResult' && <h2>AnalysisResult</h2>}
          {Object.keys(data).map((key, index) => (
            <Typography variant="body2" key={index}>
              {key} : {data[key]}
            </Typography>
          ))}
        </div>
      </Stack>
    </div>
  );
}
