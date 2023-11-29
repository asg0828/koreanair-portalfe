import ErrorLabel from '@/components/error/ErrorLabel';
import DataGrid from '@/components/grid/DataGrid';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useCreateAdminAuth, useDeleteAdminAuth, useUpdateAdminAuth } from '@/hooks/mutations/useAuthMutations';
import { useAdminAuthAllList } from '@/hooks/queries/useAuthQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType, ValidType } from '@/models/common/Constants';
import { AuthModel, UpdatedAuthModel } from '@/models/model/AuthModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { openModal } from '@/reducers/modalSlice';
import { getPagingList, getTotalPage } from '@/utils/PagingUtil';
import { Button, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const columns = [
  { headerName: 'No', field: 'rownum', colSpan: 1 },
  { headerName: '권한그룹ID', field: 'authId', colSpan: 2 },
  { headerName: '권한그룹명', field: 'authNm', colSpan: 2 },
  { headerName: '비고', field: 'authDsc', colSpan: 5 },
];

const List = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<AuthModel>>([]);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdatedAuthModel>({
    mode: 'onChange',
    defaultValues: {
      authId: '',
      authNm: '',
      authDsc: '',
    },
  });
  const values = getValues();
  const { data: response, isError, refetch } = useAdminAuthAllList();
  const { data: cResponse, isSuccess: cIsSuccess, isError: cIsError, mutate: cMuate } = useCreateAdminAuth();
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMuate } = useUpdateAdminAuth();
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate: dMutate } = useDeleteAdminAuth();

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  const handleDetail = (row: AuthModel) => {
    setValue('authId', row.authId);
    setValue('authNm', row.authNm);
    setValue('authDsc', row.authDsc);
  };

  const handleDelete = () => {
    if (values.authId) {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '삭제',
          content: '삭제하시겠습니까?',
          onConfirm: () => dMutate(values.authId),
        })
      );
    } else {
      toast({
        type: ValidType.INFO,
        content: '선택된 권한그룹이 없습니다.',
      });
    }
  };

  const onSubmit = (data: UpdatedAuthModel) => {
    if (data.authId) {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '수정',
          content: '수정하시겠습니까?',
          onConfirm: () => uMuate(data),
        })
      );
    } else {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '저장',
          content: '등록하시겠습니까?',
          onConfirm: () => cMuate(data),
        })
      );
    }
  };

  const handleClear = () => {
    setFocus('authNm');
    reset();
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        setRows(response.data);
        setPage((prevState) => ({
          ...prevState,
          totalCount: response.data.length,
          totalPage: getTotalPage(response.data.length, page.pageSize),
        }));
      }
    }
  }, [response, isError, page, toast]);

  useEffect(() => {
    if (cIsError || cResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '등록 중 에러가 발생했습니다.',
      });
    } else if (cIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '등록되었습니다.',
      });
      refetch();
      reset();
    }
  }, [cResponse, cIsSuccess, cIsError, toast, refetch, reset]);

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
      refetch();
      reset();
    }
  }, [uResponse, uIsSuccess, uIsError, toast, refetch, reset]);

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
      refetch();
      reset();
    }
  }, [dResponse, dIsSuccess, dIsError, toast, refetch, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DataGrid
        enableSort={true}
        clickable={true}
        columns={columns}
        rows={getPagingList(rows, page)}
        page={page}
        onClick={handleDetail}
        onChange={handlePage}
      />

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">권한그룹 등록</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              권한그룹 ID
            </TH>
            <TD colSpan={2} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('authId', {
                    maxLength: { value: 100, message: 'max length exceeded' },
                  })}
                  validation={errors?.authId?.message ? 'Error' : undefined}
                  disabled
                />
                <ErrorLabel message={errors?.authId?.message} />
              </Stack>
            </TD>
            <TH colSpan={1} align="right" required>
              권한그룹명
            </TH>
            <TD colSpan={2} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('authNm', {
                    required: { value: true, message: 'authNm is required.' },
                    maxLength: { value: 100, message: 'max length exceeded' },
                  })}
                  validation={errors?.authNm?.message ? 'Error' : undefined}
                />
                <ErrorLabel message={errors?.authNm?.message} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              비고
            </TH>
            <TD colSpan={5} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('authDsc', {
                    maxLength: { value: 1000, message: 'max length exceeded' },
                  })}
                  validation={errors?.authDsc?.message ? 'Error' : undefined}
                />
                <ErrorLabel message={errors?.authDsc?.message} />
              </Stack>
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={handleClear}>
          신규
        </Button>
        <Button size="LG" type="submit">
          저장
        </Button>
        <Button size="LG" onClick={handleDelete}>
          삭제
        </Button>
      </Stack>
    </form>
  );
};
export default List;
