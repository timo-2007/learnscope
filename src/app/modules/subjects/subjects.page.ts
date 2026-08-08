import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton,
  IonList, IonItem, IonLabel,
} from '@ionic/angular/standalone';
import { AuthButtonComponent } from '../../core/auth-button.component';
import { ContentService, Subject } from '../../core/content.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.page.html',
  imports: [
    RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton,
    IonList, IonItem, IonLabel,
    AuthButtonComponent,
  ],
})
export class SubjectsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);

  moduleId = this.route.snapshot.paramMap.get('moduleId')!;
  subjects = signal<Subject[]>([]);

  ngOnInit() {
    this.content.getSubjects(this.moduleId).then(({ data }) => {
      this.subjects.set(data ?? []);
    });
  }
}
