import { Component, inject, OnInit, signal } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { Employee, IApiResponse, IChildDept, IParentDept } from '../../model/Employee';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee',
  imports: [FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  parentDeptList: IParentDept[] = [];
  childDeptList: IChildDept[] = [];
  deptId: number = 0;
  employeeObj: Employee = new Employee();
  employeeList: Employee[] = [];

  masterService = inject(MasterService);
  empService = inject(EmployeeService);

  isSidePanelOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.getParentDeptList();
    this.getEmployees();
  }

  addNew() {
    this.employeeObj = new Employee(); // Reset to empty object
    this.employeeObj.employeeId = 0; // Ensure it's treated as a new entry
    this.isSidePanelOpen.set(true); // Open the side panel
  }


  close() {
    this.isSidePanelOpen.set(false);
  }

  onEdit(obj: Employee) {
    this.employeeObj = { ...obj }; // Clone object to avoid reference issues
    this.isSidePanelOpen.set(true); // Open the side panel
  }


  getEmployees() {
    this.empService.getEmployees().subscribe((res: Employee[]) => {
      this.employeeList = res;
    })
  }

  getParentDeptList() {
    this.masterService.getParentDept().subscribe((res: IApiResponse) => {
      this.parentDeptList = res.data;
    })
  }

  onDeptChange() {
    this.masterService.getChildDeptByParentId(this.deptId).subscribe((res: IApiResponse) => {
      this.childDeptList = res.data;
    })
  }

  onSaveEmp() {
    this.empService.createNewEmployee(this.employeeObj).subscribe((res: Employee) => {
      alert("Employee Created Successfully")
      this.getEmployees();
      this.close();
    }, error => {
      alert("Error from API")
    })
  }

  onUpdateEmp() {
    this.empService.updateEmployee(this.employeeObj).subscribe((res: Employee) => {
      alert("Employee Updated Successfully")
      this.getEmployees();
      this.close();
    }, error => {
      alert("Error from API")
    })
  }

  onDelete(id: number) {
    const result = confirm("Are you sure you want to delete?")
    if (result) {
      this.empService.deleteEmpById(id).subscribe((res: Employee) => {
        alert("Employee Deleted Successfully")
        this.getEmployees();
      }, error => {
        alert("Error from API")
      })
    }

  }
}
