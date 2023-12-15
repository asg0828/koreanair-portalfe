import { downloadFile } from '@/api/FileAPI';
import { AttachFileIcon, ExpandLessIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import { useCreateQna, useDeleteQna, useUpdateQna } from '@/hooks/mutations/useQnaMutations';
import { useQnaById } from '@/hooks/queries/useQnaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ModalType, ValidType } from '@/models/common/Constants';
import { FileModel } from '@/models/model/FileModel';
import { CreatedQnaModel, QnaModel, QnaParams, UpdatedQnaModel } from '@/models/model/QnaModel';
import { selectContextPath } from '@/reducers/authSlice';
import { getCode } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Label, Link, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const contextPath = useAppSelector(selectContextPath());
  const qnaId: string = location?.state?.qnaId || '';
  const params: QnaParams = location?.state?.params;
  const [qnaModel, setQnaModel] = useState<QnaModel>();
  const [cQnaId, setCQnaId] = useState<string>('');
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreatedQnaModel>({
    mode: 'onChange',
    defaultValues: {
      bfQnaId: qnaId,
      answ: '',
      openYn: 'Y',
      useYn: 'Y',
    },
  });
  const values = getValues();
  const { data: response, isSuccess, isError, refetch } = useQnaById(qnaId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteQna(qnaId);
  const { data: cResponse, isSuccess: cIsSuccess, isError: cIsError, mutate: cMutate } = useCreateQna(values);
  const { data: cdResponse, isSuccess: cdIsSuccess, isError: cdIsError, mutate: cdMutate } = useDeleteQna(cQnaId);

  const {
    register: uRegister,
    handleSubmit: uHandleSubmit,
    getValues: uGetValues,
    setValue: uSetValue,
    formState: { errors: uErrors },
    watch,
  } = useForm<UpdatedQnaModel>({
    mode: 'onChange',
    defaultValues: {
      qnaId: '',
      bfQnaId: '',
      answ: '',
      openYn: 'Y',
      useYn: 'Y',
    },
  });
  const uValues = uGetValues();

  const {
    data: cuResponse,
    isSuccess: cuIsSuccess,
    isError: cuIsError,
    mutate: cuMutate,
  } = useUpdateQna(uValues.qnaId, uValues);

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
      },
    });
  }, [params, navigate]);

  const goToEdit = () => {
    navigate('../edit', {
      state: {
        qnaId: qnaId,
        params: params,
      },
    });
  };

  const handleMoveDetail = (qnaId: string | undefined) => {
    navigate('', {
      state: {
        qnaId: qnaId,
        params: params,
      },
    });
  };

  const handleDelete = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '삭제',
        content: '삭제하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  const handleCommentUpdate = (qnaItem: QnaModel) => {
    uSetValue('qnaId', qnaItem.qnaId);
    uSetValue('bfQnaId', qnaItem.bfQnaId);
    uSetValue('answ', qnaItem.answ);
  };

  const handleCommentCancel = useCallback(() => {
    uSetValue('qnaId', '');
    uSetValue('bfQnaId', '');
    uSetValue('answ', '');
  }, [uSetValue]);

  const handleCommentDelete = (qnaId: string) => {
    setCQnaId(qnaId);
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '삭제',
        content: '답글을 삭제하시겠습니까?',
        onConfirm: cdMutate,
      })
    );
  };

  const onCreateCommentSubmit = (data: CreatedQnaModel) => {
    cMutate();
  };

  const onUpdateCommentSubmit = (data: CreatedQnaModel) => {
    cuMutate();
  };

  const handleFileDownload = async (fileId: string, fileNm: string) => {
    const isSuccess = await downloadFile(fileId, fileNm);

    if (isSuccess) {
      toast({
        type: ValidType.INFO,
        content: '파일이 다운로드되었습니다.',
      });
    } else {
      toast({
        type: ValidType.ERROR,
        content: '파일 다운로드 중 에러가 발생했습니다.',
      });
    }
  };

  useEffect(() => {
    if (cdIsError || cdResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '답글 삭제 중 에러가 발생했습니다.',
      });
    } else if (cdIsSuccess) {
      refetch();
      toast({
        type: ValidType.CONFIRM,
        content: '답글이 삭제되었습니다.',
      });
    }
  }, [cdResponse, cdIsSuccess, cdIsError, toast, refetch]);

  useEffect(() => {
    if (cIsError || cResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '답글 등록 중 에러가 발생했습니다.',
      });
    } else if (cIsSuccess) {
      refetch();
      toast({
        type: ValidType.CONFIRM,
        content: '답글이 등록되었습니다.',
      });
      setValue('answ', '');
    }
  }, [cResponse, cIsSuccess, cIsError, setValue, toast, refetch]);

  useEffect(() => {
    if (cuIsError || cuResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '답글 수정 중 에러가 발생했습니다.',
      });
    } else if (cuIsSuccess) {
      refetch();
      toast({
        type: ValidType.CONFIRM,
        content: '답글이 수정되었습니다.',
      });
      handleCommentCancel();
    }
  }, [cuResponse, cuIsSuccess, cuIsError, setValue, toast, refetch, handleCommentCancel]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess && response.data) {
      response.data.fileList?.forEach((item: FileModel) => (item.fileSizeNm = getFileSize(item.fileSize)));
      setQnaModel(response.data);
    }
  }, [response, isSuccess, isError, toast]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '삭제 중 에러가 발생했습니다.',
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '삭제되었습니다.',
      });
      goToList();
    }
  }, [dResponse, dIsSuccess, dIsError, goToList, navigate, toast]);

  if (!qnaId) {
    return (
      <EmptyState
        type="warning"
        description="조회에 필요한 정보가 없습니다"
        confirmText="돌아가기"
        onConfirm={goToList}
      />
    );
  }

  return (
    <>
      <Stack direction="Vertical" gap="MD" className="height-100 contentDeatilWrap">
        <HorizontalTable className="height-100">
          <TR>
            <TH colSpan={4} className="headerName">
              <Stack className="headerNameWrap">
                <Typography variant="h3">{qnaModel?.sj}</Typography>
                <ul>
                  <li>{getCode(GroupCodeType.QNA_TYPE, qnaModel?.clCode || '')?.codeNm}</li>
                  <li>{`${qnaModel?.rgstDeptNm || ''} ${qnaModel?.rgstNm || ''}`}</li>
                  <li>{qnaModel?.modiDt}</li>
                  <li>{`조회수 ${qnaModel?.viewCnt}`}</li>
                </ul>
              </Stack>
            </TH>
          </TR>
          <TR className="height-100">
            <TD colSpan={4} className="content">
              <TinyEditor content={qnaModel?.cn} disabled />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} className="attachFile">
              첨부파일
            </TH>
            <TD colSpan={3}>
              <ul className="attachFileList">
                {qnaModel?.fileList.map((file: FileModel) => (
                  <li>
                    <Link onClick={() => handleFileDownload(file.fileId, file.fileNm)}>
                      <Stack>
                        <AttachFileIcon />
                        {`${file.fileNm} (${file.fileSizeNm})`}
                      </Stack>
                    </Link>
                  </li>
                ))}
              </ul>
            </TD>
          </TR>
          <TR>
            <TD colSpan={4} className="reply">
              <Stack direction="Vertical" gap="SM" className="width-100">
                <Typography variant="h6">
                  Comment
                  <span className="total">{`${qnaModel?.comments.length || 0}`}</span>건
                </Typography>

                <form onSubmit={handleSubmit(onCreateCommentSubmit)}>
                  <Stack>
                    <Stack gap="SM" className="width-100" direction="Vertical">
                      <TextField
                        multiline
                        size="LG"
                        className="width-100"
                        autoFocus
                        {...register('answ', {
                          required: { value: true, message: 'answer is required.' },
                        })}
                        validation={errors?.answ?.message ? 'Error' : undefined}
                      />
                    </Stack>
                    <Button type="submit" size="LG" className="btn-reg">
                      등록
                    </Button>
                  </Stack>
                  <ErrorLabel message={errors?.answ?.message} />
                </form>

                {qnaModel?.comments
                  .sort((a, b) => new Date(a.rgstDt).getTime() - new Date(b.rgstDt).getTime())
                  .map((qnaItem) => (
                    <Stack gap="SM" direction="Vertical">
                      <Stack>
                        <Stack gap="SM" className="width-100">
                          <Typography variant="h6">{`${qnaItem.rgstDeptNm || ''} ${qnaItem.rgstNm || ''}`}</Typography>
                          <Label>{qnaItem.modiDt}</Label>
                        </Stack>

                        {watch().qnaId === qnaItem.qnaId ? (
                          <Stack>
                            <Button appearance="Unfilled" onClick={handleCommentCancel}>
                              취소
                            </Button>
                          </Stack>
                        ) : (
                          <Stack>
                            <Button appearance="Unfilled" onClick={() => handleCommentUpdate(qnaItem)}>
                              수정
                            </Button>
                            <Button appearance="Unfilled" onClick={() => handleCommentDelete(qnaItem.qnaId)}>
                              삭제
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                      <Stack gap="SM" direction="Vertical">
                        {watch().qnaId === qnaItem.qnaId ? (
                          <form onSubmit={uHandleSubmit(onUpdateCommentSubmit)}>
                            <Stack>
                              <Stack gap="SM" className="width-100" direction="Vertical">
                                <TextField
                                  multiline
                                  size="LG"
                                  className="width-100"
                                  autoFocus
                                  {...uRegister('answ', {
                                    required: { value: true, message: 'answer is required.' },
                                  })}
                                  validation={uErrors?.answ?.message ? 'Error' : undefined}
                                />
                              </Stack>
                              <Button type="submit" size="LG" className="btn-confirm">
                                확인
                              </Button>
                            </Stack>
                            <ErrorLabel message={uErrors?.answ?.message} />
                          </form>
                        ) : (
                          <Typography variant="body1">{qnaItem.answ}</Typography>
                        )}
                      </Stack>
                    </Stack>
                  ))}
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              다음
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={5} align="left" className="nextContent">
              {qnaModel?.nextSj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(qnaModel?.nextId)}>
                  {qnaModel?.nextSj}
                </Link>
              )}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              이전
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={5} align="left" className="nextContent">
              {qnaModel?.preSj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(qnaModel?.preId)}>
                  {qnaModel?.preSj}
                </Link>
              )}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End" className="margin-top-8">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
          수정
        </Button>
        <Button priority="Normal" size="LG" onClick={handleDelete}>
          삭제
        </Button>
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
