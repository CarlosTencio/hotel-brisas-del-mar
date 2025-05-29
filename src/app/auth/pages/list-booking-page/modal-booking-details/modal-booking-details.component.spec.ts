import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ModalBookingDetailsComponent } from './modal-booking-details.component';

describe('ModalBookingDetailsComponent', () => {
  let component: ModalBookingDetailsComponent;
  let fixture: ComponentFixture<ModalBookingDetailsComponent>;

  const mockBooking = {
    bookingid: 1,
    roomID: 101,
    creationDate: '2024-01-15T10:00:00',
    checkIn: '2024-01-20T15:00:00',
    checkOut: '2024-01-25T11:00:00',
    customerID: 123,
    transaction: 456789,
    bookingReferenceNumber: 'BR123456',
    customer: {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      cardNumber: '1234567890123456'
    },
    roomType: {
      roomTypeID: 1,
      roomTypeName: 'Suite Premium',
      price: 150,
      characteristics: 'Vista al mar, Balcón privado',
      description: 'Suite con vista panorámica al océano',
      image: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBookingDetailsComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBookingDetailsComponent);
    component = fixture.componentInstance;
    component.booking = mockBooking;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when closeModal is called', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit deleteBooking event when onDeleteBooking is called', () => {
    spyOn(component.deleteBooking, 'emit');
    component.onDeleteBooking();
    expect(component.deleteBooking.emit).toHaveBeenCalledWith(1);
  });

  it('should calculate nights correctly', () => {
    const nights = component.calculateNights();
    expect(nights).toBe(5);
  });

  it('should calculate total correctly', () => {
    const total = component.calculateTotal();
    expect(total).toBe(750); // 5 nights * $150
  });

  it('should mask card number correctly', () => {
    const maskedCard = component.maskCardNumber('1234567890123456');
    expect(maskedCard).toBe('****-****-****-3456');
  });

  it('should format date correctly', () => {
    const formattedDate = component.formatDate('2024-01-20T15:00:00');
    expect(formattedDate).toContain('enero');
    expect(formattedDate).toContain('2024');
  });
}); 