import { useState } from 'react';
import UserSelect from '@/components/modal/UserSelect';
import DeptSelect from '@/components/modal/DeptSelect';
import { Stack, Button, Label } from '@components/ui';

const TestModal = () => {
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isOpenDeptModal, setIsOpenDeptModal] = useState(false);

  const handleUserSelectModal = () => {
    setIsOpenUserModal((prevState) => !prevState);
  };

  const handleDeptSelectModal = () => {
    setIsOpenDeptModal((prevState) => !prevState);
  };

  return (
    <Stack direction="Vertical">
      <Stack>
        <Label>사용자 선택 팝업</Label>
        <Button onClick={handleUserSelectModal}>열기</Button>
      </Stack>

      <Stack>
        <Label>부서 선택 팝업</Label>
        <Button onClick={handleDeptSelectModal}>열기</Button>
      </Stack>

      <UserSelect isOpen={isOpenUserModal} onClose={(isOpen) => setIsOpenUserModal(isOpen)} />
      <DeptSelect isOpen={isOpenDeptModal} onClose={(isOpen) => setIsOpenDeptModal(isOpen)} />
    </Stack>
  );
};

export default TestModal;
