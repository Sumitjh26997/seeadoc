import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AccountPage } from '../account/account';
import { HomePage } from '../home/home';
import { AppoinmentPage } from '../appoinment/appoinment';
import { Api } from '../../providers/api/api';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AppoinmentPage;
  tab3Root = AccountPage;
  tab4Root = HomePage;
  clinicStatus = false;
  clinicStatusIcon = 'ios-lock-outline';

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public api: Api,
    public navParams: NavParams,
    private alertCtrl: AlertController) { }

  clinicStatusUpdate() {
    console.log(this.clinicStatus);
    let message = null;
    if(this.clinicStatus==false){
      message = 'Are you sure to open clinic?';
    }
    else{
      message = 'Are you sure to close clinic?';
    }
    let alert = this.alertCtrl.create({
      title: '<center><u>Clinic Status !</u></center>',
      message: `<center>${message}</center>`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel Clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const passingData = {
              _id: JSON.parse(localStorage.getItem('userDetails'))._id,
              isOpen: !this.clinicStatus
            };
            console.log(passingData);
            let loader = this.loadingCtrl.create({
              spinner: 'ios',
              content: 'Please wait...'
            });
            loader.present();
            this.api.post('clinic/change-status', passingData)
              .subscribe(res => {
                console.log(res);
                loader.dismiss();
                this.clinicStatus = !this.clinicStatus;
                this.clinicStatusIcon = this.clinicStatus ? 'ios-clock-outline' : 'ios-lock-outline';
                let toast = this.toastCtrl.create({
                  message: this.clinicStatus ? 'Clinic has been opened !' : 'Clinic has been closed !',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
              }, 
              err => {
                console.log(err);
                loader.dismiss();
                let toast = this.toastCtrl.create({
                  message: 'Some technical error occurred. Try again...',
                  duration: 3000
                });
                toast.present();
            });
          }
        }
      ]
    });
    alert.present();
  }
}
