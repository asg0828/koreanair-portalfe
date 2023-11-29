import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useCreateDataroom } from '@/hooks/mutations/useDataroomMutations';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType, ValidType } from '@/models/common/Constants';
import { CreatedDataroomModel } from '@/models/model/DataroomModel';
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
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreatedDataroomModel>({
    mode: 'onChange',
    defaultValues: {
      sj: '',
      cn: '',
      useYn: 'Y',
      fileIds: [],
      fileList: [],
    },
  });
  const values = getValues();
  const { data: response, isSuccess, isError, mutate } = useCreateDataroom(values);

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

  const onSubmit = (data: CreatedDataroomModel) => {
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
            <TH colSpan={1} align="right" required>
              제목
            </TH>
            <TD colSpan={5} align="left">
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
          <TR>
            <TH colSpan={1} align="right">
              게시여부
            </TH>
            <TD colSpan={5} align="left">
              <Radio label="게시" value="Y" defaultChecked={values.useYn === 'Y'} {...register('useYn')} />
              <Radio label="미개시" value="N" defaultChecked={values.useYn === 'N'} {...register('useYn')} />
            </TD>
          </TR>
          <TR className="height-100">
            <TH colSpan={1} align="right" required>
              내용
            </TH>
            <TD colSpan={5} align="left" className="content">
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
            <TH colSpan={1} align="right">
              첨부파일
            </TH>
            <TD colSpan={5} align="left" className="attachFile">
              <UploadDropzone fileCl="dataroom" uploadFiles={handleUploadFiles} fileList={values.fileList} />
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
