import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import UploadDropzone from '@/components/upload/UploadDropzone';
import { useUpdateQna } from '@/hooks/mutations/useQnaMutations';
import { useQnaById } from '@/hooks/queries/useQnaQueries';
import useCode from '@/hooks/useCode';
import { useAppDispatch } from '@/hooks/useRedux';
import { UpdatedQnaInfo } from '@/models/board/Qna';
import { GroupCodeType, ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const Edit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { getCodeList } = useCode();
  const qnaId = location?.state?.qnaId;
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<UpdatedQnaInfo>({
    mode: 'onChange',
    defaultValues: {
      qnaId: qnaId,
      clCode: '',
      sj: '',
      cn: '',
      openYn: 'Y',
      useYn: 'Y',
    },
  });
  const values = getValues();
  const codeList = getCodeList(GroupCodeType.QNA_TYPE);
  const statCodeList = getCodeList(GroupCodeType.QNA_STAT);
  const { data: response, isSuccess, isError } = useQnaById(values.qnaId);
  const { data: uResponse, mutate, isSuccess: uIsSuccess, isError: uIsError } = useUpdateQna(values.qnaId, values);

  const goToList = () => {
    navigate('..');
  };

  const onSubmit = (data: UpdatedQnaInfo) => {
    dispatch(openModal({
      type: ModalType.CONFIRM,
      title: ModalTitle.MODIFY,
      content: '수정하시겠습니까?',
      onConfirm: mutate,
    }));
  };

  useEffect(() => {
    if (isSuccess && response.data) {
      setValue('clCode', response.data.clCode);
      setValue('qnaStat', response.data.qnaStat);
      setValue('sj', response.data.sj);
      setValue('cn', response.data.cn);
      setValue('openYn', response.data.openYn);
      setValue('useYn', response.data.useYn);
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

  if (!qnaId) {
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
            <TH colSpan={1} required>
              분류
            </TH>
            <TD colSpan={3}>
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
          </TR>
          <TR>
            <TH>공개여부</TH>
            <TD align="left">
              <Radio label="공개" value="Y" defaultChecked={values.openYn === 'Y'} {...register('openYn')} />
              <Radio label="미공개" value="N" defaultChecked={values.openYn === 'N'} {...register('openYn')} />
            </TD>
            <TH required>상태</TH>
            <TD>
              <Stack gap="SM" className="width-100" direction="Vertical">
                <Controller
                  name="qnaStat"
                  control={control}
                  rules={{ required: 'stat is required.' }}
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
