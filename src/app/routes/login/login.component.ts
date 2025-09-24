import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { Button } from 'primeng/button';
import { LoaderService } from '../../services/loader.service';
import LoaderActions from '../../enums/loader.enum';
import { ToastService } from '../../services/toast.service';
import { Exception } from '../../exception/app.exception';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { Tooltip } from 'primeng/tooltip';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { LoginModel } from '../../models/Auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputText,
    InputGroup,
    Button,
    NgOptimizedImage,
    FloatLabel,
    Tooltip,
    IconField,
    InputIcon,
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
      this.loaders.enable(LoaderActions.LOG_IN);
      this.userService.login(this.loginForm.value as LoginModel).subscribe({
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
    } else {
      this.toast.error('Validation(s) Failed', 'Please enter valid username and password');
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
