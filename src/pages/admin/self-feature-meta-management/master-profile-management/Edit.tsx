import { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { Button, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import MstrProfInfo from '@/components/self-feature-adm/MstrProfInfo';
import HorizontalTable from '@/components/table/HorizontalTable';
import { ModalType, SelfFeatPgPpNm } from '@/models/selfFeature/FeatureCommon';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/modal/ConfirmModal';
import {
  MasterProfileInfo,
  MetaInfoSearchProps,
  MetaType,
  TbCoMetaTbInfo,
  TbRsMstrSgmtRule,
  TbRsMstrSgmtRuleAttrClmn,
  TbRsMstrSgmtRuleAttrTbl,
  TbRsRslnRuleKeyPrty,
  TbRsRslnRuleRel,
} from '@/models/selfFeature/FeatureAdmModel';
import {
  initMasterProfileInfo,
  initMetaInfoSearchProps,
  initMstrProfSearchInfoProps,
  initTbRsMstrSgmtRule,
  initTbRsMstrSgmtRuleAttrTbl,
  initTbRsRslnRuleKeyPrty,
  initTbRsRslnRuleRel,
} from './data';
import { useUpdateMstrProfInfo } from '@/hooks/mutations/self-feature/useSelfFeatureAdmMutations';
import { ValidType } from '@/models/common/Constants';
import {
  useMetaInfo,
  useMstrProfList,
  useResolutionKeyList,
  useResolutionRuleId,
} from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { DivisionTypes } from '@/models/selfFeature/FeatureModel';
import { AddIcon } from '@/assets/icons';
import { htmlSpeReg, htmlTagReg } from '@/utils/RegularExpression';

const MasterProfileManagementEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  // 사용될 rslnRuleId 조회
  const { data: rsltRuleIdRes, isError: rsltRuleIdErr, refetch: rsltRuleIdRefetch } = useResolutionRuleId();
  // rslnRuleId parameter
  const [rslnRuleIdParam, setRslnRuleIdParam] = useState<string>('');
  // 테이블 추가 버튼 show / hide 처리
  const [isAttrAddIconShow, setIsAttrAddIconShow] = useState<Boolean>(false);
  const [isBehvAddIconShow, setIsBehvAddIconShow] = useState<Boolean>(false);
  // 메타테이블 전체조회 테이블 선택 콤보박스 조회 API
  const [metaInfoSrchInfo, setMetaInfoSrchInfo] = useState<MetaInfoSearchProps>(cloneDeep(initMetaInfoSearchProps));
  const [attrMetaTbList, setAttrMetaTbList] = useState<Array<TbCoMetaTbInfo>>([]);
  const [behvMetaTbList, setBehvMetaTbList] = useState<Array<TbCoMetaTbInfo>>([]);
  const { data: metaInfoRes, isError: metaInfoErr, refetch: metaInfoRefetch } = useMetaInfo(metaInfoSrchInfo);
  // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 API
  const [rslnRuleId, setRslnRuleId] = useState<string>('');
  const [rslnRuleKeyPrtyList, setRslnRuleKeyPrtyList] = useState<Array<TbRsRslnRuleKeyPrty>>(
    cloneDeep([initTbRsRslnRuleKeyPrty])
  );
  const {
    data: rslnKeyListRes,
    isError: rslnKeyListErr,
    refetch: rslnKeyListRefetch,
  } = useResolutionKeyList(rslnRuleId);
  // 수정 body param
  const [mstrSgmtFormData, setMstrSgmtFormData] = useState<MasterProfileInfo>(cloneDeep(initMasterProfileInfo));
  // 기본 정보
  const [mstrSgmtRule, setMstrSgmtRule] = useState<TbRsMstrSgmtRule>(cloneDeep(initTbRsMstrSgmtRule));
  // 속성 테이블 정보
  const [attrMstrSgmtRuleAttrTblList, setAttrMstrSgmtRuleAttrTblList] = useState<Array<TbRsMstrSgmtRuleAttrTbl>>(
    cloneDeep([initTbRsMstrSgmtRuleAttrTbl])
  );
  // 행동 테이블 정보
  const [behvMstrSgmtRuleAttrTblList, setBehvMstrSgmtRuleAttrTblList] = useState<Array<TbRsMstrSgmtRuleAttrTbl>>(
    cloneDeep([initTbRsMstrSgmtRuleAttrTbl])
  );
  // 테이블 컬럼 정보
  const [mstrSgmtRuleAttrClmnList, setMstrSgmtRuleAttrClmnList] = useState<Array<TbRsMstrSgmtRuleAttrClmn>>([]);
  // resolution 관계 정보
  const [rslnRuleRelList, setRslnRuleRelList] = useState<Array<TbRsRslnRuleRel>>(cloneDeep([initTbRsRslnRuleRel]));
  // 모달, 버튼 클릭 종류
  const [btnClickType, setBtnClickType] = useState<string>('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [confirmModalTit, setConfirmModalTit] = useState<string>('');
  const [confirmModalCont, setConfirmModalCont] = useState<string>('');
  const [modalType, setModalType] = useState<string>('');
  // 수정 API
  const {
    data: updateMstrProfInfoRes,
    isSuccess: updateMstrProfInfoSucc,
    isError: updateMstrProfInfoErr,
    mutate: updateMstrProfInfoMutate,
  } = useUpdateMstrProfInfo(mstrSgmtFormData.tbRsMstrSgmtRule.mstrSgmtRuleId, mstrSgmtFormData);
  // resolution rule Id setting
  useEffect(() => {
    if (rsltRuleIdErr || rsltRuleIdRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (rsltRuleIdRes) {
        // resolution id 설정값 변경
        let t = rsltRuleIdRes.result[rsltRuleIdRes.result.length - 1];
        if (t) {
          // 속성 및 행동 테이블 정보 조회를 위해
          setRslnRuleIdParam(() => t.rslnRuleId);
        } else {
          toast({
            type: ValidType.ERROR,
            content: 'Resolution Rule에 대해 관리자에게 문의 하세요.',
          });
        }
      }
    }
  }, [rsltRuleIdRes, rsltRuleIdErr, toast]);
  useEffect(() => {
    if (rslnRuleIdParam === '') return;
    setMetaInfoSrchInfo((prevState: MetaInfoSearchProps) => {
      let rtn = cloneDeep(prevState);
      rtn.type = MetaType.MSTR_SGMT;
      rtn.rslnRuleId = rslnRuleIdParam;
      return rtn;
    });
    setRslnRuleId(rslnRuleIdParam);
  }, [rslnRuleIdParam]);
  useEffect(() => {
    if (!location || !location.state) return;
    setMstrSgmtRule(location.state.masterProfileInfo.tbRsMstrSgmtRule);
    setAttrMstrSgmtRuleAttrTblList(
      location.state.masterProfileInfo.tbRsMstrSgmtRuleAttrTbl.filter(
        (info: TbRsMstrSgmtRuleAttrTbl) => info.sgmtDvCd === DivisionTypes.ATTR
      )
    );
    setBehvMstrSgmtRuleAttrTblList(
      location.state.masterProfileInfo.tbRsMstrSgmtRuleAttrTbl.filter(
        (info: TbRsMstrSgmtRuleAttrTbl) => info.sgmtDvCd === DivisionTypes.BEHV
      )
    );
    setMstrSgmtRuleAttrClmnList(location.state.masterProfileInfo.tbRsMstrSgmtRuleAttrClmn);
    setRslnRuleRelList(location.state.masterProfileInfo.tbRsRslnRuleRel);
  }, [location]);
  // 메타테이블 전체조회 테이블 선택 콤보박스 조회 API 호출
  useEffect(() => {
    if (!metaInfoSrchInfo || metaInfoSrchInfo.type === '' || metaInfoSrchInfo.rslnRuleId === '') return;
    metaInfoRefetch();
  }, [metaInfoSrchInfo]);
  // 메타테이블 전체조회 테이블 선택 콤보박스 조회 call back
  useEffect(() => {
    if (metaInfoErr || metaInfoRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (metaInfoRes) {
        setAttrMetaTbList(() =>
          metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.ATTR)
        );
        setBehvMetaTbList(() =>
          metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.BEHV)
        );
      }
    }
  }, [metaInfoRes, metaInfoErr]);
  // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 API 호출
  useEffect(() => {
    if (!rslnRuleId || rslnRuleId === '') return;
    rslnKeyListRefetch();
  }, [rslnRuleId]);
  // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 call back
  useEffect(() => {
    if (rslnKeyListErr || rslnKeyListRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (rslnKeyListRes) {
        setRslnRuleKeyPrtyList(() => rslnKeyListRes.result);
      }
    }
  }, [rslnKeyListRes, rslnKeyListErr]);
  // modal 확인/취소 이벤트
  const onConfirm = () => {
    if (modalType === ModalType.CONFIRM) {
      if (btnClickType === 'update') {
        // 수정 API 호출
        updateMstrProfInfoMutate();
      }
    }
    setIsOpenConfirmModal(false);
  };
  const onCancel = () => {
    setIsOpenConfirmModal(false);
  };
  // 기본정보 수정시 formData setting
  useEffect(() => {
    setMstrSgmtFormData((prevState: MasterProfileInfo) => {
      let rtn = cloneDeep(prevState);
      rtn.tbRsMstrSgmtRule = mstrSgmtRule;
      return rtn;
    });
  }, [mstrSgmtRule]);
  // 속성 및 행동 테이블 정보 수정시 formData setting
  useEffect(() => {
    if (0 < attrMetaTbList.length && attrMetaTbList.length < attrMstrSgmtRuleAttrTblList.length + 1) {
      setIsAttrAddIconShow(false);
    } else {
      setIsAttrAddIconShow(true);
    }
    setMstrSgmtFormData((prevState: MasterProfileInfo) => {
      let rtn = cloneDeep(prevState);
      let behvList = rtn.tbRsMstrSgmtRuleAttrTbl.filter(
        (item: TbRsMstrSgmtRuleAttrTbl) => item.sgmtDvCd === DivisionTypes.BEHV
      );
      rtn.tbRsMstrSgmtRuleAttrTbl = [...behvList, ...attrMstrSgmtRuleAttrTblList];
      return rtn;
    });
  }, [attrMstrSgmtRuleAttrTblList]);
  useEffect(() => {
    if (0 < behvMetaTbList.length && behvMetaTbList.length < behvMstrSgmtRuleAttrTblList.length + 1) {
      setIsBehvAddIconShow(false);
    } else {
      setIsBehvAddIconShow(true);
    }
    setMstrSgmtFormData((prevState: MasterProfileInfo) => {
      let rtn = cloneDeep(prevState);
      let attrList = rtn.tbRsMstrSgmtRuleAttrTbl.filter(
        (item: TbRsMstrSgmtRuleAttrTbl) => item.sgmtDvCd === DivisionTypes.ATTR
      );
      rtn.tbRsMstrSgmtRuleAttrTbl = [...attrList, ...behvMstrSgmtRuleAttrTblList];
      return rtn;
    });
  }, [behvMstrSgmtRuleAttrTblList]);
  // 속성 및 행동 테이블 컬럼 정보 수정시 formData setting
  useEffect(() => {
    setMstrSgmtFormData((prevState: MasterProfileInfo) => {
      let rtn = cloneDeep(prevState);
      rtn.tbRsMstrSgmtRuleAttrClmn = mstrSgmtRuleAttrClmnList;
      return rtn;
    });
  }, [mstrSgmtRuleAttrClmnList]);
  // resolution 관계 정보 수정시 formData setting
  useEffect(() => {
    setMstrSgmtFormData((prevState: MasterProfileInfo) => {
      let rtn = cloneDeep(prevState);
      rtn.tbRsRslnRuleRel = rslnRuleRelList;
      return rtn;
    });
  }, [rslnRuleRelList]);
  // 페이지 이동 및 버튼 처리
  const onClickPageMovHandler = (pageNm: string) => {
    if (pageNm === SelfFeatPgPpNm.LIST) {
      navigate('..');
    } else if (pageNm === SelfFeatPgPpNm.REG) {
      const validation = () => {
        let searchError = false;
        // validation
        const validationTool = (check: string) => {
          if (check.replace(htmlTagReg, '').replace(htmlSpeReg, '').trim() === '') return true;
          else return false;
        };
        let checkValidation = '';

        // 등록 validation
        if (validationTool(mstrSgmtRule.mstrSgmtRuleNm)) {
          // masterProfileRef?.current.firstElementChild.focus();
          checkValidation = 'MasterProfile은 필수 입력값입니다.';
        } else if (validationTool(mstrSgmtRule.mstrSgmtRuleDesc)) {
          // descriptionRef?.current.firstElementChild.focus();
          checkValidation = 'Description은 필수 입력값입니다.';
        } else {
          if (attrMstrSgmtRuleAttrTblList.length < 1) {
            checkValidation = `Fact 정보 테이블은 최소 1개 이상 등록되어야 합니다.`;
          } else if (behvMstrSgmtRuleAttrTblList.length < 1) {
            checkValidation = `Base Fact 정보 테이블은 최소 1개 이상 등록되어야 합니다.`;
          }
          let attrClmnList = mstrSgmtRuleAttrClmnList.filter((i) => i.sgmtDvCd === DivisionTypes.ATTR);
          let behvClmnList = mstrSgmtRuleAttrClmnList.filter((i) => i.sgmtDvCd === DivisionTypes.BEHV);
          attrClmnList.map((item) => {
            if (item.mstrSgmtRuleClmnId === '') {
              let tableLogiNm = attrMetaTbList.find((i) => i.metaTblId === item.mstrSgmtRuleTblId)?.metaTblLogiNm;
              checkValidation = `${tableLogiNm} 속성 테이블의 컬럼항목을 확인해주세요`;
            }
            return item;
          });
          if (checkValidation === '') {
            behvClmnList.map((item) => {
              if (item.mstrSgmtRuleClmnId === '') {
                let tableLogiNm = behvMetaTbList.find((i) => i.metaTblId === item.mstrSgmtRuleTblId)?.metaTblLogiNm;
                checkValidation = `${tableLogiNm} 행동 테이블의 컬럼항목을 확인해주세요`;
              }
              return item;
            });
          }
          attrMstrSgmtRuleAttrTblList.map((item, index) => {
            if (checkValidation === '') {
              let tableLogiNm = attrMetaTbList.find((i) => i.metaTblId === item.mstrSgmtRuleTblId)?.metaTblLogiNm;
              if (item.mstrSgmtRuleTblId === '')
                checkValidation = `${index + 1}번쨰 속성 테이블을 확인해주세요`; //'Description은 필수 입력값입니다.';
              else if (item.mstrJoinKeyClmnNm === '')
                checkValidation = `${tableLogiNm} 테이블의 마스터 조인키 확인해주세요`;
              else if (item.attrJoinKeyClmnNm === '')
                checkValidation = `${tableLogiNm} 테이블의 속성 조인키 확인해주세요`;
              else if (attrClmnList.filter((col) => col.mstrSgmtRuleTblId === item.mstrSgmtRuleTblId).length < 1) {
                checkValidation = `${tableLogiNm} 테이블의 최소1개이상 컬럼항목을 추가해주세요`;
              }
            }
            return item;
          });
          if (checkValidation === '') {
            behvMstrSgmtRuleAttrTblList.map((item, index) => {
              if (checkValidation === '') {
                let tableLogiNm = behvMetaTbList.find((i) => i.metaTblId === item.mstrSgmtRuleTblId)?.metaTblLogiNm;
                if (item.mstrSgmtRuleTblId === '')
                  checkValidation = `${index + 1}번쨰 행동 테이블을 확인해주세요`; //'Description은 필수 입력값입니다.';
                else if (item.mstrJoinKeyClmnNm === '')
                  checkValidation = `${tableLogiNm} 테이블의 마스터 조인키 확인해주세요`;
                else if (item.attrJoinKeyClmnNm === '')
                  checkValidation = `${tableLogiNm} 테이블의 속성 조인키 확인해주세요`;
                else if (behvClmnList.filter((col) => col.mstrSgmtRuleTblId === item.mstrSgmtRuleTblId).length < 1) {
                  checkValidation = `${tableLogiNm} 테이블의 최소1개이상 컬럼항목을 추가해주세요`;
                }
              }
              return item;
            });
          }
        }

        if (checkValidation !== '') {
          toast({
            type: 'Error',
            content: checkValidation,
          });
          searchError = true;
        }
        return searchError;
      };

      if (validation()) return;
      // 수정 확인 팝업
      setModalType(ModalType.CONFIRM);
      setBtnClickType('update');
      setConfirmModalTit('Master Profile 수정');
      setConfirmModalCont('설정한 정보로 수정 하시겠습니까?');
      setIsOpenConfirmModal(true);
    } else {
      navigate(`../${pageNm}`);
    }
  };
  // input 입력 변경시
  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let inputValue = cloneDeep(value);
    setMstrSgmtRule((state: TbRsMstrSgmtRule) => {
      let rtn = cloneDeep(state);
      Object.keys(rtn).map((key) => {
        if (key === id) {
          rtn[key] = inputValue;
        }
        return key;
      });
      return rtn;
    });
  };
  // 속성 및 행동 테이블 정보 추가(default 테이블 정보 setting)
  const onClickAddTblInfo = (divType: string) => {
    if (divType === DivisionTypes.ATTR) {
      setAttrMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
        let rtn = cloneDeep(prevState);
        let addItem = cloneDeep(initTbRsMstrSgmtRuleAttrTbl);
        if (mstrSgmtRule && mstrSgmtRule.mstrSgmtRuleId) addItem.mstrSgmtRuleId = mstrSgmtRule.mstrSgmtRuleId;
        addItem.sgmtDvCd = divType;
        addItem.clmnAllChocYn = 'N';
        rtn.push(addItem);
        return rtn;
      });
    } else if (divType === DivisionTypes.BEHV) {
      setBehvMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
        let rtn = cloneDeep(prevState);
        let addItem = cloneDeep(initTbRsMstrSgmtRuleAttrTbl);
        if (mstrSgmtRule && mstrSgmtRule.mstrSgmtRuleId) addItem.mstrSgmtRuleId = mstrSgmtRule.mstrSgmtRuleId;
        addItem.sgmtDvCd = divType;
        addItem.clmnAllChocYn = 'N';
        rtn.push(addItem);
        return rtn;
      });
    }
  };
  // 수정 API 호출 Call back
  useEffect(() => {
    if (updateMstrProfInfoErr || updateMstrProfInfoRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: updateMstrProfInfoRes?.message ? updateMstrProfInfoRes?.message : '수정 중 에러가 발생했습니다.',
      });
    } else if (updateMstrProfInfoSucc) {
      toast({
        type: ValidType.CONFIRM,
        content: '수정되었습니다.',
      });

      // 상세로 redirect
      navigate(`../${SelfFeatPgPpNm.DETL}`, { state: { row: { mstrSgmtRuleId: updateMstrProfInfoRes.result } } });
    }
  }, [updateMstrProfInfoRes, updateMstrProfInfoSucc, updateMstrProfInfoErr]);

  return (
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100">
      {/* 기본 정보 */}
      <Typography variant="h4">Master Profile 정보</Typography>
      <Stack direction="Vertical" className="width-100" gap="MD">
        <HorizontalTable className="width-100">
          <TR>
            <TH colSpan={1} align="right" required>
              Master Profile
            </TH>
            <TD colSpan={2} align="left">
              <TextField
                className="width-100"
                id="mstrSgmtRuleNm"
                value={mstrSgmtRule.mstrSgmtRuleNm}
                onChange={onchangeInputHandler}
              />
            </TD>
            <TH colSpan={1} align="right" required>
              Description
            </TH>
            <TD colSpan={2} align="left">
              <TextField
                className="width-100"
                id="mstrSgmtRuleDesc"
                value={mstrSgmtRule.mstrSgmtRuleDesc}
                onChange={onchangeInputHandler}
              />
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>
      {/* 기본 정보 */}
      {/* 속성 정보 */}
      <Stack direction="Vertical" className="width-100" gap="MD">
        <Stack
          direction="Vertical"
          className="width-100"
          gap="MD"
          style={{
            border: '1px solid rgb(218, 218, 218)',
            borderRadius: '5px',
            padding: '1rem',
          }}
        >
          <Stack direction="Horizontal" justifyContent="Start" gap="LG">
            <Typography variant="h4">Fact 정보</Typography>
            {isAttrAddIconShow && <AddIcon onClick={() => onClickAddTblInfo(DivisionTypes.ATTR)} />}
          </Stack>
          {attrMstrSgmtRuleAttrTblList.map((attrTblInfo: TbRsMstrSgmtRuleAttrTbl, index: number) => {
            attrTblInfo.sgmtDvCd = DivisionTypes.ATTR;
            let metaTblColList = mstrSgmtRuleAttrClmnList.filter(
              (item: TbRsMstrSgmtRuleAttrClmn) => item.mstrSgmtRuleTblId === attrTblInfo.mstrSgmtRuleTblId
            );
            return (
              <MstrProfInfo
                key={`attr-mstr-prof-reg-${index}`}
                targetIndex={index}
                editMode={true}
                hasItem={true}
                rslnRuleKeyPrtyList={rslnRuleKeyPrtyList} //선택된 resolution id에 해당되는 마스터 조인키 리스트
                metaTblInfo={attrTblInfo} //저장된 메타테이블 정보
                metaTblAllList={attrMetaTbList} //모든 행동정보 메타테이블 정보(선택된 resolution id에 해당되는)
                metaTblColList={metaTblColList} //수정중인 컬럼 목록 전달
                mstrSgmtRuleAttrTblList={attrMstrSgmtRuleAttrTblList} // 선택가능 테이블 정보 setting을 위해
                setMstrSgmtRuleAttrTblList={setAttrMstrSgmtRuleAttrTblList}
                setMstrSgmtRuleAttrClmnList={setMstrSgmtRuleAttrClmnList}
              />
            );
          })}
        </Stack>
      </Stack>
      {/* 속성 정보 */}
      {/* 행동 정보 */}
      <Stack direction="Vertical" className="width-100" gap="MD">
        <Stack
          direction="Vertical"
          className="width-100"
          gap="MD"
          style={{
            border: '1px solid rgb(218, 218, 218)',
            borderRadius: '5px',
            padding: '1rem',
          }}
        >
          <Stack direction="Horizontal" justifyContent="Start" gap="LG">
            <Typography variant="h4">Base Fact 정보</Typography>
            {isBehvAddIconShow && <AddIcon onClick={() => onClickAddTblInfo(DivisionTypes.BEHV)} />}
          </Stack>
          {behvMstrSgmtRuleAttrTblList.map((behvTblInfo: TbRsMstrSgmtRuleAttrTbl, index: number) => {
            behvTblInfo.sgmtDvCd = DivisionTypes.BEHV;
            let metaTblColList = mstrSgmtRuleAttrClmnList.filter(
              (item: TbRsMstrSgmtRuleAttrClmn) => item.mstrSgmtRuleTblId === behvTblInfo.mstrSgmtRuleTblId
            );
            return (
              <MstrProfInfo
                key={`behv-mstr-prof-reg-${index}`}
                targetIndex={index}
                editMode={true}
                hasItem={true}
                rslnRuleKeyPrtyList={rslnRuleKeyPrtyList} //선택된 resolution id에 해당되는 마스터 조인키 리스트
                metaTblInfo={behvTblInfo} //저장된 메타테이블 정보
                metaTblAllList={behvMetaTbList} //모든 행동정보 메타테이블 정보(선택된 resolution id에 해당되는)
                metaTblColList={metaTblColList} //수정중인 컬럼 목록 전달
                mstrSgmtRuleAttrTblList={behvMstrSgmtRuleAttrTblList} // 선택가능 테이블 정보 setting을 위해
                setMstrSgmtRuleAttrTblList={setBehvMstrSgmtRuleAttrTblList}
                setMstrSgmtRuleAttrClmnList={setMstrSgmtRuleAttrClmnList}
              />
            );
          })}
        </Stack>
      </Stack>
      {/* 행동 정보 */}
      {/* 버튼 영역 */}
      <Stack direction="Vertical" gap="MD" justifyContent="End">
        <Stack justifyContent="End" gap="SM" className="width-100">
          <Button
            priority="Normal"
            appearance="Outline"
            size="LG"
            onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}
          >
            목록
          </Button>
          <Button
            priority="Primary"
            appearance="Contained"
            size="LG"
            onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.REG)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.79502 15.8749L4.62502 11.7049L3.20502 13.1149L8.79502 18.7049L20.795 6.70492L19.385 5.29492L8.79502 15.8749Z"
                fill="currentColor"
              ></path>
            </svg>
            저장
          </Button>
        </Stack>
      </Stack>
      {/* 버튼 영역 */}
      {/* Confirm 모달 */}
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={(isOpen) => setIsOpenConfirmModal(isOpen)}
        title={confirmModalTit}
        content={confirmModalCont}
        onConfirm={onConfirm}
        onCancle={onCancel}
        btnType={modalType}
      />
    </Stack>
  );
};

export default MasterProfileManagementEdit;
