import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonImports } from '../../Global.constant';

@Component({
  selector: 'app-login',
  imports: [CommonImports],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginObj: any = {
    username: '',
    password: ''
  };

  router = inject(Router);

  onLogin(){
    if(this.loginObj.username == 'admin' && this.loginObj.password == 'admin123'){
      alert('Login Success');
      localStorage.setItem('enquiryApp', 'admin');
      this.router.navigateByUrl('/enquiry-list');
    }
    else {
      alert('Invalid Credentials');
    }
  }

}
