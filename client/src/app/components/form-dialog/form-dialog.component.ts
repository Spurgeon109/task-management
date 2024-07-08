import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatSelectModule, 
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  newTaskFg: FormGroup = this.fb.group({
    title: '',
    description: '',
    status: 'To Do'
  });
  statusOptions = ["To Do", "In Progress", 'Done']
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialogRef<FormDialogComponent>
  ){
    if(this.data.initData) this.reset()
  }
  submit(){
    this.matDialog.close({status: "success", value: this.newTaskFg.value})
  }
  reset(){
    if(this.data.initData){
      this.newTaskFg.patchValue({'title': this.data.initData.title})
      this.newTaskFg.patchValue({'description': this.data.initData.description})
      this.newTaskFg.patchValue({'status': this.data.initData.status})
    }
    else this.newTaskFg.reset()
  }
}
