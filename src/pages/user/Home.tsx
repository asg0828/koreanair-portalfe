import '@/assets/styles/Home.scss';
import NoData from '@/components/emptyState/NoData';
import { useFaqList } from '@/hooks/queries/useFaqQueries';
import { useFeatureList, usePopularFeatureList } from '@/hooks/queries/useFeatureQueries';
import { useBizMeta, useFeatureMyDept } from '@/hooks/queries/useHomeQueries';
import { useNoticeList } from '@/hooks/queries/useNoticeQueries';
import { useQnaList } from '@/hooks/queries/useQnaQueries';
import { useAppSelector } from '@/hooks/useRedux';
import { GroupCodeType, MainLink, ValidType } from '@/models/common/Constants';
import { FaqModel } from '@/models/model/FaqModel';
import { FeatureModel } from '@/models/model/FeatureModel';
import { BizMetaModel, FeatureMyDeptModel } from '@/models/model/HomeModel';
import { NoticeModel } from '@/models/model/NoticeModel';
import { initPage } from '@/models/model/PageModel';
import { QnaModel } from '@/models/model/QnaModel';
import { initFeatureParams } from '@/pages/user/biz-meta/feature';
import { initFaqParams } from '@/pages/user/board/faq';
import { initNoticeParams } from '@/pages/user/board/notice';
import { selectSessionInfo } from '@/reducers/authSlice';
import { getCode } from '@/reducers/codeSlice';
import { Stack, Tag, Typography, useToast } from '@components/ui';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const sessionInfo = useAppSelector(selectSessionInfo());
  const [noticeList, setNoticeList] = useState<Array<NoticeModel>>([]);
  const [faqList, setFaqList] = useState<Array<FaqModel>>([]);
  const [qnaList, setQnaList] = useState<Array<QnaModel>>([]);
  const [featureList, setFeatureList] = useState<Array<FeatureModel>>([]);
  const [popularFeatureList, setPopularFeatureList] = useState<Array<FeatureModel>>([]);
  const [bizMeta, setBizMeta] = useState<BizMetaModel>();
  const [featuresMydept, setFeaturesMydept] = useState<FeatureMyDeptModel>();
  const { data: bizResponse, isError: bizIsError } = useBizMeta();
  const { data: featureMyDeptResponse, isError: featureMyDeptIsError } = useFeatureMyDept(sessionInfo.userId);
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
    if (bizIsError || bizResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('home:toast.error.bizMeta'),
      });
    } else {
      if (bizResponse?.data) {
        setBizMeta(bizResponse.data);
      }
    }
  }, [bizResponse, bizIsError, toast]);

  useEffect(() => {
    if (featureMyDeptIsError || featureMyDeptResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('home:toast.error.featureMyDept'),
      });
    } else {
      if (featureMyDeptResponse?.data) {
        setFeaturesMydept(featureMyDeptResponse.data);
      }
    }
  }, [featureMyDeptResponse, featureMyDeptIsError, toast]);

  useEffect(() => {
    if (nIsError || nResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('home:toast.error.noticeList'),
      });
    } else {
      if (nResponse?.data) {
        setNoticeList(nResponse.data.contents.filter((item: NoticeModel, index: number) => index < 4));
      }
    }
  }, [nResponse, nIsError, toast]);

  useEffect(() => {
    if (fIsError || fResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('home:toast.error.faqList'),
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
        content: t('home:toast.error.qnaList'),
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
        content: t('home:toast.error.recentFeatureList'),
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
        content: t('home:toast.error.popularFeatureList'),
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
                {t('home:label.bizMeta')}
              </Tag>
            </>
          </div>
          <Typography variant="h2" style={{ lineHeight: '50px', marginBottom: '12px' }}>
            {t('home:label.cdp')}
          </Typography>
          <Stack gap="MD" alignItems="Start">
            <Link to="/biz-meta/feature" className="box5">
              <Typography variant="h3">{t('home:label.feature')}</Typography>
              <Stack justifyContent={'End'}>
                <div className="home_icon_01"></div>
              </Stack>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number n1">{bizMeta?.featureCount}</span>
                <span className="count">{t('common.label.countingUnit.thing')}</span>
              </Stack>
            </Link>

            <Link to="/biz-meta/dataset" className="box5">
              <Typography variant="h3">{t('home:label.tableDefinition')}</Typography>
              <Stack justifyContent={'End'}>
                <div className="home_icon_02"></div>
              </Stack>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number n2">{bizMeta?.tableSpecCount}</span>
                <span className="count">{t('common.label.countingUnit.thing')}</span>
              </Stack>
            </Link>

            <Link to="." className="box5">
              <Typography variant="h3">{t('home:label.averageDailyUsers')}</Typography>
              <span className="oneWeek absolute">{t('home:label.oneWeek')}</span>
              <Stack justifyContent={'End'}>
                <div className="home_icon_03"></div>
              </Stack>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number n3">{bizMeta?.avgUserCount}</span>
                <span className="count">{t('common.label.countingUnit.person')}</span>
              </Stack>
            </Link>
          </Stack>
        </Stack>
        <Stack direction={'Vertical'} className="box2 shadowBox1">
          <div>
            <Tag
              variety="01"
              size="LG"
              shape="Round"
              style={{ display: 'inline-block', width: 'auto', lineHeight: '1.75rem' }}
            >
              {sessionInfo.deptNm || t('common.label.notFoundDept')}
            </Tag>
          </div>
          <Typography variant="h2" style={{ lineHeight: '50px', marginBottom: '12px' }}>
            {t('home:label.myDepartment')}
          </Typography>
          <Link to="/biz-meta/feature" className="box6 leftIconBox n1">
            <Typography variant="h3">{t('home:label.applyRegistFeature')}</Typography>
            <span className="smallBox_title"></span>
            <Stack justifyContent="End" alignItems="Center">
              <span className="number">{featuresMydept?.featureDeptCount}</span>
              <span className="count">{t('common.label.countingUnit.thing')}</span>
            </Stack>
          </Link>
          <Stack direction="Vertical" className="">
            <Link to="/feature/interest" className="box6 leftIconBox n2">
              <Typography variant="h3">{t('home:label.interestFeature')}</Typography>
              <Stack justifyContent="End" alignItems="Center">
                <span className="number">{featuresMydept?.featureInterestDeptCount}</span>
                <span className="count">{t('common.label.countingUnit.thing')}</span>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Stack>
      <Stack gap="LG" alignItems="Start">
        <div className="box3 shadowBox1 noticeBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">{t('home:label.notice')}</Typography>
            <Link to={MainLink.NOTICE} className="seeMore">
              {t('home:label.more')}
            </Link>
          </Stack>
          <div className="boardListWrap">
            {noticeList.length === 0 ? (
              <NoData className="board-nodata" />
            ) : (
              noticeList.map((item) => (
                <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.importantYn === 'Y' && (
                    <Tag size="MD" shape="Round" variety="02" type="Strong" className="tag_point">
                      {t('common.label.important')}
                    </Tag>
                  )}
                  <Link className="ellipsis1" to={`${MainLink.NOTICE}/detail?noticeId=${item.noticeId}`}>
                    {item.sj}
                  </Link>
                  <span className="date">{item.rgstDt}</span>
                </Stack>
              ))
            )}
          </div>
        </div>
        <div className="box3 shadowBox1 faqBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">{t('home:label.faq')}</Typography>
            <Link to={MainLink.FAQ} className="seeMore">
              {t('home:label.more')}
            </Link>
          </Stack>
          <div className="boardListWrap">
            {faqList.length === 0 ? (
              <NoData className="board-nodata" />
            ) : (
              faqList.map((item) => (
                <div>
                  <Link to={`${MainLink.FAQ}?faqId=${item.faqId}`}>
                    <div className="question ellipsis1">{item.qstn}</div>
                    <div className="answer">
                      <div className="ellipsis1">{parse(item.answ)}</div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="box3 shadowBox1 qnaBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5">{t('home:label.qna')}</Typography>
            <Link to={MainLink.QNA} className="seeMore">
              {t('home:label.more')}
            </Link>
          </Stack>
          <div className="boardListWrap qnaBoardListWrap">
            {qnaList.length === 0 ? (
              <NoData className="board-nodata" />
            ) : (
              qnaList.map((item) => (
                <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag
                    variety={item.qnaStat === 'UNREAD' ? '05' : '03'}
                    size="MD"
                    shape="Round"
                    type={item.qnaStat === 'ANSWER' ? 'Strong' : undefined}
                    className="tag_point"
                    style={{ display: 'inline-block', width: 'auto', lineHeight: '1.375rem', marginRight: '8px' }}
                  >
                    {item.qnaStatNm}
                  </Tag>
                  <Link className="ellipsis1" to={`${MainLink.QNA}/detail?qnaId=${item.qnaId}`}>
                    {item.sj}
                  </Link>
                  <span className="date">{item.rgstDt}</span>
                </Stack>
              ))
            )}
          </div>
        </div>
      </Stack>
      <Stack gap="LG" alignItems="Start">
        <div className="box4 shadowBox1 recentFeatureBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" className="recentFeatureTypo">
              {t('home:label.recentFeature')}
            </Typography>
            <Link to={MainLink.FEATURE} className="seeMore">
              {t('home:label.more')}
            </Link>
          </Stack>
          <div className="boardListWrap ">
            {featureList.length === 0 ? (
              <NoData className="feature-nodata" />
            ) : (
              featureList.map((item) => (
                <Stack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`${MainLink.FEATURE}/detail?featureId=${item.featureId}`}>
                    <div className="listLocation">{`${item.featureTypNm} > ${item.featureSeGrpNm}`}</div>
                    <div className="listInfo">
                      <div className="item">{item.featureKoNm}</div>
                      <div className="item">{item.enrUserNm}</div>
                      <div className="item">{item.enrDeptNm}</div>
                    </div>
                  </Link>
                </Stack>
              ))
            )}
          </div>
        </div>
        <div className="box4 shadowBox1 popFeatureBox">
          <Stack className="width-100 box_top" style={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" className="popFeatureTypo">
              {t('home:label.popularfeature')}
            </Typography>
            <Link to={MainLink.POPULAR_FEATURE} className="seeMore">
              {t('home:label.more')}
            </Link>
          </Stack>
          <div className="boardListWrap ">
            {popularFeatureList.length === 0 ? (
              <NoData className="feature-nodata" />
            ) : (
              popularFeatureList.map((item) => (
                <div className="item">
                  <Link to={`${MainLink.FEATURE}/detail?featureId=${item.featureId}`}>
                    <Stack>
                      <div className="exp">{item.featureKoNm}</div>
                      <div className="ellipsis1">{item.enrUserNm}</div>
                      <div className="exp"></div>
                      <div className="ellipsis1">{item.enrDeptNm}</div>
                    </Stack>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </Stack>
    </Stack>
  );
};
export default Home;
