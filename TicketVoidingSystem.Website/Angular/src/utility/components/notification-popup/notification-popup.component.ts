import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalRService } from 'src/utility/services/signal-r.service.native';
import { StaticService } from 'src/utility/services/static.service';
import { NotificationPopupService } from './notification-popup.service';

export interface NotificationItem {
  message: string;
  timestamp: string; // formatted like "2025-04-11 13:50:19"
  unread: boolean;
  isError: boolean;
}

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
  notifications: NotificationItem[] = [
    { message: "Request 12345 is added successfully", timestamp: "2024-04-04 07:33:00", unread: true, isError: false },
    { message: "Request 12346 is edited successfully", timestamp: "2024-04-04 07:33:00", unread: false, isError: false },
    { message: "Request 12347 is added successfully", timestamp: "2024-04-04 07:33:00", unread: true, isError: false },
    { message: "Request 12348 is edited successfully", timestamp: "2024-04-04 07:33:00", unread: false, isError: false },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: true, isError: false },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: true, isError: false },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: false, isError: true },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: true, isError: true },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: true, isError: true },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: false, isError: true },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: false, isError: true },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: false, isError: false },
    { message: "Request 12349 is added successfully", timestamp: "2024-04-04 07:33:00", unread: false, isError: false },

  ];

  activeTab: 'notification' | 'error' = 'notification';
  filterTab: 'all' | 'unread' = 'all';
  notificationHeight = 250;
  maximumOfUnread = 99;
  isOpen = false;
  isExpanded = false;

  openNotificationSubscription: Subscription;
  notificationChangeSubscription: Subscription;

  notificationService = inject(NotificationPopupService);
  signalRService = inject(SignalRService);
  cdr = inject(ChangeDetectorRef);

  constructor() {
    this.openNotificationSubscription = this.notificationService.isOpen$.subscribe(open => {
      this.cdr.markForCheck();
      this.isOpen = open;
    });
  }

  async ngOnInit() {
    this.notificationChangeSubscription = this.signalRService.notificationChange.subscribe((notification: string[]) => {
      console.log("notificationChangeSubscription");
      const messsage = {message: notification[0], timestamp: new Date().toLocaleString(), unread: true, isError: false};
      this.notifications.push(messsage);
      this.activeTab = messsage.isError ? 'error' : 'notification';
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.openNotificationSubscription?.unsubscribe();
    this.notificationChangeSubscription?.unsubscribe();
  }

  get unreadNotificationCount(): string {
    console.log("unreadNotificationCount");
    const count = this.notifications.filter(n => n.unread && !n.isError).length;
    return count <= this.maximumOfUnread ? `${count}` : '99+';
  }

  get unreadErrorCount(): string {
    console.log("unreadErrorCount");
    const count = this.notifications.filter(n => n.unread && n.isError).length;
    return count <= this.maximumOfUnread ? `${count}` : '99+';
  }

  selectTab(tab: 'notification' | 'error') {
    this.activeTab = tab;
  }

  selectFilterTab(tab: 'all' | 'unread') {
    this.filterTab = tab;
  }

  clickNotification(event: Event, notification: any) {
    event.stopPropagation();
    notification.unread = false;
  }

  toggleNotifications() {
    this.notificationHeight = this.isExpanded ? 250 : 750;
    this.isExpanded = !this.isExpanded;
  }

  markAllAsRead() {
    this.notifications.filter(n => n.isError === (this.activeTab === 'error'))
    .forEach(n => n.unread = false);
  }

  @HostListener('document:click', ['$event'])
  closeOnClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container')) {
      this.isOpen = false;
    }
  }

  groupedNotificationsArray() {
    let filtered = this.notifications.filter(n =>
      this.activeTab === 'notification' ? !n.isError : n.isError
    );

    if (this.filterTab === 'unread') {
      filtered = filtered.filter(n => n.unread);
    }
    console.log("groupedNotificationsArray");

    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const grouped = filtered.reduce((groups, notification) => {
      const date = StaticService.formatFullEnglishDate(notification.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {} as Record<string, typeof this.notifications>);

    return Object.entries(grouped);
  }
}