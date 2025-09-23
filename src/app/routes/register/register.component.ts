import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { Button } from 'primeng/button';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { LoaderService } from '../../services/loader.service';
import LoaderActions from '../../enums/loader.enum';
import { ToastService } from '../../services/toast.service';
import { Exception } from '../../exception/app.exception';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, InputText, InputGroup, Button, InputGroupAddon, NgOptimizedImage],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  regForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastService,
    protected loaders: LoaderService,
    protected router: Router,
  ) {
    this.regForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      password1: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.regForm.valid) {
      try {
        this.loaders.enable(LoaderActions.SIGN_IN);
        this.userService.register(this.regForm.value).subscribe({
          next: (user) => {
            this.loaders.disable(LoaderActions.SIGN_IN);
            this.toast.success(`Login Successful`, `Welcome back ${user.name}`);
            this.regForm.reset();
            this.router.navigate(['']);
          },
          error: (error: Exception) => {
            this.loaders.disable(LoaderActions.SIGN_IN);
            this.toast.error(`Login Failed`, error.message);
          },
        });
      } catch (error: Exception | Error | any) {
        this.loaders.disable(LoaderActions.SIGN_IN);
        this.toast.error(`Login Failed`, error.message);
      }
    }
  }

  protected readonly LoaderActions = LoaderActions;
}
