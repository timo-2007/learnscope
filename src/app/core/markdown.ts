import { marked } from 'marked';

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements: Element[]) => Promise<void>;
    };
  }
}

/**
 * Shields $...$ and $$...$$ LaTeX segments from marked before parsing,
 * since Markdown would otherwise mangle characters like _ and * inside them.
 * MathJax typesets the raw LaTeX afterwards, once the HTML is in the DOM.
 */
export function renderMarkdown(source: string): string {
  const mathBlocks: string[] = [];
  const shield = (raw: string) => {
    mathBlocks.push(raw);
    return `@@MATH_${mathBlocks.length - 1}@@`;
  };

  const shielded = source
    .replace(/\$\$([\s\S]+?)\$\$/g, (match) => shield(match))
    .replace(/\$([^$\n]+?)\$/g, (match) => shield(match));

  let html = marked.parse(shielded, { async: false }) as string;

  mathBlocks.forEach((math, i) => {
    html = html.replace(`@@MATH_${i}@@`, math);
  });

  return html;
}

export function typesetMath(element: Element): void {
  window.MathJax?.typesetPromise?.([element]);
}
