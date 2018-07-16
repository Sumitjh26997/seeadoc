import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

@Component({
  selector: 'page-addmember',
  templateUrl: 'addmember.html',
})

export class AddmemberPage {
  tabBarElement: any;
  user = {
    name: '',
    mobile: ''
  };

  constructor(public navCtrl: NavController,
    public api: Api,
    public common: CommonProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddmemberPage');
  }
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  addMember() {
    if(this.user.name==''){
      let toast = this.toastCtrl.create({
        message: 'Please enter patient name !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else if(this.user.mobile==''){
      let toast = this.toastCtrl.create({
        message: 'Please enter patient mobile number !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else
    {
      console.log('Tets');
      let loader = this.loadingCtrl.create();
      loader.present();
      let passingData = {
        mobile: this.user.mobile,
        name: this.user.name,
        userId: this.common.user._id
      };
      this.api.post('users/add-patient', passingData, {})
        .subscribe(res => {
          console.log(res);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: res['message'],
            duration: 3000
          });
          toast.present();
          this.navCtrl.pop();
        }, 
        err => {
          console.log(err);
          loader.dismiss();        
          let toast = this.toastCtrl.create({
            message: 'Unable to add patient',
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
