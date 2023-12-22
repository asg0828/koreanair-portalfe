import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import { useUserById } from '@/hooks/queries/useUserQueries';
import { ValidType } from '@/models/common/Constants';
import { UserModel, UserParams } from '@/models/model/UserModel';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const { t } = useTranslation();
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
        content: t('common.toast.error.read'),
      });
    } else if (isSuccess) {
      setUserModel(response.data);
    }
  }, [response, isSuccess, isError, toast]);

  if (!userId) {
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
    <>
      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">{t('management:header.userBasicInfo')}</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.userEmail')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.userEmail}
            </TD>
            <TH colSpan={1} align="right">
              {t('management:label.userNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.userNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.userId')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.userId}
            </TD>
            <TH colSpan={1} align="right">
              {t('management:label.deptNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.deptNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.employmentYn')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.useYn}
            </TD>
            <TH colSpan={1} align="right">
              {t('management:label.eUserAuthNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.groupNm}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">{t('management:header.userAuthInfo')}</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.bfUserAuthNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.bfUserAuthNm}
            </TD>
            <TH colSpan={1} align="right">
              {t('management:label.apldUserAuthNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.apldUserAuthNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.bfMgrAuthNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.bfMgrAuthNm}
            </TD>
            <TH colSpan={1} align="right">
              {t('management:label.apldMgrAuthNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.apldMgrAuthNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.modiDt')}
            </TH>
            <TD colSpan={5} align="left">
              {userModel?.modiDt}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button size="LG" onClick={goToList}>
          {t('common.button.list')}
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
