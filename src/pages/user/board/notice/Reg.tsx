import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useCreateNotice } from '@/hooks/mutations/useNoticeMutations';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType, ValidType } from '@/models/common/Constants';
import { CreatedNoticeModel } from '@/models/model/NoticeModel';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Reg = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const goToList = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '확인',
        content: '목록으로 이동하시겠습니까?',
        onConfirm: () => navigate('..'),
      })
    );
  };

  const onSubmit = (data: CreatedNoticeModel) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '저장',
        content: '등록하시겠습니까?',
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
        content: '등록 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '등록되었습니다.',
      });
      navigate('..');
    }
  }, [response, isSuccess, isError, toast, navigate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="Vertical" gap="MD" className="height-100">
        <HorizontalTable className="height-100">
          <TR>
            <TH colSpan={1} required>
              제목
            </TH>
            <TD colSpan={3}>
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('sj', {
                    required: { value: true, message: 'subject is required.' },
                    maxLength: { value: 100, message: 'max length exceeded' },
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
            <TH>게시여부</TH>
            <TD align="left">
              <Radio label="게시" value="Y" defaultChecked={values.useYn === 'Y'} {...register('useYn')} />
              <Radio label="미개시" value="N" defaultChecked={values.useYn === 'N'} {...register('useYn')} />
            </TD>
            <TH>중요여부</TH>
            <TD align="left">
              <Radio label="중요" value="Y" defaultChecked={values.importantYn === 'Y'} {...register('importantYn')} />
              <Radio label="일반" value="N" defaultChecked={values.importantYn === 'N'} {...register('importantYn')} />
            </TD>
          </TR>
          <TR className="height-100">
            <TH colSpan={1} required>
              내용
            </TH>
            <TD colSpan={3} className="content">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="cn"
                  control={control}
                  rules={{
                    required: { value: true, message: 'content is required.' },
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
            <TH colSpan={1}>첨부파일</TH>
            <TD colSpan={3} className="attachFile">
              <UploadDropzone fileCl="notice" uploadFiles={handleUploadFiles} fileList={values.fileList} />
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End" className="margin-top-8">
        <Button priority="Primary" appearance="Contained" size="LG" type="submit">
          등록
        </Button>
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </form>
  );
};
export default Reg;
