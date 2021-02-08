import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: "root"
})
export class TaskService {
  url = environment.appUrl;
  users = [];
  constructor(private http: HttpClient) { }

  getUserList(): Observable<any> {
    return this.http.get(this.url + 'listusers');
  }

  setUsers(data) {
    this.users = data;
  }

  getUsers() {
    return this.users;
  }

  getTaskList(): Observable<any> {
    return this.http.get(this.url + 'list');
  }

  createTask(data): Observable<any> {
    return this.http.post(this.url + 'create', data);
  }

  updateTask(data): Observable<any> {
    return this.http.post(this.url + 'update', data);
  }

  deleteTask(data): Observable<any> {
    return this.http.post(this.url + 'delete', data);
  }

}
