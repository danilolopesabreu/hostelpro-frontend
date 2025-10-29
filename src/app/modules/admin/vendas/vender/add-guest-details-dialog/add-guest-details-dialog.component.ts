import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Occupancy } from '../occupancy.model';

@Component({
  selector: 'app-add-guest-details-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-guest-details-dialog.component.html',
  styleUrl: './add-guest-details-dialog.component.scss',
})
export class AddGuestDetailsDialogComponent {
  guestForm: FormGroup;
  roomData?: Occupancy;

  paymentStatuses = ['Paid', 'Pending', 'Partial'];
  bookingSources = ['Direct', 'Booking.com', 'Expedia', 'Airbnb', 'Travel Agency', 'Phone', 'Walk-in'];
  nationalities = ['American', 'Canadian', 'British', 'German', 'French', 'Australian', 'Japanese', 'Chinese', 'Indian', 'Other'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddGuestDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { room: Occupancy }
  ) {
    this.roomData = data?.room;
    this.guestForm = this.fb.group({
      // Personal Information
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      idNumber: [''],
      nationality: [''],
      
      // Reservation Information
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      bookingReference: [this.generateBookingReference()],
      bookingSource: ['Direct'],
      paymentStatus: ['Pending'],
      totalAmount: [this.roomData?.rate || 0],
      
      // Additional Information
      specialRequests: [''],
      vipStatus: [false],
      loyaltyPoints: [0]
    });
  }

  onSubmit(): void {
    if (this.guestForm.valid) {
      const formValue = this.guestForm.value;
      
      // Structure the data according to the model
      const guestData = {
        personalInfo: {
          name: formValue.name,
          address: formValue.address,
          phone: formValue.phone,
          email: formValue.email,
          idNumber: formValue.idNumber,
          nationality: formValue.nationality
        },
        reservationInfo: {
          checkInDate: formValue.checkInDate,
          checkOutDate: formValue.checkOutDate,
          bookingReference: formValue.bookingReference,
          bookingSource: formValue.bookingSource,
          paymentStatus: formValue.paymentStatus,
          totalAmount: formValue.totalAmount
        },
        specialRequests: formValue.specialRequests,
        vipStatus: formValue.vipStatus,
        loyaltyPoints: formValue.loyaltyPoints
      };
      
      this.dialogRef.close(guestData);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private generateBookingReference(): string {
    return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  calculateNights(): number {
    const checkIn = this.guestForm.get('checkInDate')?.value;
    const checkOut = this.guestForm.get('checkOutDate')?.value;
    
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  updateTotalAmount(): void {
    if (this.roomData?.rate) {
      const nights = this.calculateNights();
      const total = this.roomData.rate * nights;
      this.guestForm.patchValue({ totalAmount: total });
    }
  }

  onDateChange(): void {
    setTimeout(() => {
      this.updateTotalAmount();
    }, 100);
  }
}
