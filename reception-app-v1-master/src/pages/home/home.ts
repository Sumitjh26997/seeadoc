import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Api } from './../../providers/api/api';
import { CommonProvider } from './../../providers/common/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  length: any = 0;
  appointments = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public api: Api,
    public common: CommonProvider) {}

  ionViewDidEnter(){
    this.getAppointsment();
  }
  
  filterTime1(time:any){
    let gettime = time.split(':');
    let newTime = parseFloat(gettime[0]);
    let returnTime:any;
    if(newTime==0)          // Display 00:00 time as 12:00AM
      {
        returnTime = `${newTime+12}:${gettime[1]} AM`;        
      }
    else if(newTime<12){
      returnTime = `${newTime}:${gettime[1]} AM`;
    }
    else if(newTime>12){
      returnTime = `${newTime-12}:${gettime[1]} PM`;
    }
    else if((newTime==12)){   //Display 12:00 time as 12:00 PM
      returnTime = `${newTime}:${gettime[1]} PM`;
    }
    return returnTime;
  }

  filterTime2(time:any){
    let gettime = time.split(':');
    let newTime = parseFloat(gettime[0]);
    let returnTime:any;
    if(newTime==0) // Display 00:00 time as 12:00AM
      {
        returnTime = `${newTime+12}:${gettime[1]} AM`;        
      }
    else if(newTime<12){
      returnTime = `${newTime}:${gettime[1]} AM`;
    }
    else if(newTime>12){
      returnTime = `${newTime-12}:${gettime[1]} PM`;
    }
    else if((newTime==12)){ //Display 12:00 time as 12:00 PM
      returnTime = `${newTime}:${gettime[1]} PM`;
    }
    return returnTime;
  }

  getAppointsment() {
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...',
    });
    loader.present();

    var currentDate = new Date();
    let passingData = {
      query: {
        clinic: JSON.parse(localStorage.getItem('userDetails'))._id,
        date: this.common.dateFormator(currentDate),
        status: { $in: ['queued', 'consulting'] }
      }
    };
    this.api.post('booking/fetch-as-clinic', passingData)
      .subscribe(res => {
        console.log(res);
        this.appointments = (res['data']).reverse();
        this.length = this.appointments.length;
        console.log(this.length);
        loader.dismiss();
      },
        err => {
          console.log(err);
          loader.dismiss();
      });
  }

  consulting(appointment, index) {
    let alert = this.alertCtrl.create({
      title: '<center><u>Appointment Status</u></center>',
      message: '<center>Your patient status will be changed !</center><br><center>Are you sure?</center>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel Clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (appointment.status === 'queued') {
              this.closedAppointment('consulting', appointment, index);
            }
            else if(appointment.status === 'consulting')
            {
              this.closedAppointment('closed', appointment, index);
            }
          }
        }
        ]
      });
    alert.present();
  }

  closedAppointment(status, appointment, index) {
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
    loader.present();

    const passingData = {
      _id: appointment._id,
      status: status,
      clinic: JSON.parse(localStorage.getItem('userDetails'))._id,
    };
    this.api.post('booking/change-status', passingData)
      .subscribe(res => {
        console.log(res);
        this.getAppointsment();
        let toast = this.toastCtrl.create({
          message: `Appointment status changed to : ${status}`,
          duration: 3000
        });
        toast.present();
        loader.dismiss();
      }, err => {
        console.log(err);
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Some technical error occurred. Try again',
          duration: 3000
        });
        toast.present();
      });
  }
  
  removedBookings(index) {
    if (index === 0) {
      return false;
    }
    for (let i = 0; i < index; i++) {
      if (this.appointments[i].status === 'queued') {
        this.updateStatus('missed', this.appointments[i], i);
      } else if (this.appointments[i].status === 'consulting') {
        this.updateStatus('closed', this.appointments[i], i);
      }
    }
  }

  updateStatus(status, appointment, index) {
    const passingData = {
      _id: appointment._id,
      status: status,
      clinic: JSON.parse(localStorage.getItem('userDetails'))._id,
    };
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
    loader.present();
    this.api.post('booking/change-status', passingData)
      .subscribe(res => {
        console.log(res);
        if (status === 'missed') {
          this.appointments[index].status = 'missed';
        } else {
          this.appointments[index].status = 'closed';
        }
        loader.dismiss();
      }, err => {
        console.log(err);
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Some technical error occurred. Try again',
          duration: 3000
        });
        toast.present();
      });
  }
}
