import { Tree, NodeRendererProps, NodeApi } from 'react-arborist';
import { Stack, Checkbox, Select, SelectOption, Typography, Button, TextField } from '@components/ui';
import { CheckedState } from '@/models/common/Design';
import {
  DescriptionOutlinedIcon,
  FolderOpenTwoToneIcon,
  FolderRoundedIcon,
  DeleteOutlineOutlinedIcon,
  CreateNewFolderOutlinedIcon,
  KeyboardArrowRightOutlinedIcon,
  KeyboardArrowDownOutlinedIcon,
} from '@/assets/icons';

const data = [
  {
    id: '1',
    name: '대한항공',
    isChecked: false,
    children: [
      { id: 'c1', name: '디자인팀' },
      { id: 'c2', name: '인프라팀' },
      { id: 'c3', name: '개발팀' },
      {
        id: 'c4',
        name: 'LG CNS',
        isChecked: false,
        children: [
          { id: 'd1', name: 'A-1팀' },
          { id: 'd2', name: 'A-2팀' },
          { id: 'd3', name: 'A-3팀' },
        ],
      },
      {
        id: 'c5',
        name: '케이비시스',
        isChecked: false,
        children: [
          { id: 'e1', name: 'B-1팀' },
          { id: 'e2', name: 'B-2팀' },
          { id: 'e3', name: 'B-3팀' },
        ],
      },
      {
        id: 'c6',
        name: '기타',
        isChecked: false,
        children: [
          { id: 'f1', name: 'C-1팀' },
          { id: 'f2', name: 'C-2팀' },
          { id: 'f3', name: 'C-3팀' },
        ],
      },
    ],
  },
];

const folderSx = {
  width: 30,
  color: 'rgb(250 200 1);',
};

const fileSx = {
  color: '#777777',
};

const menuIconSx = {
  width: 30,
};

const TreeMenuForm = () => {
  const NodeRenderer = ({ style, node, tree, dragHandle, preview }: NodeRendererProps<any>) => {
    const content = [];
    
    if (node.isLeaf) {
      content.push(
        <>
          <Checkbox checked={node.data.isChecked} onCheckedChange={(checked) => handleChecked(node, checked)} />
          <Stack className="width-100 hover">
            <DescriptionOutlinedIcon sx={fileSx} />
            <Typography variant="body1">{node.data.name}</Typography>
          </Stack>
        </>
      );
    } else {
      if (node.isOpen) {
        content.push(
          <>
            <KeyboardArrowDownOutlinedIcon onClick={() => node.toggle()} />
            <Checkbox checked={node.data.isChecked} onCheckedChange={(checked) => handleChecked(node, checked)} />
            <Stack onClick={() => node.toggle()} className="width-100 hover">
              <FolderOpenTwoToneIcon sx={folderSx} />
              <Typography variant="body1">{node.data.name}</Typography>
            </Stack>
          </>
        )
      } else {
        content.push(
          <>
            <KeyboardArrowRightOutlinedIcon onClick={() => node.toggle()} color="disabled" />
            <Checkbox checked={node.data.isChecked} onCheckedChange={(checked) => handleChecked(node, checked)} />
            <Stack onClick={() => node.toggle()} className="width-100 hover">
              <FolderRoundedIcon sx={folderSx} />
              <Typography variant="body1">{node.data.name}</Typography>
            </Stack>
          </>
        )
      }
    }

    return (
      <Stack style={style} ref={dragHandle}>
        {content}
      </Stack>
    );
  };

  const handleChecked = (node: NodeApi, checked: CheckedState) => {
    node.data.isChecked = checked;

    if (node.parent) {
      node.parent.data.isChecked = node.parent.children && node.parent.children.every((n: any) => n.data.isChecked);
    }

    checkedChilrenRecursive(node, checked);
  };

  const checkedChilrenRecursive = (node: NodeApi, checked: CheckedState) => {
    if (node.children) {
      node.children.forEach((n: any) => {
        n.data.isChecked = checked;
        checkedChilrenRecursive(n, checked);
      });
    }
  }

  return (
    <Stack direction="Vertical" className="height-100 width-50">
      <Stack className="padding-5 primary-300">
        <Stack justifyContent="Center" className="width-100">
          <Typography variant="h3">메뉴</Typography>
        </Stack>
        <Stack justifyContent="End">
          <DeleteOutlineOutlinedIcon sx={menuIconSx} />
          <CreateNewFolderOutlinedIcon sx={menuIconSx} />
        </Stack>
      </Stack>
      <Stack gap="XS" className="padding-10">
        <Select appearance="Outline" placeholder="전체" className="select-basic">
          <SelectOption value={1}>테스트</SelectOption>
        </Select>
        <TextField className="width-100" />
        <Button priority="Normal" appearance="Contained">
          검색
        </Button>
      </Stack>

      <section className="padding-10">
        <Tree
          initialData={data}
          width="100%"
        >
          {NodeRenderer}
        </Tree>
      </section>
    </Stack>
  );
};

export default TreeMenuForm;
