import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'
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
  private router = inject(Router);

  private titles: Record<string, string> = {
    home: 'Home',
    modules: 'Modules',
    admin: 'Admin',
  }

  currentTitle = signal('Home');

  constructor() {
    addIcons({ homeOutline, libraryOutline, shieldCheckmarkOutline, lockClosedOutline, logOutOutline });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const segment = this.router.url.split('/')[2];
        this.currentTitle.set(this.titles[segment] ?? '');
      });
  }

  logout() {
    this.auth.logout();
  }
}
