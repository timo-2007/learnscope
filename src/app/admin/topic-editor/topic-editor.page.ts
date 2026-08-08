import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
  IonItem, IonInput,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { MarkdownEditorComponent } from '../../core/markdown-editor/markdown-editor.component';
import { ContentService } from '../../core/content.service';

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.page.html',
  styleUrls: ['./topic-editor.page.scss'],
  imports: [
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonItem, IonInput,
    MarkdownEditorComponent,
  ],
})
export class TopicEditorPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);

  private topicId = this.route.snapshot.paramMap.get('topicId');
  private subjectId = this.route.snapshot.paramMap.get('subjectId');
  isNew = !this.topicId;

  title = signal('');
  content = signal('');

  ngOnInit() {
    if (this.topicId) {
      this.contentService.getTopic(this.topicId).then(({ data }) => {
        if (!data) return;
        this.title.set(data.title);
        this.content.set(data.content);
        this.subjectId = data.subject_id;
      });
    }
  }

  async save() {
    const title = this.title().trim();
    if (!title) return;

    if (this.isNew) {
      await this.contentService.createTopic(this.subjectId!, title, this.content());
    } else {
      await this.contentService.updateTopic(this.topicId!, title, this.content());
    }
    this.router.navigateByUrl('/admin');
  }
}
