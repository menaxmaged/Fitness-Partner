import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  property: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'custom';
  format?: (value: any) => string;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showPagination: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() customRowTemplate: any;
  @Input() emptyMessage: string = 'No data available';

  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();

  // Pagination variables
  currentPage: number = 1;
  filteredData: any[] = [];
  displayData: any[] = [];
  totalItems: number = 0;
  searchTerm: string = '';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['searchTerm']) {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    // First apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.data.filter(item => {
        // Search in all properties
        return Object.keys(item).some(key => {
          const value = item[key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        });
      });
    } else {
      this.filteredData = [...this.data];
    }

    // Then apply sorting
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const valueA = a[this.sortColumn as string];
        const valueB = b[this.sortColumn as string];

        if (valueA === valueB) return 0;
        
        const comparison = valueA < valueB ? -1 : 1;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Update total count and pagination
    this.totalItems = this.filteredData.length;
    this.updateDisplayData();
  }

  updateDisplayData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayData = this.filteredData.slice(start, end);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1; // Reset to first page
    this.applyFilters();
  }

  sort(column: TableColumn): void {
    if (!column.sortable) return;
    
    if (this.sortColumn === column.property) {
      // Toggle sort direction if it's the same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new sort column and reset direction to asc
      this.sortColumn = column.property;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayData();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1; // Reset to first page
    this.updateDisplayData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pageNumbers(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    
    // If total pages <= 5, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always include current page and 1 page before and after
    const pages = [currentPage];
    if (currentPage > 1) pages.unshift(currentPage - 1);
    if (currentPage < totalPages) pages.push(currentPage + 1);
    
    // Add ellipsis and first/last page indicators
    if (currentPage > 2) pages.unshift(-1); // Ellipsis
    if (currentPage < totalPages - 1) pages.push(-1); // Ellipsis
    
    if (currentPage > 1) pages.unshift(1); // First page
    if (currentPage < totalPages) pages.push(totalPages); // Last page
    
    return pages;
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onActionClick(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }

  getFormattedValue(row: any, column: TableColumn): any {
    const value = row[column.property];
    
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (column.format) {
      return column.format(value);
    }
    
    switch (column.type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  }
}