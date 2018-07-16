import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Network } from '@ionic-native/network';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  mobile = '';
  showScreen: String = 'mobile';
  OTP = '1234';
  confirmOTP = '';
  username = '';
  mobileValid = false;
  validationMessage = '';
  validatingOTP = '';
  displayOTP = false;
  displayName = false;

  constructor(public navCtrl: NavController,
    public api: Api,
    public common: CommonProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public navParams: NavParams, private network: Network) {
  }
  
  ionViewDidLoad(){
    localStorage.setItem('tutorial', 'true');
  }

  gotoPage() {
    this.navCtrl.push(TabsPage);
  }

  ionViewWillEnter() {
    this.network.onDisconnect().subscribe(() => {
      this.displayNetworkError();
    });
  }

  displayNetworkError() {
    let alert = this.alertCtrl.create({
      title: 'No Internet Connection !',
      subTitle: 'It seems like you are not connected to the internet. Please try again !',
      buttons: [{
        text: 'Retry',
        role: 'cancel',
        handler: () => {
          // this.ionViewWillEnter();
        }
      }]
    });
    alert.present();
  }

  checkOTP() {
    if (this.confirmOTP.length === 4) {
      this.validationMessage = 'Validating OTP';
      setTimeout(() => {

        if (this.confirmOTP !== this.OTP) {
          this.validationMessage = 'Invalid OTP';
          this.validatingOTP = 'invalid';
        } else {
          this.validatingOTP = 'valid';
          this.validationMessage = '';
        }
      }, 2000);
    }
  }

  sendOTP() {
    if (this.mobile.length === 10) {
      let loader = this.loadingCtrl.create({});
      loader.present();
      
      this.api.post('otp/send', { mobile: this.mobile })
        .subscribe(res => {
          console.log(res);
          this.common.displayToast('OTP has been sent to your mobile number !');
          loader.dismiss();
          this.displayOTP = true;
          this.displayName = false;
        }, err => {
          console.log(err);
          if (err.error.message) {
            this.common.displayToast(err.error.message);
          } else {
            this.common.displayToast('Oops! something went wrong. Try again...');
          }
          loader.dismiss();
        });
    }
  }

  verifyOTP() {
    console.log('OTP');
    console.log(this.confirmOTP);
    let confirmOTP = this.confirmOTP.toString();
    console.log(confirmOTP.length);
    if (confirmOTP.length === 4) {
      let loader = this.loadingCtrl.create({});
      loader.present();
      this.api.post('otp/verify', { mobile: this.mobile, otp: this.confirmOTP })
        .subscribe(res => {
          loader.dismiss();
          console.log(res);
          this.displayOTP = false;
          if (res['data']) {
            this.login(res['data'].mobile, res['data'].name);
            this.common.displayToast('OTP verified successfully !');
          } else {
            this.displayName = true;
          }
        }, err => {
          loader.dismiss();
          console.log(err);
          if (err.error.message) {
            this.common.displayToast(err.error.message);
          } else {
            this.common.displayToast('Oops! something went wrong. Try again...');
          }
        });
    }
  }


  login(mobile, name) {
    let loader = this.loadingCtrl.create({});
    loader.present();
    this.api.post('users/login', { mobile: mobile, name: name })
      .subscribe(res => {
        loader.dismiss();
        console.log(res);
        localStorage.setItem('TOKEN', res['token']);
        this.common.user = res['data'];
        localStorage.setItem('USERDATA', JSON.stringify(res['data']));
        this.navCtrl.setRoot(TabsPage);
        this.common.displayToast('Logged in successfully !');
      }, err => {
        loader.dismiss();
        if (err.error.message) {
          this.common.displayToast(err.error.message);
        } else {
          this.common.displayToast('Oops! something went wrong. Try again...');
        }
        console.log(err);
    });
  }
}
