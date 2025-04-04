import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { SignalRService } from 'src/utility/services/signal-r.service.native';
import { NotificationPopupService } from './notification-popup.service';

@Component({
  selector: 'notification-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
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
  notifications = [
    { message: "Request 12345 is added successfully", time: "07:33 AM", createdDate: "2024-04-04", unread: true, isError: false },
    { message: "Request 12346 is edited successfully", time: "08:00 AM", createdDate: "2024-04-04", unread: false, isError: false },
    { message: "Request 12347 is added successfully", time: "09:15 AM", createdDate: "2024-04-03", unread: true, isError: false },
    { message: "Request 12348 is edited successfully", time: "10:30 AM", createdDate: "2024-04-03", unread: false, isError: false },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: true, isError: false },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: true, isError: false },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: false, isError: true },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: true, isError: true },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: true, isError: true },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: false, isError: true },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: false, isError: true },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: false, isError: false },
    { message: "Request 12349 is added successfully", time: "11:45 AM", createdDate: "2024-04-02", unread: false, isError: false },

  ];

  activeTab: 'notification' | 'error' = 'notification';
  filterTab: 'all' | 'unread' = 'all';
  notificationHeight = 250;
  isOpen = false;
  isExpanded = false;
  notificationService = inject(NotificationPopupService);
  signalRService = inject(SignalRService);

  constructor() {
    this.notificationService.isOpen$.subscribe(open => {
      this.isOpen = open;
    });
  }

  async ngOnInit() {
    await this.signalRService.initializeConnection();
  }

  get unreadNotificationCount(): number {
    console.log("unreadNotificationCount");
    return this.notifications.filter(n => n.unread && !n.isError).length;
  }

  get errorNotificationCount(): number {
    console.log("errorNotificationCount");

    return this.notifications.filter(n => n.unread && n.isError).length;
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

    const grouped = filtered.reduce((groups, notification) => {
      const date = notification.createdDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {} as Record<string, typeof this.notifications>);

    return Object.entries(grouped);
  }
}