import { CommonProps } from '@/models/components/CommonProps';
import { VerticalTableProps } from './Table';

export interface SearchFormProps extends CommonProps {
  onSearch?: Function,
  onClear?: Function,
}

export interface TableSearchFormProps extends VerticalTableProps {
}