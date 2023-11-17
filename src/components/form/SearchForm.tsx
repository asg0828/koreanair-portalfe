import { CommonFormProps } from '@/models/components/Form';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack } from '@components/ui';

export interface SearchCommonFormProps extends CommonFormProps {}

const SearchForm: React.FC<SearchCommonFormProps> = ({ onSearch, onClear, children }) => {
  const handleSearch = () => {
    onSearch && onSearch();
  };

  const handleClear = () => {
    onClear && onClear();
  };

  return (
    <Stack direction="Vertical" gap="LG" className="width-100">
      <HorizontalTable>{children}</HorizontalTable>

      <Stack gap="SM" justifyContent="Center">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={handleSearch}>
          <span className="searchIcon"></span>
          검색
        </Button>
        <Button size="LG" onClick={handleClear}>
          초기화
        </Button>
      </Stack>
    </Stack>
  );
};
export default SearchForm;
