import { Table, TBody } from "@components/ui";
import { HorizontalTableProps } from "@/models/components/Table";

const HorizontalTable: React.FC<HorizontalTableProps> = ({
  children
}) => {
  return (
    <Table
      variant="horizontal"
      size="normal"
      align="center"
    >
      <TBody>
        {children}
      </TBody>
    </Table>
  )
}
export default HorizontalTable;