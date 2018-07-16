import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SelectPage } from '../select/select';
import { TommorowPage } from '../tommorow/tommorow';
import { TodayPage } from '../today/today';

@Component({
  selector: 'page-appoinment',
  templateUrl: 'appoinment.html',
})
export class AppoinmentPage {
  tab1: any;
  tab2: any;
  tab3: any;

  ngOnInit() {
    this.tab1 = TodayPage;
    this.tab2 = TommorowPage;
    this.tab3 = SelectPage;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppoinmentPage');
  }

}
