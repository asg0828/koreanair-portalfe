import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useCreateNotice } from '@/hooks/mutations/useNoticeMutations';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType, ValidType } from '@/models/common/Constants';
import { CreatedNoticeModel, NoticeParams } from '@/models/model/NoticeModel';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const Reg = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const params: NoticeParams = location?.state?.params;
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreatedNoticeModel>({
    mode: 'onChange',
    defaultValues: {
      sj: '',
      cn: '',
      startDt: '',
      endDt: '',
      popupYn: 'Y',
      useYn: 'Y',
      importantYn: 'Y',
      fileIds: [],
      fileList: [],
    },
  });
  const values = getValues();
  const { data: response, isSuccess, isError, mutate } = useCreateNotice(values);

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
      },
    });
  }, [params, navigate]);

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

  const onSubmit = (data: CreatedNoticeModel) => {
    console.log('data: ', data);
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.create'),
        content: t('common.modal.message.createConfirm'),
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
          {/* <TR>
            <TH>팝업공지여부</TH>
            <TD align="left">
              <Radio label="사용" value="Y" defaultChecked={values.popupYn === 'Y'} {...register('popupYn')} />
              <Radio label="미사용" value="N" defaultChecked={values.popupYn === 'N'} {...register('popupYn')} />
            </TD>
            <TH required>팝업공지일자</TH>
            <TD>
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Stack gap="SM" className="width-100">
                  <Controller
                    name="startDt"
                    control={control}
                    rules={{
                      required: { value: true, message: 'start date is required.' },
                      pattern: {
                        value: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                        message: 'start date is invalid.',
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        ref={(el) => {
                          const input = el?.querySelector('input');
                          input && field.ref(input);
                        }}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        validation={errors?.startDt?.message ? 'Error' : undefined}
                      />
                    )}
                  />
                  <Label>~</Label>
                  <Controller
                    name="endDt"
                    control={control}
                    rules={{
                      required: { value: true, message: 'end date is required.' },
                      pattern: {
                        value: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                        message: 'end date is invalid.',
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        ref={(el) => {
                          const input = el?.querySelector('input');
                          input && field.ref(input);
                        }}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        validation={errors?.endDt?.message ? 'Error' : undefined}
                      />
                    )}
                  />
                </Stack>
                <Stack justifyContent="Between">
                  <ErrorLabel message={errors?.startDt?.message} />
                  <ErrorLabel message={errors?.endDt?.message} />
                </Stack>
              </Stack>
            </TD>
          </TR> */}
          <TR>
            <TH colSpan={1} align="right">
              {t('board:label.postYn')}
            </TH>
            <TD colSpan={2} align="left">
              <Radio
                label={t('board:label.post')}
                value="Y"
                defaultChecked={values.useYn === 'Y'}
                {...register('useYn')}
              />
              <Radio
                label={t('board:label.unpost')}
                value="N"
                defaultChecked={values.useYn === 'N'}
                {...register('useYn')}
              />
            </TD>
            <TH colSpan={1} align="right">
              {t('board:label.importantYn')}
            </TH>
            <TD colSpan={2} align="left">
              <Radio
                label={t('board:label.important')}
                value="Y"
                defaultChecked={values.importantYn === 'Y'}
                {...register('importantYn')}
              />
              <Radio
                label={t('board:label.normal')}
                value="N"
                defaultChecked={values.importantYn === 'N'}
                {...register('importantYn')}
              />
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
              <UploadDropzone fileCl="notice" uploadFiles={handleUploadFiles} fileList={values.fileList} />
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
export default Reg;
