import VerticalTable from '../table/VerticalTable';
import { CommonFormProps } from '@/models/components/Form';
import { VerticalTableProps } from '../table/VerticalTable';
import { Stack, Select, SelectOption, Typography, Button, TextField } from '@components/ui';
import {
  DeleteOutlineOutlinedIcon,
  CreateNewFolderOutlinedIcon,
} from '@/assets/icons';

export interface TableSearchCommonFormProps extends CommonFormProps, VerticalTableProps {
}

const menuIconSx = {
  width: 30,
}

const TableSearchForm: React.FC<TableSearchCommonFormProps> = ({
  columns,
  rows,
}) => {
  return (
    <Stack direction="Vertical" className="height-100 width-50">
      <Stack className="padding-5 primary-300">
        <Stack justifyContent="Center" className="width-100">
        <Typography variant="h3">메뉴</Typography>
        </Stack>
        <Stack justifyContent="End">
          <DeleteOutlineOutlinedIcon sx={menuIconSx} />
          <CreateNewFolderOutlinedIcon sx={menuIconSx} />
        </Stack>
      </Stack>
      <Stack gap="XS" className="padding-10">
        <Select appearance="Outline" placeholder="전체" className="select-basic">
          <SelectOption value={1}>테스트</SelectOption>
        </Select>
        <TextField className="width-100"/>
        <Button priority="Normal" appearance="Contained">
          검색
        </Button>
      </Stack>

      <section className="padding-10">
        <VerticalTable
          columns={columns}
          rows={rows}
        />
      </section>
    </Stack>
  )
}

export default TableSearchForm;