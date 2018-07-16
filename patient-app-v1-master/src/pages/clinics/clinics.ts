import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { DoctorsPage } from '../doctors/doctors';
import { SuggestdoctorPage } from '../suggestdoctor/suggestdoctor';
import { CommonProvider } from './../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-clinics',
  templateUrl: 'clinics.html',
})
export class ClinicsPage {

  clinicsList = [];
  clinicsListNew = [];  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: Api,
    public loadingCtrl: LoadingController, public common: CommonProvider) {
    this.getClinics();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClinicsPage');
    console.log(this.common.location.selected);
  }

  getNewClinic(){
    this.clinicsList = this.clinicsListNew;
  }

  getClinic(ev: any) {
    this.getNewClinic();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.clinicsList = this.clinicsList.filter((item) => {
        return (((item.name).toLowerCase().indexOf(val.toLowerCase()) > -1) || ((item.addressShot).toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  }

  selectClinic(clinic, doctor) {
    console.log(clinic);
    console.log(doctor);
    this.navCtrl.push(DoctorsPage,{clinic:clinic, doctor: doctor});
  }

  suggestDoctor() {
    this.navCtrl.push(SuggestdoctorPage);
  }

  getClinics() {
    let passingData;

    if(this.common.location.selected['_id']){
      passingData = {
        query: {},
      };
      passingData.query['location'] = this.common.location.selected['_id'];
    }
    else if(this.common.location.selected['lat'] && this.common.location.selected['lng']){
      passingData = {
        query: {}
      };
      passingData.query['lat'] = this.common.location.selected['lat'];
      passingData.query['lng'] = this.common.location.selected['lng'];
    }
    else{
      passingData = {
        query: {}
      };
    }
    console.log(passingData.query);

    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('clinic/fetch', passingData)
      .subscribe(res => {
        console.log(res['data']);
        this.clinicsList = res['data'];
        this.clinicsListNew = res['data'];
        loader.dismiss();
      }, err => {
        loader.dismiss();        
        console.log(err);
    });
  }
}
