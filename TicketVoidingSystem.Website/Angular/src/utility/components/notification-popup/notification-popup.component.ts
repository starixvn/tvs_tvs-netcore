import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fadeSlide } from 'src/utility/constants/animations.constant';
import { NotificationFilterTabName, NotificationTabName, NotificationType } from '../../constants/notification.constant';
import { SignalRService } from '../../services/signal-r.service.native';
import { StaticService } from '../../services/static.service';
import { NotificationModel } from './notification-popup.model';
import { NotificationPopupService } from './notification-popup.service';

@Component({
  standalone: true,
  selector: 'notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeSlide]
})
export class NotificationPopupComponent {
  notificationChange: string[] = [];
  notifications: NotificationModel[] = [];
  groupedNotifications: [string, NotificationModel[]][] = [];
  activeTab = NotificationTabName.NOTIFICATION;
  filterTab = NotificationFilterTabName.ALL;
  notificationHeight = 250;
  maximumOfUnread = 99;
  isOpen = false;
  isExpanded = false;

  destroyRef = inject(DestroyRef);
  notificationService = inject(NotificationPopupService);
  signalRService = inject(SignalRService);
  cdr = inject(ChangeDetectorRef);

  async ngOnInit() {
    this.subscribeOpenEvent();
    this.subscribeNotificationEvent();
    await this.getNotifications();
  }

  subscribeOpenEvent() {
    this.notificationService.isOpen$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async open => {
        this.cdr.markForCheck();
        this.isOpen = open;
        if (open) {
          this.isExpanded = false;
          this.notificationHeight = 250;
          await this.getNotifications();
        }
      });
  }

  subscribeNotificationEvent() {
    this.signalRService.notificationChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification: NotificationModel) => {
        this.addNewNotification(notification);
      });
  }

  get unreadNotificationCount(): string {
    const count = this.notifications?.filter(n => !n.isRead && n.type !== NotificationType.ERROR).length;
    return count > 0 ? (count <= this.maximumOfUnread ? `${count}` : '99+') : '';
  }

  get unreadErrorCount(): string {
    const count = this.notifications?.filter(n => !n.isRead && n.type === NotificationType.ERROR).length;
    return count > 0 ? (count <= this.maximumOfUnread ? `${count}` : '99+') : '';
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.updateGroupedNotifications();
  }

  selectFilterTab(filterTab: string) {
    this.filterTab = filterTab;
    this.updateGroupedNotifications();
  }

  clickNotification(event: Event, notification: NotificationModel) {
    event.stopPropagation();
    if (!notification.isRead) {
      notification.isRead = true;
      void this.notificationService.update(notification.id.toString(), notification.isRead);
    }
  }

  toggleNotifications() {
    this.notificationHeight = this.isExpanded ? 250 : 750;
    this.isExpanded = !this.isExpanded;
  }

  markAllAsRead() {
    const affectedNotifications = this.notifications?.filter(n => !n.isRead
      && n.type === (this.activeTab === NotificationTabName.ERROR ? NotificationType.ERROR : NotificationType.NOTIFICATION));
    if (affectedNotifications.length > 0) {
      affectedNotifications.forEach(n => n.isRead = true);
      void this.notificationService.update(affectedNotifications.map(n => n.id.toString()).join(','), true);
    }
  }

  @HostListener('document:click', ['$event'])
  closeOnClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest('.notification-container')) {
      return;
    }

    if (this.isOpen) {
      this.notificationService.toggle();
    }
  }

  private updateGroupedNotifications() {
    let filtered = this.notifications.filter(n =>
      this.activeTab === NotificationTabName.NOTIFICATION ? n.type !== NotificationType.ERROR : n.type === NotificationType.ERROR
    );

    if (this.filterTab === NotificationFilterTabName.UNREAD) {
      filtered = filtered.filter(n => !n.isRead);
    }

    filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    const grouped = filtered.reduce((groups, notification) => {
      const date = StaticService.formatFullEnglishDate(notification.createdDate);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {} as Record<string, NotificationModel[]>);

    this.groupedNotifications = Object.entries(grouped);
    this.cdr.markForCheck();
  }

  private addNewNotification(notification: NotificationModel) {
    if (this.notifications.some(n => n.content === notification.content && !notification.content.includes('stored'))) {
      return;
    }

    this.notifications.unshift(notification);
    this.activeTab = notification.type === NotificationType.ERROR ? NotificationTabName.ERROR : NotificationTabName.NOTIFICATION;

    const formattedDate = StaticService.formatFullEnglishDate(notification.createdDate);
    if (this.groupedNotifications.length > 0 && this.groupedNotifications[0][0] === formattedDate) {
      this.groupedNotifications[0][1].unshift(notification);
    } else {
      this.groupedNotifications.unshift([formattedDate, [notification]]);
    }

    this.cdr.markForCheck();
  }

  private async getNotifications() {
    this.notifications = await this.notificationService.get();
    this.updateGroupedNotifications();
  }
}