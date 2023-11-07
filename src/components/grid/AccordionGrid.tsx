import TinyEditor from '@/components/editor/TinyEditor';
import { PageInfo, PageProps, initPage, pageSizeList } from '@/models/components/Page';
import { RowsInfo } from '@/models/components/Table';
import {
  Accordion,
  AccordionItem,
  Button,
  Label,
  Pagination,
  Select,
  SelectOption,
  Stack,
  Typography,
} from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';
import './AccordionGrid.scss';

export interface AccordionGridProps extends PageProps {
  buttonChildren?: ReactNode;
  rows?: Array<RowsInfo>;
  onUpdate?: (faqId: string) => void;
  onDelete?: (faqId: string) => void;
}

const AccordionGrid: React.FC<AccordionGridProps> = ({ buttonChildren, rows, onUpdate, onDelete, page, onChange }) => {
  const [pages, setPages] = useState<PageInfo>(initPage);

  useEffect(() => {
    page && setPages(page);
  }, [page]);

  const handleChange = (key: string, value: any) => {
    setPages((prevState) => {
      const state = {
        ...prevState,
        [key]: value,
      };
      if (key === 'pageSize') {
        state.page = 0;
      }
      onChange && onChange(state);
      return state;
    });
  };

  return (
    <Stack className="dataGridWrap" direction="Vertical" gap="MD">
      <Stack className="total-layout">
        <Label>
          총 <span className="total">{pages.totalCount}</span> 건
        </Label>
        <Select
          appearance="Outline"
          size="LG"
          className="select-page"
          value={pages.pageSize}
          onChange={(e, value) => handleChange('pageSize', value)}
        >
          {pageSizeList.map((pageSize) => (
            <SelectOption value={pageSize}>{`${pageSize} 건`}</SelectOption>
          ))}
        </Select>
      </Stack>
      <Stack className="accordionWrap width-100">
        <Accordion type="single" size="LG">
          {rows?.map((row) => (
            <AccordionItem title={`[${row.clCode}] ${row.qstn}`} value={row.faqId}>
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button appearance="Unfilled" onClick={() => onUpdate && onUpdate(row.faqId)}>
                  수정
                </Button>
                <Button appearance="Unfilled" onClick={() => onDelete && onDelete(row.faqId)}>
                  삭제
                </Button>
              </Stack>
              <Stack className="width-100">
                <Typography variant="body1" className="answer"></Typography>
                <TinyEditor content={row.answ} disabled />
              </Stack>
            </AccordionItem>
          ))}
        </Accordion>
      </Stack>
      <Stack className="pagination-layout">
        <Pagination
          size="LG"
          className="pagination"
          page={pages.page}
          totalPages={pages.totalPage}
          onChangePage={(value) => handleChange('page', value)}
        />
        <Stack justifyContent="End" gap="SM" className="width-100">
          {buttonChildren}
        </Stack>
      </Stack>
    </Stack>
  );
};
export default AccordionGrid;
