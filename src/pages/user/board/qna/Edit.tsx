import { AddCircleOutlineOutlinedIcon, RemoveCircleOutlineOutlinedIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useUpdateQna } from '@/hooks/mutations/useQnaMutations';
import { useQnaById } from '@/hooks/queries/useQnaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, GroupCodeType, ModalType, UrlType, ValidType } from '@/models/common/Constants';
import { FileModel } from '@/models/model/FileModel';
import { PageModel } from '@/models/model/PageModel';
import { QnaParams, UpdatedQnaModel } from '@/models/model/QnaModel';
import { selectContextPath } from '@/reducers/authSlice';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import { httpReg, httpUrlReg } from '@/utils/RegularExpression';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Edit = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qnaId: string = searchParams.get('qnaId') || '';
  const params: QnaParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const [fileLink, setFileLink] = useState<string>('');
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdatedQnaModel>({
    mode: 'onChange',
    defaultValues: {
      qnaId: qnaId,
      clCode: '',
      qnaStat: '',
      sj: '',
      cn: '',
      openYn: 'Y',
      useYn: 'Y',
      fileIds: [],
      fileList: [],
      fileLinks: [],
    },
  });
  const values = getValues();
  const codeList = useAppSelector(selectCodeList(GroupCodeType.QNA_TYPE));
  const statCodeList = useAppSelector(selectCodeList(GroupCodeType.QNA_STAT));
  const { data: response, isSuccess, isError } = useQnaById(values.qnaId);
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate } = useUpdateQna(values.qnaId, values);

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
        page: page,
      },
    });
  }, [params, page, navigate]);

  const handleList = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.confirm'),
        content: t('common.modal.message.listConfirm'),
        onConfirm: goToList,
      })
    );
  };

  const onSubmit = (data: UpdatedQnaModel) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.update'),
        content: t('common.modal.message.updateConfirm'),
        onConfirm: mutate,
      })
    );
  };

  const handleUploadFiles = (files: Array<any>) => {
    setValue(
      'fileIds',
      files.map((file) => file.fileId)
    );
  };

  const handleChangeFileLink = (newFileLink: string) => {
    setFileLink(newFileLink);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFileLink(e.target.value);
    }
  };

  const handleAddFileLink = (newFileLink: string) => {
    if (!newFileLink) {
      toast({
        type: ValidType.INFO,
        content: t('board:toast.info.fileLinkEmpty'),
      });
      return;
    }

    if (!newFileLink.match(httpReg)) {
      newFileLink = `${UrlType.HTTPS}${newFileLink}`;
    }

    if (!newFileLink.match(httpUrlReg)) {
      toast({
        type: ValidType.INFO,
        content: t('board:toast.info.notCorrect'),
      });
      return;
    }

    if (values.fileLinks.includes(newFileLink)) {
      toast({
        type: ValidType.INFO,
        content: t('board:toast.info.fileLink'),
      });
      return;
    }

    setValue('fileLinks', values.fileLinks.concat(newFileLink));
    setFileLink('');
  };

  const handleRemoveFileLink = (newFileLink: string) => {
    setValue(
      'fileLinks',
      values.fileLinks.filter((fileLink) => fileLink !== newFileLink)
    );
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.read'),
      });
    } else if (isSuccess) {
      if (response.data) {
        response.data.fileList?.forEach((item: FileModel) => (item.fileSizeNm = getFileSize(item.fileSize)));
        reset(response.data);
      } else {
        toast({
          type: ValidType.INFO,
          content: t('common.toast.info.noData'),
        });
        goToList();
      }
    }
  }, [response, isSuccess, isError, toast]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.read'),
      });
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.update'),
      });
    } else if (uIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.update'),
      });
      goToList();
    }
  }, [uResponse, uIsSuccess, uIsError, goToList, navigate, toast]);

  if (!qnaId) {
    return (
      <EmptyState
        type="warning"
        description={t('common.message.noRequireInfo')}
        confirmText={t('common.message.goBack')}
        onConfirm={goToList}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="Vertical" gap="MD" className="height-100">
        <HorizontalTable className="height-100">
          <TR>
            <TH colSpan={1} align="right" required>
              {t('board:label.sj')}
            </TH>
            <TD colSpan={5} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('sj', {
                    required: { value: true, message: t('common.validate.required') },
                    maxLength: { value: 100, message: t('common.validate.maxLength') },
                    validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                  })}
                  validation={errors?.sj?.message ? 'Error' : undefined}
                  autoFocus
                />
                <ErrorLabel message={errors?.sj?.message} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right" required>
              {t('board:label.clCodeNm')}
            </TH>
            <TD colSpan={5} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="clCode"
                  control={control}
                  rules={{ required: t('common.validate.required') }}
                  render={({ field }) => (
                    <Select
                      appearance="Outline"
                      placeholder={t('common.placeholder.all')}
                      className="width-100"
                      ref={field.ref}
                      onChange={(e, value) => value && field.onChange(value)}
                      status={errors?.clCode?.message ? 'error' : undefined}
                      value={field.value}
                    >
                      {codeList.map((codeItem: any) => (
                        <SelectOption value={codeItem.codeId}>{codeItem.codeNm}</SelectOption>
                      ))}
                    </Select>
                  )}
                />
                <ErrorLabel message={errors?.clCode?.message} />
              </Stack>
            </TD>
          </TR>
          {contextPath === ContextPath.ADMIN && (
            <>
              <TR>
                <TH colSpan={1} align="right" required>
                  {t('board:label.qnaStatNm')}
                </TH>
                <TD colSpan={5} align="left">
                  <Stack gap="SM" className="width-100" direction="Vertical">
                    <Controller
                      name="qnaStat"
                      control={control}
                      rules={{ required: t('common.validate.required') }}
                      render={({ field }) => (
                        <Select
                          appearance="Outline"
                          placeholder={t('common.placeholder.all')}
                          className="width-100"
                          ref={field.ref}
                          onChange={(e, value) => value && field.onChange(value)}
                          status={errors?.clCode?.message ? 'error' : undefined}
                          value={field.value}
                        >
                          {statCodeList.map((codeItem: any) => (
                            <SelectOption value={codeItem.codeId}>{codeItem.codeNm}</SelectOption>
                          ))}
                        </Select>
                      )}
                    />
                    <ErrorLabel message={errors?.clCode?.message} />
                  </Stack>
                </TD>
              </TR>
              <TR>
                <TH colSpan={1} align="right">
                  {t('board:label.useYn')}
                </TH>
                <TD colSpan={5} align="left">
                  <Radio
                    label={t('board:label.useY')}
                    value="Y"
                    defaultChecked={values.useYn === 'Y'}
                    {...register('useYn')}
                  />
                  <Radio
                    label={t('board:label.useN')}
                    value="N"
                    defaultChecked={values.useYn === 'N'}
                    {...register('useYn')}
                  />
                </TD>
              </TR>
            </>
          )}
          <TR className="height-100">
            <TH colSpan={1} align="right" required>
              {t('board:label.cn')}
            </TH>
            <TD colSpan={5} align="left" className="content">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="cn"
                  control={control}
                  rules={{
                    required: { value: true, message: t('common.validate.required') },
                    validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                  }}
                  render={({ field }) => (
                    <TinyEditor
                      ref={field.ref}
                      content={field.value}
                      onEditorChange={(content, editor) => field.onChange(content)}
                    />
                  )}
                />
                <ErrorLabel message={errors?.cn?.message} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('board:label.fileLink')}
            </TH>
            <TD colSpan={5}>
              <Stack gap="XS" direction="Vertical" className="width-100">
                <Stack className="width-100" gap="SM">
                  <TextField
                    className="width-100"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleChangeFileLink(e.target.value)}
                    value={fileLink}
                  />
                  <Button iconOnly onClick={() => handleAddFileLink(fileLink)}>
                    <AddCircleOutlineOutlinedIcon color="action" />
                  </Button>
                </Stack>
                {watch().fileLinks.map((fileLink: string) => (
                  <Stack className="width-100" gap="SM">
                    <TextField disabled className="width-100" value={fileLink} />
                    <Button iconOnly onClick={() => handleRemoveFileLink(fileLink)}>
                      <RemoveCircleOutlineOutlinedIcon color="action" />
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('board:label.attachedFile')}
            </TH>
            <TD colSpan={5} align="left" className="attachFile">
              <UploadDropzone fileCl="qna" uploadFiles={handleUploadFiles} fileList={watch().fileList} />
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End" className="margin-top-8">
        <Button priority="Primary" appearance="Contained" size="LG" type="submit">
          {t('common.button.save')}
        </Button>
        <Button size="LG" onClick={handleList}>
          {t('common.button.list')}
        </Button>
      </Stack>
    </form>
  );
};
export default Edit;
