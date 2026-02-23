import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  success(summary: string, detail: string, life: number = 3000, key?: string) {

  }

  error(summary: string, detail: string, life: number = 3000, key?: string) {

  }

  info(summary: string, detail: string, life: number = 3000, key?: string) {

  }

  warn(summary: string, detail: string, life: number = 3000, key?: string) {

  }
}
