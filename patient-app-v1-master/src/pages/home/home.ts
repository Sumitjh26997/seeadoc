import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';
import { ClinicsPage } from './../clinics/clinics';
import { LocationsPage } from './../locations/locations';
import { SuggestdoctorPage } from './../suggestdoctor/suggestdoctor';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  city: string = '';
  selectedLocation = null;
  location_name:any= '';

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public common: CommonProvider,public api: Api, private geolocation: Geolocation) {}

  ionViewCanEnter(){
    if((this.common.location.selected)['_id']){
      console.log((this.common.location.selected));
    }
    if((this.common.location.selected)['_id']){
      this.location_name = this.common.location.selected['town']+', '+this.common.location.selected['state']+', '+this.common.location.selected['country'];
    }
  }

  autodetect(){
    let loader = this.loadingCtrl.create({content:'Detecting location, Please wait...'});
    loader.present();
    console.log('Clicked');
    this.geolocation.getCurrentPosition({enableHighAccuracy:true, timeout:60000, maximumAge:0}).then((position) => {
      loader.dismiss();
      this.displaylocation(position);
     }).catch((error) => {
       this.common.displayToast('Unable to detect current location !');
       loader.dismiss();
       console.log('Error getting location', error);
     });
  }

  displaylocation(position){
    let loader = this.loadingCtrl.create({content:'Detecting location, Please wait...'});
    loader.present();
    console.log(position);
    this.common.location.selected = { lat:0 , lng: 0};
    this.common.location.selected['lat'] = parseFloat((position.coords.latitude).toFixed(4));
    this.common.location.selected['lng'] = parseFloat((position.coords.longitude).toFixed(4));
    this.api.location(this.common.location.selected['lat'], this.common.location.selected['lng'])
      .subscribe(res => {
        this.location_name = (res['results'])[3].formatted_address;
        this.common.displayToast('Location detected !');
        loader.dismiss();
        console.log(res);
      }, err => {
        this.common.displayToast('Unable to detect current location !');
        loader.dismiss();
        console.log(err); 
    });
  }

  gotoClinicPage() {
    if(this.common.location.selected['lat'] && this.common.location.selected['lng'])
    {
      console.log(this.common.location.selected);
      this.navCtrl.push(ClinicsPage);
    }
    else
    {
      console.log(this.common.location.selected);
      this.navCtrl.push(LocationsPage);
    }
  }
  gotoLocationPage() {
    this.navCtrl.push(LocationsPage);
  }
  gotoSuggestedDoctorPage() {
    this.navCtrl.push(SuggestdoctorPage);
  }
  
  // ionViewWillEnter(){
    // this.network.onDisconnect().subscribe(() => {
    //   this.displayNetworkError();
    // });
  // }

  displayNetworkError(){
    let alert = this.alertCtrl.create({
      title: 'No Internet Connection !',
      subTitle: 'It seems like you are not connected to the internet. Please try again !',
      buttons: [{
        text: 'Retry',
        role: 'cancel',
        handler: () => {
          // this.ionViewWillEnter();
        }}]
    });
    alert.present();
  }

}
