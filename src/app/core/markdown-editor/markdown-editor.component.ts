import { Component, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, viewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Vditor from 'vditor';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonItem, IonInput, IonContent,
} from '@ionic/angular/standalone';
import { retypesetMath } from '../markdown';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [FormsModule, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonItem, IonInput, IonContent],
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
})
export class MarkdownEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  private editorEl = viewChild.required<ElementRef<HTMLDivElement>>('editorEl');
  private formulaPreviewEl = viewChild<ElementRef<HTMLElement>>('formulaPreview');
  private vditor?: Vditor;
  private ready = false;
  private lastEmitted = '';

  formulaModalOpen = signal(false);
  formulaSource = signal('');
  private formulaDebounce?: ReturnType<typeof setTimeout>;

  ngAfterViewInit() {
    this.vditor = new Vditor(this.editorEl().nativeElement, {
      height: 420,
      mode: 'ir',
      lang: 'de_DE',
      theme: 'dark',
      preview: {
        theme: { current: 'dark' },
        math: {
          engine: 'MathJax',
          inlineDigit: true,
        },
        actions: [],
      },
      toolbar: [
        'headings', 'bold', 'italic', 'strike', 'link', '|',
        'quote', 'code', 'inline-code', '|',
        {
          name: 'formula',
          tip: 'Formel einfügen',
          icon: '<svg viewBox="0 0 32 32"><text x="16" y="24" text-anchor="middle" font-size="26" fill="currentColor">∑</text></svg>',
          click: () => this.openFormulaEditor(),
        },
        '|',
        'edit-mode', 'preview',
      ],
      cache: { enable: false },
      after: () => {
        this.ready = true;
        this.vditor?.setValue(this.value);
      },
      input: (val: string) => {
        this.lastEmitted = val;
        this.valueChange.emit(val);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.ready && this.value !== this.lastEmitted) {
      this.vditor?.setValue(this.value);
    }
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
      this.vditor?.insertValue(`$${formula}$`);
    }
    this.formulaModalOpen.set(false);
  }

  ngOnDestroy() {
    this.vditor?.destroy();
  }
}
