import { Component, OnInit } from '@angular/core';
import { Employee } from '../../Models/employee';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../Services/employee.service';

@Component({
  selector: 'app-employee-list',
    standalone: true,
  imports: [RouterModule, CommonModule, FormsModule ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  loading = false;
  error = '';

  // Search/filter
  searchTerm: string = '';
  get filteredEmployees(): Employee[] {
    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      (emp.firstName?.toLowerCase().includes(term) || '') ||
      (emp.lastName?.toLowerCase().includes(term) || '') ||
      (emp.email?.toLowerCase().includes(term) || '') ||
      (emp.position?.toLowerCase().includes(term) || '') ||
      (emp.department?.toLowerCase().includes(term) || '')
    );
  }

  // Pagination
  pageSize: number = 2;
  currentPage: number = 1;
  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
  }
  get paginatedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchEmployees();
    }
  }

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.loading = true;
    this.employeeService.getEmployees(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        // Map API response to Employee[]
        this.employees = (data.employees || []).map((emp: any) => ({
          id: emp.id,
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email,
          position: emp.position,
          department: emp.department || ''
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employees.';
        this.loading = false;
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== id);
          alert('Employee deleted successfully.');
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
        },
        error: () => {
          alert('Failed to delete employee.');
        }
      });
    }
  }
}
// ...existing code...
