import { Component } from '@angular/core';
import {
  NavController, NavParams, AlertController,
  ViewController, App, LoadingController
} from 'ionic-angular';

import { ApoinmentconfirmPage } from '../apoinmentconfirm/apoinmentconfirm';
import { TabsPage } from '../tabs/tabs';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage {
  date: Date;
  slots = null;
  bookings = null;

  min: any;
  max: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    public api: Api,
    public common: CommonProvider,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public app: App) {
    if (this.common.selectedClinic) {
      localStorage.setItem('clinic', JSON.stringify(this.common.selectedClinic));
      localStorage.setItem('doctor', JSON.stringify(this.common.selectedDoctor));

    }
    this.common.selectedClinic = JSON.parse(localStorage.getItem('clinic'));
    this.common.selectedDoctor = JSON.parse(localStorage.getItem('doctor'));
  }

  ionViewDidEnter() {
    
    console.log(this.common.selectedClinic);
    let allowedDate = parseInt(this.common.selectedClinic.allowBookingFor);
    let date = new Date();
    this.min = this.common.dateFormator(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+2}`);
    this.max = this.common.dateFormator(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+allowedDate+1}`);
    
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()];
    console.log(weekday);
    this.selectDate();
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

  selectDate() {
    let prompt = this.alertCtrl.create({
      title: 'Select Date',
      message: "Select a date for appoinment",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.date = data.title;
            console.log(this.date);
            console.log('Saved clicked');
            this.fetchSlots();
          }
        }
      ]
    });
    prompt.addInput({
      name: 'title',
      placeholder: 'Date allowed',
      type: 'date',
      min: this.min,
      max: this.max
    });
    prompt.present();
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
      title: 'Select Patient',
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
    const passingData = {
      user: this.common.user._id,
      patient: user,
      clinic: this.common.selectedClinic._id,
      slot: slot._id,
      doctor: this.common.selectedDoctor._id,
      queueCount: this.common.selectedClinic.queueCount,
      location: this.common.selectedClinic.location,
      startTime: slot.start,
      endTime: slot.end,
      bookingDate: this.date
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
    let selectedDate = new Date(this.date); //get selected date in date format 
    let passingData = {
      
        clinic: this.common.selectedClinic._id,
        date: this.common.dateFormator(this.date),
        day: selectedDate.getDay(), //numeric value of day
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

  bookingDateChecker() {
    let bookingDate = this.common.dateFormator(this.date);
    let currentDate = this.common.dateFormator(new Date());
    let date = (new Date()).setDate((new Date()).getDate() + parseInt(this.common.selectedClinic.allowBookingFor));
    let allowdDate = this.common.dateFormator(new Date(date));

    if (bookingDate >= currentDate && bookingDate <= allowdDate) {
      this.fetchSlots();
    } else {
      this.invalidDate(currentDate, allowdDate);
    }

  }

  invalidDate(currentDate, allowdDate) {
    let alert = this.alertCtrl.create({
      title: 'Sorry !!!',
      message: 'Select Date Between ' + currentDate + ' - ' + allowdDate + '',
      buttons: [{
        text: 'ok',
        handler: (date) => {
          this.selectDate();
        },
      }],
      cssClass: 'alertcss'
    });
    alert.present();
  }
}
