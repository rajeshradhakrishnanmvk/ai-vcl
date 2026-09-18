import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VclButtonComponent } from './button.component';

describe('VclButtonComponent', () => {
  let component: VclButtonComponent;
  let fixture: ComponentFixture<VclButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VclButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VclButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked when not disabled', () => {
    const emitted: MouseEvent[] = [];
    fixture.componentRef.setInput('disabled', false);
    component.clicked.subscribe(e => emitted.push(e));
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();

    expect(emitted.length).toBe(1);
  });

  it('should not emit clicked when disabled', () => {
    const emitted: MouseEvent[] = [];
    fixture.componentRef.setInput('disabled', true);
    component.clicked.subscribe(e => emitted.push(e));
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();

    expect(emitted.length).toBe(0);
  });

  it('should set aria-label', () => {
    fixture.componentRef.setInput('ariaLabel', 'Save document');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Save document');
  });

  it('should apply variant class', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.className).toContain('vcl-button--danger');
  });
});
