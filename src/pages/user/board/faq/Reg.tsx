import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useCreateFaq } from '@/hooks/mutations/useFaqMutations';
import useCode from '@/hooks/useCode';
import { useAppDispatch } from '@/hooks/useRedux';
import { CreatedFaqInfo } from '@/models/board/Faq';
import { GroupCodeType, ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Reg = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCodeList } = useCode();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreatedFaqInfo>({
    mode: 'onChange',
    defaultValues: {
      clCode: '',
      qstn: '',
      answ: '',
      useYn: 'Y',
    },
  });
  const values = getValues();
  const codeList = getCodeList(GroupCodeType.FAQ_TYPE);
  const { data: response, mutate, isSuccess, isError } = useCreateFaq(values);

  const goToList = () => {
    navigate('..');
  };

  const onSubmit = (data: CreatedFaqInfo) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: ModalTitle.SAVE,
        content: '등록하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  useEffect(() => {
    if (codeList.length > 0 && !values.clCode) {
      setValue('clCode', codeList[0].codeId);
    }
  }, [codeList, values.clCode, setValue]);

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
              질문
            </TH>
            <TD colSpan={3}>
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
            <TH required>분류</TH>
            <TD>
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
                      onChange={(e, value) => field.onChange(value)}
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
