import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';
import { SigninPage } from './../signin/signin';

@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {
  user = {
    password: '',
    new_password: ''
  };
  constructor(public navCtrl: NavController,
    public api: Api,
    public common: CommonProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  resetPassword() {
    if(this.user.password==''){
      let toast = this.toastCtrl.create({
        message: 'Please enter new password !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else if(this.user.new_password==''){
      let toast = this.toastCtrl.create({
        message: 'Please confirm password !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else if(this.user.new_password!=this.user.password){
      let toast = this.toastCtrl.create({
        message: 'Password does not match !',
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
        _id: this.common.forgotUser._id,
        data:{
          password: this.user.password
        }
      };
      console.log(passingData);
      this.api.post('clinic/reset-password', passingData)
        .subscribe(res => {
          console.log(res);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: res['message'],
            duration: 3000
          });
          toast.present();
          this.navCtrl.setRoot(SigninPage);
        }, 
        err => {
          console.log(err);
          loader.dismiss();        
          let toast = this.toastCtrl.create({
            message: 'Unable to change password !',
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
