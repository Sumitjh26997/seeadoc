import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';
import { VerificationPage } from './../verification/verification';

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  user = {
    email: '',
    mobile: ''
  };
  constructor(public navCtrl: NavController,
    public api: Api,
    public common: CommonProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  forgotPassword() {
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(this.user.email != "" && (this.user.email.length <= 5 || !emailRegexp.test(this.user.email))){
      let toast = this.toastCtrl.create({
        message: 'Please enter a valid email address !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else if((this.user.mobile=='') || ((this.user.mobile).length!=10)){
      let toast = this.toastCtrl.create({
        message: 'Please enter a valid mobile number !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else
    {
      let loader = this.loadingCtrl.create({
        spinner:'ios',
        content: 'Please wait...',
      });
      loader.present();
      let passingData = {
        mobile: this.user.mobile,
        email: this.user.email,
        code: Math.floor(100000 + Math.random() * 900000)
      };

      this.api.post('clinic/forgot-password', passingData)
        .subscribe(res => {
          console.log(res);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: res['message'],
            duration: 3000
          });
          toast.present();
          this.common.forgotUser = res['data'];
          this.common.verificationCode = passingData.code;
          this.navCtrl.push(VerificationPage);
        }, 
        err => {
          console.log(err);
          loader.dismiss();        
          let toast = this.toastCtrl.create({
            message: 'Unable to find clinic !',
            duration: 3000
        });
          toast.present();
      });
    }
  }

  goback(){
    this.navCtrl.pop();
  }
}
