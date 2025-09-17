import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  success(summary: string, detail: string, life: number = 3000) {}

  error(summary: string, detail: string, life: number = 3000) {}

  info(summary: string, detail: string, life: number = 3000) {}

  warn(summary: string, detail: string, life: number = 3000) {}
}
