import { CommonFormProps } from '@/models/components/Form';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack } from '@components/ui';
import { useTranslation } from 'react-i18next';

export interface SearchCommonFormProps extends CommonFormProps {
  showSearchButton?: boolean;
  showClearButton?: boolean;
}

const SearchForm: React.FC<SearchCommonFormProps> = ({
  onSearch,
  onClear,
  children,
  showSearchButton = true,
  showClearButton = true,
}) => {
  const { t } = useTranslation();

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
          {showSearchButton && (
            <Button priority="Primary" appearance="Contained" size="LG" type="submit">
              <span className="searchIcon"></span>
              {t('common.button.search')}
            </Button>
          )}
          {showClearButton && (
            <Button size="LG" onClick={handleClear}>
              {t('common.button.reset')}
            </Button>
          )}
        </Stack>
      </Stack>
    </form>
  );
};
export default SearchForm;
