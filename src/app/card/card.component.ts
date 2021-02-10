import { Component, OnInit, Input } from "@angular/core";
import { TaskService } from "../services/task-service.service";
import * as moment from 'moment'
import { SnackbarService } from "ngx-snackbar";
@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  @Input() users: any
  filterData: any;
  tasks: any = [];
  searchRecords = [];
  newTask: any;
  constructor(private taskSrc: TaskService, private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.users = this.taskSrc.users;
    this.newTask = {
      message: '',
      assigned_to: '',
      due_date: '',
      priority: 0
    }
    this.getTaskList();
  }

  getTaskList() {
    this.taskSrc.getTaskList().subscribe(data => {
      this.tasks = data.tasks;
      this.tasks.map(x => x.due_date = moment(x.due_date).format('DD-MMM-YYYY'));
      this.tasks = this.tasks.sort((d1, d2) => new Date(d1.due_date).getTime() - new Date(d2.due_date).getTime());
      this.searchRecords = this.tasks;
    });
  }

  addCard() {
    this.tasks.push(this.newTask)
  }

  addNewTask(task) {
    task.due_date = moment(new Date(task.due_date)).format("YYYY-MM-DD HH:mm:ss");
    let formData = new FormData();
    Object.keys(task).map(key => formData.append(key, task[key]))
    this.taskSrc.createTask(formData).subscribe(res => {
      if (res.status == "success" && res.taskid) {
        task.id = res.taskid
        task.assigned_name = this.users.filter(x => x.id == task.assigned_name)[0];
        this.snackbarService.add({
          msg: 'Record Added Successfully.',
          timeout: 3000,
          action: {
            text: '',
            onClick: (snack) => {
              console.log('dismissed: ' + snack.id);
            },
          }
        });
      }
    })
  }

  deleteTask(id) {
    if (id) {
      if (confirm("Are you sure, You wan't to delete this record?")) {
        let formData = new FormData();
        formData.append("taskid", id);
        this.taskSrc.deleteTask(formData).subscribe(res => {
          if (res.status == "success") {
            this.tasks = this.tasks.filter(x => x.id != id);
            this.snackbarService.add({
              msg: 'Record Deleted Successfully.',
              timeout: 3000,
              action: {
                text: '',
                onClick: (snack) => {
                  console.log('dismissed: ' + snack.id);
                },
              }
            });
          }
        })
      }
    }
  }

  updateTask(task) {
    task.due_date = moment(new Date(task.due_date)).format("YYYY-MM-DD HH:mm:ss");
    let formData = new FormData();
    Object.keys(task).map(key => {
      if (key === "id") {
        formData.append("taskid", task[key]);
      } else {
        formData.append(key, task[key])
      }
    })
    this.taskSrc.updateTask(formData).subscribe(res => {
      if (res.status == "success" && res.taskid) {
        task.id = res.taskid
        this.snackbarService.add({
          msg: 'Record Updated Successfully.',
          timeout: 3000,
          action: {
            text: '',
            onClick: (snack) => {
              console.log('dismissed: ' + snack.id);
            },
          }
        });
      }
    })
  }

  filterRecords() {
    this.tasks = this.searchRecords;
    this.tasks = this.tasks.filter(x => x.assigned_name.toLowerCase().indexOf(this.filterData.toLowerCase()) != -1)
  }
}
