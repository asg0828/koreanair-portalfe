import { CreateNewFolderOutlinedIcon, DeleteOutlineOutlinedIcon } from '@/assets/icons';
import DataTree from '@/components/Tree/DataTree';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { menuIconSx } from '@/models/common/Constants';
import { Button, Stack, TextField, Typography } from '@components/ui';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';
import { MoveHandler } from 'react-arborist';

export interface TreeSearchFormProps {
  treeData?: Array<HierarchyInfo>;
  enableIcon?: boolean;
  initItem?: any;
  onSearch?: Function;
  onCreate?: Function;
  onDelete?: Function;
  onClick?: (item: HierarchyInfo, parentItem?: HierarchyInfo) => void;
  onMove?: MoveHandler<any>;
  onCheck?: (item: HierarchyInfo, checked: CheckedState) => void;
}

const TreeSearchForm = ({
  treeData = [],
  enableIcon = false,
  initItem,
  onSearch,
  onCreate,
  onDelete,
  onClick,
  onMove,
}: TreeSearchFormProps) => {
  const [keyword, setKeyword] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [newTreeData, setNewTreeData] = useState<Array<HierarchyInfo>>(treeData);

  const handleSearch = () => {
    setTerm(keyword);
  };

  const handleCreate = () => {
    onCreate && onCreate();
  };

  const handleDelete = () => {
    onDelete && onDelete();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangeKeyword = (e: any) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    setNewTreeData(treeData);
  }, [treeData]);

  return (
    <Stack direction="Vertical" className="height-100 width-50">
      <Stack className="padding-5 primary-600">
        <Stack justifyContent="Center" className="width-100">
          <Typography variant="h3" className="white">
            메뉴
          </Typography>
        </Stack>

        {enableIcon && (
          <Stack justifyContent="End">
            <Stack onClick={handleDelete}>
              <DeleteOutlineOutlinedIcon sx={menuIconSx} />
            </Stack>
            <Stack onClick={handleCreate}>
              <CreateNewFolderOutlinedIcon sx={menuIconSx} />
            </Stack>
          </Stack>
        )}
      </Stack>
      <Stack gap="XS" className="padding-10">
        <TextField className="width-100" onChange={handleChangeKeyword} onKeyDown={handleKeyDown} />
        <Button priority="Normal" appearance="Contained" onClick={handleSearch}>
          검색
        </Button>
      </Stack>
      <DataTree
        enableChecked={true}
        enableDelete={enableIcon}
        treeData={newTreeData}
        term={term}
        onClick={onClick}
        onMove={onMove}
      />
    </Stack>
  );
};

export default TreeSearchForm;
