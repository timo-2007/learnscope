import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../core/auth.service';
import { RouterLink } from '@angular/router';
import { IonButtons, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, logOutOutline } from 'ionicons/icons'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterLink],
})
export class HomePage {
  auth = inject(AuthService);

  constructor() {
    addIcons({ lockClosedOutline, logOutOutline });
  }

  logout() {
    this.auth.logout();
  }
}
