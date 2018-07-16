import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,
  ViewController, App
} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AppoinmentPage } from '../appoinment/appoinment';

@Component({
  selector: 'page-book',
  templateUrl: 'book.html'
})
export class BookPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    public viewCtrl: ViewController, public app: App) {
    }
  
    
  ionViewDidLoad() {
    this.navCtrl.push(AppoinmentPage);
  }

  selectDate() {
    let prompt = this.alertCtrl.create({
      title: 'Select Date',
      message: "Select a date for appoinment",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          type: 'date'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: '<center><u>Confirm Booking</u></center>',
      message: '<center>Do you want to confirm slot?</center>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('confirm clicked');
            this.presentAlert();
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Patient');

    alert.addInput({
      type: 'radio',
      label: 'Hamza Akhtar',
      value: 'Hamza Akhtar',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Nadeem Akhtar',
      value: 'Nadeem Akhtar',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.gotoConfirm();

      }
    });
    alert.present();
  }

  presentSorryAlert() {
    let alert = this.alertCtrl.create({

      subTitle: '<center><p>Sorry!!!</p><p>No more slot is available for 5.15 PM</p></center>',
      buttons: ['Done!'],
      cssClass: 'alertcss'
    });
    alert.present();
  }

  gotoConfirm() {
    // this.navCtrl.push(ApoinmentconfirmPage, { previousNav: this.navCtrl });
  }

  backButtonFunc(){
    this.app.getRootNav().setRoot(TabsPage);
  }

}
