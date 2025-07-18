import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../Services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Employee } from '../../Models/employee';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEdit = false;
  feedback = '';
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['']
    });
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.employeeId = +id;
        this.employeeService.getEmployee(this.employeeId).subscribe({
          next: (emp) => this.employeeForm.patchValue({
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            position: emp.position,
            department: emp.department
          }),
          error: () => this.feedback = 'Failed to load employee.'
        });
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;
    const employee: Employee = { ...this.employeeForm.value, id: this.employeeId ?? 0 };
    if (this.isEdit && this.employeeId) {
      this.employeeService.updateEmployee(employee).subscribe({
        next: () => {
          this.feedback = 'Employee updated successfully.';
          setTimeout(() => this.router.navigate(['/employees']), 1000);
        },
        error: () => this.feedback = 'Failed to update employee.'
      });
    } else {
      console.log(employee);
      this.employeeService.addEmployee(employee).subscribe({
        next: () => {
          this.feedback = 'Employee added successfully.';
          setTimeout(() => this.router.navigate(['/employees']), 1000);
        },
        error: (err) => {
          console.log(err);
          this.feedback = 'Failed to add employee.'}
      });
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
