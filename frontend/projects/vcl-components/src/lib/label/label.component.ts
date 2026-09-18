import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LabelSize = 'sm' | 'base' | 'lg';

@Component({
  selector: 'vcl-label',
  standalone: true,
  template: `
    <label
      class="vcl-label vcl-label--{{ size() }}"
      [attr.for]="for() ?? null"
      [class.vcl-label--required]="required()">
      <ng-content />
      @if (required()) {
        <span class="vcl-label__required" aria-hidden="true"> *</span>
      }
    </label>
  `,
  styleUrl: './label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclLabelComponent {
  readonly for = input<string | null>(null);
  readonly required = input(false);
  readonly size = input<LabelSize>('base');
}
