import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import { useUserById } from '@/hooks/queries/useUserQueries';
import { useAppSelector } from '@/hooks/useRedux';
import { ValidType } from '@/models/common/Constants';
import { UserModel } from '@/models/model/UserModel';
import { selectSessionInfo } from '@/reducers/authSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const userId = useAppSelector(selectSessionInfo()).userId || '';
  const [userModel, setUserModel] = useState<UserModel>();
  const { data: response, isSuccess, isError } = useUserById(userId);

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
      />
    );
  }

  return (
    <Stack direction="Vertical" gap="MD" className="width-100 padding-20 single-page">
      <Stack direction="Vertical" gap="MD" className="width-100">
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

      <Stack direction="Vertical" gap="MD" className="width-100">
        <Typography variant="h3">{t('management:header.userAuthInfo')}</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              {t('management:label.bfApldUserAuthNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.bfApldUserAuthNm}
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
              {t('management:label.bfApldMgrAuthNm')}
            </TH>
            <TD colSpan={2} align="left">
              {userModel?.bfApldMgrAuthNm}
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
    </Stack>
  );
};
export default MyPage;
