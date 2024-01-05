export interface ReportParams {
    sortedColumn:string;
    sortedDirection:string;
    rank:number;
    mergeTargetOneidNo: string;
    skypassNm:number;
    userNm:string;
    vipType:string;
}

export interface VipModel extends ReportParams {
    confirmPnrCount:number;
    scheduledIntlFlightDate : number;
    lastIntlFlightDate : number;
}

export interface ContributionModel extends ReportParams {
    purchaseAmount : number;
    purchaseCount : number;
    domesticPurchaseAmount : number;
    intlPurchaseAmount : number;
    frCount : number;
    PrCount : number;
}

export interface IntlBoardingModel extends ReportParams {
    IntlIncomeAmount : number;
    IntlBonusBoardingCount : number;
    IntlFrCount : number;
    IntlPrCount : number;
    avgBoardingIntervalForIntl : number;
    mostFrequentedOnDForIntl : string;

}

export interface DomesticBoardingModel extends ReportParams {
    domesticIncomeAmount : number;
    domesticBoardingCount : number;
    domesticPurchaseAmount : number;
    domesticBonusBoardingCount : number;
    domesticPrBoardingCount : number;
    domesticAvgBoardingCycle : number;
}

export interface MileageModel extends ReportParams {
    totalMileage : number;
    totalFlightMileage : number;
    totalEtcMileage : number;
    availableMileage : number;
    familyAvailableMileage : number;
    mileagePartnerCardYn : string;
}