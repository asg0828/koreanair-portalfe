import { ReactNode } from "react";
import { CommonProps } from "./CommonProps";

export interface EmptyStateProps extends CommonProps {
  type: "complete" | "error" | "warning",
  description?: string,
  buttonChildren?: ReactNode, 
}