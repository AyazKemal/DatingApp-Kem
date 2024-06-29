import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikesService);
  baseUrl = environment.apiUrl;
  curentUser =signal<User | null>(null);

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'accounts/login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'accounts/register', model).pipe(
      map(user => {
        if (user) {
         this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.curentUser.set(user);
    this.likeService.getLikeIds();
  }

  logout(){
    localStorage.removeItem('user');
    this.curentUser.set(null);
  }
}
