import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

@Component({
  selector: 'vcl-stack',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vcl-stack',
    '[style.flex-direction]': 'direction()',
    '[style.gap]': 'gap()',
    '[style.align-items]': 'alignItems()',
    '[style.justify-content]': 'justifyContentValue()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : "nowrap"',
  }
})
export class VclStackComponent {
  readonly direction = input<StackDirection>('column');
  readonly gap = input<string>('var(--vcl-space-4)');
  readonly align = input<StackAlign>('stretch');
  readonly justify = input<StackJustify>('start');
  readonly wrap = input(false);

  get alignItems(): () => string {
    const map: Record<StackAlign, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch'
    };
    return () => map[this.align()];
  }

  get justifyContentValue(): () => string {
    const map: Record<StackJustify, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly'
    };
    return () => map[this.justify()];
  }
}
