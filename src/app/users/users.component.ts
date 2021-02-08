import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];
  constructor(private taskSrc: TaskService) { }

  ngOnInit() {
    this.taskSrc.getUserList().subscribe(res => {
      if (res.users) {
        this.users = res.users;
        this.taskSrc.users = this.users
      }
    })
  }

}
