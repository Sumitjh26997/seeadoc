import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { HomePage } from '../home/home';
import { CommonProvider } from '../../providers/common/common';

declare var google;

@Component({
  selector: 'page-mystatus',
  templateUrl: 'mystatus.html',
})
export class MystatusPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  showLiveStatus: boolean = false;
  bookingDetails = null;
  logs = null;
  logLength = 0;

  constructor(public navCtrl: NavController,
    public api: Api,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public common: CommonProvider,
    public navParams: NavParams) {
    this.bookingDetails = this.navParams.get('booking');
    console.log(this.bookingDetails);
    this.fetchLogs();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MystatusPage');
    this.loadMap();
  }

  formatDate(date: any) {
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
    return `${monthNames[getmonth - 1]} ${getday}, ${getyear}`;
  }

  filterTime(time: any) {
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
  
  filterDate(date){
    console.log(date);
    let time = new Date(date);
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  loadMap() {
    console.log('called');
    this.api.address(this.bookingDetails.clinic.addressFull).subscribe((res) => {
      console.log(res);
      let lat = (res['results'][0]).geometry.location.lat;
      let lng = (res['results'][0]).geometry.location.lng;
      let latLng = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
      this.map.setCenter(marker.getPosition());

      let content = `<b>${this.bookingDetails.clinic.addressFull}</b>`;
      let infoWindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 200
      });
      infoWindow.open(this.map, marker);
    },
      (err) => {
        console.log(err);
      });
  }


  confirmCancel() {
    let confirm = this.alertCtrl.create({
      title: 'Cancel Booking?',
      message: 'Are you sure to cancel this booking?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.cancelBooking();
          }
        }
      ]
    });
    confirm.present();
  }

  cancelBooking() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('booking/cancel', { _id: this.bookingDetails._id })
      .subscribe(res => {
        console.log(res);
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: res['message'],
          duration: 3000
        });
        toast.present();
        this.navCtrl.setRoot(HomePage);
      }, err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: 'Unable to cancel booking',
          duration: 3000
        });
        toast.present();
        loader.dismiss();
      });
  }

  confirmReschedule() {
    let confirm = this.alertCtrl.create({
      title: 'Reschedule Booking?',
      message: 'Your current slot will be lost !<br><br>Are you sure ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.rescheduleBooking();
          }
        }
      ]
    });
    confirm.present();
  }

  rescheduleBooking() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('booking/delete', { _id: this.bookingDetails._id })
      .subscribe(res => {
        console.log(res);
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: res['message'],
          duration: 3000
        });
        toast.present();
        this.navCtrl.setRoot(HomePage);
      }, err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: 'Unable to delete booking',
          duration: 3000
        });
        toast.present();
        loader.dismiss();
      });
  }

  hideshow() {
    this.showLiveStatus = true;
  }

  fetchLogs() {
    let passingData = {
      query: {
        clinic: this.bookingDetails.clinic._id,
        date: this.common.dateFormator(new Date())
      },
    };
    console.log(passingData);

    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('log/fetch', passingData)
      .subscribe(res => {
        console.log(res);
        if((res['data']).length>0){
          this.logLength = 1;
        }
        loader.dismiss();
        this.logs = (res['data']).reverse();
      }, err => {
        loader.dismiss();
        console.log(err);
      });
  }
}
