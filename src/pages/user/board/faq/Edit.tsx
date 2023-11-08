import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import TinyEditor from '@/components/editor/TinyEditor';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useUpdateFaq } from '@/hooks/mutations/useFaqMutations';
import { useFaqById } from '@/hooks/queries/useFaqQueries';
import useModal, { ModalType } from '@/hooks/useModal';
import { UpdatedFaqInfo } from '@/models/Board/Faq';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const Reg = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { openModal } = useModal();
  const faqId = location?.state?.faqId;
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<UpdatedFaqInfo>({
    mode: 'onChange',
    defaultValues: {
      faqId: faqId,
      clCode: '',
      qstn: '',
      answ: '',
      useYn: 'Y',
    },
  });
  const values = getValues();
  const { data: response, isSuccess, isError } = useFaqById(values.faqId);
  const { data: uResponse, mutate, isSuccess: uIsSuccess, isError: uIsError } = useUpdateFaq(values.faqId, values);

  const goToList = () => {
    navigate('..');
  };

  const onSubmit = (data: UpdatedFaqInfo) => {
    openModal({
      type: ModalType.CONFIRM,
      title: '수정',
      content: '수정하시겠습니까?',
      onConfirm: mutate,
    });
  };

  useEffect(() => {
    if (isSuccess && response.data) {
      setValue('faqId', response.data.faqId);
      setValue('clCode', response.data.clCode);
      setValue('qstn', response.data.qstn);
      setValue('answ', response.data.answ);
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

  if (!faqId) {
    return (
      <EmptyState
        type="warning"
        description="조회에 필요한 정보가 없습니다"
        confirmText="돌아가기"
        onConfirm={() => navigate('..')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="Vertical" gap="MD" className="height-100">
        <HorizontalTable className="height-100">
          <TR>
            <TH colSpan={1} required>
              질문
            </TH>
            <TD colSpan={3}>
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('qstn', { required: 'question is required.' })}
                  validation={errors?.qstn?.message ? 'Error' : undefined}
                />
                <ErrorLabel message={errors?.qstn?.message} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH required>분류</TH>
            <TD>
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="clCode"
                  control={control}
                  rules={{ required: 'code is required.' }}
                  render={({ field }) => (
                    <Select
                      appearance="Outline"
                      placeholder="전체"
                      className="width-100"
                      ref={field.ref}
                      value={field.value}
                      onChange={(e, value) => field.onChange(value)}
                      status={errors?.clCode?.message ? 'error' : undefined}
                    >
                      <SelectOption value={'aa'}>분류1</SelectOption>
                      <SelectOption value={'bb'}>분류2</SelectOption>
                    </Select>
                  )}
                />
                <ErrorLabel message={errors?.clCode?.message} />
              </Stack>
            </TD>
            <TH>게시여부</TH>
            <TD align="left">
              <Radio label="게시" value="Y" defaultChecked={values.useYn === 'Y'} {...register('useYn')} />
              <Radio label="미개시" value="N" defaultChecked={values.useYn === 'N'} {...register('useYn')} />
            </TD>
          </TR>
          <TR className="height-100">
            <TH colSpan={1} required>
              답변
            </TH>
            <TD colSpan={3} className="content">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="answ"
                  control={control}
                  rules={{ required: 'answer is required.' }}
                  render={({ field }) => (
                    <TinyEditor
                      ref={field.ref}
                      content={field.value}
                      onEditorChange={(content, editor) => field.onChange(content)}
                    />
                  )}
                />
                <ErrorLabel message={errors?.answ?.message} />
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
export default Reg;
