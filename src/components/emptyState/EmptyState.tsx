import { Button, Stack, Typography } from '@components/ui';
import { lazy } from 'react';
import './EmptyState.scss';

const CheckCircleOutlineIcon = lazy(() =>
  import('@/assets/icons').then((module) => ({ default: module.CheckCircleOutlineIcon }))
);
const ErrorOutlineIcon = lazy(() => import('@/assets/icons').then((module) => ({ default: module.ErrorOutlineIcon })));
const WarningAmberIcon = lazy(() => import('@/assets/icons').then((module) => ({ default: module.WarningAmberIcon })));

export interface EmptyStateProps {
  type: 'complete' | 'error' | 'warning';
  isModal?: boolean;
  description?: string;
  confirmText?: string;
  cancleText?: string;
  onConfirm?: Function;
  onCancle?: Function;
}

const sx = {
  fontSize: 72,
};

const EmptyState: React.FC<EmptyStateProps> = ({ type, description, confirmText, cancleText, onConfirm, onCancle }) => {
  const handleConfirm = () => {
    onConfirm && onConfirm();
  };

  const handleCancle = () => {
    onCancle && onCancle();
  };

  return (
    <Stack direction="Vertical" gap="LG" justifyContent="Center" alignItems="Center" className="width-100 height-100">
      {(() => {
        let IConComponent;

        switch (type) {
          case 'complete':
            IConComponent = CheckCircleOutlineIcon;
            break;
          case 'error':
            IConComponent = ErrorOutlineIcon;
            break;
          case 'warning':
            IConComponent = WarningAmberIcon;
            break;
        }

        return <IConComponent className={type} sx={sx} />;
      })()}

      <Typography variant="h2">{type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
      <Typography variant="body1">{description}</Typography>

      <Stack gap="SM">
        {confirmText && <Button onClick={handleConfirm}>{confirmText}</Button>}
        {cancleText && <Button onClick={handleCancle}>{cancleText}</Button>}
      </Stack>
    </Stack>
  );
};
export default EmptyState;
