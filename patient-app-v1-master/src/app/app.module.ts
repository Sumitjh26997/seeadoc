import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { IonRating } from '../components/ion-rating/ion-rating';

import { GetstartedPage } from '../pages/getstarted/getstarted';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { LivefeedPage } from '../pages/livefeed/livefeed';
import { HistoryPage } from '../pages/history/history';
import { DoctorsPage } from '../pages/doctors/doctors';
import { AppoinmentPage } from '../pages/appoinment/appoinment';
import { SelectPage } from '../pages/select/select';
import { TommorowPage } from '../pages/tommorow/tommorow';
import { TodayPage } from '../pages/today/today';
import { FeedbackPage } from '../pages/feedback/feedback';
import { ApoinmentconfirmPage } from '../pages/apoinmentconfirm/apoinmentconfirm';
import { AppoinmentstatusPage } from '../pages/appoinmentstatus/appoinmentstatus';
import { MystatusPage } from '../pages/mystatus/mystatus';
import { ClinicsPage } from '../pages/clinics/clinics';
import { LocationsPage } from '../pages/locations/locations';
import { SuggestdoctorPage } from '../pages/suggestdoctor/suggestdoctor';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CommonProvider } from '../providers/common/common';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Api } from '../providers/api/api';
import { AccountPage } from '../pages/account/account';
import { AddmemberPage } from '../pages/addmember/addmember';
import { TutorialPage } from '../pages/tutorial/tutorial';


@NgModule({
  declarations: [
    MyApp,
    GetstartedPage,
    HomePage,
    TabsPage,
    SigninPage,
    LivefeedPage,
    HistoryPage,
    ClinicsPage,
    LocationsPage,
    SuggestdoctorPage,
    DoctorsPage,
    AppoinmentPage,
    SelectPage,
    TommorowPage,
    TodayPage,
    FeedbackPage,
    IonRating,
    ApoinmentconfirmPage,
    AppoinmentstatusPage,
    MystatusPage,
    AccountPage,
    AddmemberPage,
    TutorialPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      scrollAssist: false, 
      autoFocusAssist: false
    }),
    HttpClientModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetstartedPage,
    HomePage,
    TabsPage,
    SigninPage,
    LivefeedPage,
    HistoryPage,
    ClinicsPage,
    LocationsPage,
    SuggestdoctorPage,
    DoctorsPage,
    AppoinmentPage,
    SelectPage,
    TommorowPage,
    TodayPage,
    FeedbackPage,
    ApoinmentconfirmPage,
    AppoinmentstatusPage,
    MystatusPage,
    AccountPage,
    AddmemberPage,
    TutorialPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    Network,
    Geolocation,
    NativeGeocoder, 
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CommonProvider,
    Api,
  ]
})
export class AppModule { }
