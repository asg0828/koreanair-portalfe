import { Button, Stack } from '@components/ui';

import useCode from '@/hooks/useCode';

const TestHook = () => {
  const { getCodeList } = useCode();

  const handleCodeHook = () => {
  };

  return (
    <Stack>
      <Button onClick={handleCodeHook}>코드 훅 실행</Button>
    </Stack>
  );
};

export default TestHook;
