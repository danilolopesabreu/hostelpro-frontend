import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { NgScrollbar } from 'ngx-scrollbar';

export interface ServiceRequest {
  id: number;
  type: 'room_service' | 'maintenance' | 'cleaning' | 'concierge' | 'technical';
  title: string;
  roomNumber: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  timestamp: Date;
  estimatedTime?: number; // minutes
}

@Component({
  selector: 'app-service-request-summary',
  imports: [
    MatCardModule,
    CommonModule,
    FeatherModule,
    MatButtonModule,
    MatBadgeModule,
    NgScrollbar,
  ],
  templateUrl: './service-request-summary.component.html',
  styleUrl: './service-request-summary.component.scss',
})
export class ServiceRequestSummaryComponent {
  serviceRequests: ServiceRequest[] = [
    {
      id: 1,
      type: 'room_service',
      title: 'Extra towels and pillows',
      roomNumber: '205',
      priority: 'medium',
      status: 'pending',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      estimatedTime: 10,
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Air conditioning not working',
      roomNumber: '312',
      priority: 'high',
      status: 'in_progress',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      estimatedTime: 45,
    },
    {
      id: 3,
      type: 'cleaning',
      title: 'Urgent cleaning required',
      roomNumber: '108',
      priority: 'high',
      status: 'pending',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      estimatedTime: 20,
    },
    {
      id: 4,
      type: 'concierge',
      title: 'Restaurant reservation',
      roomNumber: '507',
      priority: 'low',
      status: 'pending',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      estimatedTime: 5,
    },
    {
      id: 5,
      type: 'technical',
      title: 'WiFi connection issues',
      roomNumber: '401',
      priority: 'medium',
      status: 'in_progress',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      estimatedTime: 30,
    },
  ];

  get pendingRequests(): ServiceRequest[] {
    return this.serviceRequests.filter((req) => req.status === 'pending');
  }

  get inProgressRequests(): ServiceRequest[] {
    return this.serviceRequests.filter((req) => req.status === 'in_progress');
  }

  get highPriorityRequests(): ServiceRequest[] {
    return this.serviceRequests.filter((req) => req.priority === 'high');
  }

  get requestsByType() {
    return this.serviceRequests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  getServiceIcon(type: string): string {
    switch (type) {
      case 'room_service':
        return 'coffee';
      case 'maintenance':
        return 'tool';
      case 'cleaning':
        return 'shield';
      case 'concierge':
        return 'user-check';
      case 'technical':
        return 'wifi';
      default:
        return 'bell';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  }

  trackByRequestId(index: number, request: ServiceRequest): number {
    return request.id;
  }

  formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
  }
}
