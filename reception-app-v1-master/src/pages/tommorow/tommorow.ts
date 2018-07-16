import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,
  ViewController, App, LoadingController,
  ToastController } from 'ionic-angular';

import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

import { TabsPage } from '../tabs/tabs';
import { ApoinmentconfirmPage } from '../apoinmentconfirm/apoinmentconfirm';

@Component({
  selector: 'page-tommorow',
  templateUrl: 'tommorow.html',
})
export class TommorowPage {

  slots = null;
  bookings = null;
  doctor_id = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    public app: App,
    public api: Api,
    public common: CommonProvider,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, public appCtrl: App, public toastCtrl: ToastController) {
    this.fetchSlots();
  }

  ionViewDidEnter() {
    this.fetchSlots();
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
    var currentDate = new Date();
    let tomorrowDate = (new Date()).setDate(currentDate.getDate() + 1);
    const passingData = {
      user: this.common.user._id,
      patient: user,
      clinic: this.common.user._id,
      doctor: this.doctor_id,
      slot: slot._id,
      queueCount: this.common.user.queueCount,
      location: this.common.user.location,
      startTime: slot.start,
      endTime: slot.end,
      bookingDate: this.common.dateFormator(tomorrowDate),
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

        console.log(err.error.message);
        if (err.error.message) {
          this.presentSorryAlert(err.error.message);
        }
      });
  }

  backButtonFunc(){
    this.app.getRootNav().setRoot(TabsPage);
  }

  fetchSlots() {

    var currentDate = new Date();
    let tomorrowDate = (new Date()).setDate(currentDate.getDate() + 1);
    console.log('tomorrowDate:', new Date(tomorrowDate));
    let passingData = {
      query: {
        clinic: this.common.user._id,
        date: this.common.dateFormator(tomorrowDate),
      },
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
}
