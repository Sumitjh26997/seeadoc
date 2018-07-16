import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { AddmemberPage } from '../addmember/addmember'
import { SigninPage } from './../signin/signin';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  patients = null;
  constructor(
    public app: App,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public common:CommonProvider,
    public api:Api,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  ionViewWillEnter(){
    this.fetchingPatients();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: '<center><u>Confirm Log Out</u></center>',
      message: '<center>Your saved data will be lost !</center>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('confirm clicked');
            localStorage.clear();
            this.app.getRootNav().setRoot(SigninPage); 
          }
        }
      ]
    });
    alert.present();
  }

  addMember() {
    this.navCtrl.push(AddmemberPage);
  }

  fetchingPatients() {
    let passingData = {
      query: {
        isPrimary: this.common.user._id
      }
    };
    let loader = this.loadingCtrl.create();
    loader.present();
    this.api.post('users/fetch', passingData)
      .subscribe(res => {
        console.log('User ', res);
        loader.dismiss();
        this.patients = res['data'];
      }, err => {
        console.log(err);
        loader.dismiss();
      });
  }

}
