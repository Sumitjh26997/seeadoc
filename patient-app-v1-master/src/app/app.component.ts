import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';

import { GetstartedPage } from '../pages/getstarted/getstarted';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { CommonProvider } from '../providers/common/common';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(platform: Platform, statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    public common: CommonProvider,
    splashScreen: SplashScreen, public loadingCtrl: LoadingController) {

    this.rootPage = GetstartedPage;
    if (localStorage.getItem('tutorial')) {
      this.rootPage = common.user ? TabsPage : SigninPage;
    } else {
      this.rootPage = GetstartedPage;
    }

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      if (!(platform.is('core') || platform.is('mobileweb'))) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
    });
  }
}
