import {
  DescriptionOutlinedIcon,
  FolderOpenTwoToneIcon,
  FolderRoundedIcon,
  KeyboardArrowDownOutlinedIcon,
  KeyboardArrowRightOutlinedIcon,
} from '@/assets/icons';
import { CheckedState } from '@/models/common/Design';
import { Checkbox, Stack, Typography } from '@components/ui';
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';

const folderSx = {
  width: 30,
  color: 'rgb(250 200 1);',
};

const fileSx = {
  color: '#777777',
};

export interface DeptInfo {
  id: string;
  name: string;
  isChecked: boolean;
  children: Array<DeptInfo>;
}

export interface Props {
  isChecked?: boolean;
  data?: Array<DeptInfo>;
  onClickFile?: (deptItem: any) => void;
}

const DeptTree = ({ isChecked, data = [], onClickFile }: Props) => {
  const handleClickFile = (deptItem: any) => {
    onClickFile && onClickFile(deptItem);
  };

  const NodeRenderer = ({ style, node, tree, dragHandle, preview }: NodeRendererProps<any>) => {
    const content = [];

    if (node.children?.length === 0) {
      node.children = null;
    }

    if (node.isLeaf) {
      content.push(
        <>
          {isChecked && (
            <Checkbox checked={node.data.isChecked} onCheckedChange={(checked) => handleChecked(node, checked)} />
          )}
          <Stack className="width-100 hover" onClick={() => handleClickFile(node.data)}>
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
            {isChecked && (
              <Checkbox checked={node.data.isChecked} onCheckedChange={(checked) => handleChecked(node, checked)} />
            )}
            <Stack onClick={() => node.toggle()} className="width-100 hover">
              <FolderOpenTwoToneIcon sx={folderSx} />
              <Typography variant="body1">{node.data.name}</Typography>
            </Stack>
          </>
        );
      } else {
        content.push(
          <>
            <KeyboardArrowRightOutlinedIcon onClick={() => node.toggle()} color="disabled" />
            {isChecked && (
              <Checkbox checked={node.data.isChecked} onCheckedChange={(checked) => handleChecked(node, checked)} />
            )}
            <Stack onClick={() => node.toggle()} className="width-100 hover">
              <FolderRoundedIcon sx={folderSx} />
              <Typography variant="body1">{node.data.name}</Typography>
            </Stack>
          </>
        );
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
  };

  return (
    <section className="padding-10 width-100">
      <Tree data={data} width="100%">
        {NodeRenderer}
      </Tree>
    </section>
  );
};

export default DeptTree;
