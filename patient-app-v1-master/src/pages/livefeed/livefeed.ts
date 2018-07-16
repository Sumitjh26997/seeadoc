import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { MystatusPage } from '../mystatus/mystatus';
import { CommonProvider } from './../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-livefeed',
  templateUrl: 'livefeed.html',
})
export class LivefeedPage {
  
  length: any = 0;
  feedList = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public loadingCtrl: LoadingController, public common: CommonProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LivefeedPage');
  }

  ionViewDidEnter() {
    this.getLiveFeeds();
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

  gotoLiveStatus(booking) {
    this.navCtrl.push(MystatusPage, { booking: booking });
  }
  
  doRefresh(refresher) {
    this.getLiveFeeds();
    refresher.complete();
  }

  getLiveFeeds() {
    let today = new Date();
    let passingData = {
      query: {
        user: this.common.user._id,
        date: this.common.dateFormator(today),
        status: { $in: ['queued', 'missed'] }
      }
    };

    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('booking/fetch-as-patient', passingData)
      .subscribe(res => {
        let data = res['data'];
        let date1 = new Date();
        let mm1 = date1.getMonth()+1;
        let dd1 = date1.getDate();
        let yy1 = date1.getFullYear();
        this.length = data.length;
        let filteredData = [];

        for(let i=0;i<this.length;i++){
          let date1 = new Date(data[i]['date']);
          for(let j=0;j<this.length;j++){
            let date2 = new Date(data[j]['date']);
            if(date1.getTime()<date2.getTime()){
              let temp = data[i];
              data[i] = data[j];
              data[j] = temp;
            }
          }
        }

        for(let i=0;i<this.length;i++){
          let date2 = new Date(data[i]['date']);
          let mm2 = date2.getMonth()+1;
          let dd2 = date2.getDate();
          let yy2 = date2.getFullYear();
          if(yy1<=yy2){
            if(mm1==mm2){
              if(dd1<dd2){
                data[i]['position']=1;
              }
            }
          }
        }
      
        for(let i=0;i<this.length;i++){
          let date2 = new Date(data[i]['date']);
          let mm2 = date2.getMonth()+1;
          let dd2 = date2.getDate();
          let yy2 = date2.getFullYear();

          if(yy1<=yy2){
            if(mm1<=mm2){
              if(dd1<=dd2){
                filteredData.push(data[i]);
              }
            }
          }
        }
        this.feedList = filteredData;
        loader.dismiss();
      }, err => {
        loader.dismiss();
        console.log(err);
      });
  }

}
