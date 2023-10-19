import { ReactNode } from "react";
import { Table, TBody } from "@components/ui";

export interface HorizontalTableProps {
  children?: ReactNode;
}

const HorizontalTable: React.FC<HorizontalTableProps> = ({
  children
}) => {
  return (
    <Table
      variant="horizontal"
      size="normal"
      align="center"
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