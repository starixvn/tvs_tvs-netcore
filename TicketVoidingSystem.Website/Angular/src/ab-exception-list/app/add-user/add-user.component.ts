import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { UsernamesComponent } from '../../../utility/components/user-names/user-names.component';
import { Selection } from '../../../utility/models/selection.model';
import { AppStore } from '../app.store';
import { UserService } from '../services/user.service';
import { ValidationService } from '../services/validation.service';
import { AddUserModel } from './add-user.model';

@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnChanges {
  @Input() model = new AddUserModel();
  @Input() subTypeSelection: Selection[];
  @ViewChild('usernames') usernamesComponent: UsernamesComponent;

  selectedSubType: string[];
  isVoidVIP: boolean;
  
  constructor(
    private readonly validationService: ValidationService,
    private readonly userService: UserService,
    private readonly abWhiteListStore: AppStore
  ) { }
  
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['model']) {
      this.selectedSubType = [];
      this.isVoidVIP = false;
    }
  }

  async clickSave() {
    this.abWhiteListStore.changeBlockingUiStatus(true);
    const usernames = this.usernamesComponent.groupUsername.getAllValue();
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
}
