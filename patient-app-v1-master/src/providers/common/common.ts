import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';


@Injectable()
export class CommonProvider {

  public location = {
    selected: {},
  };

  public selectedClinic = null;
  public selectedDoctor = null;
  public selectedPatient = null;
  
  public user = null;
  public token = null;
  constructor(public toastCtrl: ToastController) {
    this.user = JSON.parse(localStorage.getItem('USERDATA')) || null;
    this.token = localStorage.getItem('TOKEN') || null;
    this.location.selected = JSON.parse(localStorage.getItem('SELECTED_LOCATION')) || {};
  }

  dateFormator(date) {
    let bookingDate = new Date(date);
    let year = bookingDate.getUTCFullYear();
    let month = bookingDate.getUTCMonth() < 9 ? '0' + (bookingDate.getUTCMonth() + 1) : bookingDate.getUTCMonth() + 1;
    let date2 = bookingDate.getUTCDate() < 10 ? '0' + bookingDate.getUTCDate() : bookingDate.getUTCDate();
    return (year + '-' + month + '-' + date2);
  }

  displayToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

}
