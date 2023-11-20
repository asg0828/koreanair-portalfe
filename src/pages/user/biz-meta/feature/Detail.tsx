import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import { useDeleteFeature } from '@/hooks/mutations/useFeatureMutations';
import { useFeatureById } from '@/hooks/queries/useFeatureQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import { FeatureModel } from '@/models/model/FeatureModel';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [featureModel, setFeatureModel] = useState<FeatureModel>();
  const featureId: string = location?.state?.featureId || '';
  const { data: response, isSuccess, isError } = useFeatureById(featureId);
  const { mutate, data: dResponse, isSuccess: dIsSuccess, isError: dIsError } = useDeleteFeature(featureId);

  const goToList = () => {
    navigate('..');
  };

  const goToEdit = () => {
    navigate('../edit', {
      state: {
        featureId: featureId,
      },
    });
  };

  const handleDelete = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: ModalTitle.REMOVE,
        content: '삭제하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      setFeatureModel(response.data);
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
      navigate('..');
    }
  }, [dResponse, dIsSuccess, dIsError, toast, navigate]);

  if (!featureId) {
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
    <>
      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">기본 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH required colSpan={1} align="right">
              대구분
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureSeGrpNm}
            </TD>
            <TH required colSpan={1} align="right">
              중구분
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureSeNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              Feature ID
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureId}
            </TD>
            <TH required colSpan={1} align="right">
              Feature 타입
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureTypNm}
            </TD>
          </TR>
          <TR>
            <TH required colSpan={1} align="right">
              한글명
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureKoNm}
            </TD>
            <TH required colSpan={1} align="right">
              영문명
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.featureEnNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} required align="right">
              Feature 정의
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.featureDef}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              산출단위
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.featureFm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              산출로직
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.calcUnt}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              비고
            </TH>
            <TD colSpan={5} align="left">
              {featureModel?.featureDsc}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">신청 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH align="right" colSpan={1}>
              Feature 신청자
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.enrUserNm}
            </TD>
            <TH align="right" colSpan={1}>
              신청부서
            </TH>
            <TD colSpan={2} align="left">
              {featureModel?.enrDeptNm}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
          수정
        </Button>
        <Button priority="Normal" appearance="Outline" size="LG" onClick={handleDelete}>
          삭제
        </Button>
        <Button appearance="Outline" size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
