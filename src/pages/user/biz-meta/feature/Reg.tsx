import '@/assets/styles/Board.scss';
import ErrorLabel from '@/components/error/ErrorLabel';
import { useCreateFeature } from '@/hooks/mutations/useFeatureMutations';
import { useFeatureSeList } from '@/hooks/queries/useFeatureQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ModalType, ValidType } from '@/models/common/Constants';
import { CreatedFeatureModel, FeatureSeparatesModel } from '@/models/model/FeatureModel';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';

const Reg = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreatedFeatureModel>({
    mode: 'onChange',
    defaultValues: {
      featureId: '',
      featureTyp: '',
      featureSeGrp: '',
      featureSe: '',
      featureKoNm: '',
      featureEnNm: '',
      calcUnt: '',
      featureDef: '',
      featureFm: '',
      enrUserId: '',
      enrDeptCode: '',
      featureRelTb: '',
      featureDsc: '',
    },
  });
  const values = getValues();
  const codeList = useAppSelector(selectCodeList(GroupCodeType.FEATURE_TYPE));
  const featureTypList = useRouteLoaderData('/biz-meta/feature') as Array<FeatureSeparatesModel>;
  const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([]);
  const { data: response, mutate, isSuccess, isError } = useCreateFeature(values);
  const { refetch: sRefetch, data: sResponse, isError: sIsError } = useFeatureSeList(values.featureSeGrp);

  const goToList = () => {
    navigate('..');
  };

  const onSubmit = (data: CreatedFeatureModel) => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '저장',
        content: '등록하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  useEffect(() => {
    if (values.featureSeGrp) {
      sRefetch();
    }
  }, [values.featureSeGrp, sRefetch]);

  useEffect(() => {
    if (sIsError || sResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (sResponse?.data) {
        setFeatureSeList(sResponse.data);
      }
    }
  }, [sResponse, sIsError, toast]);

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
      <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100">
        <Stack direction="Vertical" gap="MD" className="height-100">
          <Typography variant="h3">기본 정보</Typography>
          <HorizontalTable>
            <TR>
              <TH required colSpan={1} align="right">
                대구분
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="featureSeGrp"
                    control={control}
                    rules={{
                      required: 'featureSeGrp is required.',
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder="전체"
                        className="width-100"
                        ref={field.ref}
                        onChange={(e, value) => value && field.onChange(value)}
                        status={errors?.featureSeGrp?.message ? 'error' : undefined}
                        value={field.value}
                      >
                        {featureTypList.map((item) => (
                          <SelectOption value={item.seId}>{item.seNm}</SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorLabel message={errors?.featureSeGrp?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                중구분
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="featureSe"
                    control={control}
                    rules={{
                      required: 'featureSe is required.',
                      maxLength: { value: 16, message: 'max length exceeded' },
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder="전체"
                        className="width-100"
                        ref={field.ref}
                        onChange={(e, value) => value && field.onChange(value)}
                        status={errors?.featureSe?.message ? 'error' : undefined}
                        value={field.value}
                      >
                        {featureSeList.map((item) => (
                          <SelectOption value={item.seId}>{item.seNm}</SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorLabel message={errors?.featureSe?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                Feature ID
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureId', {
                      maxLength: { value: 32, message: 'max length exceeded' },
                    })}
                    validation={errors?.featureId?.message ? 'Error' : undefined}
                    autoFocus
                    disabled
                  />
                  <ErrorLabel message={errors?.featureId?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                Feature 타입
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="featureTyp"
                    control={control}
                    rules={{
                      required: 'featureTyp is required.',
                      maxLength: { value: 16, message: 'max length exceeded' },
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder="전체"
                        className="width-100"
                        ref={field.ref}
                        onChange={(e, value) => value && field.onChange(value)}
                        status={errors?.featureTyp?.message ? 'error' : undefined}
                        value={field.value}
                      >
                        {codeList.map((codeItem: any) => (
                          <SelectOption value={codeItem.codeId}>{codeItem.codeNm}</SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorLabel message={errors?.featureTyp?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH required colSpan={1} align="right">
                한글명
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureKoNm', {
                      required: { value: true, message: 'featureKoNm is required.' },
                      maxLength: { value: 100, message: 'max length exceeded' },
                    })}
                    validation={errors?.featureKoNm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.featureKoNm?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                영문명
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureEnNm', {
                      required: { value: true, message: 'featureEnNm is required.' },
                      maxLength: { value: 100, message: 'max length exceeded' },
                    })}
                    validation={errors?.featureEnNm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.featureEnNm?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} required align="right">
                Feature 정의
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureDef', {
                      required: { value: true, message: 'featureDef is required.' },
                    })}
                    validation={errors?.featureDef?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.featureDef?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                산출단위
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('calcUnt', {
                      maxLength: { value: 32, message: 'max length exceeded' },
                    })}
                    validation={errors?.calcUnt?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.calcUnt?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                산출로직
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureFm', {})}
                    validation={errors?.featureFm?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.featureFm?.message} />
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
                    {...register('featureDsc', {})}
                    validation={errors?.featureDsc?.message ? 'Error' : undefined}
                    autoFocus
                  />
                  <ErrorLabel message={errors?.featureDsc?.message} />
                </Stack>
              </TD>
            </TR>
          </HorizontalTable>
        </Stack>

        <Stack direction="Vertical" gap="MD">
          <Typography variant="h3">신청 정보</Typography>
          <HorizontalTable>
            <TR>
              <TH align="right" colSpan={1} required>
                Feature 신청자
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Stack gap="SM">
                    <TextField
                      className="width-100"
                      {...register('enrUserId', {
                        required: { value: true, message: 'enrUserId is required.' },
                        maxLength: { value: 32, message: 'max length exceeded' },
                      })}
                      validation={errors?.enrUserId?.message ? 'Error' : undefined}
                      autoFocus
                    />
                    <Button appearance="Contained" priority="Normal" shape="Square" size="MD">
                      <span className="searchIcon"></span>
                    </Button>
                  </Stack>
                  <ErrorLabel message={errors?.enrUserId?.message} />
                </Stack>
              </TD>
              <TH align="right" colSpan={1}>
                신청부서
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('enrDeptCode', {
                      maxLength: { value: 16, message: 'max length exceeded' },
                    })}
                    validation={errors?.enrDeptCode?.message ? 'Error' : undefined}
                    autoFocus
                    disabled
                  />
                  <ErrorLabel message={errors?.enrDeptCode?.message} />
                </Stack>
              </TD>
            </TR>
          </HorizontalTable>
        </Stack>

        <Stack gap="SM" justifyContent="End">
          <Button priority="Primary" appearance="Contained" size="LG" type="submit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"></path>
            </svg>
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
export default Reg;
