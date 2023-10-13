import HorizontalTable from '@components/table/HorizontalTable';
import { SearchFormProps } from '@/models/components/Form';
import {
  Button,
  Stack,
} from '@components/ui';

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  onClear,
  children
}) => {
  const handleSearch = () => {
    onSearch && onSearch();
  }

  const handleClear = () => {
    onClear && onClear();
  }

  return (
    <Stack direction="Vertical" gap="MD">
      <HorizontalTable>
        {children}
      </HorizontalTable>

      <Stack gap="SM" justifyContent="Center">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={handleSearch}>
          검색
        </Button>
        <Button size="LG" onClick={handleClear}>초기화</Button>
      </Stack>
    </Stack>
  );
};
export default SearchForm;
