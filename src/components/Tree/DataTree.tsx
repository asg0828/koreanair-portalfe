import {
  DescriptionOutlinedIcon,
  FolderOpenTwoToneIcon,
  FolderRoundedIcon,
  KeyboardArrowDownOutlinedIcon,
  KeyboardArrowRightOutlinedIcon,
} from '@/assets/icons';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { CheckedState } from '@/models/common/Design';
import { Checkbox, Stack, Typography } from '@components/ui';
import { MoveHandler, NodeApi, NodeRendererProps, Tree } from 'react-arborist';

const folderSx = {
  width: 30,
  color: 'rgb(250 200 1);',
};

const fileSx = {
  color: '#777777',
};

export interface DataTreeProps {
  enableChecked?: boolean;
  treeData?: Array<HierarchyInfo>;
  term?: string;
  onClick?: (item: HierarchyInfo, parentItem?: HierarchyInfo) => void;
  onMove?: MoveHandler<any>;
  onSearch?: (keyword: string) => void;
}

const DataTree = ({ enableChecked = false, treeData = [], term = '', onClick, onMove }: DataTreeProps) => {
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
    selectChildrenRecursive(tree.root, false);
    node.data.isSelected = true;
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
      node.parent.data.isChecked = node.parent.children && node.parent.children.every((n: any) => n.data.isChecked);
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

  // 선택한 트리가 있는지 체크
  const checkHasSelected = (node: NodeApi): boolean => {
    if (node.children) {
      return node.data.isSelected || node.children.some((n: any) => checkHasSelected(n));
    } else {
      return node.data.isSelected || false;
    }
  };

  // 트리 필터
  const handleSearchMatch = (node: NodeApi, term: string) => {
    return node.data.name.toLowerCase().includes(term.toLowerCase());
  };

  // 노드 렌더링
  const NodeRenderer = ({ style, node, tree, dragHandle }: NodeRendererProps<any>) => {
    // 조건으로 컴포넌트 렌더링
    const content = [];
    // 체크 여부
    const isChecked = node.data.isChecked;
    // 선택 여부
    const isSelected = node.data.isSelected;
    // 변경 여부 (초기 데이터와 비교 시 변경되었는지 여부)
    const isChanged = node.data.isChanged;
    // 드랍 시 대상 여부
    node.data.willReceiveDrop = node.willReceiveDrop;

    // if (node.level === 0 && node.rowIndex === 0) {
    //   const hasSelected = checkHasSelected(tree.root);

    //   if (!hasSelected) {
    //     handleClick(node, tree);
    //   }
    // }

    if (node.children?.length === 0) {
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
            <KeyboardArrowRightOutlinedIcon onClick={() => handleToggle(node)} color="disabled" />
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
        id={node.data.id}
        className={`tree-item width-100 ${isSelected ? 'primary-200' : ''} ${isChanged ? 'error-200' : ''}`}
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
        data={treeData}
        onMove={handleMove}
        searchTerm={term}
        searchMatch={handleSearchMatch}
        renderDragPreview={(dragPreviewProps) => null}
      >
        {NodeRenderer}
      </Tree>
    </section>
  );
};

export default DataTree;
