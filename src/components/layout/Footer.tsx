import { Stack, Typography } from '@ke-design/components';
import './Footer.scss';

const Footer = () => {
  return (
    <footer id="footer">
      <Stack justifyContent="End" className="width-100">
        <Typography variant="body1">Copyright <span className="highlight">ⓒKoreanAir</span> Corp. All rights reserved.</Typography>
      </Stack>
    </footer>
  )
}
export default Footer;