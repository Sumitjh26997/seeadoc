import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-suggestdoctor',
  templateUrl: 'suggestdoctor.html',
})
export class SuggestdoctorPage {

  doctorName = '';
  mobileNumber = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: Api,
    public toastCtrl: ToastController,
    public common: CommonProvider) {
  }

  gotoPage() {
  }

  ionViewWillEnter() {

  }

  ionViewWillLeave() {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SuggestdoctorPage', this.common.location.selected);
  }

  suggestDoctor() {
    if(this.doctorName==''){
      let toast = this.toastCtrl.create({
        message: 'Please enter doctor name !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else if(this.mobileNumber==''){
      let toast = this.toastCtrl.create({
        message: 'Please enter mobile number !',
        duration: 3000          
      });
      toast.present();
      return false;
    }
    else
    {
      let loader = this.loadingCtrl.create();
      const passingData = {
        userId: this.common.user._id,
        doctor: this.doctorName,
        mobile: this.mobileNumber
      };
      loader.present();
      this.api.post('suggestion/add', passingData)
        .subscribe(res => {
          console.log(res);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Suggestion has been sent!',
            duration: 3000
          });
          toast.present();
          this.navCtrl.pop();
        }, 
        err => {
          console.log(err);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Unable to send Suggestion!',
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
