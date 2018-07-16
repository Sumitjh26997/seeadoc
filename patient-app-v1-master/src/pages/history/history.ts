import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FeedbackPage } from '../feedback/feedback';
import { AppoinmentstatusPage } from '../appoinmentstatus/appoinmentstatus';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';


@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  
  length:any = 0;
  appointments = null;

  constructor(public navCtrl: NavController,
    public common: CommonProvider,
    public api: Api,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  gotofeedback(appointent) {
    this.navCtrl.push(FeedbackPage, {appointent: appointent});
  }

  ionViewDidEnter() {
    this.getAppointments();
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

  filterTime(time:any){
    let gettime = time.split(':');
    let newTime = parseFloat(gettime[0]);
    let returnTime:any;
    if(newTime<=12){
      returnTime = `${newTime}:${gettime[1]} AM`;
    }
    if(newTime>12){
      returnTime = `${newTime-12}:${gettime[1]} PM`;
    }
    if((newTime==12) && (Math.ceil(parseFloat(gettime[1]))==1)){
      returnTime = `${newTime-12}:${gettime[1]} PM`;
    }
    return returnTime;
  }

  gotoAppoinmentStatus(appointent) {
    this.navCtrl.push(AppoinmentstatusPage, { appointent: appointent });
  }

  doRefresh(refresher) {
    this.getAppointments();
    refresher.complete();
  }

  getAppointments() {
    let passingData = {
      query: {
        $or:[{user: this.common.user._id},{patient:this.common.user._id}],
        status: { $in: ['cancelled', 'closed', 'missed'] }
      },
    };
    console.log(passingData);
    let loader = this.loadingCtrl.create();
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

}
