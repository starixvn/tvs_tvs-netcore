import { Injectable } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { TEXT } from '../../../utility/constants/text';
import { Selection } from '../../../utility/models/selection.model';
import { AppService } from '../app.service';
import { AppStore } from '../app.store';
import { FilterModel } from '../filter/filter.model';
import { AddUserQuery } from '../models/add-user.query';
import { GetUserModel } from '../models/get-user.model';
import { GetUserQuery } from '../models/get-user.query';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly appService: AppService,
    private readonly modalService: ModalService
  ) { }

  async getUsers(filterModel: FilterModel): Promise<GetUserModel> {
    const query: GetUserQuery = {
      userName: filterModel.username ? filterModel.username.trim() : null,
      level: filterModel.level,
      sites: filterModel.sites,
      subTypes: filterModel.subTypes,
      voidVIP: filterModel.voidVIP
    };

    return this.appService.getUsers(query);
  }

  async addUsers(usernames: string, selectedSubType: Selection[], isVoidVIP: boolean): Promise<void> {
    const query: AddUserQuery = {
      usernames: usernames,
      subTypes: selectedSubType.map(x => x.value).join(','),
      voidVIP: isVoidVIP
    };
    const result = await this.appService.addUsers(query);
    this.modalService.open(
      {
        title: 'Add Result',
        message: TEXT.AB_WHITE_LIST_ADDED_SUCCESS,
        type: result.isSuccessful ? ModalType.Alert : ModalType.Error
      },
      async () => {
        window.location.reload();
      }
    );
  }

  async removeUsers(users: UserModel[], abExceptionListStore: AppStore): Promise<void> {
    const messageConfirmRemove = `Are you sure you want to remove the Username(s)?<br>` +
      `- ${users.map(x => x.username).join(', ')}`;
    const userIds = users.map(x => x.custId).join(',');
    this.modalService.confirm(
      {
        title: 'Remove',
        message: messageConfirmRemove,
        type: ModalType.Confirm
      },
      async () => {
        await this.onYesConfirm(userIds, abExceptionListStore);
      },
      () => { }
    );
  }

  private async onYesConfirm(userIds: string, abExceptionListStore: AppStore): Promise<void> {
    abExceptionListStore.changeBlockingUiStatus(true);
    await this.appService.removeUsers(userIds);
    abExceptionListStore.changeBlockingUiStatus(false);
    this.modalService.open(
      {
        title: 'Remove',
        message: 'Remove user(s) successfully!',
        type: ModalType.Alert
      },
      () => {
        window.location.reload();
      }
    );
  }
}