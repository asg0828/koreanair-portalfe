import { EmptyStateProps } from '@/models/components/EmptyState';
import { Stack, Typography } from '@components/ui';
import { CheckCircleOutlineIcon, ErrorOutlineIcon, WarningAmberIcon } from '@/assets/icons';
import './EmptyState.scss';

const sx = {
  fontSize: 72
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  description,
  buttonChildren,
  className = ''
}) => {
  return (
    <Stack
      direction="Vertical"
      gap="LG"
      justifyContent="Center"
      alignItems="Center"
      className={`width-100 height-100 ${className}`}
    >
      {(() => {
        let icon;
        
        switch (type) {
          case "complete":
            icon = <CheckCircleOutlineIcon className={type} sx={sx} />
            break;
          case "error":
            icon = <ErrorOutlineIcon className={type} sx={sx} />
            break;
            case "warning":
            icon = <WarningAmberIcon className={type} sx={sx} />
            break;
        }

        return icon;
      })()}
      
      <Typography variant="h2">{type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
      <Typography variant="body1">{description}</Typography>

      <Stack gap="SM">
        {buttonChildren}
      </Stack>
    </Stack>
  )
};
export default EmptyState;
