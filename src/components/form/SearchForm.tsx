import { CommonFormProps } from '@/models/components/Form';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack } from '@components/ui';

export interface SearchCommonFormProps extends CommonFormProps {}

const SearchForm: React.FC<SearchCommonFormProps> = ({ onSearch, onClear, children }) => {
  const handleSearch = (e: any) => {
    e.preventDefault();
    onSearch && onSearch();
  };

  const handleClear = () => {
    onClear && onClear();
  };

  return (
    <form onSubmit={handleSearch}>
      <Stack direction="Vertical" gap="MD">
        <HorizontalTable>{children}</HorizontalTable>

        <Stack gap="SM" justifyContent="Center">
          <Button priority="Primary" appearance="Contained" size="LG" type="submit">
            <span className="searchIcon"></span>
            검색
          </Button>
          <Button size="LG" onClick={handleClear}>
            초기화
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
export default SearchForm;
