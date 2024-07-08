import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoaderService } from '../../services/loader.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatTableModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule,
    MatCardModule,
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
    ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy{
  newTaskFg: FormGroup = this.fb.group({
    title: '',
    description: '',
    status: 'To Do'
  });
  statusOptions = ["To Do", "In Progress", 'Done']
  sourceList: Task[] = []
  filteredList: Task[] = []
  titleFilter: string = ''
  statusFilter: string = ''
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder, 
    public loaderService: LoaderService,
    public taskService: TaskService,
    public matDialog: MatDialog
  ){
  }
  ngOnInit(): void {
    this.loaderService.loaderStatus.next(true)
    this.loaderService.loaderText.next("Fetching your tasks")
    this.taskService.getListofTasks().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        this.sourceList = data
        this.filteredList = data
        this.loaderService.loaderStatus.next(false)
      },
      error: (err)=>{
      this.loaderService.loaderStatus.next(false)
      }
    })
  }

  applyFilter(){
    if((!this.titleFilter && !this.statusFilter) || (this.titleFilter.trim() === '' && this.statusFilter.trim() === '')){
      this.filteredList = this.sourceList
      return
    } 
    this.filteredList = this.sourceList.filter(i => {
      const titleFlag = this.titleFilter && this.titleFilter.trim() !== ''?i.title.includes(this.titleFilter):false
      const statusFlag = this.statusFilter && this.statusFilter.trim() !== ''?i.status.includes(this.statusFilter):false
      return titleFlag || statusFlag
    } )
    console.log(this.filteredList)
  }
  addNewTask(){
    const dialogRef  = this.matDialog.open(FormDialogComponent, {
      panelClass: 'task-form-container',
      data: {initData: null}
    })
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        if(data?.status === "success" && data.value){
          this.loaderService.loaderText.next("Adding your task")
          this.taskService.addTask({...data.value, created_time: new Date()}).pipe(takeUntil(this.destroy$)).subscribe({
            next: (data)=>{
              this.loaderService.loaderStatus.next(false)
            },
            error: (err)=>{
              this.loaderService.loaderStatus.next(false)
            }
          })
        }
      }
    })
  }

  editTask(record: Task){
    const dialogRef  = this.matDialog.open(FormDialogComponent, {
      panelClass: 'task-form-container',
      data: {initData: record}
    })
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        debugger
        if(data.status === "success" && data.value){
          this.loaderService.loaderText.next("Editing your task")
          this.taskService.editTask({ ...record, ...data.value}).pipe(takeUntil(this.destroy$)).subscribe({
            next: (data)=>{
              this.loaderService.loaderStatus.next(false)
            },
            error: (err)=>{
              this.loaderService.loaderStatus.next(false)
            }
          })
        }
      }
    })
  }

  deleteTask(task: Task){
    this.loaderService.loaderStatus.next(true)
    this.taskService.deleteTask(task._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data)=>{
        this.loaderService.loaderText.next("Deleting your task")
        this.loaderService.loaderStatus.next(false)
      },
      error: (err)=>{
        this.loaderService.loaderStatus.next(false)
      }
    })
  }

  ngOnDestroy(){
    this.destroy$.next(null)
    this.destroy$.unsubscribe()
  }
}
