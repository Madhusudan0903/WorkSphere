import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { Observable } from 'rxjs';
import { Employee, Project, ProjectEmployee } from '../../model/Employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-project',
  imports: [NgIf, ReactiveFormsModule, NgFor, AsyncPipe, DatePipe, FormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  @ViewChild("myModal") employeeModal: ElementRef | undefined;
  currentView: string = "List";
  isEditMode: boolean = false;

  projectForm: FormGroup = new FormGroup({});
  projectEmployee: ProjectEmployee = new ProjectEmployee();

  employeeService = inject(EmployeeService);
  projectList: Project[] = [];
  projectEmployeeList: ProjectEmployee[] = [];

  employeeData$: Observable<Employee[]> = new Observable<Employee[]>();

  constructor() {
    this.initializeForm();
    this.employeeData$ = this.employeeService.getEmployees();
  }

  ngOnInit(): void {
    this.currentView = "List";
    this.getAllProject();
  }

  onAddEmployees(id: number) {
    this.getAllProjectEmployee(id);
    this.projectEmployee.projectId = id;
    if (this.employeeModal) {
      this.employeeModal.nativeElement.style.display = 'block';
    }
  }

  closeModal() {
    if (this.employeeModal) {
      this.employeeModal.nativeElement.style.display = 'none';
    }
  }

  onEdit(projectData: Project) {
    this.initializeForm(projectData);
  }

  initializeForm(project?: Project) {
    this.projectForm = new FormGroup({
      projectId: new FormControl(project ? project.projectId : 0),
      projectName: new FormControl(project ? project.projectName : ""),
      clientName: new FormControl(project ? project.clientName : ""),
      startDate: new FormControl(project ? project.startDate : ""),
      leadByEmpId: new FormControl(project ? project.leadByEmpId : ""),
      contactPerson: new FormControl(project ? project.contactPerson : ""),
      contactNo: new FormControl(project ? project.contactNo : ""),
      emailId: new FormControl(project ? project.emailId : "")
    });
    this.isEditMode = !!project; // If project exists, we are in edit mode
    this.currentView = "Create"
  }

  onSaveProject() {
    const formValue = this.projectForm.value;
    if (formValue.projectId == 0) {
      this.employeeService.createNewProject(formValue).subscribe((res: Project) => {
        alert("Project Created Successfully")
        this.getAllProject();
      }, error => {

      })
    } else {
      this.employeeService.updateProject(formValue).subscribe((res: Project) => {
        alert("Project Updated Successfully")
        this.getAllProject();
      }, error => {

      })
    }

  }

  onAddEmp() {
    this.employeeService.addNewProjectEmployee(this.projectEmployee).subscribe((res: ProjectEmployee) => {
      alert("Employee Added to project")
      this.getAllProjectEmployee(this.projectEmployee.projectId);
    }, error => {

    })
  }

  getAllProjectEmployee(id: number) {
    this.employeeService.GetProjectEmployee().subscribe((res: ProjectEmployee[]) => {
      const record = res.filter(m => m.projectId == id);
      this.projectEmployeeList = record;
      //alert("Project Created Successfully")
    }, error => {

    })
  }

  getAllProject() {
    this.employeeService.getProjects().subscribe((res: Project[]) => {
      this.projectList = res;
    }, error => {

    })
  }

  onDeleteProject(projectId: number) {
    if (confirm("Are you sure you want to delete this project?")) {
      this.employeeService.deleteProject(projectId).subscribe(() => {
        alert("Project Deleted Successfully");
        this.getAllProject(); // Refresh the project list
      }, error => {
        console.error("Error deleting project", error);
      });
    }
  }

}
