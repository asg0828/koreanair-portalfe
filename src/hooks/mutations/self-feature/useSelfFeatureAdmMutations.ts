import { createMetaTableInfo, deleteMetaTable, updateMetaTable } from "@/api/self-feature/SelfFeatureAdminAPI";
import { RowsInfo } from "@/models/components/Table";
import { useMutation } from "@tanstack/react-query";

// customer Meta 등록
export const useCreateMetaTableInfo = () => {
    return useMutation([`/metas/tables/create`], () => createMetaTableInfo());
  };
  // customer Meta 수정
  export const useUpdateMetaTable = (
    metaTblId: string,
    metaTblLogiNm: string,
    tbCoMetaTbInfo: RowsInfo,
    tbCoMetaTblClmnInfoList: RowsInfo,
    rtmTblYn: string
  ) => {
    return useMutation([`/metas/tables/${metaTblId}`, tbCoMetaTblClmnInfoList], () =>
      updateMetaTable(metaTblId, metaTblLogiNm, tbCoMetaTbInfo, tbCoMetaTblClmnInfoList, rtmTblYn)
    );
  };
  // customer Meta 삭제
  export const useDeleteMetaTable = (metaTblIds: Array<string>) => {
    return useMutation([`/metas/tables/delete`], () => deleteMetaTable(metaTblIds));
  };