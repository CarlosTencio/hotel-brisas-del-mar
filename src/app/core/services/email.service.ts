// emailjs.service.ts
import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser'; // ✅ Versión actual

@Injectable({
  providedIn: 'root'
})
export class EmailJSService {
  private serviceId = 'service_vkeavbi'; // Obtén de EmailJS
  private templateId = 'template_y3xj6cc'; // Obtén de EmailJS
  private userId = 'Z0d-K15x7r1gD4xVS'; // Obtén de EmailJS

  async sendBookingConfirmation(emailData: any): Promise<any> {
    const templateParams = {
      to_email: emailData.customerEmail,
      customer_name: emailData.customerName,
      room_number: emailData.roomNumber,
      room_type: emailData.roomType,
      description: emailData.description,
      check_in: emailData.checkIn,
      check_out: emailData.checkOut,
      price: emailData.price,
      booking_date: new Date().toLocaleDateString('es-ES')
    };

    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.userId
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}