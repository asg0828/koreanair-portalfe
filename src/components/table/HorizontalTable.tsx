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
      className="height-100"
    >
      <TBody
        className="height-100"
      >
        {children}
      </TBody>
    </Table>
  )
}
export default HorizontalTable;