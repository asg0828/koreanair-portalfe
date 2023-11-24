import { Stack, Loader } from '@components/ui';
import '@/assets/styles/Fallback.scss';

const MainFallback = () => {
  return (
    <Stack justifyContent="Center" className="fallback">
      <Loader title="진행중" description="잠시만 기다려주세요" />
    </Stack>
  );
};

export default MainFallback;
