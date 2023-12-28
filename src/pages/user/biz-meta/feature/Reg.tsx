import '@/assets/styles/Board.scss';
import ErrorLabel from '@/components/error/ErrorLabel';
import { useCreateFeature } from '@/hooks/mutations/useFeatureMutations';
import { useFeatureAllList, useFeatureSeList, useFeatureTypList } from '@/hooks/queries/useFeatureQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, ModalType, ValidType } from '@/models/common/Constants';
import {
  CreatedFeatureModel,
  FeatureAllParams,
  FeatureKeyType,
  FeatureParams,
  FeatureSeparatesModel,
} from '@/models/model/FeatureModel';
import { PageModel } from '@/models/model/PageModel';
import { UserModel } from '@/models/model/UserModel';
import { selectCodeList } from '@/reducers/codeSlice';
import { openModal } from '@/reducers/modalSlice';
import { tbColReg } from '@/utils/RegularExpression';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const initFeatureAllParams: FeatureAllParams = {
  featureKoNm: undefined,
  featureEnNm: undefined,
};

const Reg = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const params: FeatureParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    setError,
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
  const [featureTypList, setFeatureTypList] = useState<Array<FeatureSeparatesModel>>();
  const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([]);
  const [featureAllParams, setFeatureAllParams] = useState<FeatureAllParams>(initFeatureAllParams);
  const [featureAllKey, setFeatureAllKey] = useState<FeatureKeyType>('featureKoNm');
  const [duplicationError, setDuplicationError] = useState<any>(initFeatureAllParams);
  const { data: response, mutate, isSuccess, isError } = useCreateFeature(values);
  const { data: tResponse, isError: tIsError } = useFeatureTypList();
  const { refetch: sRefetch, data: sResponse, isError: sIsError } = useFeatureSeList(values.featureSeGrp);
  const {
    data: faResponse,
    isError: faIsError,
    refetch: faRefetch,
  } = useFeatureAllList({ [featureAllKey]: featureAllParams[featureAllKey] }, { enabled: false, suspense: false });

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

  const handleUserSelectModal = () => {
    dispatch(
      openModal({
        type: ModalType.USER_SELECT,
        onConfirm: (users: UserModel) => {
          setValue('enrUserId', users.userId);
          setValue('enrUserNm', users.userNm);
          setValue('enrDeptCode', users.deptCode);
          setValue('enrDeptNm', users.deptNm);
        },
      })
    );
  };

  const handleCheckDuplication = (key: FeatureKeyType) => {
    if (values[key]) {
      setFeatureAllKey(key);
      setFeatureAllParams((prevState) => ({ ...prevState, [key]: values[key] }));
    } else {
      setError(key, {
        type: 'empty',
        message: t('bizMeta:message.textInput'),
      });
    }
  };

  const onSubmit = (data: CreatedFeatureModel) => {
    if (data.featureKoNm !== featureAllParams.featureKoNm) {
      setError('featureKoNm', {
        type: 'validCheck',
        message: t('bizMeta:message.validCheck'),
      });
      return;
    } else if (duplicationError.featureKoNm) {
      setError('featureKoNm', {
        type: 'duplication',
        message: t('bizMeta:message.duplicationNm'),
      });
      return;
    }

    if (data.featureEnNm !== featureAllParams.featureEnNm) {
      setError('featureEnNm', {
        type: 'validCheck',
        message: t('bizMeta:message.validCheck'),
      });
      return;
    } else if (duplicationError.featureEnNm) {
      setError('featureEnNm', {
        type: 'duplication',
        message: t('bizMeta:message.duplicationNm'),
      });
      return;
    }

    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.create'),
        content: t('common.modal.message.createConfirm'),
        onConfirm: mutate,
      })
    );
  };

  useDidMountEffect(() => {
    faRefetch();
  }, [featureAllParams]);

  useEffect(() => {
    if (values.featureSeGrp) {
      sRefetch();
    }
  }, [watch().featureSeGrp, sRefetch]);

  useEffect(() => {
    if (tIsError || tResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('bizMeta:toast.error.featureSeGrpList'),
      });
    } else {
      if (tResponse?.data) {
        setFeatureTypList(tResponse.data);
      }
    }
  }, [tResponse, tIsError, toast]);

  useEffect(() => {
    if (sIsError || sResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('bizMeta:toast.error.featureSeList'),
      });
    } else {
      if (sResponse?.data) {
        setFeatureSeList(sResponse.data);
      }
    }
  }, [sResponse, sIsError, toast]);

  useEffect(() => {
    if (faIsError || faResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('bizMeta:toast.error.duplication'),
      });
    } else {
      if (faResponse?.data) {
        if (faResponse.data.length === 0) {
          setDuplicationError((prevState: any) => ({
            ...prevState,
            [featureAllKey]: undefined,
          }));
          toast({
            type: ValidType.INFO,
            content: t('bizMeta:toast.confirm.availableNm'),
          });
        } else {
          setError(featureAllKey, {
            type: 'duplication',
            message: t('bizMeta:toast.confirm.duplicationNm'),
          });
          setDuplicationError((prevState: any) => ({
            ...prevState,
            [featureAllKey]: true,
          }));
        }
      }
    }
  }, [faResponse, faIsError, featureAllKey, featureAllParams, setError, toast]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.create'),
      });
    } else if (isSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.create'),
      });
      goToList();
    }
  }, [response, isSuccess, isError, goToList, navigate, toast]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100">
        <Stack direction="Vertical" gap="MD" className="height-100">
          <Typography variant="h3">{t('bizMeta:header.basicInfo')}</Typography>
          <HorizontalTable>
            <TR>
              <TH required colSpan={1} align="right">
                {t('bizMeta:label.featureSeGrp')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="featureSeGrp"
                    control={control}
                    rules={{
                      required: t('common.validate.required'),
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder={t('common.placeholder.all')}
                        className="width-100"
                        ref={field.ref}
                        onChange={(e, value) => value && field.onChange(value)}
                        status={errors?.featureSeGrp?.message ? 'error' : undefined}
                        value={field.value}
                      >
                        {featureTypList?.map((item) => (
                          <SelectOption value={item.seId}>{item.seNm}</SelectOption>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorLabel message={errors?.featureSeGrp?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                {t('bizMeta:label.featureSe')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="featureSe"
                    control={control}
                    rules={{
                      required: t('common.validate.required'),
                      maxLength: { value: 16, message: t('common.validate.maxLength') },
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder={t('common.placeholder.all')}
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
                {t('bizMeta:label.featureId')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureId', {
                      maxLength: { value: 32, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.featureId?.message ? 'Error' : undefined}
                    disabled
                  />
                  <ErrorLabel message={errors?.featureId?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                {t('bizMeta:label.featureTyp')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Controller
                    name="featureTyp"
                    control={control}
                    rules={{
                      required: t('common.validate.required'),
                      maxLength: { value: 16, message: t('common.validate.maxLength') },
                    }}
                    render={({ field }) => (
                      <Select
                        appearance="Outline"
                        placeholder={t('common.placeholder.all')}
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
                {t('bizMeta:label.koNm')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Stack gap="SM">
                    <TextField
                      className="width-100"
                      {...register('featureKoNm', {
                        required: { value: true, message: t('common.validate.required') },
                        maxLength: { value: 100, message: t('common.validate.maxLength') },
                        validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                      })}
                      validation={errors?.featureKoNm?.message ? 'Error' : undefined}
                      autoFocus
                    />
                    <Button
                      appearance="Contained"
                      priority="Normal"
                      shape="Square"
                      size="MD"
                      onClick={() => handleCheckDuplication('featureKoNm')}
                    >
                      {t('common.button.duplicateCheck')}
                    </Button>
                  </Stack>
                  <ErrorLabel message={errors?.featureKoNm?.message} />
                </Stack>
              </TD>
              <TH required colSpan={1} align="right">
                {t('bizMeta:label.enNm')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Stack gap="SM">
                    <TextField
                      className="width-100"
                      {...register('featureEnNm', {
                        pattern: { value: tbColReg, message: t('common.validate.requiredEn') },
                        required: { value: true, message: t('common.validate.required') },
                        maxLength: { value: 100, message: t('common.validate.maxLength') },
                        validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                      })}
                      validation={errors?.featureEnNm?.message ? 'Error' : undefined}
                    />
                    <Button
                      appearance="Contained"
                      priority="Normal"
                      shape="Square"
                      size="MD"
                      onClick={() => handleCheckDuplication('featureEnNm')}
                    >
                      {t('common.button.duplicateCheck')}
                    </Button>
                  </Stack>
                  <ErrorLabel message={errors?.featureEnNm?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} required align="right">
                {t('bizMeta:label.featureDef')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureDef', {
                      required: { value: true, message: t('common.validate.required') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.featureDef?.message ? 'Error' : undefined}
                  />
                  <ErrorLabel message={errors?.featureDef?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                {t('bizMeta:label.calcUnt')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('calcUnt', {
                      maxLength: { value: 32, message: t('common.validate.maxLength') },
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.calcUnt?.message ? 'Error' : undefined}
                  />
                  <ErrorLabel message={errors?.calcUnt?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                {t('bizMeta:label.featureFm')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    multiline
                    className="width-100 height-200"
                    {...register('featureFm', {
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.featureFm?.message ? 'Error' : undefined}
                  />
                  <ErrorLabel message={errors?.featureFm?.message} />
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">
                {t('bizMeta:label.featureRelTb')}
              </TH>
              <TD colSpan={5}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('featureRelTb', {
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.featureRelTb?.message ? 'Error' : undefined}
                  />
                  <ErrorLabel message={errors?.featureRelTb?.message} />
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
                    {...register('featureDsc', {
                      validate: (value) => (value === value?.trim() ? true : t('common.validate.trim')),
                    })}
                    validation={errors?.featureDsc?.message ? 'Error' : undefined}
                  />
                  <ErrorLabel message={errors?.featureDsc?.message} />
                </Stack>
              </TD>
            </TR>
          </HorizontalTable>
        </Stack>

        <Stack direction="Vertical" gap="MD">
          <Typography variant="h3">{t('bizMeta:header.applyInfo')}</Typography>
          <HorizontalTable>
            <TR>
              <TH align="right" colSpan={1} required>
                {t('bizMeta:label.enrUserNm')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <Stack gap="SM">
                    <TextField
                      className="width-100"
                      {...register('enrUserNm', {
                        required: { value: true, message: t('common.validate.required') },
                        maxLength: { value: 32, message: t('common.validate.maxLength') },
                      })}
                      validation={errors?.enrUserNm?.message ? 'Error' : undefined}
                      disabled
                    />
                    <Button
                      appearance="Contained"
                      priority="Normal"
                      shape="Square"
                      size="MD"
                      onClick={handleUserSelectModal}
                    >
                      <span className="searchIcon"></span>
                    </Button>
                  </Stack>
                  <ErrorLabel message={errors?.enrUserNm?.message} />
                </Stack>
              </TD>
              <TH align="right" colSpan={1}>
                {t('bizMeta:label.enrDeptNm')}
              </TH>
              <TD colSpan={2}>
                <Stack gap="SM" className="width-100" direction="Vertical">
                  <TextField
                    className="width-100"
                    {...register('enrDeptNm', {
                      maxLength: { value: 16, message: t('common.validate.maxLength') },
                    })}
                    validation={errors?.enrDeptNm?.message ? 'Error' : undefined}
                    disabled
                  />
                  <ErrorLabel message={errors?.enrDeptNm?.message} />
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
            {t('common.button.reg')}
          </Button>
          <Button size="LG" onClick={handleList}>
            {t('common.button.list')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
export default Reg;
