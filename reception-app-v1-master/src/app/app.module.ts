import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { IonRating } from '../components/ion-rating/ion-rating';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { ForgotPage } from '../pages/forgot/forgot';
import { VerificationPage } from '../pages/verification/verification';
import { ResetPage } from '../pages/reset/reset';
import { TabsPage } from '../pages/tabs/tabs';
import { BookPage } from './../pages/book/book';
import { AccountPage } from './../pages/account/account';
import { AppoinmentPage } from './../pages/appoinment/appoinment';
import { ApoinmentconfirmPage } from './../pages/apoinmentconfirm/apoinmentconfirm';
import { TommorowPage } from './../pages/tommorow/tommorow';
import { TodayPage } from './../pages/today/today';
import { SelectPage } from '../pages/select/select';
import { HistoryPage } from './../pages/history/history';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Geolocation } from '@ionic-native/geolocation';

import { CommonProvider } from '../providers/common/common';
import { Api } from '../providers/api/api';

@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    TabsPage,
    BookPage,
    AccountPage,
    ForgotPage,
    VerificationPage,
    ResetPage,
    AppoinmentPage,
    ApoinmentconfirmPage,
    HomePage,
    SelectPage,
    TodayPage,
    TommorowPage,
    HistoryPage,
    IonRating
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    TabsPage,
    BookPage,
    AccountPage,
    ForgotPage,
    VerificationPage,
    ResetPage,
    AppoinmentPage,
    ApoinmentconfirmPage,
    HomePage,
    SelectPage,
    TodayPage,
    TommorowPage,
    HistoryPage,
    IonRating
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CommonProvider,
    Api
  ]
})
export class AppModule { }
