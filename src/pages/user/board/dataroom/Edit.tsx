import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useUpdateDataroom } from '@/hooks/mutations/useDataroomMutations';
import { useDataroomById } from '@/hooks/queries/useDataroomQueries';
import useModal, { ModalType } from '@/hooks/useModal';
import { UpdatedDataroomInfo } from '@/models/Board/Dataroom';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { openModal } = useModal();
  const dataId = location?.state?.dataId;
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<UpdatedDataroomInfo>({
    mode: 'onChange',
    defaultValues: {
      dataId: dataId,
      sj: '',
      cn: '',
      useYn: 'Y',
    },
  });
  const values = getValues();
  const { data: response, isSuccess, isError } = useDataroomById(values.dataId);
  const {
    data: uResponse,
    mutate,
    isSuccess: uIsSuccess,
    isError: uIsError,
  } = useUpdateDataroom(values.dataId, values);

  const goToList = () => {
    navigate('..');
  };

  const onSubmit = (data: UpdatedDataroomInfo) => {
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
      setValue('useYn', response.data.useYn);
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

  if (!dataId) {
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
            <TH colSpan={1}>게시여부</TH>
            <TD colSpan={3} align="left">
              <Radio label="게시" value="Y" defaultChecked={values.useYn === 'Y'} {...register('useYn')} />
              <Radio label="미개시" value="N" defaultChecked={values.useYn === 'N'} {...register('useYn')} />
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
