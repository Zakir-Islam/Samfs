import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { baseApiURL } from '../Core/Constants/constant';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Intercepting request:', req.url); // Debugging
  const authService = inject(AuthService);
  const router = inject(Router);
  
  let token = authService.isAuthenticated();
  // Get the user's timezone

  const headers = {
    ...(token && req.url.startsWith(baseApiURL) ? { Authorization: `Bearer ${token}` } : {})
  };
  
  const clonedReq = req.clone({
    setHeaders: headers
  });

  return next(clonedReq).pipe(
    catchError((e: HttpErrorResponse) => {
      debugger;
      // if(e.status===0){
      //   router.navigate(['/site-under-maintenance']);
      // }
      const error = e.error?.message || e.statusText;
      return throwError(() => new Error(error));
    })
  );
};
