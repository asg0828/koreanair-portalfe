import ErrorLabel from '@/components/error/ErrorLabel';
import DataGrid from '@/components/grid/DataGrid';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useCreateUserAuth, useDeleteUserAuth, useUpdateUserAuth } from '@/hooks/mutations/useAuthMutations';
import { useUserAuthAllList } from '@/hooks/queries/useAuthQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType, ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { AuthModel, UpdatedAuthModel } from '@/models/model/AuthModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { openModal } from '@/reducers/modalSlice';
import { getPagingList, getTotalPage } from '@/utils/PagingUtil';
import { Button, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const List = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<AuthModel>>([]);
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdatedAuthModel>({
    mode: 'onChange',
    defaultValues: {
      authId: '',
      authNm: '',
      authDsc: '',
    },
  });
  const { data: response, isError, refetch } = useUserAuthAllList();
  const { data: cResponse, isSuccess: cIsSuccess, isError: cIsError, mutate: cMuate } = useCreateUserAuth();
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate: uMuate } = useUpdateUserAuth();
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate: dMutate } = useDeleteUserAuth();

  const columns: Array<ColumnsInfo> = [
    { headerName: 'No', field: 'rownum', colSpan: 0.5 },
    { headerName: t('management:label.authId'), field: 'authId', colSpan: 2, align: 'left' },
    { headerName: t('management:label.authNm'), field: 'authNm', colSpan: 2, align: 'left' },
    { headerName: t('management:label.authDsc'), field: 'authDsc', colSpan: 5.5, align: 'left' },
  ];

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  const handleDetail = (row: AuthModel) => {
    setValue('authId', row.authId);
    setValue('authNm', row.authNm);
    setValue('authDsc', row.authDsc);
  };

  const handleDelete = () => {
    const nAuthId = watch().authId;

    if (nAuthId) {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: t('common.modal.title.delete'),
          content: t('common.modal.message.deleteConfirm'),
          onConfirm: () => dMutate(nAuthId),
        })
      );
    } else {
      toast({
        type: ValidType.INFO,
        content: t('management:toast.info.selectAuthGroup'),
      });
    }
  };

  const onSubmit = (data: UpdatedAuthModel) => {
    if (data.authId) {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: t('common.modal.title.update'),
          content: t('common.modal.message.updateConfirm'),
          onConfirm: () => uMuate(data),
        })
      );
    } else {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: t('common.modal.title.create'),
          content: t('common.modal.message.createConfirm'),
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
        content: t('common.toast.error.list'),
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
  }, [response, isError, page.pageSize, toast]);

  useEffect(() => {
    if (cIsError || cResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.create'),
      });
    } else if (cIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.create'),
      });
      refetch();
      reset();
    }
  }, [cResponse, cIsSuccess, cIsError, toast, refetch, reset]);

  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.update'),
      });
    } else if (uIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.update'),
      });
      refetch();
      reset();
    }
  }, [uResponse, uIsSuccess, uIsError, toast, refetch, reset]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.delete'),
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.delete'),
      });
      refetch();
      reset();
    }
  }, [dResponse, dIsSuccess, dIsError, toast, refetch, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DataGrid
        enableSort={false}
        clickable={true}
        isMultiSelected={false}
        columns={columns}
        rows={getPagingList(rows, page)}
        page={page}
        onClick={handleDetail}
        onChange={handlePage}
      />

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">{t('management:header.authGroupReg')}</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.authId')}
            </TH>
            <TD colSpan={2} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('authId', {
                    maxLength: { value: 100, message: t('common.validate.maxLength') },
                    validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                  })}
                  validation={errors?.authId?.message ? 'Error' : undefined}
                  disabled
                />
                <ErrorLabel message={errors?.authId?.message} />
              </Stack>
            </TD>
            <TH colSpan={1} align="right" required>
              {t('management:label.authNm')}
            </TH>
            <TD colSpan={2} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('authNm', {
                    required: { value: true, message: t('common.validate.required') },
                    maxLength: { value: 100, message: t('common.validate.maxLength') },
                    validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                  })}
                  validation={errors?.authNm?.message ? 'Error' : undefined}
                />
                <ErrorLabel message={errors?.authNm?.message} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.authDsc')}
            </TH>
            <TD colSpan={5} align="left">
              <Stack gap="SM" className="width-100" direction="Vertical">
                <TextField
                  className="width-100"
                  {...register('authDsc', {
                    maxLength: { value: 1000, message: t('common.validate.maxLength') },
                    validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                  })}
                  validation={errors?.authDsc?.message ? 'Error' : undefined}
                />
                <ErrorLabel message={errors?.authDsc?.message} />
              </Stack>
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End" className="margin-top-8">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={handleClear}>
          {t('common.button.new')}
        </Button>
        <Button size="LG" type="submit">
          {t('common.button.save')}
        </Button>
        <Button size="LG" onClick={handleDelete}>
          {t('common.button.delete')}
        </Button>
      </Stack>
    </form>
  );
};
export default List;
