import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
  IonList, IonItem, IonLabel,
} from '@ionic/angular/standalone';
import { AuthButtonComponent } from '../core/auth-button.component';
import { ContentService, ModuleEntry } from '../core/content.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
  imports: [
    RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
    IonList, IonItem, IonLabel,
    AuthButtonComponent,
  ],
})
export class ModulesPage implements OnInit {
  private content = inject(ContentService);

  modules = signal<ModuleEntry[]>([]);

  ngOnInit() {
    this.content.getModules().then(({ data }) => {
      this.modules.set(data ?? []);
    });
  }
}
