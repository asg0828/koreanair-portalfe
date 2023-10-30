import { useNavigate } from 'react-router-dom';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { RowsInfo } from '@/models/components/Table';
import {
  TR,
  TH,
  TD,
  TBody,
  Button,
  Stack,
  TextField,
  Checkbox,
  Select,
  SelectOption,
  Pagination,
  Table,
  THead,
  Label
} from '@components/ui';
import { listColumns as columns, listRows as rows } from '@/utils/data/tableSampleData'

const List = () => {
  const navigate = useNavigate();

  const goToReg = () => {
    navigate('reg');
  };

  const goToDetail = (row: RowsInfo) => {
    navigate('detail', { state: row });
  };

  const trClick =()=>{
    navigate('detail');
  }

  const starClick =()=>{
    alert("starClick");
  }

  return (
    <>
      <SearchForm>
      <HorizontalTable>
          <TBody className="height-100">
          <TR>
            <TH colSpan={1} align="right">대구분</TH>
            <TD colSpan={2}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
            <TH colSpan={1} align="right">중구분</TH>
            <TD colSpan={2}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">검색 Feature</TH>
            <TD colSpan={5.01} align="left">
              <TextField className="width-100" size="MD" />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">검색 조건</TH>
            <TD colSpan={5.01} align="left">
              <Checkbox label="Feature 한글명" />
              <Checkbox label="Feature 영문명" />
              <Checkbox label="정의" />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">Feature 신청자</TH>
            <TD colSpan={2}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" size='MD'/>
                <Button
                  appearance="Contained"
                  priority="Normal"
                  shape="Square"
                  size="MD"
                >
                  <span className="searchIcon"></span>
                </Button>
              </Stack>
            </TD>
            <TH colSpan={1} align="right">신청부서</TH>
            <TD colSpan={2}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" size='MD'/>
                <Button
                  appearance="Contained"
                  priority="Normal"
                  shape="Square"
                  size="MD"
                >
                  <span className="searchIcon"></span>
                </Button>
              </Stack>
            </TD>
          </TR>
          </TBody>
        </HorizontalTable>
      </SearchForm>
      <Stack gap="SM" style={{justifyContent:"space-between"}}>
        <Label>총 <span className="total">{10}</span> 건</Label>
        <Select appearance="Outline" size='LG' defaultValue={10}  className='select-page'>
          <SelectOption value={10}>10 건</SelectOption>
          <SelectOption value={50}>50 건</SelectOption>
          <SelectOption value={100}>100 건</SelectOption>
        </Select>
      </Stack>
      <Table>
        <THead>
          <TR>
            <TH colSpan={0.3}>
              <span className='star'></span>
            </TH>
            <TH colSpan={1}>
              대구분
            </TH>
            <TH colSpan={1}>
              중구분
            </TH>
            <TH colSpan={1}>
              Feature 한글명
            </TH>
            <TH colSpan={1}>
            Feature 영문명
            </TH>
            <TH colSpan={2}>
              정의
            </TH>
            <TH colSpan={1}>
              Feature 신청자
            </TH>
            <TH colSpan={1}>
              신청부서
            </TH>
          </TR>
        </THead>
        <TBody className='listTableBody'>
          <TR>
            <TD colSpan={0.3}>
              <span className='star' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
                정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star active' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star active' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star active' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star active' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
          <TR>
            <TD colSpan={0.3}>
              <span className='star active' onClick={starClick}></span>
            </TD>
            <TD colSpan={1} onClick={trClick}>
                대구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              중구분
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 한글명
            </TD>
            <TD colSpan={1} onClick={trClick}>
            Feature 영문명
            </TD>
            <TD colSpan={2} onClick={trClick}>
              정의
            </TD>
            <TD colSpan={1} onClick={trClick}>
              Feature 신청자
            </TD>
            <TD colSpan={1} onClick={trClick}>
              신청부서
            </TD>
          </TR>
        </TBody>
      </Table>
      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={()=>{goToReg()}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"></path></svg>
          등록
        </Button>
      </Stack>

      <Stack  justifyContent="Center">
        <Pagination size="MD" className="pagination" />
      </Stack>

    </>
  );
};
export default List;
