import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { LivefeedPage } from '../livefeed/livefeed';
import { HistoryPage } from '../history/history';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	tabBarElement:any;	
  tab1Root = HomePage;
  tab2Root = LivefeedPage;
  tab3Root = HistoryPage;
  tab4Root = AccountPage;

  constructor() {
  	this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }
  // ionViewWillEnter() {
  //   this.tabBarElement.style.display = 'flex';
  // }
}
