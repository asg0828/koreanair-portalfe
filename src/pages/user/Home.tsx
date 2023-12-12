import '@/assets/styles/Home.scss';
import { useFaqList } from '@/hooks/queries/useFaqQueries';
import { useFeatureList, usePopularFeatureList } from '@/hooks/queries/useFeatureQueries';
import { useNoticeList } from '@/hooks/queries/useNoticeQueries';
import { useQnaList } from '@/hooks/queries/useQnaQueries';
import { GroupCodeType, MainLink, ValidType } from '@/models/common/Constants';
import { FaqModel } from '@/models/model/FaqModel';
import { FeatureModel } from '@/models/model/FeatureModel';
import { NoticeModel } from '@/models/model/NoticeModel';
import { initPage } from '@/models/model/PageModel';
import { QnaModel } from '@/models/model/QnaModel';
import { initFeatureParams } from '@/pages/user/biz-meta/feature';
import { initFaqParams } from '@/pages/user/board/faq';
import { initNoticeParams } from '@/pages/user/board/notice';
import { getCode } from '@/reducers/codeSlice';
import { Stack, Tag, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { toast } = useToast();
  const [noticeList, setNoticeList] = useState<Array<NoticeModel>>([]);
  const [faqList, setFaqList] = useState<Array<FaqModel>>([]);
  const [qnaList, setQnaList] = useState<Array<QnaModel>>([]);
  const [featureList, setFeatureList] = useState<Array<FeatureModel>>([]);
  const [popularFeatureList, setPopularFeatureList] = useState<Array<FeatureModel>>([]);
  const { data: nResponse, isError: nIsError } = useNoticeList(
    initNoticeParams,
    { ...initPage, pageSize: 5 },
    { suspense: false }
  );
  const { data: fResponse, isError: fIsError } = useFaqList(
    initFaqParams,
    { ...initPage, pageSize: 3 },
    { suspense: false }
  );
  const { data: qResponse, isError: qIsError } = useQnaList(
    initFaqParams,
    { ...initPage, pageSize: 4 },
    { suspense: false }
  );
  const { data: feResponse, isError: feIsError } = useFeatureList(
    initFeatureParams,
    { ...initPage, pageSize: 4 },
    { suspense: false }
  );
  const { data: pfResponse, isError: pfIsError } = usePopularFeatureList({ suspense: false });

  useEffect(() => {
    if (nIsError || nResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '공지사항 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (nResponse?.data) {
        setNoticeList(nResponse.data.contents.filter((item: NoticeModel, index: number) => index < 5));
      }
    }
  }, [nResponse, nIsError, toast]);

  useEffect(() => {
    if (fIsError || fResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: 'FAQ 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (fResponse?.data) {
        setFaqList(fResponse.data.contents.filter((item: FaqModel, index: number) => index < 3));
      }
    }
  }, [fResponse, fIsError, toast]);

  useEffect(() => {
    if (qIsError || qResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: 'QNA 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (qResponse?.data) {
        setQnaList(
          qResponse.data.contents
            .map((item: QnaModel) => ({
              ...item,
              qnaStatNm: getCode(GroupCodeType.QNA_STAT, item.qnaStat)?.codeNm || '',
            }))
            .filter((item: QnaModel, index: number) => index < 4)
        );
      }
    }
  }, [qResponse, qIsError, toast]);

  useEffect(() => {
    if (feIsError || feResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '최근 Feature 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (feResponse?.data) {
        setFeatureList(feResponse.data.contents.filter((item: FeatureModel, index: number) => index < 4));
      }
    }
  }, [feResponse, feIsError, toast]);

  useEffect(() => {
    if (pfIsError || pfResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '인기 Feature 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (pfResponse?.data) {
        setPopularFeatureList(pfResponse.data.filter((item: FeatureModel, index: number) => index < 5));
      }
    }
  }, [pfResponse, pfIsError, toast]);

  return (
    <Stack id="home" direction="Vertical" gap="LG" justifyContent="Between" className="single-page">
      <Stack direction="Horizontal" gap="LG" className="width-100" alignItems="Start">
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
        {/* 기존 포탈 영역 */}
        <Stack direction={'Vertical'} className="box2 shadowBox1">
          <div>
            <Tag
              variety="01"
              size="LG"
              shape="Round"
              style={{ display: 'inline-block', width: 'auto', lineHeight: '1.75rem' }}
            >
              여객마케팅부
            </Tag>
          </div>
          <Typography variant="h2" style={{ lineHeight: '50px', marginBottom: '12px' }}>
            내 부서
          </Typography>
          <Link to="/biz-meta/feature" className="box6 leftIconBox n1">
            <Typography variant="h3">신청/등록 Feature</Typography>
            <span className="smallBox_title"></span>
            <Stack justifyContent="End" alignItems="Center">
              <span className="number">226</span>
              <span className="count">건</span>
            </Stack>
          </Link>
          <Stack direction="Vertical" className="">
            <Link to="/feature/interest" className="box6 leftIconBox n2">
              <Typography variant="h3">관심 Feature</Typography>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number">55</span>
                <span className="count">건</span>
              </Stack>
            </Link>
          </Stack>
        </Stack>
        {/* 기존 포탈 영역 */}
      </Stack>
      <Stack gap="LG" alignItems="Start">
        <div className="box3 shadowBox1 noticeBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">공지사항</Typography>
            <Link to={MainLink.NOTICE} className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap">
            {noticeList.map((item) => (
              <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  className="ellipsis1"
                  to={`${MainLink.NOTICE}/detail`}
                  state={{ noticeId: item.noticeId, rows: noticeList }}
                >
                  {item.sj}
                </Link>
                <span className="date">{item.rgstDt}</span>
              </Stack>
            ))}
          </div>
        </div>
        <div className="box3 shadowBox1 faqBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">FAQ</Typography>
            <Link to={MainLink.FAQ} className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap">
            {faqList.map((item) => (
              <div>
                <Link to={MainLink.FAQ} state={{ faqId: item.faqId }}>
                  <div className="question">{item.qstn}</div>
                  <div className="answer">
                    <div className="ellipsis1" dangerouslySetInnerHTML={{ __html: item.answ }}></div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="box3 shadowBox1 qnaBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">Q&A</Typography>
            <Link to={MainLink.QNA} className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap ">
            {qnaList.map((item) => (
              <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Tag
                  variety={item.qnaStat === 'UNREAD' ? '05' : '03'}
                  size="MD"
                  shape="Round"
                  type={item.qnaStat === 'ANSWER' ? 'Strong' : undefined}
                  style={{ display: 'inline-block', width: 'auto', lineHeight: '1.375rem', marginRight: '5px' }}
                >
                  {item.qnaStatNm}
                </Tag>
                <Link className="ellipsis1" to={`${MainLink.QNA}/detail`} state={{ qnaId: item.qnaId, rows: qnaList }}>
                  {item.sj}
                </Link>
                <span className="date">{item.rgstDt}</span>
              </Stack>
            ))}
          </div>
        </div>
      </Stack>
      <Stack gap="LG" alignItems="Start">
        <div className="box4 shadowBox1 recentFeatureBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" className="recentFeatureTypo">
              최근 Feature
            </Typography>
            <Link to={MainLink.FEATURE} className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap ">
            {featureList.map((item) => (
              <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={`${MainLink.FEATURE}/detail`} state={{ featureId: item.featureId }}>
                  <div className="listLocation">{`${item.featureTypNm} > ${item.featureSeGrpNm}`}</div>
                  <div className="listInfo">
                    <div className="item">{item.featureKoNm}</div>
                    <div className="item">{item.enrUserNm}</div>
                    <div className="item">{item.enrDeptNm}</div>
                  </div>
                </Link>
              </Stack>
            ))}
          </div>
        </div>
        <div className="box4 shadowBox1 popFeatureBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" className="popFeatureTypo">
              인기 Feature
            </Typography>
            <Link to={MainLink.POPULAR_FEATURE} className="seeMore">
              more
            </Link>
          </Stack>
          <div className="boardListWrap ">
            {popularFeatureList.map((item) => (
              <div className="item">
                <Link to={`${MainLink.FEATURE}/detail`} state={{ featureId: item.featureId }}>
                  <Stack>
                    <div className="exp">{item.featureKoNm}</div>
                    <div className="ellipsis1">{item.enrUserNm}</div>
                    <div className="exp"></div>
                    <div className="ellipsis1">{item.enrDeptNm}</div>
                  </Stack>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Stack>
    </Stack>
  );
};
export default Home;
