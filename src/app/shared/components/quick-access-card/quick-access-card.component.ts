import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { FeatherModule } from 'angular-feather';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface QuickAccessItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  badge?: number;
  description: string;
}

@Component({
  selector: 'app-quick-access-card',
  imports: [
    MatCardModule,
    FeatherModule,
    MatButtonModule,
    MatTooltipModule
],
  templateUrl: './quick-access-card.component.html',
  styleUrl: './quick-access-card.component.scss',
})
export class QuickAccessCardComponent {
  quickAccessItems: QuickAccessItem[] = [
    {
      id: 'rooms',
      title: 'Room Management',
      icon: 'home',
      color: '#007bff',
      route: '/admin/rooms',
      badge: 3,
      description: 'Manage room availability and assignments',
    },
    {
      id: 'staff',
      title: 'Staff Roster',
      icon: 'users',
      color: '#28a745',
      route: '/admin/staff',
      description: 'View and manage staff schedules',
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: 'bar-chart-2',
      color: '#ffc107',
      route: '/admin/reports',
      description: 'Generate and view hotel reports',
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      icon: 'tool',
      color: '#dc3545',
      route: '/admin/maintenance',
      badge: 7,
      description: 'Track maintenance requests and tasks',
    },
    {
      id: 'housekeeping',
      title: 'Housekeeping',
      icon: 'shield',
      color: '#6f42c1',
      route: '/admin/housekeeping',
      badge: 12,
      description: 'Monitor room cleaning status',
    },
    {
      id: 'guests',
      title: 'Guest Services',
      icon: 'user-check',
      color: '#20c997',
      route: '/admin/guests',
      description: 'Handle guest requests and services',
    },
    {
      id: 'billing',
      title: 'Billing',
      icon: 'credit-card',
      color: '#fd7e14',
      route: '/admin/billing',
      description: 'Process payments and invoices',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      color: '#6c757d',
      route: '/admin/settings',
      description: 'Configure hotel system settings',
    },
  ];

  trackByItemId(index: number, item: QuickAccessItem): string {
    return item.id;
  }

  onQuickAccessClick(item: QuickAccessItem): void {
    // In a real application, you would navigate to the route
    console.log(`Navigating to ${item.route}`);
    // this.router.navigate([item.route]);
  }
}