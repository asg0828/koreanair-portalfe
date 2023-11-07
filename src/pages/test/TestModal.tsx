import { useState, ReactNode } from 'react';
import UserSelectModal from '@/components/modal/UserSelectModal';
import DeptSelectModal from '@/components/modal/DeptSelectModal';
import NoticeModal from '@/components/modal/NoticeModal';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { Stack, Button, Label } from '@components/ui';

const TestModal = () => {
  const [isOpenUserModal, setIsOpenUserModal] = useState<boolean>(false);
  const [isOpenDeptModal, setIsOpenDeptModal] = useState<boolean>(false);
  const [isOpenNoticeModal, setIsOpenNoticeModal] = useState<boolean>(false);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [content, setContent] = useState<ReactNode>('저장하시겠습니까?');

  const handleUserSelectModal = () => {
    setIsOpenUserModal((prevState) => !prevState);
  };

  const handleDeptSelectModal = () => {
    setIsOpenDeptModal((prevState) => !prevState);
  };

  const handleNoticeModal = () => {
    setIsOpenNoticeModal((prevState) => !prevState);
  };

  const handleConfirmModal = () => {
    setIsConfirmModal((prevState) => !prevState);
  };

  const handleConfirm = () => {
    setContent(
      <div>
        <p>저장에 실패 했습니다.</p>
        <p>errorCode: 401 발생</p>
      </div>
    );

    return false;
  };

  const handleRemoveCache = () => {
    localStorage.removeItem('hasVisited');
  };

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
        <Label>확인모달</Label>
        <Button onClick={handleConfirmModal}>열기</Button>
      </Stack>

      <Stack>
        <Label>공지사항</Label>
        <Button onClick={handleNoticeModal}>열기</Button>
        <Button onClick={handleRemoveCache}>localStorage 삭제</Button>
      </Stack>

      <UserSelectModal isOpen={isOpenUserModal} onClose={(isOpen) => setIsOpenUserModal(isOpen)} />
      <DeptSelectModal isOpen={isOpenDeptModal} onClose={(isOpen) => setIsOpenDeptModal(isOpen)} />
      <ConfirmModal
        isOpen={isConfirmModal}
        onConfirm={handleConfirm}
        onClose={(isOpen) => {
          setIsConfirmModal(isOpen);
          setContent('저장하시겠습니까?');
        }}
        title={'저장 확인'}
        content={content}
      />
      <NoticeModal isOpen={isOpenNoticeModal} onClose={(isOpen) => setIsOpenNoticeModal(isOpen)} />
    </Stack>
  );
};

export default TestModal;
