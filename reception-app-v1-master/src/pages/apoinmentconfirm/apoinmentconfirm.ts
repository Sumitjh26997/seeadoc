import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, NavParams, App, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

import { TabsPage } from '../tabs/tabs';

declare var google;

@Component({
  selector: 'page-apoinmentconfirm',
  templateUrl: 'apoinmentconfirm.html',
})
export class ApoinmentconfirmPage {
  
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  bookingDetails = null;

  clinic = null;
  doctor = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public common: CommonProvider,
    public api: Api,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App) {

    if (this.navParams.get('bookingDetails')) {
      localStorage.setItem('bookingDetails', JSON.stringify(this.navParams.get('bookingDetails')));
    }
    this.bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    console.log(this.bookingDetails);
    if (this.navParams.get('clinic')) {
      localStorage.setItem('clinic', JSON.stringify(this.navParams.get('clinic')));
    }
    this.clinic = JSON.parse(localStorage.getItem('clinic'));
    this.common.user.doctors.map(doctor => {
      if(doctor._id==this.bookingDetails.doctor){
        this.doctor = doctor;
      }
    });
    console.log(this.doctor);
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

  loadMap(){
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
    loader.present();
    this.api.address(this.common.user['addressFull']).subscribe((res)=>{
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
      
      let content = `<b>${this.common.user['addressFull']}</b>`;  
      let infoWindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 200
      });    
      infoWindow.open(this.map, marker);
      loader.dismiss();
    }, 
    (err)=>{
      console.log(err);
      loader.dismiss();
    });
  }

  backButtonFunc(){
    this.app.getRootNav().setRoot(TabsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApoinmentconfirmPage');
    this.loadMap();
  }

  confirmReschedule(){
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

  rescheduleBooking(){
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
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
      this.app.getRootNav().setRoot(TabsPage);
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
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...'
    });
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
        this.app.getRootNav().setRoot(TabsPage);
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

}
