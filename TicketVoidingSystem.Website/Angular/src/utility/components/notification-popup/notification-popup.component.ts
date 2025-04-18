import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationFilterTabName, NotificationTabName, NotificationType } from 'src/utility/constants/notification.constant';
import { SignalRService } from 'src/utility/services/signal-r.service.native';
import { StaticService } from 'src/utility/services/static.service';
import { NotificationModel } from './notification-popup.model';
import { NotificationPopupService } from './notification-popup.service';

@Component({
  selector: 'notification-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class NotificationPopupComponent {
  notificationChange: string[] = [];
  notifications: NotificationModel[] = [
    {
      content: "Request 12345 is added successfully",
      type: "N",
      id: 1,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: false
    },
    {
      content: "Request 12346 is edited successfully",
      type: "N",
      id: 2,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: true
    },
    {
      content: "Request 12347 is added successfully",
      type: "N",
      id: 3,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: false
    },
    {
      content: "Request 12348 is edited successfully",
      type: "N",
      id: 4,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: true
    },
    {
      content: "Request 12349 is added successfully",
      type: "N",
      id: 5,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: false
    },
    {
      content: "Request 12349 is added successfully",
      type: "N",
      id: 6,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: false
    },
    {
      content: "Request 12349 is added successfully",
      type: "E",
      id: 7,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: true
    },
    {
      content: "Request 12349 is added successfully",
      type: "E",
      id: 8,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: false
    },
    {
      content: "Request 12349 is added successfully",
      type: "E",
      id: 9,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: false
    },
    {
      content: "Request 12349 is added successfully",
      type: "E",
      id: 10,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: true
    },
    {
      content: "Request 12349 is added successfully",
      type: "E",
      id: 11,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: true
    },
    {
      content: "Request 12349 is added successfully",
      type: "N",
      id: 12,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: true
    },
    {
      content: "Request 12349 is added successfully",
      type: "N",
      id: 13,
      username: 1,
      createdDate: new Date("2024-04-04T07:33:00"),
      isRead: true
    }
  ];


  activeTab = NotificationTabName.NOTIFICATION;
  filterTab = NotificationFilterTabName.ALL;
  notificationHeight = 250;
  maximumOfUnread = 99;
  isOpen = false;
  isExpanded = false;
  openNotificationSubscription: Subscription;
  notificationChangeSubscription: Subscription;
  notificationService = inject(NotificationPopupService);
  signalRService = inject(SignalRService);
  cdr = inject(ChangeDetectorRef);

  async ngOnInit() {
    this.subscribeOpenEvent();
    this.subscribeNotificationEvent();
  }

  subscribeOpenEvent() {
    this.openNotificationSubscription = this.notificationService.isOpen$.subscribe(async open => {
      this.cdr.markForCheck();
      this.isOpen = open;
      if (open) {
        this.notifications = await this.notificationService.get();
      }
    });
  }

  subscribeNotificationEvent() {
    this.notificationChangeSubscription = this.signalRService.notificationChange.subscribe((notification: NotificationModel) => {
      if (this.notifications.some(n => n.content === notification.content)) {
        return;
      }
      this.notifications.push(notification);
      this.activeTab = notification.type === NotificationType.ERROR ? NotificationTabName.ERROR : NotificationTabName.NOTIFICATION;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.openNotificationSubscription?.unsubscribe();
    this.notificationChangeSubscription?.unsubscribe();
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
  }

  selectFilterTab(filterTab: string) {
    this.filterTab = filterTab;
  }

  clickNotification(event: Event, notification: NotificationModel) {
    event.stopPropagation();
    notification.isRead = true;
    void this.notificationService.update(notification.id, notification.isRead);
  }

  toggleNotifications() {
    this.notificationHeight = this.isExpanded ? 250 : 750;
    this.isExpanded = !this.isExpanded;
  }

  markAllAsRead() {
    this.notifications?.filter(n => n.type === NotificationType.ERROR === (this.activeTab === NotificationTabName.ERROR))
    .forEach(n => n.isRead = true);
  }

  @HostListener('document:click', ['$event'])
  closeOnClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container')) {
      this.isOpen = false;
    }
  }

  groupedNotificationsArray() {
    if (!this.notifications) {
      return [];
    }

    let filtered = this.notifications.filter(n =>
      this.activeTab === NotificationTabName.NOTIFICATION ? n.type !== NotificationType.ERROR : n.type === NotificationType.ERROR
    );

    if (this.filterTab === NotificationFilterTabName.UNREAD) {
      filtered = filtered.filter(n => !n.isRead);
    }
    console.log("groupedNotificationsArray");

    filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    const grouped = filtered.reduce((groups, notification) => {
      const date = StaticService.formatFullEnglishDate(notification.createdDate);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {} as Record<string, typeof this.notifications>);

    return Object.entries(grouped);
  }
}