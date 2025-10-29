import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { OccupancyService } from './occupancy.service';
import { Occupancy, RoomStatus } from './occupancy.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GuestDetailsDialogComponent } from './guest-details-dialog/guest-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddGuestDetailsDialogComponent } from './add-guest-details-dialog/add-guest-details-dialog.component';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-vender',
  imports: [
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vender.component.html',
  styleUrl: './vender.component.scss',
})
export class VenderComponent {
  occupancy: Occupancy[] = [];
  filteredRooms: Occupancy[] = [];
  roomTypes: string[] = [];
  bedSizes: string[] = [];
  floors: number[] = [];
  statuses: RoomStatus[] = [
    'Available',
    'Booked',
    'Occupied',
    'Cleaning',
    'Maintenance',
    'Out of Order',
    'Reserved',
  ];
  housekeepingStatuses: string[] = [
    'Clean',
    'Dirty',
    'Inspected',
    'Out of Order',
  ];

  // Filter properties
  selectedStatus: RoomStatus | '' = '';
  selectedType = '';
  selectedBed = '';
  selectedFloor: number | '' = '';
  selectedHousekeeping = '';
  searchText = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;

  // Search debouncing
  private searchSubject = new Subject<string>();

  // Statistics
  totalRooms = 0;
  availableRooms = 0;
  occupiedRooms = 0;
  maintenanceRooms = 0;
  occupancyRate = 0;

  // Current date for display
  currentDate = new Date();

