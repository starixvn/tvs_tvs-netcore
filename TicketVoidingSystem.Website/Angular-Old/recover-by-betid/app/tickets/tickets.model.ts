import { ElementRef } from '@angular/core';
import { BetId } from '../../../internal/models/bet-id.model';
import { GroupModel } from './group.model';

enum IconCheckBox {
    none = 0,
    any = 1,
    all = 2
}

export class TicketsModel {
    groups: Array<GroupModel>;
    invalidTransIds: string;
    movedTransIds: string;
    iconCheckBox: IconCheckBox;
    iconCheckBoxTop: string;

    updatePositionListCheckGroup(element: ElementRef) {
        const className = 'list-check-groups-input';
        const targetElement = element.nativeElement.getElementsByClassName(className);
        const top = targetElement[0].offsetParent.offsetTop + targetElement[0].offsetHeight;
        this.iconCheckBoxTop = top + 'px';
    }

    getCheckedTickets(): BetId[] {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getValueTickets();
            result.push(...ticketInGroup);
        });

        return result;
    }

    changeIconCheckBox() {
        let numberTickets = 0;
        let numberTicketsChecked = 0;
        this.groups.forEach(group => {
            group.tickets.forEach(ticket => {
                if (!ticket.isDisable) {
                    numberTickets++;
                    if (ticket.isChecked) {
                        numberTicketsChecked++;
                    }
                }
            });
        });
        this.iconCheckBox =
            numberTickets === 0 ? IconCheckBox.none :
                numberTickets === numberTicketsChecked ? IconCheckBox.all :
                    numberTicketsChecked > 0 ? IconCheckBox.any : IconCheckBox.none;
    }

    checkGroups() {
        if (this.groups.length > 0) {
            if (this.iconCheckBox !== IconCheckBox.none) {
                this.groups.forEach(group => {
                    group.isCheckAll = false;
                    group.checkTickets();
                });
                this.iconCheckBox = IconCheckBox.none;
            }
            else {
                this.groups.forEach(group => {
                    group.isCheckAll = !group.isDisabled;
                    group.checkTickets();
                });
                this.iconCheckBox = IconCheckBox.all;
            }
        }
    }

    checkAllGroupsDropDown() {
        if (this.iconCheckBox !== IconCheckBox.all) {
            this.groups.forEach(group => {
                group.isCheckAll = !group.isDisabled;
                group.checkTickets();
            });
            this.iconCheckBox = IconCheckBox.all;
        }
        else {
            this.groups.forEach(group => {
                group.isCheckAll = false;
                group.checkTickets();
            });
            this.iconCheckBox = IconCheckBox.none;
        }
    }

    isAllItemsChecked(): boolean {
        let result = true;
        for (let i = 0; i < this.groups.length && result; i++) {
            for (let j = 0; j < this.groups[i].tickets.length && result; j++) {
                const ticket = this.groups[i].tickets[j];
                result = ticket.isChecked;
            }
        }

        return result;
    }
}