import DataGrid, { initPage } from '@/components/grid/DataGrid';
import { interestColumns as columns, interestRows as rows } from '@/utils/data/tableSampleData';
import { Button, } from '@components/ui';

const List = () => {
  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        enableSort={true}
        clickable={true}
        onChange={undefined}
        page={initPage}
        buttonChildren={
          <>
            {/* <Button size="LG">엑셀다운로드</Button> */}
            <Button priority="Primary" appearance="Contained" size="LG">관심 해제</Button>
          </>
        }
      />
    </>
  );
};
export default List;
