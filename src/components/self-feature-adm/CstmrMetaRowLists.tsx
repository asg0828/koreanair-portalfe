import React from 'react';
import { Checkbox, Radio, Select, SelectOption, TD, TR, TextField, Typography } from '@ke-design/components';
import { CommonCodeInfo } from '@/models/selfFeature/FeatureCommon';
import { VerticalTableProps } from './CstmrMetaColumnList';

const CstmrMetaColumnRow: React.FC<VerticalTableProps> = React.memo(({}) => {
  //   const changeYnHandler = (field: string) => {
  //     onChange(rowIndex, field);
  //   };

  //   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     onChange(e, rowIndex);
  //   };

  //   // Select 변경 핸들러
  //   const onchangeSelectHandler = (
  //     e:
  //       | React.MouseEvent<Element, MouseEvent>
  //       | React.KeyboardEvent<Element>
  //       | React.FocusEvent<Element, Element>
  //       | null,
  //     value: {},
  //     id: string
  //   ) => {
  //     onChange(e, value, id, rowIndex);
  //   };

  //   // 체크박스 선택 값 변경 핸들러
  //   const ynChg = (field: string) => {
  //     onChange(rowIndex, field);
  //   };

  //   // 행 클릭 핸들러
  //   const handleClick = () => {
  //     onClick(row, rowIndex);
  //   };

  //   return (
  //     <TR key={`row-${rowIndex}`}>
  //       {/* Key 여부 */}
  //       <TD colSpan={1}>
  //         <Checkbox onClick={() => ynChg('pkYn')} checked={row.pkYn === 'Y'} value={row.pkYn}></Checkbox>
  //       </TD>

  //       {/* 사용 여부 */}
  //       <TD colSpan={1}>
  //         <Checkbox onClick={() => ynChg('clmnUseYn')} checked={row.clmnUseYn === 'Y'} value={row.clmnUseYn}></Checkbox>
  //       </TD>

  //       {/* 수집 기준 시간 */}
  //       <TD colSpan={1}>
  //         <Radio
  //           name="metaCustomerRadio"
  //           onChange={() => timeStampChg(rowIndex)}
  //           checked={row.baseTimeYn === 'Y'}
  //           value={row.baseTimeYn}
  //         />
  //       </TD>

  //       {/* 컬럼명 */}
  //       <TD className="verticalTableTD" colSpan={1}>
  //         <Typography variant="h5">{row.columnName}</Typography>
  //       </TD>

  //       {/* 컬럼 논리명 */}
  //       <TD colSpan={1} onClick={handleClick}>
  //         <TextField id="metaTblClmnLogiNm" onChange={(e) => onChangeHandler(e)} value={row.metaTblClmnLogiNm} />
  //       </TD>

  //       {/* 컬럼 설명 */}
  //       <TD colSpan={1} onClick={handleClick}>
  //         <TextField id="metaTblClmnDesc" onChange={(e) => onChangeHandler(e)} value={row.metaTblClmnDesc} />
  //       </TD>

  //       {/* 데이터 타입 */}
  //       <TD className="verticalTableTD" colSpan={1}>
  //         <Typography variant="h5">{row.dataType}</Typography>
  //       </TD>

  //       {/* 변경 여부 */}
  //       <TD colSpan={1}>
  //         <Checkbox
  //           checked={row.changeYn === 'Y'}
  //           disabled={row.baseTimeYn === 'Y'}
  //           value={row.changeYn}
  //           onClick={() => changeYnHandler('changeYn')}
  //         />
  //       </TD>

  //       {/* 변경 데이터 타입 */}
  //       <TD colSpan={1}>
  //         {row.changeYn === 'Y' && row.baseTimeYn !== 'Y' ? (
  //           <Select
  //             appearance="Outline"
  //             placeholder="전체"
  //             style={{ maxWidth: '80px' }}
  //             className="width-100"
  //             onChange={(e, value) => value && onchangeSelectHandler(e, value, 'chgDtpCd')}
  //           >
  //             <SelectOption value={'timestamp'}>timestamp</SelectOption>
  //             <SelectOption value={'int'}>int</SelectOption>
  //             <SelectOption value={'double'}>double</SelectOption>
  //           </Select>
  //         ) : (
  //           <Typography variant="h5">{row.chgDtpCd} </Typography>
  //         )}
  //       </TD>

  //       {/* 변경 데이터 형식 */}
  //       <TD colSpan={1}>
  //         {row.changeYn === 'Y' && row.chgDtpCd === 'timestamp' && row.baseTimeYn !== 'Y' ? (
  //           <Select
  //             id="dataFormat"
  //             appearance="Outline"
  //             placeholder="전체"
  //             className="width-100"
  //             onChange={(e, value) => value && onchangeSelectHandler(e, value, 'dataFormat')}
  //           >
  //             {timeFormat?.map((row: any, index: number) => (
  //               <SelectOption key={index} value={row.cdvCntn}>
  //                 {row.cdvNm}
  //               </SelectOption>
  //             ))}
  //           </Select>
  //         ) : (
  //           <Typography variant="h5"></Typography>
  //         )}
  //       </TD>
  //     </TR>
  return <></>;
});

export default CstmrMetaColumnRow;
