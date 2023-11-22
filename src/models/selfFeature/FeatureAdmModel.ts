
export interface CustMetaListSrchInfo {
    [key: string]: string
    item: string
    searchWord: string
    metaTblUseYn: string
}

export interface CustMetaSrchItem {
    [key: string]: string
    columnComment: string
    columnName: string
}

export interface CustMetaTableData {
    [key: string]: string
    dataClaCd: string
    dataSrcDvCd: string
    dbNm: string
    frstRegDttm: string
    frstRegUserId: string
    keepCylcCd: string
    lastUpdDttm: string
    lastUpdUserId: string
    metaTblDesc: string
    metaTblDvCd: string
    metaTblId: string
    metaTblLogiNm: string
    metaTblPhysNm: string
    metaTblUseYn: string
    rtmTblYn: string
    topicId: string
}