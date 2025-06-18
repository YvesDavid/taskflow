import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private svc: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1000)]],
      status: ['todo', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        
        this.isEdit = true;
        this.taskId = +params['id'];
        this.svc.getTask(this.taskId).subscribe(t => this.form.patchValue(t));
      }
    });
  }

  submit(): void {
    if (this.form.invalid) { return; }

    const obs = this.isEdit
      ? this.svc.updateTask(this.taskId!, this.form.value)
      : this.svc.createTask(this.form.value);

    obs.subscribe(() => this.router.navigate(['/tasks']));
  }
}