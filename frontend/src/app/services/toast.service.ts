import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  show(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    title?: string,
    durationMs: number = 4000
  ): void {
    const id = ++this.counter;
    const toast: ToastMessage = { id, type, title, message };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  success(message: string, title?: string): void {
    this.show('success', message, title || 'Success');
  }

  error(message: string, title?: string): void {
    this.show('error', message, title || 'Notice');
  }

  info(message: string, title?: string): void {
    this.show('info', message, title || 'Information');
  }

  warning(message: string, title?: string): void {
    this.show('warning', message, title || 'Warning');
  }

  remove(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }
}
