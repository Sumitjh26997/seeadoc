import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { SigninPage } from '../signin/signin';
import { HistoryPage } from './../history/history';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  patients = null;
  loader:any;
  data:any = {}

  constructor(public app: App, public navCtrl: NavController, 
    public navParams: NavParams, 
    public common:CommonProvider,
    public api:Api,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController) {}

  ionViewDidEnter(){
    this.loader = this.loadingCtrl.create({
      spinner:'ios',
      content: 'Please wait...',
    });
    this.loader.present();
    this.data = JSON.parse(localStorage.getItem('userDetails'));
    this.loader.dismiss();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: '<center><u>Confirm Log Out</u></center>',
      message: '<center>Your saved data will be removed</center>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel Clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Confirm Clicked');
            this.common.patient = null;
            this.common.forgotUser = null;
            this.common.verificationCode = null;
            this.common.user = null;
            this.common.token = null;
            localStorage.clear();
            
            this.navCtrl.parent.parent.setRoot(SigninPage);
            this.app.getRootNav().setRoot(SigninPage);         
          }
        }
      ]
    });
    alert.present();
  }

  bookingHistory(){
    this.navCtrl.push(HistoryPage);
  }
}
