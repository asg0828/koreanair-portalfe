import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import { useUserById } from '@/hooks/queries/useUserQueries';
import { ValidType } from '@/models/common/Constants';
import { UserModel, UserParams } from '@/models/model/UserModel';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const params: UserParams = location?.state?.params;
  const [userModel, setUserModel] = useState<UserModel>();
  const userId: string = location?.state?.userId || '';
  const { data: response, isSuccess, isError } = useUserById(userId);

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
      },
    });
  }, [params, navigate]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      setUserModel(response.data);
    }
  }, [response, isSuccess, isError, toast]);

  if (!userId) {
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
      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">사용자 기본정보</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              이메일
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.userEmail}
            </TD>
            <TH colSpan={1} align="right">
              성명
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.userNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              사번
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.userId}
            </TD>
            <TH colSpan={1} align="right">
              부서
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.deptNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              사용여부
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.useYn}
            </TD>
            <TH colSpan={1} align="right">
              사용자예외그룹
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.eUserAuthNm}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">사용자 권한정보</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              이전 사용자 권한
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.bfUserAuthNm}
            </TD>
            <TH colSpan={1} align="right">
              적용 사용자 권한
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.apldUserAuthNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              이전 관리자 권한
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.bfMgrAuthNm}
            </TD>
            <TH colSpan={1} align="right">
              적용 관리자 권한
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.apldMgrAuthNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              최종변경일시
            </TH>
            <TD colSpan={5} align="left">
              {userModel?.rgstDt}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
