import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useUpdateFaq } from '@/hooks/mutations/useFaqMutations';
import { useFaqById } from '@/hooks/queries/useFaqQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ModalType, ValidType } from '@/models/common/Constants';
import { UpdatedFaqModel } from '@/models/model/FaqModel';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const Reg = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const faqId = location?.state?.faqId;
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<UpdatedFaqModel>({
    mode: 'onChange',
    defaultValues: {
      faqId: faqId,
      clCode: '',
      qstn: '',
      answ: '',
      useYn: 'Y',
      fileIds: [],
      fileList: [],
    },
  });
  const values = getValues();
  const codeList = useAppSelector(selectCodeList(GroupCodeType.FAQ_TYPE));
  const { data: response, isSuccess, isError } = useFaqById(values.faqId);
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate } = useUpdateFaq(values.faqId, values);

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

  const onSubmit = (data: UpdatedFaqModel) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '수정',
        content: '수정하시겠습니까?',
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
      setValue('faqId', response.data.faqId);
      setValue('clCode', response.data.clCode);
      setValue('qstn', response.data.qstn);
      setValue('answ', response.data.answ);
      setValue('useYn', response.data.useYn);
      setValue('fileList', response.data.fileList);
    }
  }, [isSuccess, response?.data, setValue]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '수정 중 에러가 발생했습니다.',
      });
    } else if (uIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
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
            <TH colSpan={1} align="right" required>
              질문
            </TH>
            <TD colSpan={5} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('qstn', {
                    required: { value: true, message: 'question is required.' },
                    maxLength: { value: 1000, message: 'max length exceeded' },
                  })}
                  validation={errors?.qstn?.message ? 'Error' : undefined}
                  autoFocus
                />
                <ErrorLabel message={errors?.qstn?.message} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right" required>
              분류
            </TH>
            <TD colSpan={2} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="clCode"
                  control={control}
                  rules={{ required: { value: true, message: 'code is required.' } }}
                  render={({ field }) => (
                    <Select
                      appearance="Outline"
                      placeholder="전체"
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
            <TH colSpan={1} align="right">
              게시여부
            </TH>
            <TD colSpan={2} align="left">
              <Radio label="게시" value="Y" defaultChecked={values.useYn === 'Y'} {...register('useYn')} />
              <Radio label="미개시" value="N" defaultChecked={values.useYn === 'N'} {...register('useYn')} />
            </TD>
          </TR>
          <TR className="height-100">
            <TH colSpan={1} align="right" required>
              답변
            </TH>
            <TD colSpan={5} align="left" className="content">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="answ"
                  control={control}
                  rules={{ required: { value: true, message: 'answer is required.' } }}
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
            <TH colSpan={1} align="right">
              첨부파일
            </TH>
            <TD colSpan={5} align="left" className="attachFile">
              <UploadDropzone fileCl="faq" uploadFiles={handleUploadFiles} fileList={watch().fileList} />
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
