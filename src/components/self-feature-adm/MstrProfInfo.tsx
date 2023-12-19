import React, { useCallback, useEffect, useState, forwardRef, useRef } from 'react';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';

import { Button, Select, SelectOption, Stack, Typography, useToast } from '@/components/ui';

import {
  AttrBehvMstrProfInfoProps,
  MetaColumnIsResolutionInfoSearchProps,
  TbCoMetaTbInfo,
  TbCoMetaTblClmnInfo,
  TbRsMstrSgmtRuleAttrClmn,
  TbRsMstrSgmtRuleAttrTbl,
} from '@/models/selfFeature/FeatureAdmModel';
import {
  initMetaColumnIsResolutionInfoSearchJoinkeyProps,
  initMetaColumnIsResolutionInfoSearchProps,
  initTbCoMetaTbInfo,
  initTbCoMetaTblClmnInfo,
} from '@/pages/admin/self-feature-meta-management/master-profile-management/data';
import {
  useMetaColumnIsResolutionInfo,
  useMetaColumnIsResolutionJoinkeyInfo,
} from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { ValidType } from '@/models/common/Constants';
import MstrProfMetaTblColumnList from './MstrProfMetaTblColumnList';
import { DivisionTypes } from '@/models/selfFeature/FeatureModel';

