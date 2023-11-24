import { downloadFile } from '@/api/FileAPI';
import { AttachFileIcon } from '@/assets/icons';
import TinyEditor from '@/components/editor/TinyEditor';
import NoResult from '@/components/emptyState/NoData';
import { ValidType } from '@/models/common/Constants';
import { RowsInfo } from '@/models/components/Table';
import { FileModel } from '@/models/model/FileModel';
import { PageModel, PageProps, initPage, pageSizeList } from '@/models/model/PageModel';
import {
  Accordion,
  AccordionItem,
  Button,
  Label,
  Link,
  Pagination,
  Select,
  SelectOption,
  Stack,
  Typography,
  useToast,
} from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';
import './AccordionGrid.scss';

export interface AccordionGridProps extends PageProps {
  buttonChildren?: ReactNode;
  rows?: Array<RowsInfo>;
  onClick?: (faqId: string) => void;
  onUpdate?: (faqId: string) => void;
  onDelete?: (faqId: string) => void;
}

const AccordionGrid: React.FC<AccordionGridProps> = ({
  buttonChildren,
  rows,
  page,
  onClick,
  onUpdate,
  onDelete,
  onChange,
}) => {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageModel>(initPage);

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

  const handleFileDownload = async (fileId: string) => {
    const isSuccess = await downloadFile(fileId);

    if (isSuccess) {
      toast({
        type: ValidType.INFO,
        content: '파일이 다운로드되었습니다.',
      });
    } else {
      toast({
        type: ValidType.ERROR,
        content: '파일이 다운로드 중 에러가 발생했습니다.',
      });
    }
  };

  useEffect(() => {
    page && setPages(page);
  }, [page]);

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
          onChange={(e, value) => value && handleChange('pageSize', value)}
        >
          {pageSizeList.map((pageSize) => (
            <SelectOption value={pageSize}>{`${pageSize} 건`}</SelectOption>
          ))}
        </Select>
      </Stack>
      <Stack className="accordionWrap width-100">
        <Accordion type="single" size="LG">
          {rows && rows.length > 0 ? (
            rows.map((row) => (
              <div onClick={() => onClick && onClick(row.faqId)}>
                <AccordionItem title={`[${row.clCode || ''}] ${row.qstn || ''}`} value={row.faqId}>
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
                  <ul className="attachFileList">
                    {row.fileList?.map((file: FileModel) => (
                      <li>
                        <Link onClick={() => handleFileDownload(file.fileId)}>
                          <Stack>
                            <AttachFileIcon />
                            {file.fileNm}
                          </Stack>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              </div>
            ))
          ) : (
            <Stack className="no-data-wrap">
              <NoResult />
            </Stack>
          )}
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
