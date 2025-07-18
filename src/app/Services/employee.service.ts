import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../Models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://employeetask.runasp.net/api/employee';

  constructor(private http: HttpClient) {}


  getEmployees(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    // إزالة خاصية id من جسم الطلب عند الإضافة
    const { id, ...employeeData } = employee;
    return this.http.post<Employee>(this.apiUrl, employeeData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`, employee, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
