import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-getstarted',
  templateUrl: 'getstarted.html',
})
export class GetstartedPage {
  
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  
  ionViewDidLoad(){
   
  }

  ngAfterViewInit() {
    this.slides.freeMode = true;
  }

  gotoLogin(){
    localStorage.setItem('tutorial', 'true');
    this.navCtrl.setRoot(SigninPage);
  }

}
