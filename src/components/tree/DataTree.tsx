import {
  DescriptionOutlinedIcon,
  FolderOpenTwoToneIcon,
  FolderRoundedIcon,
  KeyboardArrowDownOutlinedIcon,
  KeyboardArrowRightOutlinedIcon,
} from '@/assets/icons';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { fileSx, folderSx } from '@/models/common/Constants';
import { CheckedState } from '@/models/common/Design';
import { Checkbox, Stack, Typography } from '@components/ui';
import { MoveHandler, NodeApi, NodeRendererProps, Tree } from 'react-arborist';
import './DataTree.scss';

export interface DataTreeProps {
  enableChecked?: boolean;
  enableDelete?: boolean;
  treeData?: Array<HierarchyInfo>;
  term?: string;
  onClick?: (item: HierarchyInfo, parentItem?: HierarchyInfo) => void;
  onMove?: MoveHandler<any>;
  onSearch?: (keyword: string) => void;
  treeHeight?: number;
}

const DataTree = ({
  enableChecked = false,
  enableDelete = false,
  treeData = [],
  term = '',
  onClick,
  onMove,
  treeHeight = 500,
}: DataTreeProps) => {
  // 폴더 펼치기, 접기
  const handleToggle = (node: any) => {
    node.toggle();
    onClick && onClick(node.data, node.parent.data);
  };

  // 드랍 시 아이콘에 겹쳐서(willReceiveDrop) 드랍하면 폴더로 간주, 아니면 파일로 간주
  const handleMove: MoveHandler<any> = (args) => {
    const { parentNode } = args;

    if (!parentNode?.data.willReceiveDrop && args.index === 0) {
      args.parentId = parentNode?.parent?.data.id;
      args.index = parentNode?.data.ordSeq + 1;
    }

    onMove && onMove(args);
  };

  // 노드 클릭
  const handleClick = (node: any, tree?: any) => {
    const isSelected = node.data.isSelected;
    selectChildrenRecursive(tree.root, false);
    node.data.isSelected = !isSelected;
    onClick && onClick(node.data, node.parent.data);
  };

  // 모든 트리 노드 선택 여부
  const selectChildrenRecursive = (node: NodeApi, isSelected: boolean) => {
    if (node.children) {
      node.children.forEach((n: any) => {
        n.data.isSelected = isSelected;
        selectChildrenRecursive(n, isSelected);
      });
    }
  };

  // 체크박스 클릭 핸들링 이벤트
  const handleCheck = (node: NodeApi, checked: CheckedState) => {
    node.data.isChecked = checked;
    checkParentRecursive(node);
    checkChildrenRecursive(node, checked);
    onClick && onClick(node.data, node.parent?.data);
  };

  // 부모 노드들 체크 여부 적용
  const checkParentRecursive = (node: NodeApi) => {
    if (node.parent) {
      node.parent.data.isChecked =
        node.parent.children && enableDelete
          ? node.parent.children.every((n: any) => n.data.isChecked)
          : node.parent.children?.some((n: any) => n.data.isChecked);
      checkParentRecursive(node.parent);
    }
  };

  // 자식 노드들 체크 여부 적용
  const checkChildrenRecursive = (node: NodeApi, checked: CheckedState) => {
    if (node.children) {
      node.children.forEach((n: any) => {
        n.data.isChecked = checked;
        checkChildrenRecursive(n, checked);
      });
    }
  };

  // 트리 필터
  const handleSearchMatch = (node: NodeApi, termStr: string) => {
    return node.data.name.toLowerCase().includes(termStr.toLowerCase());
  };

  // 노드 렌더링
  const NodeRenderer = ({ style, node, tree, dragHandle }: NodeRendererProps<any>) => {
    // 조건으로 컴포넌트 렌더링
    const content = [];
    // 체크 여부
    const isChecked = node.data.isChecked;
    // 선택 여부
    const isSelected = node.data.isSelected;
    // 파일 여부
    const isFile = node.children?.length === 0;
    // 드랍 시 대상 여부
    node.data.willReceiveDrop = node.willReceiveDrop;

    if (isFile) {
      content.push(
        <>
          {enableChecked && <Checkbox checked={isChecked} onCheckedChange={(checked) => handleCheck(node, checked)} />}
          <Stack className="width-100 hover" onClick={() => handleClick(node, tree)}>
            <DescriptionOutlinedIcon sx={fileSx} />
            <Typography variant="body1">{node.data.name}</Typography>
          </Stack>
        </>
      );
    } else {
      if (node.isOpen) {
        content.push(
          <>
            <KeyboardArrowDownOutlinedIcon onClick={() => handleToggle(node)} />
            {enableChecked && (
              <Checkbox checked={isChecked} onCheckedChange={(checked) => handleCheck(node, checked)} />
            )}
            <Stack className="width-100 hover" onClick={() => handleClick(node, tree)}>
              <FolderOpenTwoToneIcon sx={folderSx} />
              <Typography variant="body1">{node.data.name}</Typography>
            </Stack>
          </>
        );
      } else {
        content.push(
          <>
            <KeyboardArrowRightOutlinedIcon color="disabled" onClick={() => handleToggle(node)} />
            {enableChecked && (
              <Checkbox checked={isChecked} onCheckedChange={(checked) => handleCheck(node, checked)} />
            )}
            <Stack className="width-100 hover" onClick={() => handleClick(node, tree)}>
              <FolderRoundedIcon sx={folderSx} />
              <Typography variant="body1">{node.data.name}</Typography>
            </Stack>
          </>
        );
      }
    }

    return (
      <Stack
        key={node.data.id}
        id={node.data.id}
        className={`tree-item width-100 ${isSelected ? 'primary-200' : ''} ${isFile ? 'file' : ''}`}
        ref={dragHandle}
      >
        <Stack className="width-100" style={style}>
          {content}
        </Stack>
      </Stack>
    );
  };

  return (
    <section className="padding-10 width-100">
      <Tree
        width="100%"
        height={treeHeight}
        data={treeData}
        searchTerm={term}
        renderDragPreview={(dragPreviewProps) => null}
        onMove={handleMove}
        searchMatch={handleSearchMatch}
      >
        {NodeRenderer}
      </Tree>
    </section>
  );
};

export default DataTree;
