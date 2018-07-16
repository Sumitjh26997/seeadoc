import { ForgotPage } from './../forgot/forgot';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Api } from '../../providers/api/api';
import { CommonProvider } from './../../providers/common/common';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  
  email:string='';
  password:string='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,public toastCtrl: ToastController, public api: Api, public common: CommonProvider) {
    this.common.patient = null;
    this.common.forgotUser = null;
    this.common.verificationCode = null;
    this.common.user = null;
    this.common.token = null;
  }

  ionViewDidEnter(){
    let user = JSON.parse(localStorage.getItem('userDetails'));
    let token = JSON.parse(localStorage.getItem('Token'));
    if(user && token){
     this.navCtrl.setRoot(TabsPage);
    }
  }

  login(){
    let loader = this.loadingCtrl.create({
      spinner:'ios',
      content: 'Please wait...',
    });

    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(this.email=='' || this.password==''){
      this.toastCtrl.create({
        message: 'Please enter your email and password !',
        duration: 3000,
        position: 'top'
      }).present();
      return false;
    }
    else if(this.email != "" && (this.email.length <= 5 || !emailRegexp.test(this.email))) 
    {
      this.toastCtrl.create({
        message: 'Please enter a valid email address !',
        duration: 3000,
        position: 'top'
      }).present();
      return false;
    }
    else
    {
      loader.present();
      this.api.post('clinic/signin', {email: this.email, password: this.password})
      .subscribe(res => {
        this.common.user = res['data'];
        this.common.token = res['token'];
        localStorage.setItem('userDetails', JSON.stringify(res['data']));
        localStorage.setItem('Token', JSON.stringify(res['token']));
        this.toastCtrl.create({
          message: res['message'],
          duration: 1000,
          position: 'top'
        }).present();
        this.navCtrl.setRoot(TabsPage);
        loader.dismiss();
      }, err => {
        this.toastCtrl.create({
          message: err.error.message,
          duration: 3000,
          position: 'top'
        }).present();
        loader.dismiss();
      });
    }
  }
  forgot(){
    this.navCtrl.push(ForgotPage);
  }
}
