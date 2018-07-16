import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api/api';

declare var google;

@Component({
  selector: 'page-appoinmentstatus',
  templateUrl: 'appoinmentstatus.html',
})
export class AppoinmentstatusPage {
  
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  appointent = null;
  message = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.appointent = this.navParams.get('appointent');
    console.log(this.appointent);
    if(this.appointent.status === 'cancelled'){
      this.message = 'Your booking was cancelled';
    }else{
      this.message = 'Thank you for visiting!!!';
    }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppoinmentstatusPage');
    this.loadMap();
  }
  
  loadMap(){
    console.log('called');
    this.api.address(this.appointent.clinic.addressFull).subscribe((res)=>{
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

      let content = `<b>${this.appointent.clinic.addressFull}</b>`;  
      let infoWindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 200
      });    
      infoWindow.open(this.map, marker);
    }, 
    (err)=>{
      console.log(err);
    });
  }

}
