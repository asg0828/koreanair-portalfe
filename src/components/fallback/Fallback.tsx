import { Loader, Stack } from '@components/ui';

const Fallback = () => {
  return (
    <Stack justifyContent="Center" className="width-100 height-100">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  );
};

export default Fallback;
