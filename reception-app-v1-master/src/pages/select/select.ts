import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,
  ViewController, App, LoadingController, ToastController
} from 'ionic-angular';

import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

import { TabsPage } from '../tabs/tabs';
import { ApoinmentconfirmPage } from '../apoinmentconfirm/apoinmentconfirm';

@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage {

  date: Date;
  slots = null;
  bookings = null;
  doctor_id = null;

  min: any;
  max: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    public api: Api,
    public common: CommonProvider,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public app: App, public toastCtrl: ToastController) {
  }

  ionViewDidEnter() {
    let allowedDate = parseInt(this.common.user.allowBookingFor);
    let date = new Date();
    this.min = this.common.dateFormator(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+2}`);
    this.max = this.common.dateFormator(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+allowedDate+1}`);
    this.selectDate();
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad Today Page');
    this.doctor_id = this.common.user.doctors[0]._id;
    console.log(this.doctor_id);
  }
  
  filterTime1(time:any){
    let newTime = parseFloat(time);
    let returnTime:any;
    if(newTime<=12){
      returnTime = `${newTime}:00 AM`;
    }
    if(newTime>12){
      returnTime = `${newTime-12}:00 PM`;
    }
    return returnTime;
  }

  filterTime2(time:any){
    let newTime = parseFloat(time);
    let returnTime:any;
    if(newTime<=12){
      returnTime = `${newTime}:00 AM`;
    }
    if(newTime>12){
      returnTime = `${newTime-12}:00 PM`;
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
            this.bookingDateChecker();
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

  presentConfirm(slot) {
    let alert = this.alertCtrl.create({
      title: '<center><u>Confirm Booking</u></center>',
      message: '<center>Do you want to confirm slot?</center>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('confirm clicked');
            let alert = this.alertCtrl.create({
              title: 'Add Patient',
              message: '<center>Enter patient details to be added !</center>',
              inputs: [
                {
                  name: 'name',
                  placeholder: 'Patient Name',
                  type: 'text'
                },
                {
                  name: 'mobile',
                  placeholder: 'Patient Mobile Number',
                  type: 'number'
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: user => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Add',
                  handler: user => {
                    console.log(user);
                    if(user.name=='')
                    {
                      let toast = this.toastCtrl.create({
                        message: `Please enter patient name !`,
                        duration: 3000
                      });
                      toast.present();
                      return false;
                    }
                    else if((user.mobile=='') || (isNaN(user.mobile)) || ((user.mobile).length!=10)){
                      let toast = this.toastCtrl.create({
                        message: `Please enter a valid mobile number`,
                        duration: 3000
                      });
                      toast.present();
                      return false;
                    }
                    else
                    {
                      let loader = this.loadingCtrl.create({
                        spinner: 'ios',
                        content: 'Please wait...'
                      });
                      loader.present();
                      let passingData = {
                        mobile: user.mobile,
                        name: user.name,
                        userId: this.common.user._id
                      };
                      this.api.post('users/add-patient', passingData, {})
                      .subscribe(res => {
                        console.log(res);
                        loader.dismiss();
                        let toast = this.toastCtrl.create({
                          message: res['message'],
                          duration: 3000
                        });
                        toast.present();
                        // this.selectDoctor(res['data']._id, slot);
                        this.bookAppointment(res['data']._id, slot);
                      }, 
                      err => {
                        console.log(err);
                        loader.dismiss();        
                        let toast = this.toastCtrl.create({
                          message: 'Unable to add patient !',
                          duration: 3000
                        });
                        toast.present();
                      });
                    }
                  }
                }
              ]
            });
            alert.present();
          }
        }
      ]
    });
    alert.present();
  }

  selectDoctor(data, slot){
    let passingData = {
      query: {
        clinic: this.common.user._id
      }
    };
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
    loader.present();
    this.api.post('doctor/fetch', passingData)
    .subscribe(res => {
      console.log('User ', res);
      loader.dismiss();
      let doctors = res['data'];
      let alert = this.alertCtrl.create();
      alert.setTitle('Select Doctor');
      doctors.map(doctor => {
        alert.addInput({
          type: 'radio',
          label: `${doctor.name} - ${doctor.specialization}`,
          value: doctor._id,
        });
      });
      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: res => {
          console.log(res);
          this.doctor_id = res;
          this.bookAppointment(data, slot);
        }
      });
      alert.present();
    }, err => {
      console.log(err);
      loader.dismiss();
    });
  }

  presentSorryAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Sorry !',
      message: '<center>' + message + '</center>',
      buttons: ['Close'],
      cssClass: 'alertcss'
    });
    alert.present();
  }

  bookAppointment(user, slot) {
    const passingData = {
      user: this.common.user._id,
      patient: user,
      clinic: this.common.user._id,
      slot: slot._id,
      doctor: this.doctor_id,
      queueCount: this.common.user.queueCount,
      location: this.common.user.location,
      startTime: slot.start,
      endTime: slot.end,
      bookingDate: this.date
    }
    console.log('Passing Data ', passingData);
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
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

  backButtonFunc(){
    console.log('back button click');
    this.app.getRootNav().setRoot(TabsPage);
  }

  fetchSlots() {
    let passingData = {
      query: {
        clinic: this.common.user._id,
        date: this.common.dateFormator(this.date),
      }
    };
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
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
    let date = (new Date()).setDate((new Date()).getDate() + parseInt(this.common.user.allowBookingFor));
    let allowdDate = this.common.dateFormator(new Date(date));

    if (bookingDate >= currentDate && bookingDate <= allowdDate) {
      this.fetchSlots();
    } else {
      this.invalidDate(currentDate, allowdDate);
    }

  }

  invalidDate(currentDate, allowdDate) {
    let alert = this.alertCtrl.create({
      title:'Sorry !!!',
      message: '<center>Select Date Between <br>' + currentDate + ' - ' + allowdDate + '</center>',
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
