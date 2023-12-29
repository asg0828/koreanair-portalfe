import { AddCircleOutlineOutlinedIcon, RemoveCircleOutlineOutlinedIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import VerticalTable from '@/components/table/VerticalTable';
import { useUpdateDataset } from '@/hooks/mutations/useDatasetMutations';
import { useDatasetById } from '@/hooks/queries/useDatasetQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ModalType, ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { DatasetColumnModel, DatasetParams, UpdatedDatasetModel } from '@/models/model/DatasetModel';
import { PageModel } from '@/models/model/PageModel';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { tbColReg } from '@/utils/RegularExpression';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useCallback, useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const initRows: DatasetColumnModel = {
  index: 0,
  mcsKoNm: '',
  mcsEnNm: '',
  mcsDef: '',
  srcClNm: '',
  clFm: '',
};

export type fieldType = 'mcsKoNm' | 'mcsEnNm' | 'mcsDef' | 'srcClNm' | 'clFm';

const Edit = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const mtsId = location?.state?.mtsId;
  const params: DatasetParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdatedDatasetModel>({
    mode: 'onChange',
    defaultValues: {
      mtsKoNm: '',
      mtsEnNm: '',
      mtsDef: '',
      srcSys: '',
      srcTbNm: '',
      srcDbCd: '',
      mtsDsc: '',
      columnSpecs: [],
    },
  });
  const { fields, append, update } = useFieldArray({
    control,
    name: 'columnSpecs',
  });
  const values = getValues();
  const codeList = useAppSelector(selectCodeList(GroupCodeType.DBMS));
  const columns: Array<ColumnsInfo> = [
    {
      headerName: t('bizMeta:label.koNm'),
      field: 'mcsKoNm',
      colSpan: 2,
      maxLength: 100,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number, require?: boolean) =>
        EditableColumnItem(rowIndex, fieldName, maxLength, require),
    },
    {
      headerName: t('bizMeta:label.enNm'),
      field: 'mcsEnNm',
      colSpan: 2,
      maxLength: 100,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number, require?: boolean) =>
        EditableColumnItem(rowIndex, fieldName, maxLength, require),
    },
    {
      headerName: t('bizMeta:label.srcClNm'),
      field: 'srcClNm',
      colSpan: 2,
      maxLength: 300,
      require: false,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number, require?: boolean) =>
        EditableColumnItem(rowIndex, fieldName, maxLength, require),
    },
    {
      headerName: t('bizMeta:label.def'),
      field: 'mcsDef',
      colSpan: 2.9,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number, require?: boolean) =>
        EditableColumnItem(rowIndex, fieldName, maxLength, require),
    },
    {
      headerName: t('bizMeta:label.featureFm'),
      field: 'clFm',
      colSpan: 1.1,
      require: false,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number, require?: boolean) =>
        CalculationLogicItem(rowIndex, fieldName, maxLength, require),
    },
    {
      headerName: '',
      field: '',
      colSpan: 0.5,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) => {
        return (
          fields.length > 1 && (
            <Stack onClick={() => handleRemove(rowIndex)}>
              <RemoveCircleOutlineOutlinedIcon color="action" />
            </Stack>
          )
        );
      },
    },
  ];
  const { data: response, isSuccess, isError } = useDatasetById(mtsId);
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate } = useUpdateDataset(mtsId, values);

  const EditableColumnItem = (rowIndex: number, fieldName: fieldType, maxLength?: number, require?: boolean) => {
    return (
      <Stack gap="SM" className="width-100" direction="Vertical">
        <TextField
          className="width-100"
          {...register(`columnSpecs.${rowIndex}.${fieldName}`, {
            pattern:
              fieldName === 'mcsEnNm' ? { value: tbColReg, message: t('common.validate.requiredEn') } : undefined,
            required: require ? { value: true, message: t('common.validate.required') } : undefined,
            maxLength: maxLength && { value: maxLength, message: t('common.validate.maxLength') },
            validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
          })}
          onChange={(e) => handleChangeRows(rowIndex, fieldName, e.target.value)}
        />
        <ErrorLabel message={errors?.columnSpecs?.[rowIndex]?.[fieldName]?.message} />
      </Stack>
    );
  };

  const CalculationLogicItem = (rowIndex: number, fieldName: fieldType, maxLength?: number, require?: boolean) => {
    return (
      <Stack gap="SM" className="width-100" direction="Vertical">
        <Stack>
          <TextField
            multiline
            className="hidden"
            {...register(`columnSpecs.${rowIndex}.${fieldName}`, {
              required: require ? { value: true, message: t('common.validate.required') } : undefined,
              maxLength: maxLength && { value: maxLength, message: t('common.validate.maxLength') },
              validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
            })}
            onChange={(e) => handleChangeRows(rowIndex, fieldName, e.target.value)}
          />
          <Button
            className="width-100"
            appearance="Contained"
            onClick={() => openCalculationLogicModal(rowIndex, fieldName)}
          >
            {t('common.button.input')}
          </Button>
        </Stack>
        <ErrorLabel message={errors?.columnSpecs?.[rowIndex]?.[fieldName]?.message} />
      </Stack>
    );
  };

  const openCalculationLogicModal = (rowIndex: number, fieldName: fieldType) => {
    dispatch(
      openModal({
        type: ModalType.CALCULATION_LOGIC,
        title: t('bizMeta:label.featureFm'),
        content: values.columnSpecs[rowIndex][fieldName],
        onConfirm: (value: string) => setValue(`columnSpecs.${rowIndex}.${fieldName}`, value),
        onCancle: () => setValue(`columnSpecs.${rowIndex}.${fieldName}`, values.columnSpecs[rowIndex][fieldName]),
      })
    );
  };

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
        page: page,
      },
    });
  }, [params, page, navigate]);

  const handleList = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.confirm'),
        content: t('common.modal.message.listConfirm'),
        onConfirm: goToList,
      })
    );
  };

  const handleAdd = () => {
    setValue('columnSpecs', [
      ...fields,
      {
        ...initRows,
        index: fields.length,
      },
    ]);
  };

  const handleRemove = (rowIndex: number) => {
    setValue(
      'columnSpecs',
      fields.filter((item, index) => index !== rowIndex)
    );
  };

  const handleChangeRows = (rowIndex: number, field: string, value: string) => {
    const row = fields[rowIndex];
    row[field as keyof typeof row] = value;
    update(rowIndex, row);
  };

  const onSubmit = (data: UpdatedDatasetModel) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.update'),
        content: t('common.modal.message.updateConfirm'),
        onConfirm: mutate,
      })
    );
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.read'),
      });
    } else if (isSuccess && response.data) {
      setValue('mtsKoNm', response.data.mtsKoNm);
      setValue('mtsEnNm', response.data.mtsEnNm);
      setValue('mtsDef', response.data.mtsDef);
      setValue('srcSys', response.data.srcSys);
      setValue('srcTbNm', response.data.srcTbNm);
      setValue('srcDbCd', response.data.srcDbCd);
      setValue('mtsDsc', response.data.mtsDsc);

      response.data?.columnSpecs?.forEach((item: DatasetColumnModel, index: number) => {
        append({
          index: index,
          mcsEnNm: item.mcsEnNm,
          mcsKoNm: item.mcsKoNm,
          srcClNm: item.srcClNm,
          mcsDef: item.mcsDef,
          clFm: item.clFm,
        });
      });
    }
  }, [response, isSuccess, isError, toast, append, setValue]);

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
      goToList();
    }
  }, [uResponse, uIsSuccess, uIsError, goToList, navigate, toast]);

  if (!mtsId) {
    return (
      <EmptyState
        type="warning"
        description={t('common.message.noRequireInfo')}
        confirmText={t('common.message.goBack')}
        onConfirm={goToList}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100">
        <Stack direction="Vertical" gap="MD" className="height-100">
          <Typography variant="h3">{t('bizMeta:header.basicInfo')}</Typography>
          <HorizontalTable>
            <TR>
              <TH required colSpan={1} align="right">
                {t('bizMeta:label.tableKoNm')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('mtsKoNm', {
                      required: { value: true, message: t('common.validate.required') },
                      maxLength: { value: 100, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.mtsKoNm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.mtsKoNm?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                {t('bizMeta:label.tableEnNm')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('mtsEnNm', {
                      pattern: { value: tbColReg, message: t('common.validate.requiredEn') },
                      required: { value: true, message: t('common.validate.required') },
                      maxLength: { value: 100, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.mtsEnNm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.mtsEnNm?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH required colSpan={1} align="right">
                {t('bizMeta:label.tableDef')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    multiline
                    className="width-100"
                    {...register('mtsDef', {
                      required: { value: true, message: t('common.validate.required') },
                      maxLength: { value: 100, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.mtsDef?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.mtsDef?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} required align="right">
                {t('bizMeta:label.columnDef')}
              </TH>
              <TD colSpan={5} className="height-300 overflow-auto">
                <Stack gap="SM" className="width-100 height-100" direction="Vertical" alignItems="Start">
                  <VerticalTable className="tableTdScrollFix" columns={columns} rows={fields} clickable={false} />
                  <Stack className="width-100" justifyContent="Center">
                    <Stack onClick={handleAdd}>
                      <AddCircleOutlineOutlinedIcon fontSize="large" color="primary" />
                    </Stack>
                  </Stack>
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                {t('bizMeta:label.srcSys')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('srcSys', {
                      maxLength: { value: 300, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.srcSys?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.srcSys?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                {t('bizMeta:label.srcTbNm')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('srcTbNm', {
                      maxLength: { value: 1000, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.srcTbNm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.srcTbNm?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} required align="right">
                {t('bizMeta:label.dbNm')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="srcDbCd"
                    control={control}
                    rules={{
                      required: t('common.validate.required'),
                      maxLength: { value: 32, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder={t('common.placeholder.all')}
                        className="width-100"
                        ref={field.ref}
                        onChange={(e, value) => value && field.onChange(value)}
                        status={errors?.srcDbCd?.message ? 'error' : undefined}
                        value={field.value}
                      >
                        {codeList.map((codeItem: any) => (
                          <SelectOption value={codeItem.codeId}>{codeItem.codeNm}</SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorLabel message={errors?.srcDbCd?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                {t('bizMeta:label.featureDsc')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('mtsDsc', {
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.mtsDsc?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.mtsDsc?.message} />
                </Stack>
              </TD>
            </TR>
          </HorizontalTable>
        </Stack>

        <Stack gap="SM" justifyContent="End">
          <Button priority="Primary" appearance="Contained" size="LG" type="submit">
            {t('common.button.save')}
          </Button>
          <Button size="LG" onClick={handleList}>
            {t('common.button.list')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
export default Edit;
