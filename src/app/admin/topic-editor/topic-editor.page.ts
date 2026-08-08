import { Component, OnInit, inject, signal, ElementRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
  IonItem, IonLabel, IonInput, IonTextarea, IonSegment, IonSegmentButton, IonModal,
} from '@ionic/angular/standalone';
import { ContentService } from '../../core/content.service';
import { renderMarkdown, typesetMath, retypesetMath } from '../../core/markdown';

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.page.html',
  styleUrls: ['./topic-editor.page.scss'],
  imports: [
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
    IonItem, IonLabel, IonInput, IonTextarea, IonSegment, IonSegmentButton, IonModal,
  ],
})
export class TopicEditorPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private sanitizer = inject(DomSanitizer);
  private previewEl = viewChild<ElementRef<HTMLElement>>('previewContent');
  private textareaRef = viewChild<IonTextarea>('contentTextarea');
  private formulaPreviewEl = viewChild<ElementRef<HTMLElement>>('formulaPreview');

  private topicId = this.route.snapshot.paramMap.get('topicId');
  private subjectId = this.route.snapshot.paramMap.get('subjectId');
  isNew = !this.topicId;

  title = signal('');
  content = signal('');
  mode = signal<'write' | 'preview'>('write');
  preview = signal<SafeHtml>('');

  formulaModalOpen = signal(false);
  formulaSource = signal('');
  private formulaDebounce?: ReturnType<typeof setTimeout>;

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

  async insertAtCursor(before: string, after = '') {
    const textarea = await this.textareaRef()?.getInputElement();
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const value = this.content();
    const selected = value.slice(start, end);

    this.content.set(value.slice(0, start) + before + selected + after + value.slice(end));

    setTimeout(() => {
      const cursor = start + before.length + selected.length;
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  openFormulaEditor() {
    this.formulaSource.set('');
    this.formulaModalOpen.set(true);
    setTimeout(() => this.renderFormulaPreview());
  }

  onFormulaInput(value: string) {
    this.formulaSource.set(value);
    clearTimeout(this.formulaDebounce);
    this.formulaDebounce = setTimeout(() => this.renderFormulaPreview(), 200);
  }

  private renderFormulaPreview() {
    const el = this.formulaPreviewEl()?.nativeElement;
    if (!el) return;
    el.textContent = this.formulaSource().trim() ? `$$${this.formulaSource()}$$` : '';
    retypesetMath(el);
  }

  insertFormula() {
    const formula = this.formulaSource().trim();
    if (formula) {
      this.insertAtCursor(`$${formula}$`);
    }
    this.formulaModalOpen.set(false);
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
