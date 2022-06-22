import { Result } from '../models/result';

export class ResultModelService {
  static createSuccessResult(): Result<null> {
    return {
      isSuccessful: true,
      errorCode: 0,
      errorMsg: ''
    };
  }

  static createFailResult(errorMessage: string, errorCode: number): Result<null> {
    return {
      isSuccessful: false,
      errorCode: errorCode,
      errorMsg: errorMessage
    };
  }
}