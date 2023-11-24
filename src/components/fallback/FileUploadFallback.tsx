import '@/assets/styles/Fallback.scss';
import { Loader } from '@components/ui';

const FileUploadFallback = () => {
  return <Loader className="fallback" type="Circle" />;
};

export default FileUploadFallback;
