import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@components/table/HorizontalTable';
import { listColumns as columns, listRows as rows } from '@/utils/data/tableSampleData'
import { RowsInfo } from "@/models/components/Table";
import {
    Pagination,
    TR,
    TH,
    TD,
    Button,
    Stack,
    TextField,
    Checkbox,
    Select,
    SelectOption,
    DatePicker,
    Label,
  } from '@components/ui';
import { TbRsCustFeatRule } from "@/models/selfFeature/FeatureInfo";

const SelfFeature = () => {

    const navigate = useNavigate();

    const [ name, setName ] = useState<string>('')

    const [ searchInfo, setSearchInfo ] = useState<TbRsCustFeatRule>({
        id: '',
        name: '',
        description: '',
        rslnRuleId: '',
        mstrSgmtRuleId: '',
        mstrSgmtRuleNm: '',
        useYn: '',
        batManualExecTestCnt: 0,
        frstRegDttm: '',
        frstRegUserId: '',
        lastUpdDttm: '',
        lastUpdUserId: '',
        category: '',
        dataType: '',
        frstRegUserNm: '',
        lastUpdUserNm: '',
        submissionStatus: '',
        metaTblId: '',
        lastUpdLginId: ''
    })

    const onClickPageMovHandler = (pageNm: string, rows?: RowsInfo): void => {

        if (pageNm === 'detail' || pageNm === 'edit')
            navigate(pageNm, { state: rows })
        else
            navigate(pageNm)

    }

    const searchOnClickHandler = (): void => {
        console.log(searchInfo)
    }

    const onchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {

    }

    return (
        <Stack direction="Vertical" gap="MD" className="height-100">
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">카테고리</TH>
            <TD colSpan={3}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">Feature 명</TH>
            <TD colSpan={3}>
              <TextField className="width-100" value={name} onChange={onchangeInput}/>
            </TD>
          </TR>
          {/* <TR>
            <TH colSpan={1} align="right">데이터셋 조건</TH>
            <TD colSpan={3} align="left">
              <Checkbox label="테이터셋명" />
              <Checkbox label="테이블ID" />
              <Checkbox label="정의" />
              <Checkbox label="분석관점" />
              <Checkbox label="지수" />
              <Checkbox label="활용상세" />
            </TD>
          </TR> */}
          <TR>
            <TH align="right">사용 여부</TH>
            <TD>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
            <TH align="right">진행 상태</TH>
            <TD>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
          </TR>
          {/* <TR>
            <TH colSpan={1} align="right">등록일</TH>
            <TD colSpan={3}>
              <DatePicker appearance="Outline" calendarViewMode="days" mode="single" shape="Square" size="MD" />
              <Label>~</Label>
              <DatePicker appearance="Outline" />
            </TD>
          </TR>
          <TR>
            <TH align="right">관련부서</TH>
            <TD>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
                <Button>검색</Button>
              </Stack>
            </TD>
            <TH align="right">담당자</TH>
            <TD>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
                <Button>검색</Button>
              </Stack>
            </TD>
          </TR> */}
        </HorizontalTable>
  
        <Stack gap="SM" justifyContent="Center">
          <Button priority="Primary" appearance="Contained" size="LG" onClick={searchOnClickHandler}>
            검색
          </Button>
        </Stack>
  
        <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
          <Label>총 373 건</Label>
          <VerticalTable
            columns={columns}
            rows={rows}
            enableSort={true}
            clickable={true}
            onClick={(rows: RowsInfo) => onClickPageMovHandler('detail', rows)}
          />
          <Stack className="pagination-layout">
            <Select appearance="Outline" size="LG" defaultValue={10} className="select-page">
              <SelectOption value={10}>10</SelectOption>
              <SelectOption value={30}>30</SelectOption>
              <SelectOption value={50}>50</SelectOption>
            </Select>
  
            <Pagination size="LG" className="pagination" />
  
            <Stack justifyContent="End" gap="SM" className="width-100">
              {/* <Button size="LG">엑셀다운로드</Button> */}
              <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler('reg')}>
                등록
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    )
  }
  export default SelfFeature;