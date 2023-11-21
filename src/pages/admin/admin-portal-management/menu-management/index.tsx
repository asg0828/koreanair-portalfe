import HorizontalTable from '@/components/table/HorizontalTable';
import TreeMenuForm from '@/components/form/TreeSearchForm';
import { Stack, Button, TextField, TR, TH, TD, Radio } from '@components/ui';

const List = () => {
  return (
    <>
      <Stack alignItems="Start">
        <TreeMenuForm />

        <Stack direction="Vertical" className="height-100 width-50">
          <HorizontalTable>
            <TR>
              <TH>상위메뉴명</TH>
              <TD><TextField disabled className="width-100" /></TD>
            </TR>
            <TR>
              <TH>메뉴명</TH>
              <TD><TextField className="width-100" /></TD>
            </TR>
            <TR>
              <TH>메뉴 URL</TH>
              <TD><TextField disabled className="width-100" /></TD>
            </TR>
            <TR>
              <TH>메뉴 설명</TH>
              <TD><TextField className="width-100" /></TD>
            </TR>
            <TR>
              <TH>사용여부</TH>
              <TD>
                <Radio label="사용" checked />
                <Radio label="미사용" />
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
