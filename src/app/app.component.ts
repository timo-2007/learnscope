import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonMenuToggle,
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel,
  IonButtons, IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, libraryOutline, shieldCheckmarkOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink, RouterLinkActive,
    IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonMenuToggle,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel,
    IonButtons, IonButton,
  ],
})
export class AppComponent {
  auth = inject(AuthService);
  menuCollapsed = signal(false);

  constructor() {
    addIcons({ homeOutline, libraryOutline, shieldCheckmarkOutline, chevronBackOutline, chevronForwardOutline });
  }
}
