import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
})
export class LocationsPage {

  selectedLocation = {};
  locations = null;

  constructor(public navCtrl: NavController,
    public common: CommonProvider,
    public api: Api,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.selectedLocation = this.common.location.selected;
    this.fetchLocations();
  }

  selectLocation(location) {
    console.log(location);
    this.common.location.selected = location;
    localStorage.setItem('SELECTED_LOCATION', JSON.stringify(location))
    this.navCtrl.pop();
  }

  fetchLocations() {
    let loader = this.loadingCtrl.create({});
    loader.present();
    this.api.post('location/fetch', {})
      .subscribe(res => {
        loader.dismiss();
        console.log(res);
        this.locations = res['data'];
      }, err => {
        loader.dismiss();
        console.log(err);
      });
  }

}
