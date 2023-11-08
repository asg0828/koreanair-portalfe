import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useUpdateNotice } from '@/hooks/mutations/useNoticeMutations';
import { useNoticeById } from '@/hooks/queries/useNoticeQueries';
import useModal, { ModalType } from '@/hooks/useModal';
import { UpdatedNoticeInfo } from '@/models/Board/Notice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, DatePicker, Label, Radio, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { openModal } = useModal();
  const noticeId = location?.state?.noticeId;
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<UpdatedNoticeInfo>({
    mode: 'onChange',
    defaultValues: {
      noticeId: noticeId,
      sj: '',
      cn: '',
      startDt: '',
      endDt: '',
      popupYn: 'Y',
      useYn: 'Y',
      importantYn: 'Y',
    },
  });
  const values = getValues();
  const { data: response, isSuccess, isError } = useNoticeById(values.noticeId);
  const {
    data: uResponse,
    mutate,
    isSuccess: uIsSuccess,
    isError: uIsError,
  } = useUpdateNotice(values.noticeId, values);

  const goToList = () => {
    navigate('..');
  };

  const onSubmit = (data: UpdatedNoticeInfo) => {
    openModal({
      type: ModalType.CONFIRM,
      title: '수정',
      content: '수정하시겠습니까?',
      onConfirm: mutate,
    });
  };

  useEffect(() => {
    if (isSuccess && response.data) {
      setValue('sj', response.data.sj);
      setValue('cn', response.data.cn);
      setValue('startDt', response.data.startDt);
      setValue('endDt', response.data.endDt);
      setValue('popupYn', response.data.popupYn);
      setValue('useYn', response.data.useYn);
      setValue('importantYn', response.data.importantYn);
    }
  }, [isSuccess, response?.data, setValue]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '수정 중 에러가 발생했습니다.',
      });
    } else if (uIsSuccess) {
      toast({
        type: 'Confirm',
        content: '수정되었습니다.',
      });
      navigate('..');
    }
  }, [uResponse, uIsSuccess, uIsError, toast, navigate]);

  if (!noticeId) {
    return (
      <EmptyState
        type="warning"
        description="조회에 필요한 정보가 없습니다"
        confirmText="돌아가기"
        onConfirm={() =>
          navigate('..', {
            state: {
              isRefresh: true,
            },
          })
        }
      />
    );
  }

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
                  {...register('sj', { required: 'subject is required.' })}
                  validation={errors?.sj?.message ? 'Error' : undefined}
                />
                <ErrorLabel message={errors?.sj?.message} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH>팝업공지여부</TH>
            <TD align="left">
              <Radio label="사용" value="Y" defaultChecked={values.popupYn === 'Y'} {...register('popupYn')} />
              <Radio label="미사용" value="N" defaultChecked={values.popupYn === 'N'} {...register('popupYn')} />
            </TD>
            <TH>팝업공지일자</TH>
            <TD>
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Stack gap="SM" className="width-100">
                  <Controller
                    name="startDt"
                    control={control}
                    rules={{
                      required: 'start date is required.',
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
                      required: 'end date is required.',
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
          </TR>
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
                  rules={{ required: 'content is required.' }}
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
              <UploadDropzone />
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
export default Edit;
