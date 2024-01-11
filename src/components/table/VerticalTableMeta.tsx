import NoResult from '@/components/emptyState/NoData';
import { useUpdateMetaTable } from '@/hooks/mutations/self-feature/useSelfFeatureAdmMutations';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalType } from '@/models/common/Constants';
import { SortDirection, SortDirectionCode } from '@/models/common/Design';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { CommonCode, CommonCodeInfo } from '@/models/selfFeature/FeatureCommon';
import { openModal } from '@/reducers/modalSlice';
import { htmlSpeReg, htmlTagReg } from '@/utils/RegularExpression';
import '@components/table/VerticalTable.scss';
import { Button, Modal, Stack, TBody, TH, THead, TR, Table, useToast } from '@components/ui';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CstmrMetaColumnListEdit from '../self-feature-adm/CstmrMetaColumnListEdit';
import { FixedSizeList as List } from 'react-window';

export interface VerticalTableProps {
  columns: Array<ColumnsInfo>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  rowSelection?: Function;
  onClick?: Function;
  children?: ReactNode;
  onChange?: Function;
  props?: any;
  list: RowsInfo;
}

// customerMeta 수정용 grid
const VerticalTableMeta: React.FC<VerticalTableProps> = ({
  columns = [],
  rows = [],
  showHeader = true,
  enableSort = false,
  clickable = false,
  rowSelection,
  onChange,
  onClick,
  props,
  list,
}) => {
  const [flag, setFlag] = useState<string>('');
  const [submitFlag, setSubmitFlag] = useState(false);
  const { metaTblId } = props;
  const tbCoMetaTbInfo = list;
  const [tbCoMetaTblClmnInfoList, setTbCoMetaTblClmnInfoList] = useState<Array<RowsInfo>>(Array.from(rows));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: responseTime, isError: isErrorTime, refetch: refetchTime } = useCommCodes(CommonCode.FORMAT);
  const [timeFormat, setTimeFormat] = useState<Array<CommonCodeInfo>>([]);

  const [tbCoMetaTblClmnInfoListPost, setTbCoMetaTblClmnInfoListPost] = useState<Array<any>>([
    {
      baseTimeYn: '',
      clmnUseYn: 'Y',
      dtpCd: '',
      metaTblClmnLogiNm: '',
      metaTblClmnPhysNm: '',
      pkYn: '',
      metaTblClmnDesc: '',
    },
  ]);
  const {
    data: uResponse,
    isSuccess: uIsSuccess,
    isError: uIsError,
    mutate,
  } = useUpdateMetaTable(metaTblId, tbCoMetaTbInfo, tbCoMetaTblClmnInfoListPost);
  const updateMutate = useCallback(() => mutate(), uResponse?.result)
  // timeFormat 세팅
  useEffect(() => {
    if (isErrorTime || responseTime?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (responseTime?.result) {
        setTimeFormat(responseTime.result);
      }
    }
  }, [responseTime, isErrorTime, toast]);

  // 수정중 페이지 이탈 모달
  const [isOpen, setOpen] = useState(false);

  const handleChangeSortDirection = (order: SortDirection, index: number) => {
    const oValue = order === SortDirectionCode.ASC ? 1 : order === SortDirectionCode.DESC ? -1 : 0;

    const tbCoMetaTblClmnInfoList = rows.sort((a, b) => {
      if (a[index] === b[index]) {
        return 0;
      } else if (a[index] < b[index]) {
        return oValue;
      } else {
        return -oValue;
      }
    });
    setTbCoMetaTblClmnInfoList(tbCoMetaTblClmnInfoList);
  };

  useEffect(() => {
    setTbCoMetaTblClmnInfoList(rows);
  }, [rows]);


  // 수정 버튼
  const editCustomerDetailInfo = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '수정',
        content: '수정하시겠습니까?',
        onConfirm: () => setSubmitFlag(true),
      })
    );
  };



  // 목록 버튼
  const goToList = () => {
    if (rows !== tbCoMetaTblClmnInfoList) {
      setOpen(true);
    } else {
      navigate('..');
    }
  };

  // 수정 후 페이지 이동
  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      setSubmitFlag(false);
      toast({
        type: 'Error',
        content: uResponse?.message,
      });
    } else {
      if (uIsSuccess) {
        navigate('..');
        toast({
          type: 'Confirm',
          content: '수정이 완료되었습니다.',
        });
      }
    }
  }, [uResponse, uIsError, toast]);

  // 컴포넌트 데이터 수집 flag
  const getFlag = (flag: string) => {
    setFlag(flag);
  };
  let colList: Array<RowsInfo> = [];

  const getData = (data: RowsInfo) => {
    const { isNullable, remarks, dataType, ...rest } = data;
    data = {
      baseTimeYn: rest.baseTimeYn === undefined ? 'N' : rest.baseTimeYn,
      clmnUseYn: rest.clmnUseYn ? rest.clmnUseYn : 'N',
      dtpCd: rest.dtpCd,
      metaTblClmnLogiNm: rest.metaTblClmnLogiNm,
      metaTblClmnPhysNm: rest.metaTblClmnPhysNm,
      pkYn: rest.pkYn === null ? 'N' : rest.pkYn,
      metaTblClmnDesc: rest.metaTblClmnDesc,
      chgDtpCd: rest.chgDtpCd,
      dataFormat: rest.dataFormat,
    };
    colList.push(data);

    // formdata setting
    if (tbCoMetaTblClmnInfoList.filter((item)=> item.editStatus !== 'deleted').length === colList.length) {
      const validationTool = (check: string) => {
        if (check.replace(htmlTagReg, '').replace(htmlSpeReg, '').trim() === '') return true;
        else return false;
      };
      let checkValidation = '';

      /* 테이블 validation */
      if (validationTool(tbCoMetaTbInfo.dbNm)) checkValidation = '데이터베이스명을 입력해주세요';
      else if (validationTool(tbCoMetaTbInfo.metaTblPhysNm)) checkValidation = '테이블 물리명을 입력해주세요';
      else if (validationTool(tbCoMetaTbInfo.metaTblLogiNm)) checkValidation = '테이블 논리명을 입력해주세요';
      else if (validationTool(tbCoMetaTbInfo.metaTblDesc)) checkValidation = '테이블설명을 입력해주세요';
      else if (validationTool(tbCoMetaTbInfo.metaTblDvCd)) checkValidation = '메타테이블구분을 입력해주세요';
      else if (validationTool(tbCoMetaTbInfo.metaTblUseYn)) checkValidation = '사용여부을 입력해주세요';
      else if (validationTool(tbCoMetaTbInfo.rtmTblYn)) checkValidation = '실시간여부을 입력해주세요';
      else if (!colList.find((e) => e.clmnUseYn === 'Y')) checkValidation = '사용여부가 1개이상 체크되어야 합니다.';
      else if (!colList.filter((e) => e.clmnUseYn === 'Y').find((e) => e.pkYn === 'Y'))
        checkValidation = '사용여부가 Y인 것중 Key 여부를 하나 선택해주세요';
      else if (!colList.filter((e) => e.clmnUseYn === 'Y').find((e) => e.baseTimeYn === 'Y'))
        checkValidation = '사용여부가 Y인 것중 수집 기준 시간 여부를 하나 선택해주세요';
      else if (colList.filter((e) => e.clmnUseYn === 'Y').find((e) => e.metaTblClmnLogiNm === ''))
        checkValidation = '사용여부가 Y인 경우 논리명을 입력해주세요';
      else if (colList.filter((e) => e.changeYn === 'Y').find((e) => e.chgDtpCd === ('' || 'null' || null)))
        checkValidation = '변경 데이터 타입을 입력해주세요.';
      else if (
        colList.filter((e) => e.changeYn === 'Y').filter((e) => e.chgDtpCd === 'timestamp').find((e) => e.dataFormat === ('' || null || 'null')))
          checkValidation = '변경 데이터 형식을 입력해주세요.';
      if (checkValidation !== '') {
        setSubmitFlag(false);
        toast({
          type: 'Error',
          content: checkValidation,
        });
        return;
      }
      setTbCoMetaTblClmnInfoListPost(colList);
    }
  };

  useEffect(() => {
    if (submitFlag) {
      setSubmitFlag(false);
      updateMutate()
    }
  }, [tbCoMetaTblClmnInfoListPost]);

  return (
    <>
      <Table
        style={{ overflowY: 'auto', height: '500px' }}
        variant="vertical"
        size="normal"
        align="center"
        className="verticalTable"
      >
        {showHeader && columns?.length > 0 && (
          <THead>
            <TR>
              {columns.map((column, index) => (
                <TH
                  className="verticalTableTH"
                  key={`header-${index}`}
                  required={column.require}
                  colSpan={column.colSpan ? column.colSpan : undefined}
                  // enableSort={column.field.length > 0 && enableSort}
                  onChangeSortDirection={(order = SortDirectionCode.ASC) => handleChangeSortDirection(order, index)}
                >
                  {column.headerName}
                </TH>
              ))}
            </TR>
          </THead>
        )}
        {tbCoMetaTblClmnInfoList?.length > 0 ? (
        <TBody>
          <List
          height={400}
          itemCount={tbCoMetaTblClmnInfoList?.length}
          itemSize={35}
          width='100%'
          > 
          {({ index, style }) => (
          <div style={style}>
            <CstmrMetaColumnListEdit
              columns={columns}
              rows={tbCoMetaTblClmnInfoList[index]}
              rowIndex={index}
              flag={flag}
              getFlag={getFlag}
              submitFlag={submitFlag}
              getData={getData}
            />   
          </div>
          )}
      </List>
    </TBody>

        ) : (
          <TBody className="no-data-wrap">
            <NoResult />
          </TBody>
        )}
      </Table>
      <Stack gap="SM" justifyContent="End">
        <Button
          onClick={editCustomerDetailInfo}
          style={{ width: 50 }}
          type="submit"
          priority="Primary"
          appearance="Contained"
          size="LG"
        >
          수정
        </Button>
        <Button onClick={goToList} style={{ width: 50 }} type="submit" priority="Normal" appearance="Outline" size="LG">
          목록
        </Button>
      </Stack>
      <Modal open={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>오류</Modal.Header>
        <Modal.Body>작성중인 Data가 있습니다. 작성을 취소하고 이동하시겠습니까? </Modal.Body>
        <Modal.Footer>
          <Button
            priority="Primary"
            appearance="Contained"
            onClick={() => {
              navigate('..');
            }}
          >
            확인
          </Button>
          <Button
            priority="Normal"
            appearance="Outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VerticalTableMeta;
