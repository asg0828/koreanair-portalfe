import { Link, useNavigate } from 'react-router-dom';
import { Stack, Typography, Tag } from '@components/ui';
import '@/assets/styles/Home.scss';

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <Stack id="home" direction="Vertical" gap="LG" justifyContent="Between">
      <Stack direction="Horizontal" gap="LG" className="width-100" alignItems="Start">
      <Stack direction={'Vertical'} className="box2 none">
        <Stack direction="Vertical" className="box2-1 shadowBox1">
          <Typography variant="h3" style={{ marginBottom: '12px' }}>
            접속 정보
          </Typography>
          <ul>
            <li>
              <dl><dt>로그인 시간</dt><dd>2023-10-27 11:23</dd></dl>
            </li>
            <li>
              <dl><dt>IP 주소</dt><dd>10.111.48.144</dd></dl>
            </li>
          </ul>
          </Stack>
          <Stack direction="Vertical" className="box2-1 shadowBox1">
            <Typography variant="h3" style={{ marginBottom: '12px' }}>
            부서별 접속자수 <span style={{ fontSize: '12px', color: '#333', fontWeight: 'normal' }}>(지난 일주일 기준)</span>
          </Typography>
          <ol>
            <li className="item01">
              <dl><dt>여객마케팅부</dt><dd>5,542<span>명</span></dd></dl>
            </li>
            <li className="item02">
              <dl><dt>고객서비스부</dt><dd>3,300<span>명</span></dd></dl>
            </li>
            <li className="item03">
              <dl><dt>고객승무본부</dt><dd>1,600<span>명</span></dd></dl>
            </li>
            <li className="item04">
              <dl><dt>기내식사업본부</dt><dd>470<span>명</span></dd></dl>
            </li>
          </ol>
          </Stack>
        </Stack>
        <Stack direction="Vertical" className="box1 shadowBox1">
          <div>
            <>
              <Tag
                variety="01"
                size="LG"
                shape="Round"
                style={{ display: 'inline-block', width: 'auto', lineHeight: '1.75rem' }}
              >
                BIZ메타
              </Tag>
            </>
          </div>
          <Typography variant="h2" style={{ lineHeight: '50px', marginBottom: '12px' }}>
            Customer Data Portal
          </Typography>
          <Stack gap="MD" alignItems="Start">
            <Link to="/biz-meta/feature" className="box5">
              <Typography variant="h3">Feature</Typography>
              <Stack justifyContent={'End'}>
                <div className="home_icon_01"></div>
              </Stack>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number n1">126</span>
                <span className="count">건</span>
              </Stack>
            </Link>

            <Link to="/biz-meta/dataset" className="box5">
              <Typography variant="h3">테이블정의</Typography>
              <Stack justifyContent={'End'}>
                <div className="home_icon_02"></div>
              </Stack>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number n2">126</span>
                <span className="count">건</span>
              </Stack>
            </Link>

            <Link to="/" className="box5">
              <Typography variant="h3">일평균사용자</Typography>
              <Stack justifyContent={'End'}>
                <div className="home_icon_03"></div>
              </Stack>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number n3">14,226</span>
                <span className="count">명</span>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Stack>
      <Stack gap="LG" alignItems="Start">
        <div className="box3 shadowBox1 noticeBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">공지사항</Typography>
            <Link to="/board/notice" className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap">
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link className="ellipsis1" to="/">
                대한항공 사칭 피싱 이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link className="ellipsis1" to="/">
                대한항공 사칭 피싱 이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link className="ellipsis1" to="/">
                대한항공 사칭 피싱 이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link className="ellipsis1" to="/">
                대한항공 사칭 피싱 이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link className="ellipsis1" to="/">
                대한항공 사칭 피싱 이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
          </div>
        </div>
        <div className="box3 shadowBox1 faqBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">FAQ</Typography>
            <Link to="/board/faq" className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap">
            <div>
              <Link to="/">
                <div className="question">아이디, 비밀번호를 분실했어요.</div>
                <div className="answer">
                  <div className="ellipsis1">로그인 페이지 내에 아이디, 비밀번호찾기메뉴가존재합니다.</div>
                </div>
              </Link>
            </div>
            <div>
              <Link to="/">
                <div className="question">아이디, 비밀번호를 분실했어요.</div>
                <div className="answer">
                  <div className="ellipsis1">로그인 페이지 내에 아이디, 비밀번호 찾기 메뉴가 존재합니다.</div>
                </div>
              </Link>
            </div>
            <div>
              <Link to="/">
                <div className="question">아이디, 비밀번호를 분실했어요.</div>
                <div className="answer">
                  <div className="ellipsis1">로그인 페이지 내에 아이디, 비밀번호 찾기 메뉴가 존재합니다.</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="box3 shadowBox1 qnaBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">Q&A</Typography>
            <Link to="/board/qna" className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap ">
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag
                variety="03"
                size="MD"
                shape="Round"
                style={{ display: 'inline-block', width: 'auto', lineHeight: '1.375rem', marginRight: '5px' }}
              >
                확인중
              </Tag>
              <Link to="/" className="ellipsis1">
                대한항공 사칭 피싱 이메일 주의이메일 주의이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag
                variety="03"
                size="MD"
                shape="Round"
                style={{ display: 'inline-block', width: 'auto', lineHeight: '1.375rem', marginRight: '5px' }}
              >
                확인중
              </Tag>
              <Link to="/" className="ellipsis1">
                대한항공 사칭 피싱 이메일 주의이메일 주의이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag
                variety="03"
                size="MD"
                shape="Round"
                style={{ display: 'inline-block', width: 'auto', lineHeight: '1.375rem', marginRight: '5px' }}
              >
                확인중
              </Tag>
              <Link to="/" className="ellipsis1">
                대한항공 사칭 피싱 이메일 주의이메일 주의이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag
                variety="03"
                size="MD"
                shape="Round"
                type="Strong"
                style={{ display: 'inline-block', width: 'auto', lineHeight: '1.375rem', marginRight: '5px' }}
              >
                답변완료
              </Tag>
              <Link to="/" className="ellipsis1">
                대한항공 사칭 피싱 이메일 주의이메일 주의이메일 주의
              </Link>
              <span className="date">2023-09-10</span>
            </Stack>
          </div>
        </div>
      </Stack>
      <Stack gap="LG" alignItems="Start">
        <div className="box4 shadowBox1 recentFeatureBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" className="recentFeatureTypo">
              최근 Feature
            </Typography>
            <Link to="/biz-meta/feature" className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap ">
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/">
                <div className="listLocation">회원 &gt; SKYPASS회원정보</div>
                <div className="listInfo">
                  <div className="item">회원한글명 일치여부</div>
                  <div className="item">Member YN</div>
                  <div className="item">홍길동</div>
                  <div className="item">여객마케팅부</div>
                </div>
              </Link>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/">
                <div className="listLocation">회원 &gt; SKYPASS회원정보</div>
                <div className="listInfo">
                  <div className="item">회원한글명 일치여부</div>
                  <div className="item">Member YN</div>
                  <div className="item">홍길동</div>
                  <div className="item">여객마케팅부</div>
                </div>
              </Link>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/">
                <div className="listLocation">회원 &gt; SKYPASS회원정보</div>
                <div className="listInfo">
                  <div className="item">회원한글명 일치여부</div>
                  <div className="item">Member YN</div>
                  <div className="item">홍길동</div>
                  <div className="item">여객마케팅부</div>
                </div>
              </Link>
            </Stack>
            <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/">
                <div className="listLocation">회원 &gt; SKYPASS회원정보</div>
                <div className="listInfo">
                  <div className="item">회원한글명 일치여부</div>
                  <div className="item">Member YN</div>
                  <div className="item">홍길동</div>
                  <div className="item">여객마케팅부</div>
                </div>
              </Link>
            </Stack>
          </div>
        </div>
        <div className="box4 shadowBox1 popFeatureBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" className="popFeatureTypo">
              인기 Feature
            </Typography>
            <Link to="/feature/popular" className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap ">
            <div className="item">
              <Link to="/">
                <Stack>
                  <div className="exp">회원한글명 일치여부</div>
                  <div className="ellipsis1">SKYPASS 회원 한글명과 일반 회원 한글명이 일치하는지 확인 결과</div>
                </Stack>
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <Stack>
                  <div className="exp">회원한글명 일치여부</div>
                  <div className="ellipsis1">SKYPASS 회원 한글명과 일반 회원 한글명이 일치하는지 확인 결과</div>
                </Stack>
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <Stack>
                  <div className="exp">회원한글명 일치여부</div>
                  <div className="ellipsis1">SKYPASS 회원 한글명과 일반 회원 한글명이 일치하는지 확인 결과</div>
                </Stack>
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <Stack>
                  <div className="exp">회원한글명 일치여부</div>
                  <div className="ellipsis1">SKYPASS 회원 한글명과 일반 회원 한글명이 일치하는지 확인 결과</div>
                </Stack>
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <Stack>
                  <div className="exp">회원한글명 일치여부</div>
                  <div className="ellipsis1">SKYPASS 회원 한글명과 일반 회원 한글명이 일치하는지 확인 결과</div>
                </Stack>
              </Link>
            </div>
          </div>
        </div>
      </Stack>
    </Stack>
  );
};
export default AdminHome;