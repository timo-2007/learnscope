import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  IonCardHeader, IonItem, IonLabel, IonInput,
  IonButton, IonContent, IonHeader, IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [IonItem, IonLabel, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, FormsModule],
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');

  async login() {
    const { error } = await this.auth.login(this.email, this.password);
    if (error) {
      this.error.set(error.message);
      return;
    }
    this.router.navigateByUrl('/tabs/admin');
  }
}
