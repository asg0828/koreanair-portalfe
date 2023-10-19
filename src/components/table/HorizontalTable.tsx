import { ReactNode } from "react";
import { Table, TBody } from "@components/ui";

export interface HorizontalTableProps {
  children?: ReactNode;
  className?: string;
}

const HorizontalTable: React.FC<HorizontalTableProps> = ({
  children,
  className,
}) => {
  return (
    <Table
      variant="horizontal"
      size="normal"
      align="center"
      className={className ? className : ''}
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