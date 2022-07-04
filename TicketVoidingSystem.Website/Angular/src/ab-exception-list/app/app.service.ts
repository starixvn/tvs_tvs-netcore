import { Injectable } from '@angular/core';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { AbExceptionSubType } from './models/ab-exception-sub-type.mode';
import { AddUserQuery } from './models/add-user.query';
import { CheckUsernameModel } from './models/check-username.model';
import { GetUserModel } from './models/get-user.model';
import { GetUserQuery } from './models/get-user.query';
import { PermissionABExceptionList } from './models/permission.model';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  /* istanbul ignore next */
  async getUsers(query: GetUserQuery): Promise<GetUserModel> {
    return this.httpService.postJson<GetUserQuery, GetUserModel>(query, 'api/ABExceptionList/GetUsers');
  }
  
  /* istanbul ignore next */
  async addUsers(query: AddUserQuery ): Promise<Result<null>> {
    return this.httpService.postJson<AddUserQuery, Result<null>>(query, 'api/ABExceptionList/AddUsers');
  }

  /* istanbul ignore next */
  async getPermissionABExceptionList(): Promise<PermissionABExceptionList> {
    return this.httpService.getJson('api/ABExceptionList/GetPermission');
  }

  /* istanbul ignore next */
  async getSubTypes(): Promise<AbExceptionSubType[]> {
    return this.httpService.getJson('api/ABExceptionList/GetSubType');
  }
  
  /* istanbul ignore next */
  async checkUsernames(usernames: string): Promise<CheckUsernameModel> {
    return this.httpService.postJson<{ usernames: string }, CheckUsernameModel>({ usernames: usernames }, 'api/ABExceptionList/CheckUsernames');
  }

  /* istanbul ignore next */
  async removeUsers(custIds: string): Promise<Result<null>> {
    return this.httpService.postJson<{ custIds: string }, Result<null>>({ custIds: custIds }, 'api/ABExceptionList/RemoveUsers');
  }
}
