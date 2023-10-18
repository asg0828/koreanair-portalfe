import { Avatar, Stack, Typography } from '@components/ui';
import { profile, mileage, ffp } from './data';

export default function Profile() {
  return (
    <Stack>
      <div
        style={{
          background: '#f5f5f5',
          padding: '1.5rem 1rem',
          width: '300px',
          height: '700px',
        }}
      >
        <Stack alignItems="center">
          <h1>Gil-Dong GO</h1>
        </Stack>
        <Stack direction="Vertical">
          <Stack wrap={true}>
            <h2>Profile</h2>
            <div style={{ marginLeft: '130px', marginTop: '20px' }} className="componentWrapper">
              <Avatar fallbackText="Gil-dong" imageSrc="" size="LG" />
            </div>
          </Stack>
          {Object.keys(profile).map((key, index) => (
            <Typography variant="body2" key={index}>
              {key} : {profile[key]}
            </Typography>
          ))}
        </Stack>
        <Stack direction="Vertical">
          <Stack>
            <h2>FFP</h2>
          </Stack>
          {Object.keys(ffp).map((key, index) => (
            <Typography variant="body2" key={index}>
              {key} : {ffp[key]}
            </Typography>
          ))}
        </Stack>
        <Stack direction="Vertical">
          <Stack>
            <h2>Mileage</h2>
          </Stack>
          {Object.keys(mileage).map((key, index) => (
            <Typography variant="body2" key={index}>
              {key} : {mileage[key]}
            </Typography>
          ))}
        </Stack>
      </div>
    </Stack>
  );
}
