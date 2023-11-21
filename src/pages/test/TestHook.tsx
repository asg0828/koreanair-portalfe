import { Button, Stack } from '@components/ui';

import { getCode } from '@/reducers/codeSlice';

const TestHook = () => {
  const handleCodeHook = () => {
  };

  return (
    <Stack>
      <Button onClick={handleCodeHook}>코드 훅 실행</Button>
    </Stack>
  );
};

export default TestHook;
