import { Component, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import Vditor from 'vditor';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  template: `<div #editorEl></div>`,
})
export class MarkdownEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  private editorEl = viewChild.required<ElementRef<HTMLDivElement>>('editorEl');
  private vditor?: Vditor;
  private ready = false;
  private lastEmitted = '';

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
        'edit-mode', 'preview', 'fullscreen', 'help',
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

  ngOnDestroy() {
    this.vditor?.destroy();
  }
}
