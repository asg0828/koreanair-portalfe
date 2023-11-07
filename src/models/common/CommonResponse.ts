export default interface CommonResponse {
  successOrNot: string;
  statusCode: string;
  data?: any;
  header?: any;
  status?: number;
  message?: string;
}

export class StatusCode {
  public static readonly BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR';
  public static readonly PARAMETER_VALUE_ERROR = 'PARAMETER_VALUE_ERROR';
  public static readonly MANDATORY_PARAM_ERROR = 'MANDATORY_PARAM_ERROR';

  public static readonly SUCCESS = 'SUCCESS';
  public static readonly FAIL = 'FAIL';

  public static readonly WRONG_EMAIL_OR_PASSWORD = 'WRONG_EMAIL_OR_PASSWORD';
  public static readonly LOCK = 'lock';

  public static readonly UNKNOWN_ERROR = 'UNKNOWN_ERROR';
}

export class MemberStateCode {
  public static readonly INITIAL = 'initial';
  public static readonly NORMAL = 'normal';
  public static readonly DORMANT = 'dormant';
  public static readonly DELETE = 'delete';
  public static readonly LOCK = 'lock';
}
