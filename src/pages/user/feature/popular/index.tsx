import DataGrid, { initPage } from '@/components/grid/DataGrid';
import { popularColumns as columns, popularRows as rows } from '@/utils/data/tableSampleData';
import { Button, Tooltip } from '@components/ui';
import FavoriteIcon from '@mui/icons-material/Favorite';

const List = () => {
  return (
    <>
      {/* 관심 Feature 등록/해제?  */}
        {/* <Tooltip content="tooltip">
          <Button appearance="Unfilled">
            <FavoriteIcon />
          </Button>
        </Tooltip> */}
      <DataGrid
        columns={columns}
        rows={rows}
        enableSort={true}
        clickable={true}
        onChange={undefined}
        page={initPage}
      />
    </>
  );
};
export default List;
