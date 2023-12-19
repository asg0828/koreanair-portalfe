import {
  MstrProfMetaTblColumnListProps,
  TbCoMetaTblClmnInfo,
  TbRsMstrSgmtRuleAttrClmn,
  TbRsMstrSgmtRuleAttrTbl,
} from '@/models/selfFeature/FeatureAdmModel';
import React, { useState, useEffect, useRef } from 'react';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';

import { Checkbox, Label, Select, SelectOption, Stack, TextField, Typography } from '@components/ui';
import { DivisionTypes } from '@/models/selfFeature/FeatureModel';
import { AddIcon, KeyboardArrowDownOutlinedIcon, KeyboardArrowUpOutlinedIcon, RemoveIcon } from '@/assets/icons';
import {
  initTbCoMetaTblClmnInfo,
  initTbRsMstrSgmtRuleAttrClmn,
} from '@/pages/admin/self-feature-meta-management/master-profile-management/data';
import ConfirmModal from '../modal/ConfirmModal';
import { ModalType } from '@/models/selfFeature/FeatureCommon';

const MstrProfMetaTblColumnList = ({
  editMode,
  divisionType, // 속성, 행동정보 구분
  targetIndex,
  metaTblInfo, // 저장된 메타테이블 정보
  metaTblClmnList, // 저장된 메타테이블 컬럼 정보(화면 노출용)
  metaTblClmnAllList, // 저장된 메타테이블 전체 컬럼 항목(등록 및 수정시 필요)
  setMstrSgmtRuleAttrTblList,
  setMstrSgmtRuleAttrClmnList,
}: MstrProfMetaTblColumnListProps) => {
  // 항목 리스트 show / hide 처리
  const [isColListShow, setIsColListShow] = useState<Boolean>(false);
  // 컬럼 추가 버튼 show / hide 처리
  const [isAddIconShow, setIsAddIconShow] = useState<Boolean>(false);
  // 보여줄 항목 list(등록 및 수정시 컬럼 추가할 경우 필요)
  const [tmpMetaTblClmnList, setTmpMetaTblClmnList] = useState<Array<TbCoMetaTblClmnInfo>>([]);
  // 컬럼 전체선택
  const [isCheckedAllCol, setIsCheckedAllCol] = useState<boolean>(false);
  // 모달, 버튼 클릭 종류
  const [btnClickType, setBtnClickType] = useState<string>('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [confirmModalTit, setConfirmModalTit] = useState<string>('');
  const [confirmModalCont, setConfirmModalCont] = useState<string>('');
  const [modalType, setModalType] = useState<string>('');

  useEffect(() => {
    // 테이블 정보가 바뀌면 컬럼 항목 reset && 전체선택 해제(이전 선택된 테이블 ID를 알아야함)
    if ((!metaTblInfo || metaTblInfo.mstrSgmtRuleTblId === '') && metaTblClmnAllList.length > 0) {
      // 전체선택 해제
      setIsCheckedAllCol(() => false);
      setIsAddIconShow(() => true);
      // 화면용 list
      setTmpMetaTblClmnList(() => []);
      // formData list
      let tblId: string;
      setMstrSgmtRuleAttrTblList &&
        setMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
          let rtn = cloneDeep(prevState);
          tblId = cloneDeep(rtn[targetIndex!].mstrSgmtRuleTblId);
          rtn[targetIndex!].clmnAllChocYn = 'N';
          return rtn;
        });
      setMstrSgmtRuleAttrClmnList &&
        setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
          let rtn = cloneDeep(prevState);
          rtn = rtn.filter((item: TbRsMstrSgmtRuleAttrClmn) => item.mstrSgmtRuleTblId !== tblId);
          return rtn;
        });
    }
  }, [metaTblInfo, metaTblClmnAllList]);
  // modal 확인/취소 이벤트
  const onConfirm = () => {
    if (modalType === ModalType.CONFIRM) {
    }
    setIsOpenConfirmModal(() => false);
  };
  const onCancel = () => {
    setIsOpenConfirmModal(() => false);
  };
  // 저장된 데이터중 항목 전체선택인 경우
  useEffect(() => {
    setIsCheckedAllCol(() => false);
    setIsColListShow(() => true);
    setIsAddIconShow(() => true);
    if (!metaTblInfo || !metaTblInfo.clmnAllChocYn) return;

    if (metaTblInfo.clmnAllChocYn === 'Y') {
      setIsAddIconShow(() => false);
      setIsCheckedAllCol(() => true);
      setIsColListShow(() => false);
    }
  }, [metaTblInfo?.clmnAllChocYn]);
  // 등록 및 수정시 컬럼 추가할 경우 필요
  useEffect(() => {
    if (!metaTblClmnList || metaTblClmnList.length < 1) {
      setTmpMetaTblClmnList(() => []);
    } else {
      setTmpMetaTblClmnList(() => cloneDeep(metaTblClmnList).filter((e) => e.baseTimeYn !== 'Y'));
    }
  }, [metaTblClmnList]); //저장된 메타테이블 컬럼 정보

  // 새로운 항목 추가 버튼 클릭
  const onClickAddColInfo = () => {
    if (metaTblInfo && metaTblInfo.mstrSgmtRuleTblId === '') {
      setModalType(ModalType.ALERT);
      setConfirmModalTit('Master Profile 등록');
      setConfirmModalCont('테이블을 선택 해주세요.');
      setIsOpenConfirmModal(() => true);
      return;
    }
    if (0 < metaTblClmnAllList.length && metaTblClmnAllList.length < tmpMetaTblClmnList.length + 1) {
      setIsAddIconShow(false);
      setModalType(ModalType.ALERT);
      setConfirmModalTit('Master Profile 등록');
      setConfirmModalCont('더이상 컬럼을 추가할 수 없습니다.');
      setIsOpenConfirmModal(() => true);
      return;
    }
    // 화면용 list
    setTmpMetaTblClmnList((prevState: Array<TbCoMetaTblClmnInfo>) => {
      let rtn = cloneDeep(prevState);
      let addItem = cloneDeep(initTbCoMetaTblClmnInfo);
      addItem.metaTblId = metaTblInfo!.mstrSgmtRuleTblId;
      rtn.push(addItem);
      return rtn;
    });

    let baseTimeYnClmn: Array<TbCoMetaTblClmnInfo> = cloneDeep([{ ...initTbCoMetaTblClmnInfo }]);
    baseTimeYnClmn = cloneDeep(metaTblClmnAllList)?.filter((e) => e.baseTimeYn === 'Y');
    let isPushBaseTime = cloneDeep(metaTblClmnList)?.filter((e) => e.baseTimeYn === 'Y').length === 0;
    let updtItem: TbRsMstrSgmtRuleAttrClmn = cloneDeep(initTbRsMstrSgmtRuleAttrClmn);
    setMstrSgmtRuleAttrClmnList &&
      setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
        let rtn = cloneDeep(prevState);
        let addItem = cloneDeep(initTbRsMstrSgmtRuleAttrClmn);
        Object.keys(addItem).map((colKey) => {
          metaTblInfo &&
            Object.keys(metaTblInfo).map((tblKey) => {
              if (colKey === tblKey) {
                if (isPushBaseTime) updtItem[colKey] = metaTblInfo[tblKey];
                addItem[colKey] = metaTblInfo[tblKey];
              }
              return tblKey;
            });
          return colKey;
        });
        rtn.push(addItem);
        if (isPushBaseTime) {
          updtItem.mstrSgmtRuleTblId = baseTimeYnClmn[0]?.metaTblId;
          updtItem.mstrSgmtRuleTblNm = baseTimeYnClmn[0]?.metaTblClmnPhysNm;
          updtItem.mstrSgmtRuleClmnId = baseTimeYnClmn[0]?.metaTblClmnId;
          updtItem.mstrSgmtRuleClmnNm = baseTimeYnClmn[0]?.metaTblClmnPhysNm;
          updtItem.mstrSgmtRuleClmnDesc = baseTimeYnClmn[0]?.metaTblClmnLogiNm;
          updtItem.clmnDtpCd = baseTimeYnClmn[0]?.dtpCd;
          updtItem.baseTimeYn = 'Y';
          rtn.push(updtItem);
        }
        return rtn;
      });
  };
  // 항목 삭제 버튼 클릭
  const onClickRemoveColInfo = (delIdx: number) => {
    // 전체선택 해제
    setIsCheckedAllCol(() => false);
    setIsAddIconShow(() => true);
    if (tmpMetaTblClmnList.length > 1) setIsColListShow(() => true);
    // 화면용 list
    setTmpMetaTblClmnList((prevState: Array<TbCoMetaTblClmnInfo>) => {
      let rtn = cloneDeep(prevState);
      rtn = rtn.filter((delInfo: TbCoMetaTblClmnInfo, index: number) => index !== delIdx);
      return rtn;
    });
    // formData list
    setMstrSgmtRuleAttrClmnList &&
      setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
        let rtn = cloneDeep(prevState);
        let keepList = rtn.filter(
          (item: TbRsMstrSgmtRuleAttrClmn) => item.mstrSgmtRuleTblId !== metaTblInfo!.mstrSgmtRuleTblId
        );
        let updtList = rtn.filter(
          (item: TbRsMstrSgmtRuleAttrClmn) =>
            item.mstrSgmtRuleTblId === metaTblInfo!.mstrSgmtRuleTblId && item.baseTimeYn !== 'Y'
        );
        let baseTimeClmn = rtn.filter(
          (item: TbRsMstrSgmtRuleAttrClmn) =>
            item.mstrSgmtRuleTblId === metaTblInfo!.mstrSgmtRuleTblId && item.baseTimeYn === 'Y'
        );

        updtList = updtList.filter((item: TbRsMstrSgmtRuleAttrClmn, index: number) => index !== delIdx);
        return [...keepList, ...updtList, ...baseTimeClmn];
      });
  };
  // 컬럼 전체선택
  const onClickCheckAll = () => {
    if (metaTblInfo && metaTblInfo.mstrSgmtRuleTblId === '') {
      setModalType(ModalType.ALERT);
      setConfirmModalTit('Master Profile 등록');
      setConfirmModalCont('테이블을 선택 해주세요.');
      setIsOpenConfirmModal(() => true);
      return;
    }
    setIsCheckedAllCol(!isCheckedAllCol);

    let clmnAllYn = 'N';
    if (!isCheckedAllCol) clmnAllYn = 'Y';
    // formData list
    setMstrSgmtRuleAttrTblList &&
      setMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
        let rtn = cloneDeep(prevState);
        rtn[targetIndex!].clmnAllChocYn = clmnAllYn;
        return rtn;
      });
    if (clmnAllYn === 'N') {
      setIsAddIconShow(() => true);
      // 화면용 list
      setTmpMetaTblClmnList(() => []);
      // formData list
      setMstrSgmtRuleAttrClmnList &&
        setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
          let rtn = cloneDeep(prevState);
          rtn = rtn.filter(
            (item: TbRsMstrSgmtRuleAttrClmn) => item.mstrSgmtRuleTblId !== metaTblInfo!.mstrSgmtRuleTblId
          );
          return rtn;
        });
    } else if (clmnAllYn === 'Y') {
      setIsAddIconShow(() => false);
      // 화면용 list
      setTmpMetaTblClmnList(() => cloneDeep(metaTblClmnAllList));
      // formData list
      setMstrSgmtRuleAttrClmnList &&
        setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
          let rtn = cloneDeep(prevState);
          rtn = rtn.filter(
            (item: TbRsMstrSgmtRuleAttrClmn) => item.mstrSgmtRuleTblId !== metaTblInfo!.mstrSgmtRuleTblId
          );
          let updtList: Array<TbRsMstrSgmtRuleAttrClmn> = [];
          metaTblClmnAllList.map((colItem: TbCoMetaTblClmnInfo) => {
            let updtItem: TbRsMstrSgmtRuleAttrClmn = cloneDeep(initTbRsMstrSgmtRuleAttrClmn);
            updtItem.mstrSgmtRuleTblId = colItem.metaTblId;
            updtItem.mstrSgmtRuleTblNm = colItem.metaTblClmnPhysNm;
            updtItem.mstrSgmtRuleClmnId = colItem.metaTblClmnId;
            updtItem.mstrSgmtRuleClmnNm = colItem.metaTblClmnPhysNm;
            updtItem.mstrSgmtRuleClmnDesc = colItem.metaTblClmnLogiNm;
            updtItem.clmnDtpCd = colItem.dtpCd;
            updtItem.baseTimeYn = colItem.baseTimeYn;
            updtItem.sgmtDvCd = divisionType;
            updtList.push(updtItem);
            return colItem;
          });
          return [...rtn, ...updtList];
        });
      setIsColListShow(() => false);
    }
  };

  return (
    <Stack
      direction="Vertical"
      justifyContent="Start"
      gap="LG"
      style={{
        paddingLeft: '11%',
      }}
    >
      {/* 상세 */}
      {!editMode && (
        <>
          <Stack
            direction="Horizontal"
            justifyContent="Start"
            style={{
              position: 'relative',
            }}
          >
            <Typography
              style={{
                width: '10%',
                fontWeight: '700',
              }}
              variant="body2"
            >
              컬럼 정보
            </Typography>
            {/* <Checkbox
                            checked={metaTblInfo?.clmnAllChocYn === 'Y'}
                            disabled
                        />
                        <Label style={{
                            fontSize: "0.75rem",
                            color: "rgb(85, 85, 85)",
                            lineHeight: "1.5",
                            fontWeight: "400",
                            textAlign: "start",
                            marginLeft: "0.5%",
                        }}>
                            항목 전체선택
                        </Label> */}
            {isColListShow && (
              <KeyboardArrowUpOutlinedIcon
                style={{
                  position: 'absolute',
                  right: '0px',
                }}
                onClick={() => setIsColListShow(!isColListShow)}
              />
            )}
            {!isColListShow && (
              <KeyboardArrowDownOutlinedIcon
                style={{
                  position: 'absolute',
                  right: '0px',
                }}
                onClick={() => setIsColListShow(!isColListShow)}
              />
            )}
          </Stack>
          {isColListShow &&
            metaTblClmnList.length > 0 &&
            metaTblClmnList.map((clmnInfo: TbCoMetaTblClmnInfo, index: number) => {
              return (
                <Stack
                  key={index}
                  direction="Horizontal"
                  style={{
                    border: '1px solid rgb(218, 218, 218)',
                    borderRadius: '5px',
                    background: 'white',
                    color: divisionType === DivisionTypes.ATTR ? '#00b21e' : '#00256c',
                    padding: '1rem',
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{
                      width: '40%',
                      color: divisionType === DivisionTypes.ATTR ? '#00b21e' : '#00256c',
                    }}
                  >
                    {`${clmnInfo.metaTblClmnLogiNm} [${clmnInfo.metaTblClmnPhysNm}]`}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      color: divisionType === DivisionTypes.ATTR ? '#00b21e' : '#00256c',
                    }}
                  >
                    {clmnInfo.metaTblClmnLogiNm}
                  </Typography>
                </Stack>
              );
            })}
        </>
      )}
      {/* 상세 */}
      {/* 등록 및 수정 */}
      {editMode && (
        <>
          <Stack
            direction="Horizontal"
            justifyContent="Start"
            style={{
              position: 'relative',
            }}
          >
            <Typography
              style={{
                width: '10%',
                fontWeight: '700',
              }}
              variant="body2"
            >
              컬럼 추가
            </Typography>
            {isAddIconShow && (
              <AddIcon
                style={{
                  position: 'absolute',
                  left: '6%',
                }}
                onClick={() => onClickAddColInfo()}
              />
            )}
            <Checkbox checked={isCheckedAllCol} onCheckedChange={onClickCheckAll} />
            <Label
              style={{
                fontSize: '0.75rem',
                color: 'rgb(85, 85, 85)',
                lineHeight: '1.5',
                fontWeight: '400',
                textAlign: 'start',
                marginLeft: '0.5%',
              }}
            >
              컬럼 전체선택
            </Label>
            {isColListShow && (
              <KeyboardArrowUpOutlinedIcon
                style={{
                  position: 'absolute',
                  right: '0px',
                }}
                onClick={() => setIsColListShow(!isColListShow)}
              />
            )}
            {!isColListShow && (
              <KeyboardArrowDownOutlinedIcon
                style={{
                  position: 'absolute',
                  right: '0px',
                }}
                onClick={() => setIsColListShow(!isColListShow)}
              />
            )}
          </Stack>
          {isColListShow &&
            tmpMetaTblClmnList.length > 0 &&
            tmpMetaTblClmnList.map((clmnInfo: TbCoMetaTblClmnInfo, index: number) => {
              // 현재 설정된 메타테이블 컬럼 정보 순회하며 등록 가능한 컬럼 setting
              let mstrSgmtRuleClmnOption: Array<TbCoMetaTblClmnInfo> = [];
              for (let i = 0; i < metaTblClmnAllList.length; i++) {
                let item = metaTblClmnAllList[i];
                let hasItem = false;
                if (metaTblClmnList && metaTblClmnList?.length > 0) {
                  for (let j = 0; j < metaTblClmnList.length; j++) {
                    let item2 = metaTblClmnList[j];
                    if (item.metaTblClmnId === item2.metaTblClmnId) {
                      hasItem = true;
                      break;
                    }
                  }
                }
                if (item.metaTblClmnId === clmnInfo.metaTblClmnId) hasItem = false;

                if (!hasItem) mstrSgmtRuleClmnOption.push(cloneDeep(item));
              }
              return (
                <Stack key={index} direction="Horizontal" gap="LG">
                  <RemoveIcon
                    onClick={() => {
                      onClickRemoveColInfo(index);
                    }}
                  />
                  <Stack
                    className="width-100"
                    key={index}
                    direction="Horizontal"
                    gap="LG"
                    style={{
                      border: '1px solid rgb(218, 218, 218)',
                      borderRadius: '5px',
                      background: 'white',
                      color: divisionType === DivisionTypes.ATTR ? '#00b21e' : '#00256c',
                      padding: '1rem',
                    }}
                  >
                    <Select
                      // ref={clmnRef[index]}
                      style={{
                        width: '40%',
                        color: divisionType === DivisionTypes.ATTR ? '#00b21e' : '#00256c',
                      }}
                      value={clmnInfo.metaTblClmnPhysNm}
                      appearance="Outline"
                      placeholder="선택"
                      className="width-100"
                      onChange={(
                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        value: SelectValue<{}, false>
                      ) => {
                        let v = String(value);

                        if (!v || v === 'null' || v === 'undefined') return;

                        setTmpMetaTblClmnList((prevState: Array<TbCoMetaTblClmnInfo>) => {
                          let rtn = cloneDeep(prevState);
                          let item = metaTblClmnAllList.find(
                            (item: TbCoMetaTblClmnInfo) => item.metaTblClmnPhysNm === v
                          );
                          rtn[index].metaTblClmnLogiNm = item ? item.metaTblClmnLogiNm : '';
                          rtn[index].metaTblClmnPhysNm = v;
                          return rtn;
                        });
                        setMstrSgmtRuleAttrClmnList &&
                          setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
                            let rtn = cloneDeep(prevState);
                            let keepList = rtn.filter(
                              (item: TbRsMstrSgmtRuleAttrClmn) =>
                                item.mstrSgmtRuleTblId !== metaTblInfo!.mstrSgmtRuleTblId
                            );
                            let updtList = rtn.filter(
                              (item: TbRsMstrSgmtRuleAttrClmn) =>
                                item.mstrSgmtRuleTblId === metaTblInfo!.mstrSgmtRuleTblId && item.baseTimeYn !== 'Y'
                            );
                            let baseTimeCol = rtn.filter(
                              (item: TbRsMstrSgmtRuleAttrClmn) =>
                                item.mstrSgmtRuleTblId === metaTblInfo!.mstrSgmtRuleTblId && item.baseTimeYn === 'Y'
                            );
                            let item = metaTblClmnAllList.find(
                              (item: TbCoMetaTblClmnInfo) => item.metaTblClmnPhysNm === v
                            );
                            updtList[index].mstrSgmtRuleClmnId = item ? item.metaTblClmnId : '';
                            updtList[index].clmnDtpCd = item ? item.dtpCd : '';
                            updtList[index].baseTimeYn = item ? item.baseTimeYn : '';
                            updtList[index].mstrSgmtRuleClmnNm = v;
                            updtList[index].mstrSgmtRuleClmnDesc = item ? item.metaTblClmnLogiNm : '';
                            return [...keepList, ...updtList, ...baseTimeCol];
                          });
                      }}
                    >
                      {mstrSgmtRuleClmnOption
                        .filter((e) => e.baseTimeYn !== 'Y')
                        .map((item, index) => (
                          <SelectOption
                            key={index}
                            value={item.metaTblClmnPhysNm}
                          >{`${item.metaTblClmnLogiNm} [${item.metaTblClmnPhysNm}]`}</SelectOption>
                        ))}
                    </Select>
                    <TextField
                      style={{
                        width: '40%',
                        color: divisionType === DivisionTypes.ATTR ? '#00b21e' : '#00256c',
                      }}
                      value={clmnInfo.metaTblClmnLogiNm}
                      onChange={(e) => {
                        const { id, value } = e.target;

                        setTmpMetaTblClmnList((prevState: Array<TbCoMetaTblClmnInfo>) => {
                          let rtn = cloneDeep(prevState);
                          rtn[index].metaTblClmnLogiNm = value;
                          return rtn;
                        });
                        setMstrSgmtRuleAttrClmnList &&
                          setMstrSgmtRuleAttrClmnList((prevState: Array<TbRsMstrSgmtRuleAttrClmn>) => {
                            let rtn = cloneDeep(prevState);
                            let keepList = rtn.filter(
                              (item: TbRsMstrSgmtRuleAttrClmn) =>
                                item.mstrSgmtRuleTblId !== metaTblInfo!.mstrSgmtRuleTblId
                            );
                            let updtList = rtn.filter(
                              (item: TbRsMstrSgmtRuleAttrClmn) =>
                                item.mstrSgmtRuleTblId === metaTblInfo!.mstrSgmtRuleTblId && item.baseTimeYn !== 'Y'
                            );
                            let baseTimeCol = rtn.filter(
                              (item: TbRsMstrSgmtRuleAttrClmn) =>
                                item.mstrSgmtRuleTblId === metaTblInfo!.mstrSgmtRuleTblId && item.baseTimeYn === 'Y'
                            );
                            updtList[index].mstrSgmtRuleClmnDesc = value;
                            return [...keepList, ...updtList, ...baseTimeCol];
                          });
                      }}
                    />
                  </Stack>
                </Stack>
              );
            })}
        </>
      )}
      {/* 등록 및 수정 */}
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

export default MstrProfMetaTblColumnList;
