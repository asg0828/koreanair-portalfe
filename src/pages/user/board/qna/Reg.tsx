import { AddCircleOutlineOutlinedIcon, RemoveCircleOutlineOutlinedIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useCreateQna } from '@/hooks/mutations/useQnaMutations';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, GroupCodeType, ModalType, UrlType, ValidType } from '@/models/common/Constants';
import { PageModel } from '@/models/model/PageModel';
import { CreatedQnaModel, QnaParams } from '@/models/model/QnaModel';
import { selectContextPath } from '@/reducers/authSlice';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { httpReg, httpUrlReg } from '@/utils/RegularExpression';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const Reg = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const location = useLocation();
  const params: QnaParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const [fileLink, setFileLink] = useState<string>('');
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatedQnaModel>({
    mode: 'onChange',
    defaultValues: {
      clCode: '',
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
  const { data: response, isSuccess, isError, mutate } = useCreateQna();

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

  const onSubmit = (data: CreatedQnaModel) => {
    data.cn = data.cn.replace(/src=".*"/, '');

    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.create'),
        content: t('common.modal.message.createConfirm'),
        onConfirm: () => mutate(data),
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
        content: t('common.toast.error.create'),
      });
    } else if (isSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.create'),
      });
      goToList();
    }
  }, [response, isSuccess, isError, goToList, navigate, toast]);

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
                      placeholder={t('common.placeholder.select')}
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
            <TR>
              <TH colSpan={1} align="right">
                {t('board:label.useYn')}
              </TH>
              <TD colSpan={5} align="left">
                <Radio label={t('board:label.useY')} value="Y" {...register('useYn')} />
                <Radio label={t('board:label.useN')} value="N" {...register('useYn')} />
              </TD>
            </TR>
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
              <UploadDropzone fileCl="qna" uploadFiles={handleUploadFiles} fileList={values.fileList} />
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
export default Reg;
