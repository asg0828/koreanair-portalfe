import VerticalTable from '@/components/table/VerticalTable';
import { Button, Pagination, Stack } from '@ke-design/components';

import { Typography } from '@mui/material';
import HorizontalTable from '@/components/table/HorizontalTable';
import { onIdPaxData, oneIdPaxColumn } from '../../one-id-main/data';

export default function SamePnrUcild() {
  return (
    <div style={{ width: '1200px' }}>
      <div>
        <Stack>
          <HorizontalTable></HorizontalTable>
        </Stack>
        <div style={{ marginLeft: 1080 }}>
          <Stack>
            <Button>검색</Button>
            {/* <Button onClick={onClear}>초기화</Button> */}
          </Stack>
        </div>
      </div>
      <Typography variant="h6">조회 결과 {onIdPaxData.length}</Typography>
      <Stack>
        <VerticalTable enableSort={true} showHeader={true} columns={oneIdPaxColumn} rows={onIdPaxData} />
      </Stack>
      <Pagination />
    </div>
  );
}
