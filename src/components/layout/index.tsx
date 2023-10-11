import Header from '@components/layout/Header';
import { Providers } from '@components/ui';
import Body from '@components/layout/Body';
import Footer from '@components/layout/Footer';

const RootLayout = () => {
  return (
    <Providers>
      <Header />
      <Body />
      <Footer />
    </Providers>
  );
};
export default RootLayout;
