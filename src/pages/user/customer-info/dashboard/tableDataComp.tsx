import VerticalTable from '@/components/table/VerticalTable';
import { Stack } from '@ke-design/components';

export default function TableDataComp(props: any) {
  const pnrTickerColumn = props.column;
  const pnrData = props.row;
  const flag = props.flag;
  return (
    <div
      style={{
        background: '#f5f5f5',
        padding: '1.5rem 1rem',
        width: '400px',
      }}
    >
      {flag === 'voc' && <h2>VOC</h2>}
      {flag === 'cart' && <h2>Cart</h2>}
      <VerticalTable columns={pnrTickerColumn} rows={pnrData} showHeader={true} />
    </div>
  );
}