  constructor(
    private occupancyService: OccupancyService,
    private dialog: MatDialog
  ) {
    // Setup search debouncing
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterRooms();
    });
  }

  // Auto-refresh functionality
  private autoRefreshInterval?: any;
  autoRefreshEnabled = false;
  private readonly AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

  ngOnInit(): void {
    this.loadOccupancyData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }

  private loadOccupancyData(): void {
    this.occupancyService.getOccupancy().subscribe((data) => {
      // Add animation for data loading
      this.animateDataLoad(() => {
        this.occupancy = data;
        this.filteredRooms = data;
        this.calculateStatistics();

        // Extract unique values for filter dropdowns
        this.roomTypes = [...new Set(this.occupancy.map((room) => room.type))];
        this.bedSizes = [...new Set(this.occupancy.map((room) => room.bed))];
        this.floors = [
          ...new Set(this.occupancy.map((room) => room.floor)),
        ].sort((a, b) => a - b);
      });
    });
  }

  private animateDataLoad(callback: () => void): void {
    const container = document.querySelector('.rooms-grid');
    if (container) {
      container.classList.add('loading');
      setTimeout(() => {
        callback();
        container.classList.remove('loading');
        container.classList.add('loaded');
        setTimeout(() => container.classList.remove('loaded'), 1000);
      }, 300);
    } else {
      callback();
    }
  }

  private setupAutoRefresh(): void {
    // Auto-refresh can be enabled/disabled by users
    if (this.autoRefreshEnabled) {
      this.autoRefreshInterval = setInterval(() => {
        this.refreshData();
      }, this.AUTO_REFRESH_INTERVAL);
    }
  }

  refreshData(): void {
    this.currentDate = new Date();
    this.loadOccupancyData();
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;

    if (this.autoRefreshEnabled) {
      this.setupAutoRefresh();
      this.showUpdateMessage('Auto-refresh enabled (30s intervals)');
    } else {
      if (this.autoRefreshInterval) {
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = undefined;
      }
      this.showUpdateMessage('Auto-refresh disabled');
    }
  }

  calculateStatistics(): void {
    this.totalRooms = this.occupancy.length;
    this.availableRooms = this.occupancy.filter(
      (room) => room.status === 'Available'
    ).length;
    this.occupiedRooms = this.occupancy.filter(
      (room) => room.status === 'Occupied' || room.status === 'Booked'
    ).length;
    this.maintenanceRooms = this.occupancy.filter(
      (room) => room.status === 'Maintenance' || room.status === 'Out of Order'
    ).length;
    this.occupancyRate = Math.round(
      (this.occupiedRooms / this.totalRooms) * 100
    );
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  filterRooms(): void {
    this.filteredRooms = this.occupancy.filter((room) => {
      const statusMatch = this.selectedStatus
        ? room.status === this.selectedStatus
        : true;
      const typeMatch = this.selectedType
        ? room.type === this.selectedType
        : true;
      const bedMatch = this.selectedBed ? room.bed === this.selectedBed : true;
      const floorMatch = this.selectedFloor
        ? room.floor === this.selectedFloor
        : true;
      const housekeepingMatch = this.selectedHousekeeping
        ? room.housekeepingStatus === this.selectedHousekeeping
        : true;

      // Text search in room number, guest name, or booking reference
      const textMatch = this.searchText
        ? room.roomNo.toString().includes(this.searchText.toLowerCase()) ||
          (room.guestDetails?.personalInfo?.name
            ?.toLowerCase()
            .includes(this.searchText.toLowerCase()) ??
            false) ||
          (room.guestDetails?.reservationInfo?.bookingReference
            ?.toLowerCase()
            .includes(this.searchText.toLowerCase()) ??
            false)
        : true;

      // Date range filter
      const dateMatch =
        this.checkInDate || this.checkOutDate ? this.isDateInRange(room) : true;

      return (
        statusMatch &&
        typeMatch &&
        bedMatch &&
        floorMatch &&
        housekeepingMatch &&
        textMatch &&
        dateMatch
      );
    });
  }

  private isDateInRange(room: Occupancy): boolean {
    if (!room.guestDetails?.reservationInfo) return true;

    const roomCheckIn = new Date(room.guestDetails.reservationInfo.checkInDate);
    const roomCheckOut = new Date(
      room.guestDetails.reservationInfo.checkOutDate
    );

    if (this.checkInDate && this.checkOutDate) {
      return (
        roomCheckIn >= this.checkInDate && roomCheckOut <= this.checkOutDate
      );
    } else if (this.checkInDate) {
      return roomCheckIn >= this.checkInDate;
    } else if (this.checkOutDate) {
      return roomCheckOut <= this.checkOutDate;
    }

    return true;
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedBed = '';
    this.selectedFloor = '';
    this.selectedHousekeeping = '';
    this.searchText = '';
    this.checkInDate = null;
    this.checkOutDate = null;
    this.filterRooms();
  }

  getStatusColor(status: RoomStatus): string {
    const statusColors: { [key in RoomStatus]: string } = {
      Available: '#4caf50',
      Booked: '#ff9800',
      Occupied: '#f44336',
      Cleaning: '#2196f3',
      Maintenance: '#9c27b0',
      'Out of Order': '#607d8b',
      Reserved: '#ff5722',
    };
    return statusColors[status] || '#757575';
  }

  getStatusIcon(status: RoomStatus): string {
    const statusIcons: { [key in RoomStatus]: string } = {
      Available: 'check-circle',
      Booked: 'event',
      Occupied: 'person',
      Cleaning: 'cleaning_services',
      Maintenance: 'build',
      'Out of Order': 'warning',
      Reserved: 'event-available',
    };
    return statusIcons[status] || 'help';
  }

  getRoomPriorityColor(priority?: string): string {
    switch (priority) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#757575';
    }
  }

  openGuestDetailsDialog(room: Occupancy): void {
    const dialogRef = this.dialog.open(GuestDetailsDialogComponent, {
      width: '80vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: { room },
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit') {
        // Open edit dialog
        this.openAddGuestDetailsDialog(result.room, true);
      }
    });
  }

  openAddGuestDetailsDialog(room: Occupancy, isEdit: boolean = false): void {
    const dialogRef = this.dialog.open(AddGuestDetailsDialogComponent, {
      width: '70vw',
      maxWidth: '900px',
      maxHeight: '90vh',
      data: { room, isEdit },
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Guest Details Submitted:', result);

        // Animate the room card update
        this.updateRoomWithAnimation(room, result);
      }
    });
  }

  private updateRoomWithAnimation(room: Occupancy, guestData: any): void {
    // Find the room element for animation
    const roomElement = document.querySelector(`[data-room-id="${room.id}"]`);

    if (roomElement) {
      // Add loading animation
      roomElement.classList.add('updating');

      // Simulate processing delay for better UX
      setTimeout(() => {
        // Update room data
        room.status = 'Booked' as any;
        room.guestDetails = {
          personalInfo: guestData.personalInfo,
          reservationInfo: guestData.reservationInfo,
          specialRequests: guestData.specialRequests || '',
          vipStatus: guestData.vipStatus,
          loyaltyPoints: guestData.loyaltyPoints,
        };

        // Update statistics and filters
        this.calculateStatistics();
        this.filterRooms();

        // Remove loading animation and add success animation
        roomElement.classList.remove('updating');
        roomElement.classList.add('updated');

        // Remove success animation after delay
        setTimeout(() => {
          roomElement.classList.remove('updated');
        }, 2000);

        // Show success message
        this.showUpdateMessage('Guest details saved successfully!');
      }, 800);
    } else {
      // Fallback update without animation
      room.status = 'Booked' as any;
      room.guestDetails = {
        personalInfo: guestData.personalInfo,
        reservationInfo: guestData.reservationInfo,
        specialRequests: guestData.specialRequests || '',
        vipStatus: guestData.vipStatus,
        loyaltyPoints: guestData.loyaltyPoints,
      };
      this.calculateStatistics();
      this.filterRooms();
    }
  }

  private showUpdateMessage(message: string): void {
    // Create and show a temporary success message
    const messageElement = document.createElement('div');
    messageElement.className = 'update-message';
    messageElement.textContent = message;
    messageElement.innerHTML = `
      <span>${message}</span>
    `;

    document.body.appendChild(messageElement);

    // Animate in
    setTimeout(() => messageElement.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
      messageElement.classList.remove('show');
      setTimeout(() => document.body.removeChild(messageElement), 300);
    }, 3000);
  }

  private generateBookingReference(): string {
    return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  canAddGuest(room: Occupancy): boolean {
    return room.status === 'Available' || room.status === 'Cleaning';
  }

  canViewGuest(room: Occupancy): boolean {
    return (
      room.status === 'Booked' ||
      room.status === 'Occupied' ||
      room.status === 'Reserved'
    );
  }

  getActionText(room: Occupancy): string {
    if (this.canViewGuest(room)) return 'Guest Details';
    if (this.canAddGuest(room)) return 'Add Guest';
    return 'Unavailable';
  }

  handleRoomAction(room: Occupancy): void {
    if (this.canViewGuest(room)) {
      this.openGuestDetailsDialog(room);
    } else if (this.canAddGuest(room)) {
      this.openAddGuestDetailsDialog(room);
    }
  }
}
