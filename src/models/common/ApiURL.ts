export enum PortalApiURL {
  LOG_IN = '/session/v1/login',
  LOG_OUT = '/session/v1/logout',
  USER_MGMT = '/user-mgmt/v1/users',
  DEPT_MGMT = '/dept-mgmt/v1/depts',
  USER_AUTH_MGMT = '/auth-mgmt/v1/user-auths',
  ADMIN_AUTH_MGMT = '/auth-mgmt/v1/mgr-auths',
  USER_MENU_MGMT = '/menu-mgmt/v1/user-menus',
  ADMIN_MENU_MGMT = '/menu-mgmt/v1/mgr-menus',
  FILE = '/file',
  CODE = '/system/v1/code-groups',
  NOTICE = '/board/v1/notice',
  FAQ = '/board/v1/faq',
  QNA = '/board/v1/qna',
  DATAROOM = '/board/v1/dataroom',
  ONEID = '/admin/v1/oneId',
  FEATURE = '/biz-meta/v1/features',
  FEATURE_SEPARATES = '/biz-meta/v1/feature-separates',
  POPULAR_FEATURE = '/user-mgmt/v1/user-popular-features',
  DATASET = '/biz-meta/v1/table-specs',
}

export enum SelfFeatureCmmApiURL {
  CODE = '/api/v1/commCode/retrieveCommCodes',
}

export enum SelfFeatureUserApiURL {
  FEAT_BASE = '/api/v1/customerfeatures',
  FEAT_SUB_BASE = '/api/v1/submissions',
  FEAT_WITH_SUB_BASE = '/api/v1/customerfeatures-with-submission',
  FEAT_WITH_SUB_SQL_BASE = '/api/v1/korean-air/customerfeatures-with-submission',
  FACT_BASEFACT = '/api/v1/mastersegment/table-columns-meta-info',
  READ_SQL = '/api/v1/customerfeatures/read-sql',
  RUN_SCDL = '/api/v1/airflow/runSchedule',
  BATCH_EXECUTE_LOGS = '/api/v1/batchdb/logs',
  SAMPLE_DATA = '/api/v1/customerfeatures/sample',
  PARENT_CHILD = '/api/v1/customerfeatures/parent-child',
  APRV_USER_PRE = '/api/v1/submission-types',
  APRV_USER_POST = '/approver-candidate',
  SUB_REQ_BASE_PRE = '/api/v1/users',
  SUB_REQ_BASE_POST = '/submissions',
}

export enum SelfFeatureAdmApiURL {
  SCHEMA = '/api/v1/batchdb/schemas',
  META_TABLE = '/api/v1/metas/tables',
  COL_AND_CMMT = '/api/v1/metas/columnsAndComments',
  TABLE_INFO = '/api/v1/batchdb/tables',
  MSTR_SGMT_BASE = '/api/v1/mastersegment/rules',
  META_TABLE_RULE_TABLE_BASE = '/api/v1/metas/ruletable',
}
