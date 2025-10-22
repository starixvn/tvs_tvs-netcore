import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsernamesComponent } from '../../../utility/components/user-names/user-names.component';
import { Selection } from '../../../utility/models/selection.model';
import { AppStore } from '../app.store';
import { UserService } from '../services/user.service';
import { ValidationService } from '../services/validation.service';
import { AddUserModel } from './add-user.model';
import { UserNameService } from '../../../utility/components/user-names/user-name.service';

@Component({
  standalone: true,
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  imports: [UsernamesComponent, NgSelectModule, FormsModule, CommonModule],
})
export class AddUserComponent implements OnChanges {
  @Input() model = new AddUserModel();
  @Input() subTypeSelection: Selection[];
  @ViewChild('usernames') usernamesComponent: UsernamesComponent;
  selectedSubType: string[];
  isVoidVIP: boolean;

  validationService = inject(ValidationService);
  userService = inject(UserService);
  abWhiteListStore = inject(AppStore);
  userNameService = inject(UserNameService);
  
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['model']) {
      this.selectedSubType = [];
      this.isVoidVIP = false;
    }
  }

  async clickSave() {
    this.abWhiteListStore.changeBlockingUiStatus(true);
    const usernames = this.userNameService.getAllValue(this.usernamesComponent.groupUsername);
    const isValidUserNames = await this.validationService.validateUsernames(usernames, this.usernamesComponent);
    if (isValidUserNames) {
      this.model.isOpen = false;
      await this.userService.addUsers(usernames, this.selectedSubType, this.isVoidVIP);
    }
    this.abWhiteListStore.changeBlockingUiStatus(false);
  }

  closeModal() {
    this.model.isOpen = false;
  }

  async afterFocusOutBetIds(): Promise<void> {
    this.abWhiteListStore.changeBlockingUiStatus(true);
    const usernames = this.userNameService.getAllValue(this.usernamesComponent.groupUsername);
    await this.validationService.validateUsernames(usernames, this.usernamesComponent);
    this.abWhiteListStore.changeBlockingUiStatus(false);
  }
}
