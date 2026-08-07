import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonMenuToggle,
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, libraryOutline, shieldCheckmarkOutline, lockClosedOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink, RouterLinkActive,
    IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonMenuToggle,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel,
  ],
})
export class AppComponent {
  auth = inject(AuthService);

  constructor() {
    addIcons({ homeOutline, libraryOutline, shieldCheckmarkOutline, lockClosedOutline, logOutOutline });
  }

  logout() {
    this.auth.logout();
  }
}
