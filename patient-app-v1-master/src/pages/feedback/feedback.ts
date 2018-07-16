import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HistoryPage } from '../history/history';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  satisfy: string = 'yes';
  appointment = null;
  rating = 5;
  remark = '';

  constructor(public navCtrl: NavController,
    public api: Api,
    public common: CommonProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.appointment = this.navParams.get('appointent');
  }

  log(valor) {
    console.log(valor);
    this.rating = valor;
  }

  gotoback() {
    this.navCtrl.push(HistoryPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  sendFeedback() {
    if((this.remark).length>500)
    {
      let toast = this.toastCtrl.create({
        message: 'Remark should be less than 500 character!',
        duration: 3000
      });
      toast.present();
      return false;
    }
    else
    {
      const passingData = {
        bookingId: this.appointment._id,
        rating: this.rating,
        message: this.remark,
        isSatisfy: this.satisfy
      };
      console.log(passingData);
      let loader = this.loadingCtrl.create();
      loader.present();
      this.api.post('feedback/add', passingData)
        .subscribe(res => {
          console.log(res);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Your feedback has been sent!',
            duration: 3000
          });
          toast.present();
          this.navCtrl.pop();
        }, err => {
          console.log(err);
          loader.dismiss();
      });
    }
  }

}
