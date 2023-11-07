import { Typography } from '@components/ui';
import './ErrorLabel.scss';

export interface Props {
  message?: string;
}

export const ErrorLabel = ({ message }: Props) => {
  return (
    <Typography variant="body2" className="label-error-message">
      {message}
    </Typography>
  );
};

export default ErrorLabel;
