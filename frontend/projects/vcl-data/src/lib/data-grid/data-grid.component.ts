import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerDataSource, CustomerDto } from '../services/customer-data-source';
import { PagedRequest } from '../models/data-source.model';

export interface GridColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'vcl-data-grid',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="vcl-data-grid">
      <div class="vcl-data-grid__toolbar">
        <input
          class="vcl-data-grid__search"
          type="search"
          placeholder="Search..."
          [ngModel]="filterValue()"
          (ngModelChange)="onFilterChange($event)"
          aria-label="Filter data" />
        <span class="vcl-data-grid__count">
          {{ totalCount() }} item{{ totalCount() === 1 ? '' : 's' }}
        </span>
      </div>

      @if (loading()) {
        <div class="vcl-data-grid__loading" aria-busy="true" aria-label="Loading data">
          <div class="vcl-data-grid__spinner"></div>
        </div>
      } @else if (error()) {
        <div class="vcl-data-grid__error" role="alert">{{ error() }}</div>
      } @else {
        <div class="vcl-data-grid__scroll-container">
          <table class="vcl-data-grid__table" role="grid">
            <thead>
              <tr>
                @for (col of columns(); track col.key) {
                  <th
                    scope="col"
                    [attr.aria-sort]="getSortState(col.key)"
                    [class.vcl-data-grid__th--sortable]="col.sortable"
                    (click)="col.sortable && onSortChange(col.key)">
                    {{ col.label }}
                    @if (col.sortable) {
                      <span class="vcl-data-grid__sort-icon" aria-hidden="true">
                        {{ sortColumn() === col.key ? (sortDesc() ? '↓' : '↑') : '⇅' }}
                      </span>
                    }
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @if (rows().length === 0) {
                <tr>
                  <td [attr.colspan]="columns().length" class="vcl-data-grid__empty">
                    No data found.
                  </td>
                </tr>
              }
              @for (row of rows(); track row.id) {
                <tr class="vcl-data-grid__row">
                  @for (col of columns(); track col.key) {
                    <td>{{ getCell(row, col.key) }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="vcl-data-grid__pagination">
          <button
            type="button"
            [disabled]="currentPage() === 1"
            (click)="goToPage(currentPage() - 1)"
            aria-label="Previous page">
            &lsaquo;
          </button>
          <span class="vcl-data-grid__page-info">
            Page {{ currentPage() }} of {{ totalPages() }}
          </span>
          <button
            type="button"
            [disabled]="currentPage() >= totalPages()"
            (click)="goToPage(currentPage() + 1)"
            aria-label="Next page">
            &rsaquo;
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './data-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclDataGridComponent implements OnInit {
  readonly columns = input<GridColumn[]>([
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'createdAt', label: 'Created' }
  ]);
  readonly pageSize = input(20);

  protected readonly rows = signal<CustomerDto[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalCount = signal(0);
  protected readonly currentPage = signal(1);
  protected readonly filterValue = signal('');
  protected readonly sortColumn = signal<string | null>(null);
  protected readonly sortDesc = signal(false);

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize()))
  );

  private filterTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly dataSource: CustomerDataSource) {}

  ngOnInit(): void {
    void this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    const sortKey = this.sortColumn();
    const query: PagedRequest = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      sort: sortKey ? `${sortKey}${this.sortDesc() ? '_desc' : ''}` : undefined,
      filter: this.filterValue() || undefined
    };

    this.dataSource.load(query).subscribe({
      next: result => {
        this.rows.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: err => {
        this.error.set('Failed to load data. Please try again.');
        this.loading.set(false);
        console.error('[VclDataGrid] Load error:', err);
      }
    });
  }

  onFilterChange(value: string): void {
    this.filterValue.set(value);
    this.currentPage.set(1);
    if (this.filterTimer) clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => void this.loadData(), 300);
  }

  onSortChange(key: string): void {
    if (this.sortColumn() === key) {
      this.sortDesc.update(d => !d);
    } else {
      this.sortColumn.set(key);
      this.sortDesc.set(false);
    }
    void this.loadData();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    void this.loadData();
  }

  getSortState(key: string): string | null {
    if (this.sortColumn() !== key) return null;
    return this.sortDesc() ? 'descending' : 'ascending';
  }

  getCell(row: CustomerDto, key: string): string {
    const val = (row as unknown as Record<string, unknown>)[key];
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' && key === 'createdAt') {
      return new Date(val).toLocaleDateString();
    }
    return String(val);
  }
}
