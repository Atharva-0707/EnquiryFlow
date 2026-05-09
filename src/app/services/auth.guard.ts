import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('enquiryApp') !== null;

  if (isLoggedIn) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
