import '@/assets/styles/Board.scss';
import { useDeleteFeature } from '@/hooks/mutations/useFeatureMutations';
import { useFeatureById } from '@/hooks/queries/useFeatureQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType, ValidType } from '@/models/common/Constants';
import { FeatureModel, FeatureParams } from '@/models/model/FeatureModel';
import { PageModel } from '@/models/model/PageModel';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Detail = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const contextPath = useAppSelector(selectContextPath());
  const sessionInfo = useAppSelector(selectSessionInfo());
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const featureId: string = searchParams.get('featureId') || '';
  const params: FeatureParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const [featureModel, setFeatureModel] = useState<FeatureModel>();
  const { data: response, isSuccess, isError } = useFeatureById(featureId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteFeature(featureId);

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
        page: page,
      },
    });
  }, [params, page, navigate]);

  const goToEdit = () => {
    navigate(`../edit`, {
      state: {
        featureId: featureId,
        params: params,
        page: page,
      },
    });
  };

  const handleDelete = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.delete'),
        content: t('common.modal.message.deleteConfirm'),
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
    } else if (isSuccess) {
      if (response.data) {
        setFeatureModel(response.data);
      } else {
        toast({
          type: ValidType.INFO,
          content: t('common.toast.info.noData'),
        });
        goToList();
      }
    }
  }, [response, isSuccess, isError, toast]);

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
      goToList();
    }
  }, [dResponse, dIsSuccess, dIsError, goToList, navigate, toast]);

  return (
    <>
      <Stack direction="Vertical" gap="MD" className="detail-container">
        <Typography variant="h3">{t('bizMeta:header.basicInfo')}</Typography>
        <HorizontalTable>
          <TR>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.featureSeGrp')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureSeGrpNm}
            </TD>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.featureSe')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureSeNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.featureId')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureId}
            </TD>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.featureTyp')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureTypNm}
            </TD>
          </TR>
          <TR>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.koNm')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureKoNm}
            </TD>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.enNm')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureEnNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} required align="right">
              {t('bizMeta:label.featureDef')}
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.featureDef}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.calcUnt')}
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.calcUnt}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.featureFm')}
            </TH>
            <TD colSpan={5} align="left">
              <TextField multiline disabled className="width-100 height-200" value={featureModel?.featureFm} />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.featureRelTb')}
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.featureRelTb}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.featureDsc')}
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.featureDsc}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">{t('bizMeta:header.applyInfo')}</Typography>
        <HorizontalTable>
          <TR>
            <TH align="right" colSpan={1}>
              {t('bizMeta:label.enrUserNm')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.enrUserNm}
            </TD>
            <TH align="right" colSpan={1}>
              {t('bizMeta:label.enrDeptNm')}
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.enrDeptNm}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        {(() => {
          if (contextPath === ContextPath.ADMIN) {
            if (sessionInfo.userId === featureModel?.rgstId || sessionInfo.apldMgrAuthId === 'ma23000000001') {
              return (
                <>
                  <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
                    {t('common.button.edit')}
                  </Button>
                  <Button priority="Normal" size="LG" onClick={handleDelete}>
                    {t('common.button.delete')}
                  </Button>
                </>
              );
            } else if (sessionInfo.apldMgrAuthId === 'ma23000000002') {
              return (
                <Button priority="Normal" size="LG" onClick={handleDelete}>
                  {t('common.button.delete')}
                </Button>
              );
            }
          }
          return null;
        })()}
        <Button appearance="Outline" size="LG" onClick={goToList}>
          {t('common.button.list')}
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
