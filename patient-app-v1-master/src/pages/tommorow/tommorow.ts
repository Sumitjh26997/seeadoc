import { Component } from '@angular/core';
import {
  NavController, NavParams, AlertController,
  ViewController, App, LoadingController
} from 'ionic-angular';

import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

import { ApoinmentconfirmPage } from '../apoinmentconfirm/apoinmentconfirm';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-tommorow',
  templateUrl: 'tommorow.html',
})
export class TommorowPage {
  currentDate = new Date();
  tomorrowDate = (new Date()).setDate(this.currentDate.getDate() + 1);
  day = this.currentDate.getDay()+1;


  slots = null;
  bookings = null;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    public app: App,
    public api: Api,
    public common: CommonProvider,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, public appCtrl: App) {
    if (this.common.selectedClinic) {
      localStorage.setItem('clinic', JSON.stringify(this.common.selectedClinic));
      localStorage.setItem('doctor', JSON.stringify(this.common.selectedDoctor));
    }

    this.common.selectedClinic = JSON.parse(localStorage.getItem('clinic'));
    this.common.selectedDoctor = JSON.parse(localStorage.getItem('doctor'));

  }

  ionViewDidEnter() {
    console.log(this.common.selectedClinic);
    this.fetchSlots();
  }


  filterTime1(time: any) {
    let gettime = time.split(':');
    let newTime = parseFloat(gettime[0]);
    let returnTime: any;
    if (newTime <= 12) {
      returnTime = `${newTime}:${gettime[1]} AM`;
    }
    if (newTime > 12) {
      returnTime = `${newTime - 12}:${gettime[1]} PM`;
    }
    if ((newTime == 12) && (Math.ceil(parseFloat(gettime[1])) == 1)) {
      returnTime = `${newTime - 12}:${gettime[1]} PM`;
    }
    return returnTime;
  }

  filterTime2(time: any) {
    let gettime = time.split(':');
    let newTime = parseFloat(gettime[0]);
    let returnTime: any;
    if (newTime <= 12) {
      returnTime = `${newTime}:${gettime[1]} AM`;
    }
    if (newTime > 12) {
      returnTime = `${newTime - 12}:${gettime[1]} PM`;
    }
    if ((newTime == 12) && (Math.ceil(parseFloat(gettime[1])) == 1)) {
      returnTime = `${newTime - 12}:${gettime[1]} PM`;
    }
    return returnTime;
  }


  fetchingPatients(slot, status) {
    let passingData = {
      query: {
        isPrimary: this.common.user._id
      }
    }
    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('users/fetch', passingData)
      .subscribe(res => {
        console.log('User ', res);
        loader.dismiss();
        this.presentAlert(slot, res['data'], status);
      }, err => {
        console.log(err);
        loader.dismiss();
      });
  }

  presentAlert(slot, patients, status) {
    console.log('Slot ', slot);
    console.log('Patient ', patients);
    patients.push(this.common.user);
    let alert = this.alertCtrl.create({
      title: 'Select Patient'
    });

    patients.map(patient => {
      alert.addInput({
        type: 'radio',
        label: patient.name,
        value: patient._id,
      });
    });


    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        patients.map(patient => {
          if (patient._id == data) {
            this.common.selectedPatient = patient.name;
            console.log(this.common.selectedPatient);
          }
        });
        this.bookAppointment(data, slot);
      }
    });
    alert.present();

  }

  presentSorryAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Sorry !',
      message: '' + message + '',
      buttons: ['Close'],
      cssClass: 'alertcss'
    });
    alert.present();
  }

  bookAppointment(user, slot) {
    var currentDate = new Date();
    let tomorrowDate = (new Date()).setDate(currentDate.getDate() + 1);
    const passingData = {
      user: this.common.user._id,
      patient: user,
      clinic: this.common.selectedClinic._id,
      doctor: this.common.selectedDoctor._id,
      slot: slot._id,
      queueCount: this.common.selectedClinic.queueCount,
      location: this.common.selectedClinic.location,
      startTime: slot.start,
      endTime: slot.end,
      bookingDate: this.common.dateFormator(tomorrowDate),
      status: {$ne:'cancelled'} // query against status i.e. do not fetch cancelled bookings
    }
    console.log('Passing Data ', passingData);
    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('booking/add', passingData)
      .subscribe(res => {
        console.log('Booking Details ', res);
        this.navCtrl.push(ApoinmentconfirmPage, { bookingDetails: res['data'] });
        loader.dismiss();
      }, err => {
        loader.dismiss();

        console.log(err);
        if (err.error.message) {
          this.presentSorryAlert(err.error.message);
        }
      });
  }

  backButtonFunc() {
    console.log('back button click');
    this.app.getRootNav().setRoot(TabsPage);
  }

  fetchSlots() {

    var currentDate = new Date();
    let tomorrowDate = (new Date()).setDate(currentDate.getDate() + 1);
    console.log('tomorrowDate:', new Date(tomorrowDate));
    let passingData = {
        clinic: this.common.selectedClinic._id,
        date: this.common.dateFormator(tomorrowDate),
        day : this.currentDate.getDay()+1, // numeric value of day for tommorow
        status: {$ne:'cancelled'} // query against status i.e. do not fetch cancelled bookings
    };
    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('slot/fetch', passingData)
      .subscribe(res => {
        loader.dismiss();
        console.log(res);
        this.slots = res['data'].slots;
        this.bookings = res['data'].bookings;
      }, err => {
        loader.dismiss();
        console.log(err);
      });
  }
}
