import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton,
  IonList, IonItem, IonLabel,
} from '@ionic/angular/standalone';
import { AuthButtonComponent } from '../../core/auth-button.component';
import { ContentService, Topic } from '../../core/content.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  imports: [
    RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton,
    IonList, IonItem, IonLabel,
    AuthButtonComponent,
  ],
})
export class TopicsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);

  moduleId = this.route.snapshot.paramMap.get('moduleId')!;
  subjectId = this.route.snapshot.paramMap.get('subjectId')!;
  topics = signal<Topic[]>([]);

  ngOnInit() {
    this.content.getTopics(this.subjectId).then(({ data }) => {
      this.topics.set(data ?? []);
    });
  }
}
