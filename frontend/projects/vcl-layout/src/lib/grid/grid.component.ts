import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'vcl-grid',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vcl-grid',
    '[style.grid-template-columns]': 'columns()',
    '[style.gap]': 'gap()',
    '[style.align-items]': 'align()',
  }
})
export class VclGridComponent {
  readonly columns = input<string>('repeat(auto-fill, minmax(200px, 1fr))');
  readonly gap = input<string>('var(--vcl-space-4)');
  readonly align = input<string>('start');
}
