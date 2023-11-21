export enum PortalApiURL {
  LOG_IN = '/session/v1/login',
  LOG_OUT = '/session/v1/logout',
  CODE = '/system/v1/code-groups',
  NOTICE = '/board/v1/notice',
  FAQ = '/board/v1/faq',
  QNA = '/board/v1/qna',
  DATAROOM = '/board/v1/dataroom',
  ONEID = '/admin/v1/oneId',
  FEATURE = '/biz-meta/v1/features',
  FEATURE_SEPARATES = '/biz-meta/v1/feature-separates',
  USER_FEATURE = '/user-mgmt/v1/users',
  DATASET = '/biz-meta/v1/table-specs',
}

export enum SelfFeatureCmmApiURL {
  CODE = '/api/v1/commCode/retireveCommCodes',
}

export enum SelfFeatureUserApiURL {
  FACT_BASEFACT = '/api/v1/mastersegment/table-columns-meta-info',
  READ_SQL = '/api/v1/customerfeatures/read-sql',
  RUN_SCDL = '/api/v1/airflow/runSchedule',
  BATCH_EXECUTE_LOGS = '/api/v1/batchdb/logs',
  SAMPLE_DATA = '/api/v1/customerfeatures/sample',
  PARENT_CHILD = '/api/v1/customerfeatures/parent-child',
}

export enum SelfFeatureAdmApiURL {
  SCHEMA = '/api/v1/batchdb/schemas',
  META_TABLE_LIST = '/api/v1/metas/tables',
  COL_AND_CMMT = '/api/v1/metas/columnsAndComments/tb_co_meta_tbl_info',
}