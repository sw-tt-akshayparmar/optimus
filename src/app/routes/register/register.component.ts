import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
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
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputText,
    InputGroup,
    Button,
    NgOptimizedImage,
    FloatLabel,
    InputGroupAddon,
    Message,
  ],
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
    this.regForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9_.]+$/),
          ],
        ],
        name: [
          '',
          [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z ]+$/)],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordCfm: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  // ✅ Custom Validator
  private passwordsMatchValidator: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('passwordCfm')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  };

  // ✅ Helper for error messages
  getError(controlName: string): string | null {
    const control = this.regForm.get(controlName);

    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `${controlName} must be at least ${requiredLength} characters long`;
    }
    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength'].requiredLength;
      return `${controlName} cannot exceed ${requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'username')
        return 'Username can only contain letters, numbers, and underscores';
      if (controlName === 'name') return 'Name can only contain alphabets and spaces';
    }
    if (this.regForm.hasError('passwordMismatch') && controlName === 'passwordCfm') {
      return 'Password and Confirm Password do not match';
    }

    return null;
  }

  onSubmit() {
    if (this.regForm.valid) {
      try {
        this.loaders.enable(LoaderActions.SIGN_IN);
        this.userService.register(this.regForm.value).subscribe({
          next: (user) => {
            this.loaders.disable(LoaderActions.SIGN_IN);
            this.toast.success(`Registration Successful`, `Welcome ${user.name}!`);
            this.regForm.reset();
            this.router.navigate(['']);
          },
          error: (error: Exception) => {
            this.loaders.disable(LoaderActions.SIGN_IN);
            this.toast.error(`Registration Failed`, error.message);
          },
        });
      } catch (error: Exception | Error | any) {
        this.loaders.disable(LoaderActions.SIGN_IN);
        this.toast.error(`Registration Failed`, error.message);
      }
    } else {
      this.toast.error(`Validation(s) Failed`, `Please enter valid details`);
    }
  }

  protected readonly LoaderActions = LoaderActions;
}
