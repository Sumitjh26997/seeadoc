import { Injectable } from '@angular/core';


@Injectable()
export class CommonProvider {

  public patient = null;
  public forgotUser = null;
  public verificationCode = null;
  public user = null;
  public token = null;
  
  constructor() {
    this.user = JSON.parse(localStorage.getItem('userDetails')) || null;
    this.token = localStorage.getItem('Token') || null;
  }

  dateFormator(date) {
    let bookingDate = new Date(date);
    let year = bookingDate.getUTCFullYear();
    let month = bookingDate.getUTCMonth() < 9 ? '0' + (bookingDate.getUTCMonth() + 1) : bookingDate.getUTCMonth() + 1;
    let date2 = bookingDate.getUTCDate() < 10 ? '0' + bookingDate.getUTCDate() : bookingDate.getUTCDate();
    return (year + '-' + month + '-' + date2);
  }
}
