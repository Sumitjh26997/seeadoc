import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { AppoinmentPage } from '../appoinment/appoinment';
import { Platform } from 'ionic-angular';
import { CommonProvider } from './../../providers/common/common';
import { Api } from '../../providers/api/api';

declare var google;

@Component({
  selector: 'page-doctors',
  templateUrl: 'doctors.html',
})
export class DoctorsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  showLiveStatus = false;
  clinic = null;
  doctor = null;
  logs = null;
  logLength = 0;
  date = new Date();
  day = this.date.getDay();
  weekday:string[] = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  today = this.weekday[this.day];
  open = null;
  break = null;

  constructor(public navCtrl: NavController,  public loadingCtrl: LoadingController, public platform: Platform,
    public navParams: NavParams, private alertCtrl: AlertController,
    public api: Api,
    public common: CommonProvider) {
    if (this.navParams.get('clinic')) {
      localStorage.setItem('clinic', JSON.stringify(this.navParams.get('clinic')));
      localStorage.setItem('doctor', JSON.stringify(this.navParams.get('doctor')));
      
    }
    this.clinic = JSON.parse(localStorage.getItem('clinic'));
    this.doctor = JSON.parse(localStorage.getItem('doctor'));
    if(this.day == 0)
    {
      if(this.clinic.Sunday.isOpen==1)
      {}
      else{}
    }
    else if(this.day == 1)
    {
      if(this.clinic.Monday.isOpen==1)
      {}
      else{}
    }
    else if(this.day==0)
    {
      if(this.clinic.Sunday.isOpen==1)
      {}
      else{}
    }
    else if(this.day==0)
    {
      if(this.clinic.Sunday.isOpen==1)
      {}
      else{}
    }
    else if(this.day==0)
    {
      if(this.clinic.Sunday.isOpen==1)
      {}
      else{}
    }
    else if(this.day==0)
    {
      if(this.clinic.Sunday.isOpen==1)
      {}
      else{}
    }
    console.log(this.doctor);
    console.log(this.clinic);
    console.log(this.day);
    console.log(this.weekday[0]);
    console.log(this.weekday[1]);
    console.log(this.weekday[2]);
    console.log(this.weekday[3]);
    console.log(this.weekday[4]);
    console.log(this.weekday[5]);
    console.log(this.weekday[6]);
    console.log(this.today);
    this.presentAlert();
    this.fetchLogs();
  }

  takeAppoinment() {
    this.common.selectedClinic = this.clinic;
    this.common.selectedDoctor = this.doctor;
    this.navCtrl.push(AppoinmentPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorsPage');
    this.loadMap();
  }
  
  filterDate(date){
    console.log(date);
    let time = new Date(date);
    return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'NOTICE BOARD',
      message: `${this.clinic.noticeBoard}`,
      buttons: [ 
                  {
                    text: 'Ok',
                    cssClass: 'ok_button',
                    handler: () => {
                      console.log('confirm clicked');
                    }
                  }
                ],
      cssClass: 'alertcss'
    });
    alert.present();
  }

  gotoMap(location) {
    window.open(location);
  }

  loadMap(){
    console.log('called');
    this.api.address(this.clinic.addressFull).subscribe((res)=>{
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
    }, 
    (err)=>{
      console.log(err);
    });
  }
  
  fetchLogs() {
    
    let passingData = {
      query: {
        clinic: this.clinic._id,
        date: this.common.dateFormator(new Date())
      }
    };
    console.log(passingData);

    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('log/fetch', passingData)
      .subscribe(res => {
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
