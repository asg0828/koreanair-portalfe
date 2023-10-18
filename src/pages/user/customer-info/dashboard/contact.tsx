import { Stack } from '@components/ui';
import VerticalTable from '@components/table/VerticalTable';
import { pnrData, pnrTickerColumn } from './data';

export default function Contact() {
  return (
    <Stack wrap={true}>
      <Stack direction="vertical" wrap={true}>
        <div style={{ width: 500, marginRight: 15 }}>
          <h2>Email</h2>
          <VerticalTable columns={pnrTickerColumn} rows={pnrData} showHeader={false} />
        </div>
      </Stack>
      <Stack direction="vertical" wrap={true}>
        <div style={{ width: 500, marginRight: 15 }}>
          <Stack direction="horizontal">
            <h2>SMS</h2>
          </Stack>
          <Stack>
            <VerticalTable columns={pnrTickerColumn} rows={pnrData} showHeader={false} />
          </Stack>
        </div>
      </Stack>
      <Stack direction="vertical" wrap={true}>
        <div style={{ width: 500 }}>
          <h2>PUSH</h2>
          <VerticalTable columns={pnrTickerColumn} rows={pnrData} showHeader={false} />
        </div>
      </Stack>
    </Stack>
  );
}
