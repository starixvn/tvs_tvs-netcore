export class Result {
    errorCode: number;
    errorMsg: string;
    isSuccessful: boolean;
}

export class RecoverResult extends Result {
    isSettledBet: boolean;
}

export class SqlResult {
  ErrCode: number;
  ErrMsg: string;
  isSuccessful: boolean;
}
