// emailjs.service.ts
import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

interface EmailData {
  customerEmail: string;
  customerName: string;
  roomNumber: number;
  roomType: string;
  description: string;
  checkIn: string;
  checkOut: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmailJSService {
  private serviceId = 'service_omh3789';
  private templateId = 'template_ltqax3g';
  private userId = 'QEZ-q9v4WBnXLv46W';
  private initialized = false;

  constructor() {
    console.log('EmailJS Service instantiated');
    this.initEmailJS();
  }

  private async initEmailJS() {
    try {
      console.log('Attempting to initialize EmailJS...');
      await emailjs.init(this.userId);
      this.initialized = true;
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
      console.log('Current configuration:', {
        serviceId: this.serviceId,
        templateId: this.templateId,
        userId: this.userId
      });
      throw new Error('Failed to initialize email service');
    }
  }

  async sendBookingConfirmation(emailData: EmailData): Promise<any> {
    if (!this.initialized) {
      console.log('EmailJS not initialized, attempting to initialize...');
      await this.initEmailJS();
    }

    const templateParams = {
      email: emailData.customerEmail,
      customer_name: emailData.customerName,
      room_number: emailData.roomNumber,
      room_type: emailData.roomType,
      description: emailData.description,
      check_in: emailData.checkIn,
      check_out: emailData.checkOut,
      price: emailData.price,
      booking_date: new Date().toLocaleDateString('es-ES')
    };

    console.log('Attempting to send email with params:', templateParams);

    try {
      console.log('Sending email...');
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.userId
      );

      console.log('Email service response:', response);

      if (response.status !== 200) {
        console.error('Email service returned non-200 status:', response.status);
        throw new Error(`Email service responded with status: ${response.status}`);
      }

      console.log('Email sent successfully');
      return response;
    } catch (error) {
      console.error('Detailed error sending email:', {
        error,
        serviceId: this.serviceId,
        templateId: this.templateId,
        userId: this.userId.substring(0, 5) + '...'
      });
      throw new Error('Failed to send confirmation email');
    }
  }
}