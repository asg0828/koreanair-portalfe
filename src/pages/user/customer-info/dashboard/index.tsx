import { Stack } from '@components/ui';
import AnalysisResult from './analysisResult';
import AnalysisIndex from './analysisIndex';
import Contact from './contact';
import { pnrData, pnrTickerColumn } from './data';
import PnrTicketNumber from './pnrTickectNumber';
import Profile from './profile';
import SearchBar from './searchBar';
import Contribution from './contribution';
import Homepage from './homepage';
import TableDataComp from './tableDataComp';

export default function List() {
  return (
    <Stack direction="Vertical" gap="XL" justifyContent="Start" className={'width-100'} wrap={true}>
      <SearchBar></SearchBar>

      <Stack direction="Horizontal" gap="XL" justifyContent="Start" className={'width-100'} wrap={true}>
        <Stack direction="Horizontal">
          <Profile />
          <div style={{ marginLeft: '13px' }}>
            <Stack direction="Vertical">
              <Stack direction="Horizontal">
                <Contribution></Contribution>
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

      <Contact></Contact>
    </Stack>
  );
}
