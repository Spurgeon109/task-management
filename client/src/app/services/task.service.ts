import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Task, TaskAddReq } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getListofTasks(): Observable<any>{
    const url = environment.apiUrl
    return this.http.get(`${url}get-list`)
  }

  addTask(body: TaskAddReq): Observable<any>{
    const url = environment.apiUrl
    return this.http.post(`${url}add-task`, body)
  }

  editTask(body: Task): Observable<any>{
    const url = environment.apiUrl
    return this.http.post(`${url}update-task`, body)
  }

  deleteTask(id: string): Observable<any>{
    const url = environment.apiUrl
    return this.http.delete(`${url}delete-task/${id}`)
  }
}
