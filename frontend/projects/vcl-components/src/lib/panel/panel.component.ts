import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'vcl-panel',
  standalone: true,
  template: `
    <section
      class="vcl-panel"
      [class.vcl-panel--elevated]="elevated()"
      [attr.aria-label]="title() ?? null">
      @if (title()) {
        <header class="vcl-panel__header">
          <h2 class="vcl-panel__title">{{ title() }}</h2>
          <ng-content select="[vcl-panel-actions]" />
        </header>
      }
      <div class="vcl-panel__body">
        <ng-content />
      </div>
      <ng-content select="[vcl-panel-footer]" />
    </section>
  `,
  styleUrl: './panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclPanelComponent {
  readonly title = input<string | null>(null);
  readonly elevated = input(false);
}
