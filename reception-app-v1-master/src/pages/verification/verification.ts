import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { ResetPage } from './../reset/reset';

@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class VerificationPage {

  code=null;

  constructor(public navCtrl: NavController, public common: CommonProvider, public toastCtrl: ToastController) {
    console.log(this.common.forgotUser);
  }

  verifyAccount(){
    if(this.code==this.common.verificationCode){
      let toast = this.toastCtrl.create({
        message: 'Account verified successfully !',
        duration: 3000          
      });
      toast.present();
      this.navCtrl.push(ResetPage);
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Invalid verification code !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
  }
}
