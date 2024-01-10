import { downloadFile } from '@/api/FileAPI';
import { AttachFileIcon } from '@/assets/icons';
import TinyEditor from '@/components/editor/TinyEditor';
import NoResult from '@/components/emptyState/NoData';
import { useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ValidType } from '@/models/common/Constants';
import { RowsInfo } from '@/models/components/Table';
import { FileModel } from '@/models/model/FileModel';
import { PageModel, PageProps, initPage, pageSizeList } from '@/models/model/PageModel';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { openPopup } from '@/utils/FuncUtil';
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
import { useTranslation } from 'react-i18next';
import './AccordionGrid.scss';

export interface AccordionGridProps extends PageProps {
  value?: string;
  buttonChildren?: ReactNode;
  rows?: Array<RowsInfo>;
  onClick?: (faqId: string) => void;
  onUpdate?: (faqId: string) => void;
  onDelete?: (faqId: string) => void;
}

const AccordionGrid: React.FC<AccordionGridProps> = ({
  value,
  buttonChildren,
  rows,
  page,
  onClick,
  onUpdate,
  onDelete,
  onChange,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const sessionInfo = useAppSelector(selectSessionInfo());
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

  const handleFileDownload = async (fileId: string, fileNm?: string) => {
    const isSuccess = await downloadFile(fileId, fileNm);

    if (isSuccess) {
      toast({
        type: ValidType.INFO,
        content: t('common.toast.success.download'),
      });
    } else {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.download'),
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
          {t('common.label.countingUnit.total')}
          <span className="total">{` ${pages.totalCount} `}</span>
          {t('common.label.countingUnit.thing')}
        </Label>
        <Select
          appearance="Outline"
          size="LG"
          className="select-page"
          value={pages.pageSize}
          onChange={(e, value) => value && handleChange('pageSize', value)}
        >
          {pageSizeList.map((pageSize) => (
            <SelectOption value={pageSize}>{`${pageSize} ${t('common.label.countingUnit.thing')}`}</SelectOption>
          ))}
        </Select>
      </Stack>
      <Stack className="accordionWrap width-100">
        <Accordion type="single" size="LG" value={value}>
          {rows && rows.length > 0 ? (
            rows.map((row) => (
              <div onClick={() => onClick && onClick(row.faqId)}>
                <AccordionItem title={`[${row.codeNm || ''}] ${row.qstn || ''}`} value={row.faqId}>
                  <Stack justifyContent="End" gap="SM" className="width-100">
                    {(() => {
                      if (contextPath === ContextPath.ADMIN) {
                        if (sessionInfo.userId === row.rgstId || sessionInfo.apldMgrAuthId === 'ma23000000001') {
                          return (
                            <>
                              <Button appearance="Unfilled" onClick={() => onUpdate && onUpdate(row.faqId)}>
                                {t('common.button.edit')}
                              </Button>
                              <Button appearance="Unfilled" onClick={() => onDelete && onDelete(row.faqId)}>
                                {t('common.button.delete')}
                              </Button>
                            </>
                          );
                        } else if (sessionInfo.apldMgrAuthId === 'ma23000000002') {
                          return (
                            <Button appearance="Unfilled" onClick={() => onDelete && onDelete(row.faqId)}>
                              {t('common.button.delete')}
                            </Button>
                          );
                        }
                      }
                      return null;
                    })()}
                  </Stack>
                  <Stack className="width-100">
                    <Typography variant="body1" className="answer"></Typography>
                    <Stack direction="Vertical" className="width-100">
                      <TinyEditor content={row.answ} disabled />
                      <Stack gap="MD" direction="Vertical" className="attach_file_list_wrap">
                        {row.fileLinks?.length > 0 && (
                          <Stack direction="Vertical" className="attach_file_list_item">
                            <Typography variant="body2" className="attach_file_title">파일 링크</Typography>
                            <ul className="attachFileList">
                              {row.fileLinks.map((fileLink: string) => (
                                <li>
                                  <Link linkType="External" children={fileLink} onClick={() => openPopup(fileLink)} />
                                </li>
                              ))}
                            </ul>
                          </Stack>
                        )}
                        {row.fileList?.length > 0 && (
                          <Stack direction="Vertical" className="attach_file_list_item">
                            <Typography variant="body2" className="attach_file_title">첨부파일</Typography>
                            <ul className="attachFileList">
                              {row.fileList.map((file: FileModel) => (
                                <li>
                                  <Link onClick={() => handleFileDownload(file.fileId, file.fileNm)}>
                                    <Stack>
                                      <AttachFileIcon />
                                      {`${file.fileNm} (${file.fileSizeNm})`}
                                    </Stack>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
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
