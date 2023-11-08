import { CommonFormProps } from '@/models/components/Form';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack } from '@components/ui';

export interface SearchCommonFormProps extends CommonFormProps {}

export type SearchKey = 'sj' | 'cn';

export type SearchValue = '제목' | '내용';

export type SearchInfo = {
  key: SearchKey;
  value: SearchValue;
};

export const searchInfoList: SearchInfo[] = [
  { key: 'sj', value: '제목' },
  { key: 'cn', value: '내용' },
];

const SearchForm: React.FC<SearchCommonFormProps> = ({ onSearch, onClear, children }) => {
  const handleSearch = () => {
    onSearch && onSearch();
  };

  const handleClear = () => {
    onClear && onClear();
  };

  return (
    <Stack direction="Vertical" gap="MD">
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
