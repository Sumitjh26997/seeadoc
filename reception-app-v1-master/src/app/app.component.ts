import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SigninPage } from '../pages/signin/signin';
import { TabsPage } from './../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation,) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      if(!(platform.is('core') || platform.is('mobileweb'))){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
    });
    if(localStorage.getItem('userDetails'))
    {
      this.rootPage = TabsPage;
    } 
    else 
    {
      this.rootPage = SigninPage;
    }
  }
}
