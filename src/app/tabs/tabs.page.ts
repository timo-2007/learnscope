import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, libraryOutline, lockClosedOutline, logOutOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  imports: [
    RouterLink,
    IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  ],
})
export class TabsPage {
  auth = inject(AuthService);

  constructor() {
    addIcons({ homeOutline, libraryOutline, shieldCheckmarkOutline, lockClosedOutline, logOutOutline });
  }

  logout() {
    this.auth.logout();
  }
}
