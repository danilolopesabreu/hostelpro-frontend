export interface PersonalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  idNumber?: string;
  nationality?: string;
}

export interface ReservationInfo {
  checkInDate: string;
  checkOutDate: string;
  bookingReference: string;
  bookingSource?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Partial';
  totalAmount?: number;
  actualCheckIn?: string;
  actualCheckOut?: string;
}

export interface RoomAmenities {
  wifi: boolean;
  airConditioner: boolean;
  minibar: boolean;
  balcony: boolean;
  seaView: boolean;
  cityView: boolean;
  kitchenette: boolean;
  spa: boolean;
}

export interface GuestDetails {
  personalInfo: PersonalInfo;
  reservationInfo: ReservationInfo;
  specialRequests: string;
  vipStatus?: boolean;
  loyaltyPoints?: number;
}

export interface RoomMaintenance {
  lastCleaned?: string;
  maintenanceStatus?: 'Good' | 'Needs Attention' | 'Under Maintenance';
  nextMaintenanceDate?: string;
}

export type RoomStatus = 'Available' | 'Booked' | 'Occupied' | 'Cleaning' | 'Maintenance' | 'Out of Order' | 'Reserved';

export interface Occupancy {
  id: number;
  roomNo: number;
  floor: number;
  type: string;
  bed: string;
  occupants: string;
  maxOccupancy: number;
  status: RoomStatus;
  priority?: 'High' | 'Medium' | 'Low';
  rate: number;
  amenities?: RoomAmenities;
  maintenance?: RoomMaintenance;
  guestDetails?: GuestDetails;
  checkInTime?: string;
  checkOutTime?: string;
  housekeepingStatus?: 'Clean' | 'Dirty' | 'Inspected' | 'Out of Order';
  notes?: string;
}