const MstrProfInfo = ({
  targetIndex, // 등록 및 수정시 수정할 item index
  editMode,
  hasItem, // 최초 수정 정보가 있는 경우 초기화 로직 제외를 위한 flag
  rslnRuleKeyPrtyList, //선택된 resolution id에 해당되는 마스터 조인키 리스트
  metaTblInfo, //저장된 메타테이블 정보
  metaTblAllList, //모든 속성/행동정보 메타테이블 정보(선택된 resolution id에 해당되는)
  metaTblColList, //저장된 메타테이블 컬럼 항목
  mstrSgmtRuleAttrTblList, //선택 가능한 테이블 정보 setting을 위해
  setMstrSgmtRuleAttrTblList,
  setMstrSgmtRuleAttrClmnList,
  focusTarget, // 포커스할 타겟?!
}: AttrBehvMstrProfInfoProps) => {
  /* 포커스 */
  // const metaTblIdRef = useRef<any>(null);
  // const attrJoinKeyRef = useRef<any>(null);
  // const masterJoinKeyRef = useRef<any>(null);
  // if (focusTarget && focusTarget?.current?.findIndexRef === targetIndex) {
  //   const targetName = focusTarget?.current?.targetRef;
  //   if (targetName === 'metaTblIdRef') {
  //     metaTblIdRef.current.focus();
  //   } else if (targetName === 'attrJoinKeyRef') {
  //     attrJoinKeyRef.current.focus();
  //   } else if (targetName === 'masterJoinKeyRef') {
  //     masterJoinKeyRef.current.focus();
  //   }
  // }
  // const childRefs = Array.from({ length: metaTblColList.length }, () => useRef(null));
  // validationRef.current.focus();

  const { toast } = useToast();
  // 최초 저장 정보 확인
  //const [isEdit, setIsEdit] = useState<Boolean>(false)
  // 정보타입
  const [divisionType, setDivisionType] = useState<string>('');
  const [metaTblOptionList, setMetaTblOptionList] = useState<Array<TbCoMetaTbInfo>>([]);
  // 각 메타 테이블 및 컬럼 정보(화면 노출을 위해 필요)
  const [metaTableInfo, setMetaTableInfo] = useState<TbCoMetaTbInfo>();
  const [metaTblClmnList, setMetaTblClmnList] = useState<Array<TbCoMetaTblClmnInfo>>([]);
  // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API
  const [metaTblId, setMetaTblId] = useState<string>('');
  const [metaTblSrchInfo, setMetaTblSrchInfo] = useState<MetaColumnIsResolutionInfoSearchProps>(
    cloneDeep(initMetaColumnIsResolutionInfoSearchProps)
  );
  // 선택한 테이블에 해당되는 컬럼 리스트
  const [metaTblClmnAllList, setMetaTblClmnAllList] = useState<Array<TbCoMetaTblClmnInfo>>([]);
  const {
    data: metaColIsRslnInfoRes,
    isError: metaColIsRslnInfoErr,
    refetch: metaColIsRslnInfoRefetch,
  } = useMetaColumnIsResolutionInfo(metaTblId, metaTblSrchInfo);
  // 각 테이블 속성 key 정보(화면노출을 위한 info state)
  const [metaTblClmnJoinkeyInfo, setMetaTblClmnJoinkeyInfo] = useState<TbCoMetaTblClmnInfo>();
  const [metaTblClmnJoinkeyList, setMetaTblClmnJoinkeyList] = useState<Array<TbCoMetaTblClmnInfo>>();
  // 속성 조인키 조회 API
  const [metaTblSrchJoinkeyInfo, setMetaTblSrchJoinkeyInfo] = useState<MetaColumnIsResolutionInfoSearchProps>(
    cloneDeep(initMetaColumnIsResolutionInfoSearchJoinkeyProps)
  );
  const {
    data: metaColIsRslnInfoJoinkeyRes,
    isError: metaColIsRslnInfoJoinkeyErr,
    refetch: metaColIsRslnInfoJoinkeyRefetch,
  } = useMetaColumnIsResolutionJoinkeyInfo(metaTblId, metaTblSrchJoinkeyInfo);
  // component mount
  useEffect(() => {
    // 최초 수정 정보가 있는 경우 초기화 로직 제외를 위한 flag
    // if (!metaTblInfo.mstrSgmtRuleTblId) setIsEdit(false)
    // else setIsEdit(true)
  }, []);
  /* 
        선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API
        호출을 위한 param setting
        선택된 메타테이블의 논리명 및 등록 수정시 테이블 select를 위한 metaTblAllList
    */
  useEffect(() => {
    if (!metaTblInfo) return;
    setDivisionType(() => cloneDeep(metaTblInfo.sgmtDvCd));

    let tblId: string = '';
    // 등록인 경우에는 metaTblId로
    if (editMode && metaTblInfo.metaTblId) tblId = metaTblInfo.metaTblId;
    else tblId = metaTblInfo.mstrSgmtRuleTblId;
    setMetaTblId(() => cloneDeep(tblId));
    //if (!metaTblAllList) return
    let temp = metaTblAllList.find((info: TbCoMetaTbInfo) => info.metaTblId === metaTblInfo?.mstrSgmtRuleTblId);
    setMetaTableInfo(() => {
      if (temp) return cloneDeep(temp);
      else return cloneDeep(initTbCoMetaTbInfo);
      //else return cloneDeep(initTbCoMetaTbInfo)
    });
    // 현재 설정된 메타테이블 정보 순회하며 등록 가능한 컬럼 setting
    let temp2: Array<TbCoMetaTbInfo> = [];
    for (let i = 0; i < metaTblAllList.length; i++) {
      let item = metaTblAllList[i];
      let hasItemFlag = false;
      if (mstrSgmtRuleAttrTblList && mstrSgmtRuleAttrTblList?.length > 0) {
        for (let j = 0; j < mstrSgmtRuleAttrTblList.length; j++) {
          let item2 = mstrSgmtRuleAttrTblList[j];
          if (item.metaTblId === item2.mstrSgmtRuleTblId) {
            hasItemFlag = true;
            break;
          }
        }
      }
      if (item.metaTblId === metaTblInfo?.mstrSgmtRuleTblId) hasItemFlag = false;

      if (!hasItemFlag) temp2.push(cloneDeep(item));
    }
    setMetaTblOptionList(() => cloneDeep(temp2));
  }, [metaTblInfo, metaTblAllList]);
  // useEffect(() => {
  // }, [metaTblInfo?.mstrSgmtRuleTblId])
  // useEffect(() => {
  // }, [metaTblAllList, mstrSgmtRuleAttrTblList])
  // 화면 노출을 위한 저장된 컬럼 setting
  useEffect(() => {
    // 선택한 테이블에 해당되는 컬럼 리스트
    if (!metaTblColList || metaTblColList.length < 1 || metaTblClmnAllList.length < 1) {
      setMetaTblClmnList(() => []);
    } else {
      let colList: Array<TbCoMetaTblClmnInfo> = [];
      metaTblColList.map((saveColInfo) => {
        let isInit: Boolean = true;
        metaTblClmnAllList.map((colInfo) => {
          if (saveColInfo.mstrSgmtRuleClmnId === colInfo.metaTblClmnId) {
            colList.push(colInfo);
            isInit = false;
          }
          return colInfo;
        });
        if (isInit) {
          let t = cloneDeep(initTbCoMetaTblClmnInfo);
          t.metaTblId = metaTableInfo?.metaTblId ? metaTableInfo.metaTblId : '';
          t.metaTblLogiNm = metaTableInfo?.metaTblLogiNm ? metaTableInfo.me?.metaTblLogiNm : '';
          colList.push(t);
        }
        return saveColInfo;
      });
      setMetaTblClmnList(() => cloneDeep(colList));
    }
  }, [metaTblColList, metaTblClmnAllList]);

  // 선택한 테이블의 속성 Joinkey 화면 노출을 위한 setting
  useEffect(() => {
    if (!metaTblInfo || !metaTblClmnJoinkeyList) return;
    let attrJoinkeyInfo = metaTblClmnJoinkeyList.find(
      (metaTblClmnJoinkey: TbCoMetaTblClmnInfo) =>
        metaTblClmnJoinkey.metaTblClmnPhysNm === metaTblInfo.attrJoinKeyClmnNm
    );
    setMetaTblClmnJoinkeyInfo(() => cloneDeep(attrJoinkeyInfo));
  }, [metaTblClmnJoinkeyList]);

  // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API 호출
  useEffect(() => {
    if (!metaTblId) {
      setMetaTblClmnAllList(() => []);
      setMetaTblClmnJoinkeyList(() => []);
      return;
    }
    metaColIsRslnInfoRefetch();
    metaColIsRslnInfoJoinkeyRefetch();
  }, [metaTblId]);

  // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 call back
  useEffect(() => {
    if (metaColIsRslnInfoErr || metaColIsRslnInfoRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (metaColIsRslnInfoRes) {
        setMetaTblClmnAllList(() => cloneDeep(metaColIsRslnInfoRes.result));
      }
    }
  }, [metaColIsRslnInfoRes, metaColIsRslnInfoErr]);

  // 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 call back
  useEffect(() => {
    if (metaColIsRslnInfoJoinkeyErr || metaColIsRslnInfoJoinkeyRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (metaColIsRslnInfoJoinkeyRes) {
        setMetaTblClmnJoinkeyList(() => cloneDeep(metaColIsRslnInfoJoinkeyRes.result));
      }
    }
  }, [metaColIsRslnInfoJoinkeyRes, metaColIsRslnInfoJoinkeyErr]);

  // select box 선택시
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    let keyNm = String(id);
    let v = String(value);
    if (v === 'null' || v === 'undefined') return;

    setMstrSgmtRuleAttrTblList &&
      setMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
        let rtn = cloneDeep(prevState);
        rtn[targetIndex!][keyNm] = v;
        return rtn;
      });
  };

  // 정보 삭제시
  const onClickDeleteHandler = () => {
    // 컬럼 정보 삭제를 위해
    let tblId: string;
    // 해당 테이블 삭제
    setMstrSgmtRuleAttrTblList &&
      setMstrSgmtRuleAttrTblList((tblList: Array<TbRsMstrSgmtRuleAttrTbl>) => {
        let rtn = cloneDeep(tblList);
        tblId = cloneDeep(rtn[targetIndex!].mstrSgmtRuleTblId);
        rtn = rtn.filter((tblItem: TbRsMstrSgmtRuleAttrTbl, index: number) => index !== targetIndex);
        return rtn;
      });
    // 삭제하는 테이블 컬럼 정보 삭제
    setMstrSgmtRuleAttrClmnList &&
      setMstrSgmtRuleAttrClmnList((tblColList: Array<TbRsMstrSgmtRuleAttrClmn>) => {
        let rtn = cloneDeep(tblColList);
        rtn = rtn.filter((tblColItem: TbRsMstrSgmtRuleAttrClmn) => tblColItem.mstrSgmtRuleTblId !== tblId);
        return rtn;
      });
  };

  return (
    <Stack
      direction="Vertical"
      className="width-100"
      gap="MD"
      style={{
        border: '1px solid rgb(218, 218, 218)',
        borderRadius: '5px',
        background: divisionType === DivisionTypes.ATTR ? '#eff9f0' : '#e6f9ff',
        color: divisionType === DivisionTypes.ATTR ? '#00b21e' : '#00256c',
        padding: '1rem',
      }}
    >
      {/* 상세 */}
      {!editMode && (
        <>
          <Stack direction="Horizontal" justifyContent="Start" gap="LG">
            <Typography style={{ width: '10%' }} variant="h6">
              속성 테이블
            </Typography>
            <Typography style={{ width: '20%' }} variant="body1">
              {metaTableInfo?.metaTblLogiNm}
            </Typography>
          </Stack>
          <Stack direction="Horizontal" justifyContent="Start" gap="LG">
            <Typography style={{ width: '10%' }} variant="h6">
              마스터 Join key
            </Typography>
            <Typography style={{ width: '20%' }} variant="body1">
              {metaTblInfo?.mstrJoinKeyClmnNm}
            </Typography>
            <Typography style={{ width: '10%' }} variant="h6">
              속성 Join key
            </Typography>
            <Typography variant="body1">
              {metaTblClmnJoinkeyInfo &&
                `${metaTblClmnJoinkeyInfo.metaTblClmnLogiNm} [${metaTblClmnJoinkeyInfo.metaTblClmnPhysNm}]`}
            </Typography>
          </Stack>
        </>
      )}
      {/* 상세 */}
      {/* 등록 및 수정 */}
      {editMode && (
        <>
          <Stack
            direction="Horizontal"
            justifyContent="Start"
            gap="LG"
            style={{
              position: 'relative',
            }}
          >
            <Typography style={{ width: '10%' }} variant="h6">
              속성 테이블
            </Typography>
            <Select
              // ref={metaTblIdRef}
              style={{ width: '20%' }}
              value={metaTableInfo?.metaTblId}
              appearance="Outline"
              placeholder="선택"
              className="width-100"
              onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
              ) => {
                /*
                                    속성테이블 select 선택시 
                                    선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 API 호출
                                    및 이전 컬럼 항목 reset
                                */
                let v = String(value);
                if (!v || v === '' || v === 'null' || v === 'undefined') return;
                // 최초 수정 정보가 있는 경우 초기화 로직 제외
                setMstrSgmtRuleAttrTblList &&
                  setMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
                    let rtn = cloneDeep(prevState);

                    rtn[targetIndex!].mstrSgmtRuleTblId = v;
                    //if (!isEdit) {

                    let tblInfo = metaTblAllList.find((item: TbCoMetaTbInfo) => item.metaTblId === v);
                    rtn[targetIndex!].mstrSgmtRuleTblNm = tblInfo ? tblInfo.metaTblPhysNm : '';
                    rtn[targetIndex!].mstrSgmtRuleDbNm = tblInfo ? tblInfo.dbNm : '';
                    rtn[targetIndex!].clmnAllChocYn = 'N';
                    rtn[targetIndex!].attrJoinKeyClmnNm = '';
                    rtn[targetIndex!].mstrJoinKeyClmnNm = '';
                    //}
                    return rtn;
                  });
                setMstrSgmtRuleAttrClmnList &&
                  setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
                    let rtn = cloneDeep(prevState);
                    rtn = rtn.filter((item: TbRsMstrSgmtRuleAttrClmn) => item.mstrSgmtRuleTblId !== metaTblId);
                    return rtn;
                  });
                //if (metaTblInfo.mstrSgmtRuleTblId && isEdit) setIsEdit(false)
              }}
            >
              {metaTblOptionList.map((item, index) => (
                <SelectOption key={index} value={item.metaTblId}>
                  {item.metaTblLogiNm}
                </SelectOption>
              ))}
            </Select>
            {/* 삭제 버튼 */}
            <Button
              style={{
                position: 'absolute',
                left: '97%',
              }}
              size="SM"
              onClick={onClickDeleteHandler}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                ></path>
              </svg>
            </Button>
            {/* 삭제 버튼 */}
          </Stack>
          <Stack direction="Horizontal" justifyContent="Start" gap="LG">
            <Typography style={{ width: '10%' }} variant="h6">
              마스터 Join key
            </Typography>
            <Select
              // ref={masterJoinKeyRef}
              style={{ width: '20%' }}
              id="mstrJoinKeyClmnNm"
              value={metaTblInfo?.mstrJoinKeyClmnNm}
              appearance="Outline"
              placeholder="선택"
              className="width-100"
              onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
              ) => {
                onchangeSelectHandler(e, value, 'mstrJoinKeyClmnNm');
              }}
            >
              {rslnRuleKeyPrtyList.map((item, index) => (
                <SelectOption key={index} value={item.rslnRuleKeyClmnNm}>
                  {item.rslnRuleKeyClmnNm}
                </SelectOption>
              ))}
            </Select>
            <Typography variant="h6">속성 Join key</Typography>
            <Select
              // ref={attrJoinKeyRef}
              style={{ width: '50%' }}
              id="attrJoinKeyClmnNm"
              value={metaTblInfo?.attrJoinKeyClmnNm}
              appearance="Outline"
              placeholder="선택"
              className="width-100"
              onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
              ) => {
                onchangeSelectHandler(e, value, 'attrJoinKeyClmnNm');
              }}
            >
              {metaTblClmnJoinkeyList &&
                metaTblClmnJoinkeyList.map((item, index) => (
                  <SelectOption
                    key={index}
                    value={item.metaTblClmnPhysNm}
                  >{`${item.metaTblClmnLogiNm} [${item.metaTblClmnPhysNm}]`}</SelectOption>
                ))}
            </Select>
          </Stack>
        </>
      )}
      {/* 등록 및 수정 */}
      {/* 항목 리스트 */}
      <MstrProfMetaTblColumnList
        editMode={editMode}
        divisionType={divisionType} // 속성, 행동정보 구분
        targetIndex={targetIndex} // 등록 및 수정시 수정할 item index
        metaTblInfo={metaTblInfo} // 저장된 메타테이블 정보
        metaTblClmnList={metaTblClmnList} // 저장된 메타테이블 컬럼정보
        metaTblClmnAllList={metaTblClmnAllList} // 저장된 메타테이블 전체 컬럼 항목
        setMstrSgmtRuleAttrTblList={setMstrSgmtRuleAttrTblList} // 컬럼 전체 선택 체크에 필요
        setMstrSgmtRuleAttrClmnList={setMstrSgmtRuleAttrClmnList}
      />
      {/* 항목 리스트 */}
    </Stack>
  );
};

export default MstrProfInfo;
