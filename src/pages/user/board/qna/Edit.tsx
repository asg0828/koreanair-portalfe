import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useUpdateQna } from '@/hooks/mutations/useQnaMutations';
import { useQnaById } from '@/hooks/queries/useQnaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ModalType, ValidType } from '@/models/common/Constants';
import { FileModel } from '@/models/model/FileModel';
import { PageModel } from '@/models/model/PageModel';
import { QnaParams, UpdatedQnaModel } from '@/models/model/QnaModel';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const Edit = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const qnaId = location?.state?.qnaId;
  const params: QnaParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<UpdatedQnaModel>({
    mode: 'onChange',
    defaultValues: {
      qnaId: qnaId,
      clCode: '',
      sj: '',
      cn: '',
      openYn: 'Y',
      useYn: 'Y',
      fileIds: [],
      fileList: [],
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

  useEffect(() => {
    if (isSuccess && response.data) {
      response.data.fileList?.forEach((item: FileModel) => (item.fileSizeNm = getFileSize(item.fileSize)));
      setValue('clCode', response.data.clCode);
      setValue('qnaStat', response.data.qnaStat);
      setValue('sj', response.data.sj);
      setValue('cn', response.data.cn);
      setValue('openYn', response.data.openYn);
      setValue('useYn', response.data.useYn);
      setValue('fileList', response.data.fileList);
    }
  }, [isSuccess, response?.data, setValue]);

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
          <TR>
            <TH colSpan={1} align="right">
              {t('board:label.useYn')}
            </TH>
            <TD colSpan={2} align="left">
              <Radio
                label={t('board:label.useY')}
                value="Y"
                defaultChecked={values.openYn === 'Y'}
                {...register('openYn')}
              />
              <Radio
                label={t('board:label.useN')}
                value="N"
                defaultChecked={values.openYn === 'N'}
                {...register('openYn')}
              />
            </TD>
            <TH colSpan={1} align="right" required>
              {t('board:label.qnaStatNm')}
            </TH>
            <TD colSpan={2} align="left">
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
          {t('common.button.reg')}
        </Button>
        <Button size="LG" onClick={handleList}>
          {t('common.button.list')}
        </Button>
      </Stack>
    </form>
  );
};
export default Edit;
