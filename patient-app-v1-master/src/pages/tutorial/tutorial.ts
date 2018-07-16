import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  gotoAPP() {
    localStorage.setItem('tutorial', 'true');
    this.navCtrl.setRoot(SigninPage);
  }

}
