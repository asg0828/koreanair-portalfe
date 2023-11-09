import HorizontalTable from '@/components/table/HorizontalTable';
import TreeMenuForm from '@/components/form/TreeSearchForm';
import { Stack, Button, TextField, TR, TH, TD, Select, SelectOption, Radio } from '@components/ui';

const List = () => {
  return (
    <>
      <Stack alignItems="Start">
        <TreeMenuForm />

        <Stack direction="Vertical" className="height-100 width-50">
          <HorizontalTable>
            <TR>
              <TH>상위부서명</TH>
              <TD><TextField disabled className="width-100" /></TD>
            </TR>
            <TR>
              <TH>부서명</TH>
              <TD><TextField className="width-100" /></TD>
            </TR>
            <TR>
              <TH>부서순서</TH>
              <TD><TextField disabled className="width-100" /></TD>
            </TR>
            <TR>
              <TH>사용여부</TH>
              <TD>
                <Radio label="사용" name="isUse" checked />
                <Radio label="미사용" name="isUse" />
              </TD>
            </TR>
            <TR>
              <TH>사용자권한그룹</TH>
              <TD>
                <Select appearance="Outline" placeholder="전체" className="width-100">
                  <SelectOption className="width-100" value={1}>
                    테스트
                  </SelectOption>
                </Select>
              </TD>
            </TR>
            <TR>
              <TH>관리자권한그룹</TH>
              <TD>
                <Select appearance="Outline" placeholder="전체" className="width-100">
                  <SelectOption className="width-100" value={1}>
                    테스트
                  </SelectOption>
                </Select>
              </TD>
            </TR>
          </HorizontalTable>
        </Stack>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG">
          저장
        </Button>
      </Stack>
    </>
  );
};
export default List;
