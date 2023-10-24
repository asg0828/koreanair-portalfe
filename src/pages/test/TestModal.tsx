import { useState } from 'react';
import UserSelectModal from '@/components/modal/UserSelectModal';
import DeptSelectModal from '@/components/modal/DeptSelectModal';
import NoticeModal from '@/components/modal/NoticeModal';
import { Stack, Button, Label } from '@components/ui';

const TestModal = () => {
  const [isOpenUserModal, setIsOpenUserModal] = useState<boolean>(false);
  const [isOpenDeptModal, setIsOpenDeptModal] = useState<boolean>(false);
  const [isOpenNoticeModal, setIsOpenNoticeModal] = useState<boolean>(false);

  const handleUserSelectModal = () => {
    setIsOpenUserModal((prevState) => !prevState);
  };

  const handleDeptSelectModal = () => {
    setIsOpenDeptModal((prevState) => !prevState);
  };

  const handleNoticeModal = () => {
    setIsOpenNoticeModal((prevState) => !prevState);
  }

  const handleRemoveCache = () => {
    localStorage.removeItem('hasVisited');
  }

  return (
    <Stack direction="Vertical">
      <Stack>
        <Label>사용자 선택</Label>
        <Button onClick={handleUserSelectModal}>열기</Button>
      </Stack>

      <Stack>
        <Label>부서 선택</Label>
        <Button onClick={handleDeptSelectModal}>열기</Button>
      </Stack>

      <Stack>
        <Label>공지사항</Label>
        <Button onClick={handleNoticeModal}>열기</Button>
        <Button onClick={handleRemoveCache}>localStorage 삭제</Button>
      </Stack>

      <UserSelectModal isOpen={isOpenUserModal} onClose={(isOpen) => setIsOpenUserModal(isOpen)} />
      <DeptSelectModal isOpen={isOpenDeptModal} onClose={(isOpen) => setIsOpenDeptModal(isOpen)} />
      <NoticeModal isOpen={isOpenNoticeModal} onClose={(isOpen) => setIsOpenNoticeModal(isOpen)} />
    </Stack>
  );
};

export default TestModal;
