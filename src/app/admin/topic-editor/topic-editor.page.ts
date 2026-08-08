import { Component, OnInit, inject, signal, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
  IonItem, IonLabel, IonInput, IonTextarea, IonSegment, IonSegmentButton,
} from '@ionic/angular/standalone';
import { ContentService } from '../../core/content.service';
import { renderMarkdown, typesetMath } from '../../core/markdown';

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.page.html',
  styleUrls: ['./topic-editor.page.scss'],
  imports: [
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonItem, IonLabel, IonInput, IonTextarea, IonSegment, IonSegmentButton,
  ],
})
export class TopicEditorPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private sanitizer = inject(DomSanitizer);
  private previewEl = viewChild<ElementRef<HTMLElement>>('previewContent');

  private topicId = this.route.snapshot.paramMap.get('topicId');
  private subjectId = this.route.snapshot.paramMap.get('subjectId');
  isNew = !this.topicId;

  title = signal('');
  content = signal('');
  mode = signal<'write' | 'preview'>('write');
  preview = signal<SafeHtml>('');

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

  setMode(mode: 'write' | 'preview') {
    this.mode.set(mode);
    if (mode === 'preview') {
      this.preview.set(this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(this.content())));
      setTimeout(() => {
        const el = this.previewEl()?.nativeElement;
        if (el) typesetMath(el);
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
