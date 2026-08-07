import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, libraryOutline, lockClosedOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { AuthService } from '../core/auth.service';

addIcons({ homeOutline, libraryOutline });

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  auth = inject(AuthService);

  constructor() {
    addIcons({ homeOutline });
    addIcons({ libraryOutline });
    addIcons({ shieldCheckmarkOutline });
    addIcons({ lockClosedOutline })
  }
}
