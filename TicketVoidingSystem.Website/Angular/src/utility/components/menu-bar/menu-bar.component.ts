import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../utility/services/common.service';
import { SignalRService } from '../../../utility/services/signal-r.service.native';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { NotificationPopupService } from '../notification-popup/notification-popup.service';
import { MenuItem } from './menu-bar.model';

@Component({
  standalone: true,
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  imports: [CommonModule, FormsModule, NotificationPopupComponent]
})
export class MenuBarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  username: string;
  isBlock: boolean;
  rootUrl = '/';
  notificationIconClass = '';
  notificationIconClassSubscription: Subscription;
  private notificationTimer: ReturnType<typeof setTimeout>;

  notificationService = inject(NotificationPopupService);
  commonService = inject(CommonService);
  signalRService = inject(SignalRService);

  async ngOnInit(): Promise<void> {
    this.isBlock = true;
    this.rootUrl = document.body.getAttribute('root-url');
    const model = await this.commonService.getNapUserInfo();
    if (model) {
      this.username = model.userName;
      this.menuItems = orderBy(uniqBy(model.menuItem.filter(x => x.parentId <= 0), x => x.id), ['displayOrder'], ['asc']);
      this.menuItems.forEach(t => {
        t.items = model.menuItem.filter(z => z.parentId === t.id);
        t.items = orderBy(uniqBy(t.items, x => x.id), ['displayOrder'], ['asc']);
      });
      this.isBlock = false;
    }

    this.notificationIconClassSubscription = this.signalRService.notificationIconClass.subscribe((value: string) => {
      this.notificationIconClass = value;
      if (value) {
        // Clear any existing timer
        if (this.notificationTimer) {
          clearTimeout(this.notificationTimer);
        }
        // Set new timer to remove class after 5 seconds
        this.notificationTimer = setTimeout(() => {
          this.notificationIconClass = 'fa-bell-unread';
        }, 5000);
      }
    });
  }

  toggleNotification(event: Event) {
    event.stopPropagation();
    this.notificationIconClass = '';
    this.notificationService.toggle();
  }

  ngOnDestroy() {
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
    if (this.notificationIconClassSubscription) {
      this.notificationIconClassSubscription.unsubscribe();
    }
  }
}
