import { Stack, Tabs, TabList, TabContent, Tab, Typography } from '@components/ui';
import VerticalTable from '@components/table/VerticalTable';
import '@/assets/styles/Home.scss';

const columns = [
  { headerName: 'No', field: 'column1' },
  { headerName: '주제영역', field: 'column2' },
  { headerName: '데이터셋명', field: 'column3' },
];

const rows = [
  {
    column1: '유류할증료',
    column2: '마일리지 몰 기획 SKYPASS Deal 『추석기획전』',
    column3: '2023.09.22',
  },
  {
    column1: '기타안내',
    column2: '대한항공 사칭 피싱 이메일 주의',
    column3: '2023.09.22',
  },
  {
    column1: '유류할증료',
    column2: '한국 출발 국제선 유류할증료 (2023년 9월)',
    column3: '2023.09.22',
  },
  {
    column1: '스카이패스 클럽',
    column2: '캐시앤마일즈 서비스 이용 한도 확대',
    column3: '2023.09.22',
  },
  {
    column1: '여행정보',
    column2: '부산·후쿠오카/나고야 재운항 (9/27일 부)',
    column3: '2023.09.22',
  },
];

const Home = () => {
  return (
    <Stack id="home" direction="Vertical" gap="MD" justifyContent="Between" className="width-100">
      <Stack direction="Horizontal" gap="MD" className="width-100">
        <Stack direction="Vertical" className="box1">
          <Typography className="font-white">BIZ메타 전체</Typography>

          <Stack className="margin-top-200">
            <Stack direction="Vertical" className="font-white">
              <Typography className="font-white">데이터셋</Typography>
              <Typography className="font-white">216 건</Typography>
            </Stack>

            <Stack direction="Vertical" className="margin-left-100">
              <Typography className="font-white">Feature</Typography>
              <Typography className="font-white">475 건</Typography>
            </Stack>

            <Stack direction="Vertical" className="margin-left-100">
              <Typography className="font-white">사용자</Typography>
              <Typography className="font-white">1000 명</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="Vertical" className="box2">
          <Typography variant="h1" className="font-white">내 부서(여객마케팅부)</Typography>

          <Stack className="margin-top-200">
            <Stack direction="Vertical" className="font-white">
              <Typography className="font-white">데이터셋</Typography>
              <Typography className="font-white">12 건</Typography>
            </Stack>

            <Stack direction="Vertical" className="margin-left-100">
              <Typography className="font-white">Feature</Typography>
              <Typography className="font-white">23 건</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="Horizontal" gap="XL">
        <Tabs defaultValue={'0'} className="width-100">
          <TabList>
            <Tab value={'0'}>공지사항</Tab>
            <Tab value={'1'}>FAQ</Tab>
            <Tab value={'2'}>Q&A</Tab>
          </TabList>
          <TabContent value={'0'}>
            <VerticalTable columns={columns} rows={rows} clickable={true} showHeader={false}/>
          </TabContent>
          <TabContent value={'1'}>
            <VerticalTable columns={columns} rows={rows} clickable={true} showHeader={false}/>
          </TabContent>
          <TabContent value={'2'}>
            <VerticalTable columns={columns} rows={rows} clickable={true} showHeader={false}/>
          </TabContent>
        </Tabs>

        <Tabs defaultValue={'3'} className="width-100">
          <TabList>
            <Tab value={'3'}>최근 데이터셋</Tab>
            <Tab value={'4'}>인기 Feature</Tab>
          </TabList>
          <TabContent value={'3'}>
            <VerticalTable columns={columns} rows={rows} clickable={true} showHeader={false}/>
          </TabContent>
          <TabContent value={'4'}>
            <VerticalTable columns={columns} rows={rows} clickable={true} showHeader={false}/>
          </TabContent>
        </Tabs>
      </Stack>
    </Stack>
  );
};
export default Home;
