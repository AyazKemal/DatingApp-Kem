import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  curentUser =signal<User | null>(null);

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'accounts/login', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.curentUser.set(user)
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'accounts/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.curentUser.set(user)
        }
        return user;
      })
    )
  }

  logout(){
    localStorage.removeItem('user');
    this.curentUser.set(null);
  }
}
