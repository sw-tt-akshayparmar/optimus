import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoaderService } from '../../services/loader.service';
import LoaderActions from '../../enums/loader.enum';
import { ToastService } from '../../services/toast.service';
import { Exception } from '../../exception/app.exception';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    MatFormField,
    MatInput,
    MatLabel,
    MatPrefix,
    MatIcon,
    MatButton,
    MatError,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastService,
    protected loaders: LoaderService,
    protected router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      try {
        this.loaders.enable(LoaderActions.LOG_IN);
        this.userService.login(this.loginForm.value).subscribe({
          next: (user) => {
            this.loaders.disable(LoaderActions.LOG_IN);
            this.toast.success(`Login Successful`, `Welcome back ${user.name}`);
            this.loginForm.reset();
            this.router.navigate(['']);
          },
          error: (error: Exception) => {
            this.loaders.disable(LoaderActions.LOG_IN);
            this.toast.error(`Login Failed`, error.message);
          },
        });
      } catch (error: Exception | Error | any) {
        this.loaders.disable(LoaderActions.LOG_IN);
        this.toast.error(`Login Failed`, error.message);
      }
    }
  }
  getError(controlName: string): string | null {
    const control = this.loginForm.get(controlName);
    if (!control) return null;
    if (control.hasError('required')) return `${controlName} is required`;
    return null;
  }

  protected readonly LoaderActions = LoaderActions;
}
