import { Table, TBody } from "@components/ui";
import { HorizontalTableProps } from "@/models/components/Table";

const HorizontalTable = (props: HorizontalTableProps) => {
  return (
    <Table
      variant="horizontal"
      size="normal"
      align="center"
    >
      <TBody>
        {props.children}
      </TBody>
    </Table>
  )
}
export default HorizontalTable;