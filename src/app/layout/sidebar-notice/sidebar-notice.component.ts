import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';


export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  organizer?: string;
  isRead: boolean;
  priority: 'normal' | 'high';
  type?: 'meeting' | 'reminder' | 'deadline' | 'event';
  colorScheme:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'secondary';
  hasAttachment: boolean;
  attachments?: { name: string; url: string; type: string }[];
  expanded: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordRotation: boolean;
  autoLogout: boolean;
  mobileOtp: boolean;
}

export interface NotificationSettings {
  messages: boolean;
  security: boolean;
  email: boolean;
  events: boolean;
}

@Component({
  selector: 'app-sidebar-notice',
  templateUrl: './sidebar-notice.component.html',
  styleUrls: ['./sidebar-notice.component.scss'],
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSnackBarModule,
    FormsModule
],
})
export class SidebarNoticeComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  events: Event[] = [
    {
      id: '1',
      title: 'Project Planning Meeting',
      description:
        'Meeting with john deo regarding new project planning and estimation. We need to discuss the timeline, resources, and deliverables.',
      date: 'Today',
      time: '10:00',
      location: 'Conference Room A',
      organizer: 'Pankaj Tiwari',
      isRead: false,
      priority: 'high',
      type: 'meeting',
      colorScheme: 'primary',
      hasAttachment: true,
      attachments: [
        {
          name: 'Project_Timeline.pdf',
          url: '/assets/docs/timeline.pdf',
          type: 'pdf',
        },
        {
          name: 'Requirements.docx',
          url: '/assets/docs/requirements.docx',
          type: 'doc',
        },
      ],
      expanded: false,
    },
    {
      id: '2',
      title: 'Design Review Session',
      description:
        'Green. Herb. Seas after multiply creepeth itself give set, sixth bring green to that made own, deep under grass said.',
      date: '11 Jan',
      time: '12:30',
      location: 'Design Studio',
      organizer: 'Jamie Lloyd',
      isRead: true,
      priority: 'normal',
      type: 'meeting',
      colorScheme: 'success',
      hasAttachment: false,
      expanded: false,
    },
    {
      id: '3',
      title: 'Development Sprint Planning',
      description:
        "Dominion light. Cattle seed god fowl itself his won't won't, seas man. Brought fowl forth hath rule created fill said.",
      date: '12 - 14 Feb',
      time: '14:00',
      location: 'Virtual Meeting',
      organizer: 'Alby Shaw',
      isRead: false,
      priority: 'normal',
      type: 'event',
      colorScheme: 'info',
      hasAttachment: true,
      attachments: [
        {
          name: 'Sprint_Goals.xlsx',
          url: '/assets/docs/sprint.xlsx',
          type: 'excel',
        },
      ],
      expanded: false,
    },
    {
      id: '4',
      title: 'Client Presentation',
      description:
        "Heaven rule. All forth void. Upon second air fly green greater likeness creature very them i can't lights bearing midst.",
      date: '15 - 17 Feb',
      time: '11:00',
      location: 'Client Office',
      organizer: 'Macie Jordan',
      isRead: true,
      priority: 'high',
      type: 'meeting',
      colorScheme: 'warning',
      hasAttachment: false,
      expanded: false,
    },
    {
      id: '5',
      title: 'Team Building Activity',
      description:
        "A don't. God. Is great Said isn't and form two give every shall and one place so kind make he.",
      date: '02 - 03 Mar',
      time: '22:00',
      location: 'Recreation Center',
      organizer: 'Aleeza Miller',
      isRead: false,
      priority: 'normal',
      type: 'event',
      colorScheme: 'secondary',
      hasAttachment: false,
      expanded: false,
    },
    {
      id: '6',
      title: 'Quarterly Review',
      description:
        "She'd light one. Gathering seasons. Shall may they're called Shall. Appear their. Give, the. Good rule over after you. Male.",
      date: '08 - 11 Mar',
      time: '12:20',
      location: 'Boardroom',
      organizer: 'Esme Pearson',
      isRead: true,
      priority: 'normal',
      type: 'meeting',
      colorScheme: 'danger',
      hasAttachment: true,
      attachments: [
        { name: 'Q1_Report.pdf', url: '/assets/reports/q1.pdf', type: 'pdf' },
        {
          name: 'Financial_Summary.xlsx',
          url: '/assets/reports/finance.xlsx',
          type: 'excel',
        },
      ],
      expanded: false,
    },
  ];

  securitySettings: SecuritySettings = {
    twoFactorAuth: true,
    passwordRotation: false,
    autoLogout: true,
    mobileOtp: true,
  };

  notificationSettings: NotificationSettings = {
    messages: true,
    security: true,
    email: false,
    events: true,
  };

  // Legacy property for backward compatibility
  isChecked = true;

  ngOnInit(): void {
    // Initialize component
    this.loadUserPreferences();
  }

  // Event management methods
  toggleEventExpansion(index: number): void {
    this.events[index].expanded = !this.events[index].expanded;
  }

  toggleReadStatus(index: number): void {
    this.events[index].isRead = !this.events[index].isRead;
    const status = this.events[index].isRead ? 'read' : 'unread';
    this.showSnackBar(`Event marked as ${status}`);
  }

  deleteEvent(index: number): void {
    const eventTitle = this.events[index].title;
    this.events.splice(index, 1);
    this.showSnackBar(`Deleted event: ${eventTitle}`);
  }

  refreshEvents(): void {
    // Simulate refresh - in real app, this would fetch from API
    this.showSnackBar('Events refreshed');
    console.log('Refreshing events...');
  }

  downloadAttachment(attachment: {
    name: string;
    url: string;
    type: string;
  }): void {
    // Simulate download - in real app, this would handle actual file download
    this.showSnackBar(`Downloading: ${attachment.name}`);
    console.log('Downloading attachment:', attachment);

    // Example download implementation:
    // const link = document.createElement('a');
    // link.href = attachment.url;
    // link.download = attachment.name;
    // link.click();
  }

  // Settings management methods
  onSettingChange(settingKey: string, value: boolean): void {
    // Handle setting changes
    console.log(`Setting ${settingKey} changed to:`, value);

    // Save to backend or local storage
    this.saveUserPreferences();

    // Show feedback
    this.showSnackBar(`${settingKey} ${value ? 'enabled' : 'disabled'}`);
  }

  saveSettings(): void {
    // Save all settings
    this.saveUserPreferences();
    this.showSnackBar('Settings saved successfully');
  }

  resetSettings(): void {
    // Reset to default values
    this.securitySettings = {
      twoFactorAuth: false,
      passwordRotation: false,
      autoLogout: false,
      mobileOtp: false,
    };

    this.notificationSettings = {
      messages: true,
      security: true,
      email: true,
      events: true,
    };

    this.showSnackBar('Settings reset to default');
  }

  // Private helper methods
  private loadUserPreferences(): void {
    // Load from local storage or API
    const savedSecuritySettings = localStorage.getItem('securitySettings');
    const savedNotificationSettings = localStorage.getItem(
      'notificationSettings'
    );

    if (savedSecuritySettings) {
      this.securitySettings = {
        ...this.securitySettings,
        ...JSON.parse(savedSecuritySettings),
      };
    }

    if (savedNotificationSettings) {
      this.notificationSettings = {
        ...this.notificationSettings,
        ...JSON.parse(savedNotificationSettings),
      };
    }
  }

  private saveUserPreferences(): void {
    // Save to local storage or API
    localStorage.setItem(
      'securitySettings',
      JSON.stringify(this.securitySettings)
    );
    localStorage.setItem(
      'notificationSettings',
      JSON.stringify(this.notificationSettings)
    );
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
