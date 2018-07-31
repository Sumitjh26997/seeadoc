import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';


@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  
  length:any = 0;
  appointments = null;
  date: Date;
  min: any;
  max: any;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    public common: CommonProvider,
    public api: Api,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    //let allowedDate = parseInt(this.common.selectedClinic.allowBookingFor);
    let date = new Date();
  //  this.min = this.common.dateFormator(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+2}`);
//    this.max = this.common.dateFormator(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+allowedDate+1}`);
    
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()];
    console.log(weekday);
    this.selectDate();
  }

  selectDate() {
    let prompt = this.alertCtrl.create({
      title: 'Select Date',
      message: "Select a date for appoinment logs",
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
            this.getAppointments();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  
  formatDate(date:any) {
    var getdate = date.split('-');
    var getday = parseInt(getdate[2]);
    var getmonth = parseInt(getdate[1]);
    var getyear = parseInt(getdate[0]);
    var monthNames = [
      "JANUARY", "FEBRUARY", "MARCH",
      "APRIL", "MAY", "JUNE", "JULY",
      "AUGUST", "SEPTEMBER", "OCTOBER",
      "NOVEMBER", "DECEMBER"
    ];
    return `${monthNames[getmonth-1]} ${getday}, ${getyear}`;
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

  getAppointments() {
    let passingData = {
      query: {
        clinic: this.common.user._id,
        date: this.common.dateFormator(this.date),
        status: { $in: ['cancelled', 'closed', 'missed'] }
      },
    };
    console.log(passingData);
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
    loader.present();
    this.api.post('booking/fetch', passingData)
      .subscribe(res => {
        console.log(res);
        this.appointments = res['data'];
        this.length = this.appointments.length;
        console.log(this.length);
        loader.dismiss();
      }, err => {
        loader.dismiss();
        console.log(err);
      });
  }

  export() {
    let passingData = {
      query: {
        clinic: this.common.user._id,
        date: this.common.dateFormator(this.date),
        status: { $in: ['cancelled', 'closed', 'missed'] }
      },
    };
    console.log(passingData);
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
    loader.present();
    this.api.post('booking/generate-pdf', passingData)
      .subscribe(res => {
        console.log(res);
        this.appointments = res['data'];
        this.length = this.appointments.length;
        console.log(this.length);
        loader.dismiss();
      }, err => {
        loader.dismiss();
        console.log(err);
      });
  }

}
