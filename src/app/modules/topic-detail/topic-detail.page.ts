import { Component, OnInit, inject, signal, ElementRef, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton,
} from '@ionic/angular/standalone';
import { AuthButtonComponent } from '../../core/auth-button.component';
import { ContentService } from '../../core/content.service';
import { renderMarkdown, typesetMath } from '../../core/markdown';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.page.html',
  styleUrls: ['./topic-detail.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton,
    AuthButtonComponent,
  ],
})
export class TopicDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private sanitizer = inject(DomSanitizer);
  private contentEl = viewChild<ElementRef<HTMLElement>>('renderedContent');

  moduleId = this.route.snapshot.paramMap.get('moduleId')!;
  subjectId = this.route.snapshot.paramMap.get('subjectId')!;
  topicId = this.route.snapshot.paramMap.get('topicId')!;

  title = signal('');
  html = signal<SafeHtml>('');

  ngOnInit() {
    this.content.getTopic(this.topicId).then(({ data }) => {
      if (!data) return;
      this.title.set(data.title);
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(data.content)));

      setTimeout(() => {
        const el = this.contentEl()?.nativeElement;
        if (el) typesetMath(el);
      });
    });
  }
}
