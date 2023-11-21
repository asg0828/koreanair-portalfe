import { AddCircleOutlineOutlinedIcon, RemoveCircleOutlineOutlinedIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import ErrorLabel from '@/components/error/ErrorLabel';
import VerticalTable from '@/components/table/VerticalTable';
import { useUpdateDataset } from '@/hooks/mutations/useDatasetMutations';
import { useDatasetById } from '@/hooks/queries/useDatasetQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { DatasetColumnModel, UpdatedDatasetModel } from '@/models/model/DatasetModel';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const mtsId: string = location?.state?.mtsId || '';
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
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'columnSpecs',
  });
  const values = getValues();
  const codeList = useAppSelector(selectCodeList(GroupCodeType.DBMS));
  const columns: Array<ColumnsInfo> = [
    {
      headerName: '영문명',
      field: 'mcsEnNm',
      colSpan: 1.5,
      maxLength: 100,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) =>
        EditableColumnItem(rowIndex, fieldName, maxLength),
    },
    {
      headerName: '한글명',
      field: 'mcsKoNm',
      colSpan: 1.5,
      maxLength: 100,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) =>
        EditableColumnItem(rowIndex, fieldName, maxLength),
    },
    {
      headerName: '원천 컬럼명',
      field: 'srcClNm',
      colSpan: 1.5,
      maxLength: 300,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) =>
        EditableColumnItem(rowIndex, fieldName, maxLength),
    },
    {
      headerName: '정의',
      field: 'mcsDef',
      colSpan: 3.9,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) =>
        EditableColumnItem(rowIndex, fieldName, maxLength),
    },
    {
      headerName: '산출로직',
      field: 'clFm',
      colSpan: 1.1,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) =>
        CalculationLogicItem(rowIndex, fieldName, maxLength),
    },
    {
      headerName: '',
      field: '',
      colSpan: 0.5,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) => {
        return (
          <Stack onClick={() => handleRemove(rowIndex)}>
            <RemoveCircleOutlineOutlinedIcon color="action" />
          </Stack>
        );
      },
    },
  ];
  const { data: response, isSuccess, isError } = useDatasetById(mtsId);
  const { data: uResponse, isSuccess: uIsSuccess, isError: uIsError, mutate } = useUpdateDataset(mtsId, values);

  const EditableColumnItem = (rowIndex: number, fieldName: fieldType, maxLength?: number) => {
    return (
      <Stack gap="SM" className="width-100" direction="Vertical">
        <TextField
          className="width-100"
          {...register(`columnSpecs.${rowIndex}.${fieldName}`, {
            required: { value: true, message: `${fieldName} is required.` },
            maxLength: maxLength && { value: maxLength, message: 'max length exceeded' },
          })}
          onChange={(e) => handleChangeRows(rowIndex, fieldName, e.target.value)}
        />
        <ErrorLabel message={errors?.columnSpecs?.[rowIndex]?.[fieldName]?.message} />
      </Stack>
    );
  };

  const CalculationLogicItem = (rowIndex: number, fieldName: fieldType, maxLength?: number) => {
    return (
      <Stack gap="SM" className="width-100" direction="Vertical">
        <Stack>
          <TextField
            multiline
            className="hidden"
            {...register(`columnSpecs.${rowIndex}.${fieldName}`, {
              required: { value: true, message: `${fieldName} is required.` },
              maxLength: maxLength && { value: maxLength, message: 'max length exceeded' },
            })}
          />
          <Button
            className="width-100"
            appearance="Contained"
            onClick={() =>
              openCalculationLogicModal(rowIndex, fieldName, getValues(`columnSpecs.${rowIndex}.${fieldName}`))
            }
          >
            입력
          </Button>
        </Stack>
        <ErrorLabel message={errors?.columnSpecs?.[rowIndex]?.[fieldName]?.message} />
      </Stack>
    );
  };

  const openCalculationLogicModal = (rowIndex: number, fieldName: fieldType, value: string) => {
    dispatch(
      openModal({
        type: ModalType.CALCULATION_LOGIC,
        title: '산출로직',
        content: values.columnSpecs[rowIndex][fieldName],
        onConfirm: (value: string) => setValue(`columnSpecs.${rowIndex}.${fieldName}`, value),
        onCancle: () => setValue(`columnSpecs.${rowIndex}.${fieldName}`, values.columnSpecs[rowIndex][fieldName]),
      })
    );
  };

  const goToList = () => {
    navigate('..');
  };

  const handleAdd = () => {
    append({
      ...initRows,
      index: fields.length,
    });
  };

  const handleRemove = (rowIndex: number) => {
    if (rowIndex !== 0) {
      const newRows = [...fields];
      newRows.splice(rowIndex, 1);
      setValue('columnSpecs', newRows);
    }
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
        title: ModalTitle.SAVE,
        content: '수정하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  useEffect(() => {
    if (isSuccess && response.data) {
      setValue('mtsKoNm', response.data.mtsKoNm);
      setValue('mtsEnNm', response.data.mtsEnNm);
      setValue('mtsDef', response.data.mtsDef);
      setValue('srcSys', response.data.srcSys);
      setValue('srcTbNm', response.data.srcTbNm);
      setValue('srcDbCd', response.data.srcDbCd);
      setValue('mtsDsc', response.data.mtsDsc);

      response.data?.columnSpecs.forEach((item: DatasetColumnModel, index: number) => {
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
  }, [isSuccess, response?.data, setValue, append]);

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

  if (!mtsId) {
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
      <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100">
        <Stack direction="Vertical" gap="MD" className="height-100">
          <Typography variant="h3">기본 정보</Typography>
          <HorizontalTable>
            <TR>
              <TH required colSpan={1} align="right">
                테이블 영문명
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('mtsEnNm', {
                      required: { value: true, message: 'mtsEnNm is required.' },
                      maxLength: { value: 100, message: 'max length exceeded' },
                    })}
                    validation={errors?.mtsEnNm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.mtsEnNm?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                테이블 한글명
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('mtsKoNm', {
                      required: { value: true, message: 'mtsKoNm is required.' },
                      maxLength: { value: 100, message: 'max length exceeded' },
                    })}
                    validation={errors?.mtsKoNm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.mtsKoNm?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH required colSpan={1} align="right">
                테이블 정의
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    multiline
                    className="width-100"
                    {...register('mtsDef', {
                      required: { value: true, message: 'mtsDef is required.' },
                      maxLength: { value: 100, message: 'max length exceeded' },
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
                컬럼 정의
              </TH>
              <TD colSpan={5} className="height-300 overflow-auto">
                <Stack gap="SM" className="width-100 height-100" direction="Vertical" alignItems="Start">
                  <VerticalTable columns={columns} rows={fields} />
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
                원천시스템
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('srcSys', {
                      maxLength: { value: 300, message: 'max length exceeded' },
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
                원천테이블명
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('srcTbNm', {
                      maxLength: { value: 300, message: 'max length exceeded' },
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
                DB명
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="srcDbCd"
                    control={control}
                    rules={{
                      maxLength: { value: 16, message: 'max length exceeded' },
                      required: 'srcDbCd is required.',
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder="전체"
                        className="width-100"
                        ref={field.ref}
                        onChange={(e, value) => field.onChange(value)}
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
                비고
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('mtsDsc', {})}
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
            등록
          </Button>
          <Button size="LG" onClick={goToList}>
            목록
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
export default Edit;
