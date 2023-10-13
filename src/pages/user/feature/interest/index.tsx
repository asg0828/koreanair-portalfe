import DataGrid from '@/components/grid/DataGrid';
import { listColumns as columns, listRows as rows } from '@/utils/data/tableSampleData'

const List = () => {
  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        enableSort={true}
        clickable={true}
        onChange={undefined}
      />
    </>
  );
};
export default List;
