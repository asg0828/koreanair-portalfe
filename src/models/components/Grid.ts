import { ReactNode } from 'react';
import { VerticalTableProps } from './Table';
import { PageProps } from './Page';

export interface DatagridProps extends VerticalTableProps, PageProps {
  totalCount?: number,
  buttonChildren?: ReactNode,
}