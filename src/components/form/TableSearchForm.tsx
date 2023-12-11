import { CreateNewFolderOutlinedIcon, DeleteOutlineOutlinedIcon } from '@/assets/icons';
import VerticalTable from '@/components/table/VerticalTable';
import { menuIconSx } from '@/models/common/Constants';
import { Button, Select, SelectOption, Stack, TextField, Typography } from '@components/ui';
import { useEffect, useState } from 'react';

export interface TableSearchFormProps {
  title?: string;
  columns?: Array<any>;
  rows?: Array<any>;
  enableIcon?: boolean;
  onClick?: Function;
}

const TableSearchForm = ({
  title = '',
  columns = [],
  rows = [],
  enableIcon = false,
  onClick,
}: TableSearchFormProps) => {
  const [searchInfoList, setSearchInfoList] = useState<Array<any>>([]);
  const [searchCondition, setSearchCondition] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [initRows, setInitRows] = useState<Array<any>>(rows);
  const [filterRows, setFileterRows] = useState<Array<any>>(rows);

  const handleSearch = () => {
    if (keyword) {
      if (searchCondition) {
        setFileterRows(initRows.filter((item: any) => item[searchCondition].includes(keyword)));
      } else {
        setFileterRows(initRows.filter((item: any) => Object.keys(item).some((key) => item[key].includes(keyword))));
      }
    } else {
      setFileterRows(initRows);
    }
  };

  const handleChangeKeyword = (e: any) => {
    setKeyword(e.target.value);
  };

  const handleSearchConditions = (value: any) => {
    setSearchCondition(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (columns.length > 0) {
      setSearchInfoList(
        columns.map((item) => ({
          key: item.field,
          value: item.headerName,
        }))
      );
    }
  }, [columns]);

  useEffect(() => {
    setInitRows(rows);
    setFileterRows(rows);
  }, [rows]);

  return (
    <Stack direction="Vertical" className="height-100 width-50">
      <Stack className="padding-5 primary-600">
        <Stack justifyContent="Center" className="width-100">
          <Typography variant="h3" className="white">{title}</Typography>
        </Stack>

        {enableIcon && (
          <Stack justifyContent="End">
            <DeleteOutlineOutlinedIcon sx={menuIconSx} />
            <CreateNewFolderOutlinedIcon sx={menuIconSx} />
          </Stack>
        )}
      </Stack>
      <Stack gap="XS" className="padding-10">
        <Select
          appearance="Outline"
          placeholder="전체"
          className="select-basic"
          onChange={(e, value) => value && handleSearchConditions(value)}
        >
          {searchInfoList.map((searchInfo) => (
            <SelectOption value={searchInfo.key}>{searchInfo.value}</SelectOption>
          ))}
        </Select>
        <TextField className="width-100" onChange={handleChangeKeyword} onKeyDown={handleKeyDown} />
        <Button priority="Normal" appearance="Contained" onClick={handleSearch}>
          검색
        </Button>
      </Stack>

      <section className="padding-10">
        <VerticalTable clickable={true} isMultiSelected={false} columns={columns} rows={filterRows} onClick={onClick} />
      </section>
    </Stack>
  );
};

export default TableSearchForm;
