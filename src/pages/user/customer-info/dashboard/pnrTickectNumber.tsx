import { Stack, Tabs, TabList, Tab, TabContent } from '@components/ui';
import VerticalTable from '@components/table/VerticalTable';
import { pnrData, pnrTickerColumn } from './data';

export default function PnrTicketNumber() {
  return (
    <Stack direction="Vertical" wrap={true}>
      <div style={{ width: '800px' }}>
        <Tabs defaultValue="tab01">
          <TabList>
            <Tab value="tab01">PNR</Tab>
            <Tab value="tab02">Ticket Number</Tab>
          </TabList>
          <TabContent value="tab01">
            <Stack direction="Horizontal" gap="XL" justifyContent="Start" className={'width-100'}>
              <VerticalTable columns={pnrTickerColumn} rows={pnrData} showHeader={true} />
            </Stack>
          </TabContent>
          <TabContent value="tab02">탭 확인용</TabContent>
        </Tabs>
      </div>
    </Stack>
  );
}
