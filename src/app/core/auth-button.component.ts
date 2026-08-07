import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [RouterLink, IonButton, IonIcon],
  template: `
    @if (auth.isLoggedIn()) {
      <ion-button (click)="auth.logout()">
        <ion-icon name="log-out-outline" slot="icon-only"></ion-icon>
      </ion-button>
    } @else {
      <ion-button routerLink="/login">
        <ion-icon name="lock-closed-outline" slot="icon-only"></ion-icon>
      </ion-button>
    }
  `,
})
export class AuthButtonComponent {
  auth = inject(AuthService);

  constructor() {
    addIcons({ lockClosedOutline, logOutOutline });
  }
}
