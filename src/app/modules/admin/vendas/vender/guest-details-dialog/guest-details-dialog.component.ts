import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Occupancy, RoomStatus } from '../occupancy.model';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-guest-details-dialog',
    imports: [
        MatDialogModule,
        MatTabsModule,
        MatButtonModule,
        MatDialogClose,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        CommonModule,
        MatTooltipModule,
    ],
    templateUrl: './guest-details-dialog.component.html',
    styleUrl: './guest-details-dialog.component.scss'
})
export class GuestDetailsDialogComponent {
  roomData: Occupancy;
  dialogTitle: string;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { room: Occupancy },
    public dialogRef: MatDialogRef<GuestDetailsDialogComponent>
  ) {
    this.roomData = data.room;
    this.dialogTitle = `Room ${this.roomData?.roomNo || 'Unknown'} - Guest Details`;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editGuest(): void {
    // Close current dialog and return edit action
    this.dialogRef.close({ action: 'edit', room: this.roomData });
  }

  getStatusColor(): string {
    const statusColors: { [key in RoomStatus]: string } = {
      'Available': '#4caf50',
      'Booked': '#ff9800', 
      'Occupied': '#f44336',
      'Cleaning': '#2196f3',
      'Maintenance': '#9c27b0',
      'Out of Order': '#607d8b',
      'Reserved': '#ff5722'
    };
    return statusColors[this.roomData?.status] || '#757575';
  }

  getStatusIcon(): string {
    const statusIcons: { [key in RoomStatus]: string } = {
      'Available': 'check-circle',
      'Booked': 'event',
      'Occupied': 'person',
      'Cleaning': 'cleaning-services',
      'Maintenance': 'build',
      'Out of Order': 'warning',
      'Reserved': 'event-available'
    };
    return statusIcons[this.roomData?.status] || 'help';
  }
}
