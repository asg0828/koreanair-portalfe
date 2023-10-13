import { CommonProps } from '@/models/components/CommonProps';

export interface SearchFormProps extends CommonProps {
  onSearch?: Function,
  onClear?: Function,
}