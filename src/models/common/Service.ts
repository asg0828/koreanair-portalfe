export enum Service {
  KAL_BE = 'kal-be',
  // 2023-11-02 김태훈A Self-Feature BE API case 추가
  KAL_SF_BE = 'kal-sf-be',
  APIGEE_AUTH = 'apigee-auth',
  KAL_CSTMR_BE = 'customer-be',
}
export enum ServicePort {
  KAL_BE = 8080,
  // 2023-11-02 김태훈A Self-Feature BE API case 추가
  KAL_SF_BE = 8080,
}

export enum ServiceContextPath {
  KAL_BE = '/pt',
}
